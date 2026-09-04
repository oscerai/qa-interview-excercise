import { beforeEach, describe, expect, it } from 'vitest';
import { createSession, generateNote, transition, attachTranscript } from '../../src/sessions.js';
import { store } from '../../src/store.js';

describe('sessions', () => {
  beforeEach(() => {
    store.reset();
    store.upsertUser({ id: 'u1', plan: 'free' });
  });

  it('creates a draft session and generates a note after recording', () => {
    const session = createSession('u1', 'Jane Doe');
    expect(session.status).toBe('draft');

    transition(session, 'recording');
    attachTranscript(session, 'Patient reports a sore throat.');
    transition(session, 'ready');

    const result = generateNote(session);
    expect(result.note).toContain('Jane Doe');
    expect(result.session.status).toBe('note_generated');
  });
});
