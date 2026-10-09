import { describe, expect, test } from 'vitest';
import { SIDES, SIDES_ROUNDS, getSidesLevel, pickRounds } from './sides';

describe('how many sides levels', () => {
	test('ten levels, starting with triangle and square', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSidesLevel(level)).toBeDefined();
		}
		expect(getSidesLevel(1)!.shapes).toEqual(['triangle', 'square']);
		expect(getSidesLevel(6)!.tight).toBe(true);
		expect(getSidesLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer is the number of sides', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSidesLevel(level)!;
			const rounds = pickRounds(config, () => 0.3);
			expect(rounds).toHaveLength(SIDES_ROUNDS);
			for (const round of rounds) {
				expect(config.shapes).toContain(round.shape);
				expect(round.answer).toBe(SIDES[round.shape]);
				expect(round.options).toHaveLength(3);
				expect(new Set(round.options).size).toBe(3);
				expect(round.options).toContain(round.answer);
				if (config.tight) {
					const wrong = round.options.filter((value) => value !== round.answer);
					expect(wrong.some((value) => Math.abs(value - round.answer) === 1)).toBe(true);
				}
			}
		}
	});
});
