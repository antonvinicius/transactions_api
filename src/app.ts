import Fastify from 'fastify';
import { transactionsRoutes } from './routes/transactions.js';
import fastifyCookie from '@fastify/cookie';
export const app = Fastify();

app.addHook('preHandler', (request, _, next) => {
  console.log(`[${request.method}] ${request.url}`);
  next();
});

app.register(fastifyCookie);

app.register(transactionsRoutes, {
  prefix: 'transactions'
});
