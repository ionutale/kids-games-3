import { describe, expect, test } from 'vitest';
import { SET_ROUNDS, getSetLevel, pickRounds } from './complete-set';

describe('complete-set levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSetLevel(level)).toBeDefined();
		}
		expect(getSetLevel(1)!.optionCount).toBe(2);
		expect(getSetLevel(10)!.pool.length).toBe(10);
		expect(getSetLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('shown faces match and answer completes the set', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSetLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SET_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shownCount);
				expect(round.shown.every((face) => face === round.match)).toBe(true);
				expect(round.answer).toBe(round.match);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
			}
		}
	});
});
