import { describe, expect, test } from 'vitest';
import {
	INITIALS,
	LETTER_ROUNDS_PER_LEVEL,
	MAX_LETTER_LEVEL,
	WORDS,
	getLetterLevel,
	levelLetters,
	makeLetterOptions,
	pickLetterTargets,
	type WordLocale
} from './letters';

const LOCALES: WordLocale[] = ['it', 'ro', 'en', 'de'];

describe('letter levels', () => {
	test('ten levels with at least three fruits', () => {
		expect(MAX_LETTER_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getLetterLevel(level)!;
			expect(config).toBeDefined();
			expect(config.fruits.length).toBeGreaterThanOrEqual(LETTER_ROUNDS_PER_LEVEL);
		}
		expect(getLetterLevel(1)!.casing).toBe('upper');
		expect(getLetterLevel(4)!.casing).toBe('lower');
		expect(getLetterLevel(9)!.casing).toBe('mixed');
		expect(getLetterLevel(11)).toBeUndefined();
	});

	test('every initial is a plain capital', () => {
		for (const locale of LOCALES) {
			for (const fruit of getLetterLevel(6)!.fruits) {
				expect(INITIALS[locale][fruit]).toMatch(/^[A-Z]$/);
				expect(WORDS[locale][fruit].length).toBeGreaterThan(0);
			}
		}
	});
});

describe('pickLetterTargets', () => {
	test('three different fruits from the level set', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLetterLevel(level)!;
			const targets = pickLetterTargets(config, () => 0.42);
			expect(targets).toHaveLength(LETTER_ROUNDS_PER_LEVEL);
			expect(new Set(targets).size).toBe(LETTER_ROUNDS_PER_LEVEL);
		}
	});
});

describe('makeLetterOptions', () => {
	test('three buttons including the right initial, in every language', () => {
		for (const locale of LOCALES) {
			for (let level = 1; level <= 10; level++) {
				const config = getLetterLevel(level)!;
				for (const target of config.fruits) {
					const options = makeLetterOptions(locale, config, target, () => 0.7);
					const correct = INITIALS[locale][target];
					expect(options).toHaveLength(3);
					expect(options.map((option) => option.key)).toContain(correct);
					expect(new Set(options.map((option) => option.key)).size).toBe(3);
					for (const option of options) {
						expect(option.show.toUpperCase()).toBe(option.key);
					}
				}
			}
		}
	});

	test('upper levels show capitals, lower levels small letters', () => {
		const upper = makeLetterOptions('en', getLetterLevel(1)!, 'apple', () => 0.1);
		expect(upper.every((option) => option.show === option.show.toUpperCase())).toBe(true);
		const lower = makeLetterOptions('en', getLetterLevel(6)!, 'apple', () => 0.1);
		expect(lower.every((option) => option.show === option.show.toLowerCase())).toBe(true);
	});

	test('tight levels prefer look-alike letters', () => {
		const config = getLetterLevel(7)!;
		const options = makeLetterOptions('en', config, 'banana', () => 0.99);
		const keys = options.map((option) => option.key);
		expect(keys).toContain('B');
		expect(keys.some((key) => key === 'D' || key === 'P')).toBe(true);
	});

	test('small pools still fill three buttons', () => {
		const config = getLetterLevel(1)!;
		expect(levelLetters('ro', config)).toEqual(['M', 'P']);
		const options = makeLetterOptions('ro', config, 'apple', () => 0.5);
		expect(options).toHaveLength(3);
		expect(options.map((option) => option.key)).toContain('M');
	});
});
