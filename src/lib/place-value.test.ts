import { describe, expect, test } from 'vitest';
import { PLACE_ROUNDS, getPlaceLevel, pickRounds } from './place-value';

describe('place-value levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getPlaceLevel(level)).toBeDefined();
		}
		expect(getPlaceLevel(1)!.ask).toBe('number');
		expect(getPlaceLevel(4)!.ask).toBe('tens');
		expect(getPlaceLevel(6)!.ask).toBe('ones');
		expect(getPlaceLevel(8)!.ask).toBe('mixed');
		expect(getPlaceLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches ask and rod counts', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPlaceLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PLACE_ROUNDS);
			for (const round of rounds) {
				expect(round.value).toBe(round.tens * 10 + round.ones);
				expect(round.tens).toBeGreaterThanOrEqual(config.minTens);
				expect(round.tens).toBeLessThanOrEqual(config.maxTens);
				expect(round.ones).toBeGreaterThanOrEqual(config.minOnes);
				expect(round.ones).toBeLessThanOrEqual(config.maxOnes);
				const expected =
					round.ask === 'number' ? round.value : round.ask === 'tens' ? round.tens : round.ones;
				expect(round.answer).toBe(expected);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
			}
		}
	});
});
