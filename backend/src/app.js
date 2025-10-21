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

const app = express();

const openApiDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

app.set('trust proxy', 1);
app.disable('x-powered-by');

const helmetMiddleware = (() => {
  const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
  const netlifySources = [
    'https://*.netlify.app',
    'https://*.netlify.com',
    'https://netlify.app',
    'https://app.netlify.com',
    'https://api.netlify.com'
  ];
  const connectSrc = new Set(["'self'", ...netlifySources]);

  const addOrigins = (origins) => {
    if (!origins) {
      return;
    }

    if (origins === '*') {
      connectSrc.add('*');
      return;
    }

    if (Array.isArray(origins)) {
      for (const origin of origins) {
        addOrigins(origin);
      }
      return;
    }

    if (origins && origins !== 'null') {
      connectSrc.add(origins);
    }
  };

  addOrigins(config.cors.origin);
  addOrigins(config.cors.publicOrigins);
  addOrigins(config.cors.allowCredentialsOrigins);

  const computedDirectives = {
    ...defaultDirectives,
    'default-src': ["'self'"],
    'connect-src': Array.from(connectSrc),
    'frame-ancestors': ["'self'", 'https://app.netlify.com', 'https://*.netlify.app']
  };

  const additionalDirectives = config.security?.csp?.directives || {};
  for (const [directive, value] of Object.entries(additionalDirectives)) {
    computedDirectives[directive] = Array.isArray(value) ? value : [value];
  }

  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: computedDirectives
    },
    referrerPolicy: {
      policy: config.security?.referrerPolicy
    },
    hsts: {
      maxAge: config.security?.hsts?.maxAge,
      includeSubDomains: config.security?.hsts?.includeSubDomains,
      preload: config.security?.hsts?.preload,
      setIf: (req) => req.secure || req.get('x-forwarded-proto') === 'https'
    },
    frameguard: { action: 'sameorigin' },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    xContentTypeOptions: true,
    expectCt: false
  });
})();

app.use(helmetMiddleware);
app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: config.cors.methods
  })
);
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

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, { explorer: true }));

app.get('/api/docs.json', (_req, res) => {
  res.json(openApiDocument);
});

app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
