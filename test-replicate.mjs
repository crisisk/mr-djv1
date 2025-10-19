import https from 'https';

const REPLICATE_API_KEY = 'r8_F37uDRCZQ92lMBuJKJ5b5EM0xHH9vnZ2EDXMN';

const data = JSON.stringify({
  input: {
    prompt: "test image",
    aspect_ratio: "16:9"
  }
});

const options = {
  hostname: 'api.replicate.com',
  port: 443,
  path: '/v1/models/black-forest-labs/flux-1.1-pro/predictions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${REPLICATE_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
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
});

req.on('error', (error) => {
  console.error('Request Error:', error);
});

req.write(data);
req.end();
