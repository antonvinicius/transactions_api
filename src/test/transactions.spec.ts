import { afterAll, beforeAll, describe, expect, it, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';
import { execSync } from 'node:child_process';

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    execSync('npm run migrate:rollback --all');
  });

  beforeEach(() => {
    execSync('npm run migrate:rollback --all');
    execSync('npm run migrate:latest');
  });

  it('should be able to create new transaction', async () => {
    const response = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5,
        type: 'credit'
      });

    expect(response.statusCode).toEqual(201);
  });

  it('should be able to list transactions', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5,
        type: 'credit'
      });

    const cookie = createResponse.get('Set-Cookie') ?? [];

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie);
    const body = response.body;

    expect(body.transactions).toEqual([
      expect.objectContaining({
        title: 'new transaction',
        amount: 5
      })
    ]);
  });

  it('should be able to list single transaction', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction',
        amount: 5,
        type: 'credit'
      });

    const cookie = createResponse.get('Set-Cookie') ?? [];

    const response = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookie);
    const transaction = response.body.transactions[0];

    expect(transaction).toEqual(expect.objectContaining({
      title: 'new transaction',
      amount: 5
    }));
  });

  it('should be able to get summary from transaction', async () => {
    const createResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'new transaction 1',
        amount: 25,
        type: 'credit'
      });

    const cookie = createResponse.get('Set-Cookie') ?? [];

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookie)
      .send({
        title: 'new transaction 2',
        amount: 10,
        type: 'debit'
      });

    const response = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookie);

    expect(response.body.summary.amount).toEqual(15);
  });
});
