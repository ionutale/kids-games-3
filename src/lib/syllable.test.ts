import { describe, expect, test } from 'vitest';
import {
	SYL_BANK,
	SYL_ROUNDS,
	bankFor,
	getSylLevel,
	pickRounds,
	type SylLocale
} from './syllable';

const LOCALES: SylLocale[] = ['it', 'ro', 'en', 'de'];

describe('syllable levels', () => {
	test('ten levels and enough words per language', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSylLevel(level)).toBeDefined();
		}
		expect(getSylLevel(1)!.maxParts).toBe(2);
		expect(getSylLevel(8)!.maxParts).toBe(4);
		expect(getSylLevel(11)).toBeUndefined();
		for (const locale of LOCALES) {
			expect(SYL_BANK[locale].length).toBeGreaterThanOrEqual(18);
			expect(SYL_BANK[locale].some((word) => word.parts === 1)).toBe(true);
			expect(SYL_BANK[locale].some((word) => word.parts === 2)).toBe(true);
			expect(SYL_BANK[locale].some((word) => word.parts === 3)).toBe(true);
			expect(SYL_BANK[locale].some((word) => word.parts === 4)).toBe(true);
		}
	});
});

describe('pickRounds', () => {
	test('the answer matches the word part count', () => {
		for (const locale of LOCALES) {
			for (let level = 1; level <= 10; level++) {
				const config = getSylLevel(level)!;
				const rounds = pickRounds(locale, config, () => 0.25);
				expect(rounds).toHaveLength(SYL_ROUNDS);
				const optionSpan = config.maxParts - config.minParts + 1;
				for (const round of rounds) {
					expect(round.options).toHaveLength(optionSpan);
					expect(round.options[0]).toBe(config.minParts);
					expect(round.options[round.options.length - 1]).toBe(config.maxParts);
					expect(round.answer).toBe(round.prompt.parts);
					expect(round.options).toContain(round.answer);
					expect(round.prompt.parts).toBeGreaterThanOrEqual(config.minParts);
					expect(round.prompt.parts).toBeLessThanOrEqual(config.maxParts);
					expect(bankFor(locale).some((word) => word.word === round.prompt.word)).toBe(true);
				}
			}
		}
	});
});
