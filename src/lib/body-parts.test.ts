import { describe, expect, test } from 'vitest';
import { BODY_ROUNDS, getBodyLevel, pickRounds } from './body-parts';

describe('body-parts levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getBodyLevel(level)).toBeDefined();
		}
		expect(getBodyLevel(1)!.optionCount).toBe(2);
		expect(getBodyLevel(10)!.parts.length).toBe(10);
		expect(getBodyLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer is among the options', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getBodyLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(BODY_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const part of round.options) {
					expect(config.parts).toContain(part);
				}
			}
		}
	});
});
