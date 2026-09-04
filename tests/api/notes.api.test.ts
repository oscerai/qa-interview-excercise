import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { store } from '../../src/store.js';

const app = createApp();

describe('POST /sessions/:id/generate', () => {
  beforeEach(() => store.reset());

  it('returns 201 for a happy-path free user', async () => {
    await request(app).post('/users').send({ id: 'u1', plan: 'free' }).expect(201);

    const created = await request(app)
      .post('/sessions')
      .set('x-user-id', 'u1')
      .send({ patientName: 'Jane Doe' })
      .expect(201);

    const id = created.body.id as string;
    await request(app).post(`/sessions/${id}/start`).expect(200);
    await request(app)
      .post(`/sessions/${id}/stop`)
      .send({ transcript: 'Patient reports a sore throat.' })
      .expect(200);

    const generated = await request(app)
      .post(`/sessions/${id}/generate`)
      .set('x-user-id', 'u1')
      .expect(201);

    expect(generated.body.note).toMatch(/Jane Doe/);
  });
});
