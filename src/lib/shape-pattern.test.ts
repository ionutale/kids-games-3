import { describe, expect, test } from 'vitest';
import { SHAPE_PATTERN_ROUNDS, getShapePatternLevel, pickShapeRounds } from './shape-pattern';

describe('shape pattern levels', () => {
	test('ten levels, starting with two shapes', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getShapePatternLevel(level)).toBeDefined();
		}
		expect(getShapePatternLevel(1)!.kind).toBe('abab');
		expect(getShapePatternLevel(1)!.optionCount).toBe(2);
		expect(getShapePatternLevel(10)!.kind).toBe('mixed');
		expect(getShapePatternLevel(11)).toBeUndefined();
	});
});

describe('pickShapeRounds', () => {
	test('the next shape continues the repeat', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShapePatternLevel(level)!;
			const rounds = pickShapeRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SHAPE_PATTERN_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				const row = [...round.shown, round.answer];
				const period = guessPeriod(row);
				for (let i = period; i < row.length; i++) {
					expect(row[i]).toBe(row[i - period]);
				}
			}
		}
	});
});

function guessPeriod(row: string[]): number {
	for (let period = 1; period <= 4; period++) {
		if (row.every((shape, index) => shape === row[index % period])) return period;
	}
	return 1;
}
