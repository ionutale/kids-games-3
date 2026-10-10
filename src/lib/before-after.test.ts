import { describe, expect, test } from 'vitest';
import { BEF_ROUNDS, getBefLevel, letterAt, pickRounds } from './before-after';

describe('before or after levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getBefLevel(level)).toBeDefined();
		}
		expect(getBefLevel(1)!.side).toBe('after');
		expect(getBefLevel(1)!.optionCount).toBe(2);
		expect(getBefLevel(4)!.side).toBe('before');
		expect(getBefLevel(6)!.casing).toBe('lower');
		expect(getBefLevel(8)!.side).toBe('mixed');
		expect(getBefLevel(8)!.tight).toBe(true);
		expect(getBefLevel(11)).toBeUndefined();
	});
});

describe('letterAt', () => {
	test('maps indexes to letters', () => {
		expect(letterAt(1, 'upper')).toBe('B');
		expect(letterAt(3, 'lower')).toBe('d');
	});
});

describe('pickRounds', () => {
	test('the answer is the letter before or after the shown one', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getBefLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(BEF_ROUNDS);
			if (config.side === 'mixed') {
				expect(rounds.some((round) => round.side === 'before')).toBe(true);
				expect(rounds.some((round) => round.side === 'after')).toBe(true);
			} else {
				expect(rounds.every((round) => round.side === config.side)).toBe(true);
			}
			for (const round of rounds) {
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				expect(round.options).not.toContain(round.letter);
				const focus = round.letter.toUpperCase().charCodeAt(0);
				const answer = round.answer.toUpperCase().charCodeAt(0);
				expect(answer - focus).toBe(round.side === 'after' ? 1 : -1);
				for (const letter of [round.letter, round.answer, ...round.options]) {
					if (config.casing === 'upper') expect(letter).toBe(letter.toUpperCase());
					else expect(letter).toBe(letter.toLowerCase());
				}
			}
		}
	});
});
