import { describe, expect, test } from 'vitest';
import { ONE_MORE_ROUNDS, getOneMoreLevel, pickRounds } from './one-more';

describe('one-more levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getOneMoreLevel(level)).toBeDefined();
		}
		expect(getOneMoreLevel(1)!.optionCount).toBe(2);
		expect(getOneMoreLevel(7)!.tight).toBe(true);
		expect(getOneMoreLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer is always one more than the shown pile', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOneMoreLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ONE_MORE_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toBeGreaterThanOrEqual(config.min);
				expect(round.shown).toBeLessThanOrEqual(config.max);
				expect(round.answer).toBe(round.shown + 1);
				expect(round.options).toContain(round.answer);
				expect(round.options).not.toContain(round.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
			}
		}
	});
});
