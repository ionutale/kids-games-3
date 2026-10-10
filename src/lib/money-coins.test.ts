import { describe, expect, test } from 'vitest';
import { MONEY_ROUNDS, getMoneyLevel, pickRounds } from './money-coins';

describe('money-coins levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getMoneyLevel(level)).toBeDefined();
		}
		expect(getMoneyLevel(1)!.values).toEqual([1, 5]);
		expect(getMoneyLevel(4)!.values).toEqual([1, 5, 10]);
		expect(getMoneyLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer is among options from the level pool', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMoneyLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(MONEY_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(config.values).toContain(round.answer);
				expect(config.modes).toContain(round.mode);
				expect(new Set(round.options).size).toBe(round.options.length);
			}
		}
	});
});
