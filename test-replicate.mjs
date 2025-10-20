import https from 'https';

const REPLICATE_API_KEY = 'r8_F37uDRCZQ92lMBuJKJ5b5EM0xHH9vnZ2EDXMN';
const REQUEST_TIMEOUT_MS = 30_000;

const data = JSON.stringify({
  input: {
    prompt: "test image",
    aspect_ratio: "16:9"
  }
});

const controller = new AbortController();
const terminationSignals = ['SIGINT', 'SIGTERM'];
const terminationHandlers = {};

terminationSignals.forEach((signal) => {
  const handler = () => {
    console.error(`Received ${signal}. Aborting request.`);
    controller.abort(new Error(`Process terminated with ${signal}`));
  };
  terminationHandlers[signal] = handler;
  process.once(signal, handler);
});

let cleanedUp = false;
const cleanup = () => {
  if (cleanedUp) {
    return;
  }
  cleanedUp = true;
  terminationSignals.forEach((signal) => {
    const handler = terminationHandlers[signal];
    if (handler) {
      process.off(signal, handler);
    }
  });
};

const options = {
  hostname: 'api.replicate.com',
  port: 443,
  path: '/v1/models/black-forest-labs/flux-1.1-pro/predictions',
  method: 'POST',
  signal: controller.signal,
  headers: {
    'Authorization': `Bearer ${REPLICATE_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    cleanup();
    console.log('\nResponse Body:');
    console.log(responseData);
    try {
      const json = JSON.parse(responseData);
      console.log('\nParsed JSON:');
      console.log(JSON.stringify(json, null, 2));
    } catch (error) {
      console.error('\nFailed to parse JSON:', error.message);
    }
  });

  res.on('close', cleanup);
});

req.setTimeout(REQUEST_TIMEOUT_MS, () => {
  const timeoutError = new Error(`Request timed out after ${REQUEST_TIMEOUT_MS} ms`);
  req.destroy(timeoutError);
});

req.on('error', (error) => {
  cleanup();
  if (error.name === 'AbortError') {
    console.error('Request aborted:', error.message || 'The operation was aborted.');
    return;
  }
  console.error('Request Error:', error.message || error);
});

req.on('close', cleanup);

req.write(data);
req.end();
