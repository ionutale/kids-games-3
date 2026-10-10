import { describe, expect, test } from 'vitest';
import { LAYOUT_ANSWER, PATH_ROUNDS, getPathLevel, pickRounds } from './follow-path';

describe('follow-path levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getPathLevel(level)).toBeDefined();
		}
		expect(getPathLevel(1)!.optionCount).toBe(2);
		expect(getPathLevel(10)!.optionCount).toBe(4);
		expect(getPathLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches layout and sits in options', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPathLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PATH_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(LAYOUT_ANSWER[round.layout]);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(config.layouts).toContain(round.layout);
			}
		}
	});
});
