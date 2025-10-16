const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const config = require('./config');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errors');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));
app.use(compression());
app.use(morgan(config.logging));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
