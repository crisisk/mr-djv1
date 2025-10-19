// src/utils/queryOptimizer.ts

import { PrismaClient, Prisma } from '@prisma/client';
import { performance } from 'perf_hooks';
import { Logger } from './logger';

export class QueryOptimizer {
  private prisma: PrismaClient;
  private logger: Logger;

  constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    });
    this.logger = new Logger();
  }

  /**
   * Optimized query execution with performance monitoring
   * @param queryFn - The query function to execute
   * @returns Result of the query and performance metrics
   */
  async executeOptimizedQuery<T>(
    queryFn: (prisma: PrismaClient) => Promise<T>
  ): Promise<{ data: T; metrics: QueryMetrics }> {
    const startTime = performance.now();

    try {
      // Execute the query
      const data = await queryFn(this.prisma);
      
      const endTime = performance.now();
      const metrics = this.calculateMetrics(startTime, endTime);

      // Log performance metrics
      this.logger.info('Query executed successfully', { metrics });

      return { data, metrics };
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  /**
   * Optimized batch query execution
   * @param queries - Array of query functions to execute
   * @returns Results and performance metrics
   */
  async executeBatchQueries<T>(
    queries: ((prisma: PrismaClient) => Promise<T>)[]
  ): Promise<{ results: T[]; metrics: QueryMetrics }> {
    const startTime = performance.now();

    try {
      // Execute queries in parallel when possible
      const results = await Promise.all(
        queries.map(query => query(this.prisma))
      );

      const endTime = performance.now();
      const metrics = this.calculateMetrics(startTime, endTime);

      return { results, metrics };
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  /**
   * Optimized pagination query
   * @param model - Prisma model to query
   * @param page - Page number
   * @param pageSize - Items per page
   * @param where - Filter conditions
   * @param include - Relations to include
   * @returns Paginated results and performance metrics
   */
  async executePaginatedQuery<T>(
    model: string,
    page: number = 1,
    pageSize: number = 10,
    where: any = {},
    include: any = {}
  ): Promise<{ data: T[]; total: number; metrics: QueryMetrics }> {
    const startTime = performance.now();

    try {
      // Execute count and data queries in parallel
      const [total, data] = await Promise.all([
        (this.prisma[model] as any).count({ where }),
        (this.prisma[model] as any).findMany({
          where,
          include,
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      const endTime = performance.now();
      const metrics = this.calculateMetrics(startTime, endTime);

      return { data, total, metrics };
    } catch (error) {
      this.handleQueryError(error);
      throw error;
    }
  }

  private calculateMetrics(startTime: number, endTime: number): QueryMetrics {
    return {
      executionTime: endTime - startTime,
      timestamp: new Date().toISOString(),
    };
  }

  private handleQueryError(error: any): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error('Prisma known error', {
        code: error.code,
        message: error.message,
      });
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      this.logger.error('Prisma validation error', {
        message: error.message,
      });
    } else {
      this.logger.error('Unknown query error', {
        message: error.message,
      });
    }
  }
}

interface QueryMetrics {
  executionTime: number;
  timestamp: string;
}

// Usage example:
async function example() {
  const optimizer = new QueryOptimizer();

  // Example 1: Simple optimized query
  const { data: users, metrics } = await optimizer.executeOptimizedQuery(
    prisma => prisma.user.findMany({
      include: { posts: true },
      where: { active: true },
    })
  );

  // Example 2: Batch queries
  const { results } = await optimizer.executeBatchQueries([
    prisma => prisma.user.findMany(),
    prisma => prisma.post.findMany(),
  ]);

  // Example 3: Paginated query
  const { data, total, metrics: paginationMetrics } = 
    await optimizer.executePaginatedQuery(
      'user',
      1,
      10,
      { active: true },
      { posts: true }
    );
}

// Test suite
import { describe, it, expect, beforeEach } from 'jest';

describe('QueryOptimizer', () => {
  let optimizer: QueryOptimizer;

  beforeEach(() => {
    optimizer = new QueryOptimizer();
  });

  it('should execute optimized query successfully', async () => {
    const { data, metrics } = await optimizer.executeOptimizedQuery(
      prisma => prisma.user.findMany()
    );

    expect(data).toBeDefined();
    expect(metrics.executionTime).toBeGreaterThan(0);
  });

  it('should handle pagination correctly', async () => {
    const { data, total, metrics } = await optimizer.executePaginatedQuery(
      'user',
      1,
      10
    );

    expect(data.length).toBeLessThanOrEqual(10);
    expect(total).toBeGreaterThanOrEqual(0);
    expect(metrics.executionTime).toBeGreaterThan(0);
  });

  it('should handle errors gracefully', async () => {
    await expect(
      optimizer.executeOptimizedQuery(async () => {
        throw new Error('Test error');
      })
    ).rejects.toThrow('Test error');
  });
});

// Performance benchmarking
async function runBenchmark() {
  const optimizer = new QueryOptimizer();
  const iterations = 100;
  const results: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const { metrics } = await optimizer.executeOptimizedQuery(
      prisma => prisma.user.findMany()
    );
    results.push(metrics.executionTime);
  }

  const avgExecutionTime = 
    results.reduce((a, b) => a + b, 0) / results.length;
  console.log(`Average execution time: ${avgExecutionTime}ms`);
}
