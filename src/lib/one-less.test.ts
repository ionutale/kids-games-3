import { describe, expect, test } from 'vitest';
import { ONE_LESS_ROUNDS, getOneLessLevel, pickRounds } from './one-less';

describe('one-less levels', () => {
	test('ten levels, shown piles stay above one', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getOneLessLevel(level)).toBeDefined();
			expect(getOneLessLevel(level)!.min).toBeGreaterThanOrEqual(2);
		}
		expect(getOneLessLevel(1)!.optionCount).toBe(2);
		expect(getOneLessLevel(7)!.tight).toBe(true);
		expect(getOneLessLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer is always one less than the shown pile', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getOneLessLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ONE_LESS_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toBeGreaterThanOrEqual(config.min);
				expect(round.shown).toBeLessThanOrEqual(config.max);
				expect(round.answer).toBe(round.shown - 1);
				expect(round.answer).toBeGreaterThanOrEqual(1);
				expect(round.options).toContain(round.answer);
				expect(round.options).not.toContain(round.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
			}
		}
	});
});
