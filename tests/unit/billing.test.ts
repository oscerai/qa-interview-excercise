import { describe, expect, it } from 'vitest';
import { daysRemainingInMonth, prorateMonthlyPrice } from '../../src/billing.js';

describe('prorateMonthlyPrice', () => {
  it('charges full price on the first day of the month', () => {
    expect(prorateMonthlyPrice(100, 1, 30)).toBe(100);
  });

  it('charges one day worth on the last day of a 30-day month', () => {
    expect(prorateMonthlyPrice(100, 30, 30)).toBe(3.33);
  });
});

describe('daysRemainingInMonth', () => {
  it('always has at least one day left in the billing period', () => {
    expect(daysRemainingInMonth()).toBeGreaterThan(0);
  });
});
