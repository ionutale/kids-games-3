import { describe, expect, test } from 'vitest';
import { COMPARE_ROUNDS, getCompareLevel, pickRounds } from './compare-numbers';

describe('compare-numbers levels', () => {
	test('ten levels, bigger then smaller then mixed', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getCompareLevel(level)).toBeDefined();
		}
		expect(getCompareLevel(1)!.ask).toBe('bigger');
		expect(getCompareLevel(4)!.ask).toBe('smaller');
		expect(getCompareLevel(5)!.ask).toBe('mixed');
		expect(getCompareLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches bigger or smaller ask', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getCompareLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(COMPARE_ROUNDS);
			for (const round of rounds) {
				expect(round.left).not.toBe(round.right);
				expect(round.left).toBeGreaterThanOrEqual(config.min);
				expect(round.right).toBeGreaterThanOrEqual(config.min);
				expect(round.left).toBeLessThanOrEqual(config.max);
				expect(round.right).toBeLessThanOrEqual(config.max);
				if (config.ask !== 'mixed') expect(round.ask).toBe(config.ask);
				const expected =
					round.ask === 'bigger'
						? Math.max(round.left, round.right)
						: Math.min(round.left, round.right);
				expect(round.answer).toBe(expected);
			}
		}
	});
});
