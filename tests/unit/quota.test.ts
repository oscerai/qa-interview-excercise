import { beforeEach, describe, expect, it } from 'vitest';
import { canGenerate } from '../../src/quota.js';
import { store } from '../../src/store.js';

describe('quota', () => {
  beforeEach(() => store.reset());

  it('allows a free user who has not generated any notes yet', () => {
    expect(canGenerate('free', 0)).toBe(true);
  });

  it('allows a pro user regardless of usage', () => {
    expect(canGenerate('pro', 10_000)).toBe(true);
  });
});
