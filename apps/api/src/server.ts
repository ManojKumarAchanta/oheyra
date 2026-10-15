import { buildApp } from './app.js';
import { env } from './config/env.js';

const app = buildApp();

const start = async () => {
  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    app.log.info(`⚡ PULSE Fastify API listening on http://${env.HOST}:${env.PORT}`);
    app.log.info(`📖 Interactive API documentation available at http://${env.HOST}:${env.PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Graceful Shutdown Handling (Essential for Koyeb & Docker containers)
const signals = ['SIGINT', 'SIGTERM'] as const;
signals.forEach((signal) => {
  process.on(signal, async () => {
    app.log.info(`Received ${signal}. Gracefully closing Fastify API server...`);
    try {
      await app.close();
      app.log.info('Fastify API server closed successfully.');
      process.exit(0);
    } catch (err) {
      app.log.error(err, 'Error occurred during graceful shutdown');
      process.exit(1);
    }
  });
});

start();
