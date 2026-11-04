const env = require('./config/env');
const { createApp } = require('./app');

const app = createApp();

app.listen(env.port, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${env.port}`);
});
