import { describe, expect, test } from 'vitest';
import { NEXT_ROUNDS, getNextLevel, pickRounds } from './next-number';

describe('next number levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getNextLevel(level)).toBeDefined();
		}
		expect(getNextLevel(1)!.shown).toBe(2);
		expect(getNextLevel(1)!.optionCount).toBe(2);
		expect(getNextLevel(6)!.step).toBe(2);
		expect(getNextLevel(8)!.tight).toBe(true);
		expect(getNextLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer continues the counting row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getNextLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(NEXT_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				for (let i = 1; i < round.shown.length; i++) {
					expect(round.shown[i] - round.shown[i - 1]).toBe(config.step);
				}
				expect(round.answer - round.shown[round.shown.length - 1]).toBe(config.step);
			}
		}
	});
});
