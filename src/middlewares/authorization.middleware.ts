import { FastifyReply, FastifyRequest } from 'fastify';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (!request.cookies.sessionId) {
    return reply.status(401).send();
  }
}
