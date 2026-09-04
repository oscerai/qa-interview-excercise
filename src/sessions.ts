import { incrementUsage } from './quota.js';
import { store } from './store.js';
import type { Session, SessionStatus } from './types.js';

const ALLOWED: Record<SessionStatus, SessionStatus[]> = {
  draft: ['recording'],
  recording: ['ready', 'draft'],
  ready: ['note_generated', 'recording'],
  note_generated: [],
};

export function createSession(userId: string, patientName: string): Session {
  // BUG (whitespace-name): "   " is treated as a valid name.
  if (!patientName) {
    throw Object.assign(new Error('patientName is required'), { status: 400 });
  }

  const session: Session = {
    id: `ses_${Math.random().toString(36).slice(2, 10)}`,
    userId,
    patientName,
    status: 'draft',
    transcript: '',
  };
  return store.saveSession(session);
}

export function transition(session: Session, next: SessionStatus): Session {
  if (!ALLOWED[session.status].includes(next)) {
    throw Object.assign(
      new Error(`Cannot move session from ${session.status} to ${next}`),
      { status: 409 }
    );
  }
  session.status = next;
  return store.saveSession(session);
}

export function attachTranscript(session: Session, transcript: string): Session {
  session.transcript = transcript;
  return store.saveSession(session);
}

export function generateNote(session: Session): { note: string; session: Session } {
  // BUG (skip-ready): generate is allowed from `recording`, not only `ready`.
  if (session.status === 'draft') {
    throw Object.assign(new Error('Session is not ready to generate a note'), {
      status: 409,
    });
  }

  // BUG (quota-on-failure): usage is incremented even when generation fails.
  incrementUsage(session.userId);

  if (!session.transcript) {
    throw Object.assign(new Error('Transcript is empty'), { status: 422 });
  }

  const note = `Consult note for ${session.patientName}: ${session.transcript}`;
  session.status = 'note_generated';
  store.saveSession(session);
  return { note, session };
}
