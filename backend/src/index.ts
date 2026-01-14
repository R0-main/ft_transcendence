import 'dotenv/config';
import { FastifyApp } from './fastify';

const start = async () => {
  const fastifyApp = new FastifyApp();
  try {
    await fastifyApp.initialize();
    await fastifyApp.listen();
  } catch (err) {
    fastifyApp.instance.log.error(err);
    process.exit(1);
  }
};

start();
