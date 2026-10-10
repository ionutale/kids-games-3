import { describe, expect, test } from 'vitest';
import { CLOTHES_FOR, DRESS_ROUNDS, getDressLevel, pickRounds } from './dress-weather';

describe('dress-weather levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getDressLevel(level)).toBeDefined();
		}
		expect(getDressLevel(1)!.weathers).toEqual(['sunny', 'rainy']);
		expect(getDressLevel(5)!.weathers.length).toBe(4);
		expect(getDressLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer fits the weather and wrong options do not', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDressLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DRESS_ROUNDS);
			for (const round of rounds) {
				expect(config.weathers).toContain(round.weather);
				expect(CLOTHES_FOR[round.weather]).toContain(round.answer);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const option of round.options) {
					if (option !== round.answer) {
						expect(CLOTHES_FOR[round.weather]).not.toContain(option);
					}
				}
			}
		}
	});
});
