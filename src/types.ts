export type Plan = 'free' | 'pro';

export type SessionStatus = 'draft' | 'recording' | 'ready' | 'note_generated';

export type User = {
  id: string;
  plan: Plan;
};

export type Session = {
  id: string;
  userId: string;
  patientName: string;
  status: SessionStatus;
  transcript: string;
};

export type Usage = {
  userId: string;
  yearMonth: string;
  generatedCount: number;
};
