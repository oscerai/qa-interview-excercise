import { store } from './store.js';
import type { Plan } from './types.js';

const FREE_MONTHLY_LIMIT = 10;

export function currentYearMonth(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function canGenerate(plan: Plan, generatedCount: number): boolean {
  if (plan === 'pro') return true;
  // BUG (quota-off-by-one): free users can generate 11 notes, not 10.
  // Spec is "10 per month" → this should be `generatedCount < FREE_MONTHLY_LIMIT`.
  return generatedCount <= FREE_MONTHLY_LIMIT;
}

export function incrementUsage(userId: string, now = new Date()): number {
  const yearMonth = currentYearMonth(now);
  const row = store.getUsage(userId, yearMonth);
  row.generatedCount += 1;
  store.saveUsage(row);
  return row.generatedCount;
}

export { FREE_MONTHLY_LIMIT };
