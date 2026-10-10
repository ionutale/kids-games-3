import { describe, expect, test } from 'vitest';
import { ABC_ROUNDS, getAbcLevel, letterAt, pickRounds } from './abc-order';

describe('abc order levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getAbcLevel(level)).toBeDefined();
		}
		expect(getAbcLevel(1)!.shown).toBe(2);
		expect(getAbcLevel(1)!.optionCount).toBe(2);
		expect(getAbcLevel(1)!.casing).toBe('upper');
		expect(getAbcLevel(6)!.casing).toBe('lower');
		expect(getAbcLevel(8)!.tight).toBe(true);
		expect(getAbcLevel(10)!.max).toBe(25);
		expect(getAbcLevel(11)).toBeUndefined();
	});
});

describe('letterAt', () => {
	test('maps indexes to letters', () => {
		expect(letterAt(0, 'upper')).toBe('A');
		expect(letterAt(2, 'upper')).toBe('C');
		expect(letterAt(0, 'lower')).toBe('a');
		expect(letterAt(25, 'lower')).toBe('z');
	});
});

describe('pickRounds', () => {
	test('the answer continues the alphabet row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAbcLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ABC_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				const codes = round.shown.map((letter) => letter.toUpperCase().charCodeAt(0));
				for (let i = 1; i < codes.length; i++) {
					expect(codes[i] - codes[i - 1]).toBe(1);
				}
				expect(round.answer.toUpperCase().charCodeAt(0) - codes[codes.length - 1]).toBe(1);
				for (const letter of [...round.shown, ...round.options]) {
					if (config.casing === 'upper') expect(letter).toBe(letter.toUpperCase());
					else expect(letter).toBe(letter.toLowerCase());
				}
			}
		}
	});
});
