const { createHash } = require('crypto');
const config = require('../config');
const { createRedisConnection } = require('./redis');
const { logger } = require('./logger');
const { reportQueueMetrics, notifyQueueDeadLetter } = require('./alerts');

const useInMemoryQueue = process.env.NODE_ENV === 'test';
const registries = new Set();

function buildQueueName(name) {
  const prefix = config.redis.namespace || 'mr-dj';
  return `${prefix}_${name}`.replace(/:/g, '_');
}

function createInMemoryQueue(name, processor, { defaultJobOptions = {} } = {}) {
  const waiting = [];
  const failed = [];
  const deadLetters = [];
  const defaults = {
    attempts: defaultJobOptions.attempts || 5,
    backoff: defaultJobOptions.backoff || { type: 'exponential', delay: 2000 }
  };

  function removeJob(list, job) {
    const index = list.indexOf(job);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  function createJob(payload, options = {}) {
    const opts = {
      attempts: options.attempts || defaults.attempts,
      backoff: options.backoff || defaults.backoff,
      removeOnComplete: options.removeOnComplete,
      removeOnFail: options.removeOnFail,
      delay: options.delay || 0
    };

    let resolveCompletion;
    let rejectCompletion;
    const completion = new Promise((resolve, reject) => {
      resolveCompletion = resolve;
      rejectCompletion = reject;
    });

    const job = {
      id: options.jobId || `${name}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
      name,
      data: payload,
      opts,
      timestamp: Date.now(),
      delay: opts.delay,
      failedReason: null,
      attemptsMade: 0,
      waitUntilFinished: async () => completion,
      async retry() {
        removeJob(failed, job);
        job.failedReason = null;
        waiting.push(job);
        return execute(job);
      },
      async promote() {
        return execute(job);
      },
      async remove() {
        removeJob(waiting, job);
        removeJob(failed, job);
      }
    };

    job.resolve = (value) => {
      job.result = value;
      resolveCompletion(value);
    };
    job.reject = (error) => {
      rejectCompletion(error);
    };

    waiting.push(job);
    return job;
  }

  async function execute(job) {
    if (waiting.includes(job)) {
      removeJob(waiting, job);
    }
    removeJob(failed, job);

    job.attemptsMade += 1;

    try {
      const result = await processor({
        id: job.id,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade - 1
      });
      job.failedReason = null;
      job.resolve(result);
      return result;
    } catch (error) {
      job.failedReason = error.message;
      if (job.attemptsMade >= job.opts.attempts) {
        const deadEntry = {
          jobId: job.id,
          name: job.name,
          data: job.data,
          attemptsMade: job.attemptsMade,
          failedReason: error.message,
          failedAt: new Date().toISOString()
        };
        deadLetters.push(deadEntry);
        removeJob(failed, job);
        if (typeof api.workerFailedHandler === 'function') {
          await api.workerFailedHandler(job, error);
        }
        await notifyQueueDeadLetter(name, deadEntry);
      } else {
        failed.push(job);
      }
      job.reject(error);
      throw error;
    }
  }

  const queue = {
    async add(_queueName, payload, options = {}) {
      return createJob(payload, options);
    },
    async getJobCounts() {
      return {
        waiting: waiting.length,
        delayed: 0,
        active: 0,
        completed: 0,
        failed: failed.length
      };
    },
    async getJobs(statuses) {
      const jobs = [];
      statuses.forEach((status) => {
        if (status === 'waiting' || status === 'delayed') {
          jobs.push(...waiting);
        } else if (status === 'failed') {
          jobs.push(...failed);
        }
      });
      return jobs;
    },
    async drain() {
      waiting.length = 0;
      failed.length = 0;
      deadLetters.length = 0;
    },
    async close() {}
  };

  const api = {
    name,
    queue,
    worker: {
      async close() {},
      on(event, handler) {
        if (event === 'failed') {
          api.workerFailedHandler = handler;
        }
      },
      async waitUntilReady() {}
    },
    queueEvents: {
      async waitUntilReady() {},
      async close() {}
    },
    deadLetterQueue: {
      async add(_name, entry) {
        deadLetters.push(entry);
      },
      async getJobCounts() {
        return {
          waiting: deadLetters.length,
          delayed: 0,
          failed: 0
        };
      },
      async getJobs() {
        return deadLetters.map((entry) => ({ data: entry }));
      },
      async drain() {
        deadLetters.length = 0;
      },
      async close() {}
    },
    async addJob(payload, options = {}) {
      const job = await queue.add(name, payload, options);
      return job;
    },
    async getMetrics() {
      const counts = await queue.getJobCounts();
      const metrics = { counts, retryAgeP95: 0 };
      await reportQueueMetrics(name, metrics);
      return metrics;
    },
    async close() {}
  };

  registries.add(api);
  return api;
}

function createDurableQueue(name, processor, { concurrency = 5, defaultJobOptions = {} } = {}) {
  if (useInMemoryQueue) {
    return createInMemoryQueue(name, processor, { defaultJobOptions });
  }

  const { Queue, Worker, QueueEvents } = require('bullmq');

  const queueName = buildQueueName(name);
  const deadQueueName = buildQueueName(`${name}_dead`);
  const connectionFactory = () => createRedisConnection();

  const queue = new Queue(queueName, {
    connection: connectionFactory(),
    defaultJobOptions: {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: true,
      removeOnFail: false,
      ...defaultJobOptions
    }
  });

  const deadLetterQueue = new Queue(deadQueueName, {
    connection: connectionFactory(),
    defaultJobOptions: {
      removeOnComplete: false,
      removeOnFail: false
    }
  });

  const queueEvents = new QueueEvents(queueName, {
    connection: connectionFactory()
  });
  queueEvents.waitUntilReady().catch((error) => {
    logger.error({ err: error, queue: queueName }, 'Queue events failed to initialize');
  });

  const worker = new Worker(
    queueName,
    async (job) => {
      const result = await processor(job);
      return result;
    },
    {
      connection: connectionFactory(),
      concurrency
    }
  );
  worker.on('error', (error) => {
    logger.error({ err: error, queue: queueName }, 'Queue worker error');
  });

  worker.on('failed', async (job, error) => {
    if (!job || job.attemptsMade < job.opts.attempts) {
      return;
    }
    try {
      const entry = {
        jobId: job.id,
        name: job.name,
        data: job.data,
        attemptsMade: job.attemptsMade,
        failedReason: error?.message || 'unknown-error',
        failedAt: new Date().toISOString()
      };
      await deadLetterQueue.add(
        'dead-letter',
        entry,
        {
          jobId: `${job.id}:dead:${Date.now()}`,
          removeOnComplete: false,
          removeOnFail: false
        }
      );
      await notifyQueueDeadLetter(queueName, entry);
    } catch (deadError) {
      logger.error(
        {
          err: deadError,
          queue: queueName,
          jobId: job?.id
        },
        'Failed to record dead-letter job'
      );
    }
  });

  function computeJobId(payload, dedupeKey) {
    if (dedupeKey) {
      return `${name}:${dedupeKey}`;
    }
    const hash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    return `${name}:${hash}`;
  }

  async function addJob(payload, options = {}) {
    const jobId = computeJobId(payload, options.dedupeKey);
    const jobOptions = {
      jobId,
      attempts: options.attempts,
      backoff: options.backoff,
      removeOnComplete: options.removeOnComplete,
      removeOnFail: options.removeOnFail,
      delay: options.delay,
      priority: options.priority
    };

    return queue.add(name, payload, jobOptions);
  }

  async function getMetrics() {
    const [counts, waitingJobs, delayedJobs] = await Promise.all([
      queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed'),
      queue.getJobs(['waiting'], 0, 50, true),
      queue.getJobs(['delayed'], 0, 50, true)
    ]);

    const samples = waitingJobs.concat(delayedJobs);
    const now = Date.now();
    const ages = samples
      .map((job) => Math.max(0, now - job.timestamp))
      .sort((a, b) => a - b);
    const p95Index = Math.ceil(ages.length * 0.95) - 1;
    const retryAgeP95 = ages.length ? ages[Math.max(0, p95Index)] : 0;

    const metrics = {
      counts,
      retryAgeP95
    };

    await reportQueueMetrics(queueName, metrics);
    return metrics;
  }

  const api = {
    name,
    queue,
    worker,
    queueEvents,
    deadLetterQueue,
    addJob,
    getMetrics,
    close: async () => {
      await Promise.all([
        queue.close(),
        worker.close(),
        queueEvents.close(),
        deadLetterQueue.close()
      ]);
    }
  };

  registries.add(api);
  return api;
}

async function closeAllQueues() {
  const pending = Array.from(registries).map(async (entry) => {
    try {
      await entry.close();
    } catch (error) {
      logger.error({ err: error, queue: entry.name }, 'Failed to close queue');
    }
  });
  await Promise.all(pending);
  registries.clear();
}

module.exports = {
  createDurableQueue,
  closeAllQueues
};
