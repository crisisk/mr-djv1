const express = require('express');
const { setupCompressionMiddleware } = require('./compression-middleware');

const app = express();
setupCompressionMiddleware(app);

// Your routes here
