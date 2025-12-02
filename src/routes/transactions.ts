import { FastifyInstance } from 'fastify';
import z from 'zod';
import { knex } from '../database';
import { randomUUID } from 'node:crypto';
import { authMiddleware } from '../middlewares/authorization.middleware';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [authMiddleware] }, async (request) => {
    const transactions = await knex('transactions')
      .where({
        session_id: request.cookies.sessionId
      })
      .select('*');

    return { transactions };
  });

  app.get('/:id', { preHandler: [authMiddleware] }, async (request) => {
    const transactionDetailsParamsSchema = z.object({
      id: z.uuid()
    });

    const { id } = transactionDetailsParamsSchema.parse(request.params);

    const transaction = await knex('transactions').where({
      id,
      session_id: request.cookies.sessionId
    }).select('*');

    return { transaction };
  });

  app.get('/summary', { preHandler: [authMiddleware] }, async (request) => {
    const summary = await knex('transactions')
      .where({
        session_id: request.cookies.sessionId
      })
      .sum('amount', { as: 'amount' }).first();

    return { summary };
  });

  app.post('/', async (request, reply) => {
    const transactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit'])
    });

    const { amount, title, type } = transactionBodySchema.parse(request.body);

    let session_id = request.cookies.sessionId;

    if (!session_id) {
      session_id = randomUUID();
      reply.cookie('sessionId', session_id, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id
    });

    return reply.status(201).send();
  });
};
