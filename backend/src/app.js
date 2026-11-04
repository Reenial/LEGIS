// Builds the Express app. server.js starts it; tests import it directly.
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { createSessionMiddleware } = require('./config/session');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp({ withSessions = true } = {}) {
  const app = express();

  // Render runs behind a proxy; needed for secure cookies.
  app.set('trust proxy', 1);

  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  // Render health check (render.yaml: healthCheckPath /health)
  app.get('/health', (req, res) => res.json({ status: 'healthy' }));

  if (withSessions) app.use(createSessionMiddleware());

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
