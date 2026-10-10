import { describe, expect, test } from 'vitest';
import { WEATHER_ROUNDS, getWeatherLevel, pickRounds } from './weather';

describe('weather levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getWeatherLevel(level)).toBeDefined();
		}
		expect(getWeatherLevel(1)!.weathers).toEqual(['sunny', 'rainy']);
		expect(getWeatherLevel(1)!.optionCount).toBe(2);
		expect(getWeatherLevel(8)!.tight).toBe(true);
		expect(getWeatherLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer matches the shown weather', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWeatherLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(WEATHER_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(round.weather);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const option of round.options) {
					expect(config.weathers).toContain(option);
				}
			}
		}
	});
});
