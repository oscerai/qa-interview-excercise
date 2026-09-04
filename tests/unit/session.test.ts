import { beforeEach, describe, expect, it } from 'vitest';
import { createSession, transition } from '../../src/sessions.js';
import { store } from '../../src/store.js';

describe('session state machine', () => {
  beforeEach(() => {
    store.reset();
    store.upsertUser({ id: 'u1', plan: 'free' });
  });

  it('rejects an invalid status transition', () => {
    const session = createSession('u1', 'Jane Doe');
    expect(() => transition(session, 'ready')).toThrow(/Cannot move session/);
  });
});
