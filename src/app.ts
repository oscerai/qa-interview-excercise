import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { canGenerate, currentYearMonth } from './quota.js';
import {
  attachTranscript,
  createSession,
  generateNote,
  transition,
} from './sessions.js';
import { store } from './store.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.post('/users', (req, res) => {
    const { id, plan } = req.body ?? {};
    if (!id || (plan !== 'free' && plan !== 'pro')) {
      return res.status(400).json({ error: 'id and plan (free|pro) are required' });
    }
    const user = store.upsertUser({ id, plan });
    return res.status(201).json(user);
  });

  app.post('/sessions', (req, res) => {
    const userId = String(req.header('x-user-id') ?? '');
    const user = store.getUser(userId);
    if (!user) return res.status(401).json({ error: 'unknown user' });

    try {
      const session = createSession(user.id, req.body?.patientName);
      return res.status(201).json(session);
    } catch (err) {
      return sendError(res, err);
    }
  });

  app.post('/sessions/:id/start', (req, res) => {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'not found' });
    try {
      return res.json(transition(session, 'recording'));
    } catch (err) {
      return sendError(res, err);
    }
  });

  app.post('/sessions/:id/stop', (req, res) => {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'not found' });
    try {
      attachTranscript(session, String(req.body?.transcript ?? ''));
      return res.json(transition(session, 'ready'));
    } catch (err) {
      return sendError(res, err);
    }
  });

  app.post('/sessions/:id/generate', (req, res) => {
    const userId = String(req.header('x-user-id') ?? '');
    const user = store.getUser(userId);
    if (!user) return res.status(401).json({ error: 'unknown user' });

    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: 'not found' });
    if (session.userId !== user.id) return res.status(403).json({ error: 'forbidden' });

    const usage = store.getUsage(user.id, currentYearMonth());
    if (!canGenerate(user.plan, usage.generatedCount)) {
      return res.status(402).json({ error: 'monthly note quota exceeded' });
    }

    try {
      return res.status(201).json(generateNote(session));
    } catch (err) {
      return sendError(res, err);
    }
  });

  const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
  app.use(express.static(publicDir));

  return app;
}

function sendError(res: express.Response, err: unknown) {
  const status = (err as { status?: number }).status ?? 500;
  const message = err instanceof Error ? err.message : 'unknown error';
  return res.status(status).json({ error: message });
}
