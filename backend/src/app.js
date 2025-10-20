const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const config = require('./config');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errors');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

const openApiDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

app.set('trust proxy', 1);
app.disable('x-powered-by');

const helmetConfig = (() => {
  const directives = helmet.contentSecurityPolicy.getDefaultDirectives();
  const netlifySources = [
    'https://*.netlify.app',
    'https://*.netlify.com',
    'https://netlify.app',
    'https://app.netlify.com',
    'https://api.netlify.com'
  ];
  const connectSrc = new Set(["'self'", ...netlifySources]);

  if (Array.isArray(config.cors.origin)) {
    for (const origin of config.cors.origin) {
      if (origin && origin !== '*') {
        connectSrc.add(origin);
      }
    }
  } else if (typeof config.cors.origin === 'string' && config.cors.origin && config.cors.origin !== '*') {
    connectSrc.add(config.cors.origin);
  }

  return {
    contentSecurityPolicy: {
      directives: {
        ...directives,
        'default-src': ["'self'"],
        'connect-src': Array.from(connectSrc),
        'frame-ancestors': ["'self'", 'https://app.netlify.com', 'https://*.netlify.app']
      }
    }
  };
})();

app.use(helmet(helmetConfig));
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));
app.use(compression());
app.use(morgan(config.logging));
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      req.rawBody = Buffer.from(buf);
    }
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, { explorer: true }));

app.get('/api/docs.json', (_req, res) => {
  res.json(openApiDocument);
});

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
