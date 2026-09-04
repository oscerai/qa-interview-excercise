import type { Session, Usage, User } from './types.js';

const users = new Map<string, User>();
const sessions = new Map<string, Session>();
const usage = new Map<string, Usage>();

export const store = {
  reset(): void {
    users.clear();
    sessions.clear();
    usage.clear();
  },

  upsertUser(user: User): User {
    users.set(user.id, user);
    return user;
  },

  getUser(id: string): User | undefined {
    return users.get(id);
  },

  saveSession(session: Session): Session {
    sessions.set(session.id, session);
    return session;
  },

  getSession(id: string): Session | undefined {
    return sessions.get(id);
  },

  getUsage(userId: string, yearMonth: string): Usage {
    const key = `${userId}:${yearMonth}`;
    const existing = usage.get(key);
    if (existing) return existing;
    const created = { userId, yearMonth, generatedCount: 0 };
    usage.set(key, created);
    return created;
  },

  saveUsage(row: Usage): void {
    usage.set(`${row.userId}:${row.yearMonth}`, row);
  },
};
