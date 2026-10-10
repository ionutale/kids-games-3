import { describe, expect, test } from 'vitest';
import { SEASON_ROUNDS, getSeasonLevel, pickRounds } from './seasons';

describe('seasons levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSeasonLevel(level)).toBeDefined();
		}
		expect(getSeasonLevel(1)!.seasons).toEqual(['spring', 'winter']);
		expect(getSeasonLevel(1)!.optionCount).toBe(2);
		expect(getSeasonLevel(8)!.tight).toBe(true);
		expect(getSeasonLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer matches the shown season', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSeasonLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SEASON_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(round.season);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const option of round.options) {
					expect(config.seasons).toContain(option);
				}
			}
		}
	});
});
