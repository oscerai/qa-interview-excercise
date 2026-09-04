/**
 * Days left in the calendar month, including today.
 * On the last day of the month this returns 0.
 */
export function daysRemainingInMonth(asOf: Date = new Date()): number {
  const year = asOf.getFullYear();
  const month = asOf.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return lastDay - asOf.getDate();
}

/**
 * Prorated price for the rest of the billing month (rounded to cents).
 */
export function prorateMonthlyPrice(
  fullPrice: number,
  dayOfMonth: number,
  daysInMonth: number
): number {
  if (daysInMonth <= 0 || dayOfMonth < 1 || dayOfMonth > daysInMonth) {
    throw new Error('Invalid billing period');
  }
  const remainingDays = daysInMonth - dayOfMonth + 1;
  return Math.round(((fullPrice * remainingDays) / daysInMonth) * 100) / 100;
}
