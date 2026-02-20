const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/db');

const server = app.listen(env.port, () => {
  console.log(`Backend running on http://localhost:${env.port}`);
});

process.on('SIGINT', async () => {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
});
