import { describe, expect, test } from 'vitest';
import { PLACE_ROUNDS, getPlaceLevel, pickRounds } from './map-places';

describe('map-places levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getPlaceLevel(level)).toBeDefined();
		}
		expect(getPlaceLevel(1)!.optionCount).toBe(2);
		expect(getPlaceLevel(10)!.places.length).toBe(6);
		expect(getPlaceLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer is among the options', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPlaceLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PLACE_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const place of round.options) {
					expect(config.places).toContain(place);
				}
			}
		}
	});
});
