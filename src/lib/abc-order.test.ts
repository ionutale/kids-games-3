import { describe, expect, test } from 'vitest';
import { ABC_LEVELS, ABC_ROUNDS, getAbcLevel, letterAt, pickRounds } from './abc-order';

describe('abc order levels', () => {
	test('ten levels with a rising difficulty curve', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getAbcLevel(level)).toBeDefined();
		}
		expect(getAbcLevel(1)!.shown).toBe(2);
		expect(getAbcLevel(1)!.optionCount).toBe(2);
		expect(getAbcLevel(1)!.casing).toBe('upper');
		expect(getAbcLevel(6)!.casing).toBe('lower');
		expect(getAbcLevel(8)!.tight).toBe(true);
		expect(getAbcLevel(10)!.max).toBe(25);
		expect(getAbcLevel(10)!.optionCount).toBe(4);
		expect(getAbcLevel(11)).toBeUndefined();
	});

	test('the alphabet window advances through the levels', () => {
		// The first level starts at the top of the alphabet…
		expect(getAbcLevel(1)!.min).toBe(0);
		// …and later levels move along it instead of camping on A.
		expect(getAbcLevel(4)!.min).toBe(6); // G
		expect(getAbcLevel(7)!.min).toBe(15); // P
		expect(getAbcLevel(8)!.max).toBe(25); // ends at Z
		// The revisit level goes back to the middle with tight distractors.
		expect(getAbcLevel(9)!.min).toBe(4);
		expect(getAbcLevel(9)!.tight).toBe(true);
		// The last level covers everything.
		expect(getAbcLevel(10)!.min).toBe(0);
		expect(getAbcLevel(10)!.max).toBe(25);
	});

	test('rounds per level grow with difficulty', () => {
		for (const config of ABC_LEVELS) {
			expect(config.rounds).toBeGreaterThanOrEqual(ABC_ROUNDS);
			expect(config.rounds).toBeLessThanOrEqual(5);
		}
		expect(getAbcLevel(1)!.rounds).toBe(3);
		expect(getAbcLevel(4)!.rounds).toBe(4);
		expect(getAbcLevel(9)!.rounds).toBe(5);
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
			expect(rounds).toHaveLength(config.rounds);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				const codes = round.shown.map((letter) => letter.toUpperCase().charCodeAt(0) - 65);
				for (let i = 1; i < codes.length; i++) {
					expect(codes[i] - codes[i - 1]).toBe(1);
				}
				expect(round.answer.toUpperCase().charCodeAt(0) - 65 - codes[codes.length - 1]).toBe(1);
				for (const letter of [...round.shown, ...round.options]) {
					if (config.casing === 'upper') expect(letter).toBe(letter.toUpperCase());
					else expect(letter).toBe(letter.toLowerCase());
				}
			}
		}
	});

	test('every round stays inside the level window', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAbcLevel(level)!;
			for (const rand of [0.1, 0.25, 0.5, 0.75, 0.9]) {
				const rounds = pickRounds(config, () => rand);
				for (const round of rounds) {
					const shown = round.shown.map((letter) => letter.toUpperCase().charCodeAt(0) - 65);
					const answer = round.answer.toUpperCase().charCodeAt(0) - 65;
					expect(shown[0]).toBeGreaterThanOrEqual(config.min);
					expect(answer).toBeLessThanOrEqual(config.max);
					expect(answer).toBe(shown[shown.length - 1] + 1);
				}
			}
		}
	});

	test('later levels actually use later letters', () => {
		const config = getAbcLevel(7)!;
		for (const round of pickRounds(config, () => 0.4)) {
			const first = round.shown[0].toUpperCase().charCodeAt(0) - 65;
			expect(first).toBeGreaterThanOrEqual(15); // P or later
		}
	});
});
