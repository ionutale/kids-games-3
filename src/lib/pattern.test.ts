import { describe, expect, test } from 'vitest';
import { PATTERN_ROUNDS, getPatternLevel, pickRounds } from './pattern';

describe('color pattern levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getPatternLevel(level)).toBeDefined();
		}
		expect(getPatternLevel(1)!.kind).toBe('abab');
		expect(getPatternLevel(1)!.optionCount).toBe(2);
		expect(getPatternLevel(10)!.kind).toBe('mixed');
		expect(getPatternLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the next color continues the repeat', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPatternLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PATTERN_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				const row = [...round.shown, round.answer];
				const period = new Set(round.shown).size === 1 ? 1 : guessPeriod(row);
				for (let i = period; i < row.length; i++) {
					expect(row[i]).toBe(row[i - period]);
				}
			}
		}
	});
});

function guessPeriod(row: string[]): number {
	for (let period = 1; period <= 4; period++) {
		if (row.every((color, index) => color === row[index % period])) return period;
	}
	return 1;
}
