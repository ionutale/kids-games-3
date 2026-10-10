import { describe, expect, test } from 'vitest';
import { HALF_ROUNDS, getHalfLevel, pickRounds } from './half-share';

describe('half-share levels', () => {
	test('ten levels with even piles', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getHalfLevel(level)).toBeDefined();
		}
		expect(getHalfLevel(1)!.min).toBe(2);
		expect(getHalfLevel(10)!.max).toBe(12);
		expect(getHalfLevel(7)!.tight).toBe(true);
		expect(getHalfLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer is half of an even pile', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHalfLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(HALF_ROUNDS);
			for (const round of rounds) {
				expect(round.shown % 2).toBe(0);
				expect(round.shown).toBeGreaterThanOrEqual(config.min);
				expect(round.shown).toBeLessThanOrEqual(config.max);
				expect(round.answer).toBe(round.shown / 2);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
			}
		}
	});
});
