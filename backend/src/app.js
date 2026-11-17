// Builds the Express app. server.js starts it; tests import it directly.
const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { createSessionMiddleware } = require('./config/session');
const apiRouter = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

function createApp({ withSessions = true, sessionStore } = {}) {
  const app = express();

  // Render runs behind a proxy; needed for secure cookies.
  app.set('trust proxy', 1);

  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(express.json({ limit: '1mb' }));

  // Render health check (render.yaml: healthCheckPath /health)
  app.get('/health', (req, res) => res.json({ status: 'healthy' }));

  // Render's free plan stops this service after ~15 minutes without traffic. When the website
  // finds it stopped, it sends the browser here (frontend nginx /wake-api): opening it as a page
  // starts the service, and once it runs it sends the browser back to the website.
  // Only a "#/..." route of the website is accepted as `to`, so this can't redirect elsewhere.
  app.get('/wake', (req, res) => {
    const to = typeof req.query.to === 'string' && req.query.to.startsWith('#/') ? req.query.to : '';
    res.set('Cache-Control', 'no-store');
    res.redirect(`${env.frontendUrl.replace(/\/+$/, '')}/${to}`);
  });

  if (withSessions) app.use(createSessionMiddleware({ store: sessionStore }));

  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
