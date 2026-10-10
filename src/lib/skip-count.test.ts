import { describe, expect, test } from 'vitest';
import { SKIP_ROUNDS, getSkipLevel, pickRounds } from './skip-count';

describe('skip-count levels', () => {
	test('ten levels: 2s, then 5s, then 10s, then mix', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSkipLevel(level)).toBeDefined();
		}
		expect(getSkipLevel(1)!.step).toBe(2);
		expect(getSkipLevel(3)!.step).toBe(2);
		expect(getSkipLevel(4)!.step).toBe(5);
		expect(getSkipLevel(6)!.step).toBe(5);
		expect(getSkipLevel(7)!.step).toBe(10);
		expect(getSkipLevel(9)!.step).toBe(10);
		expect(getSkipLevel(10)!.steps).toEqual([2, 5, 10]);
		expect(getSkipLevel(3)!.tight).toBe(true);
		expect(getSkipLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer continues the skip-count row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSkipLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SKIP_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				if (config.steps) {
					expect(config.steps).toContain(round.step);
				} else {
					expect(round.step).toBe(config.step);
				}
				for (let i = 1; i < round.shown.length; i++) {
					expect(round.shown[i] - round.shown[i - 1]).toBe(round.step);
				}
				expect(round.answer - round.shown[round.shown.length - 1]).toBe(round.step);
			}
		}
	});
});
