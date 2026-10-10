import { describe, expect, test } from 'vitest';
import {
	RHYME_BANK,
	RHYME_ROUNDS,
	bankFor,
	getRhymeLevel,
	pickRounds,
	type RhymeLocale
} from './rhyme';

const LOCALES: RhymeLocale[] = ['it', 'ro', 'en', 'de'];

describe('rhyme levels', () => {
	test('ten levels and twelve pairs per language', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getRhymeLevel(level)).toBeDefined();
		}
		expect(getRhymeLevel(1)!.optionCount).toBe(2);
		expect(getRhymeLevel(6)!.tight).toBe(true);
		expect(getRhymeLevel(11)).toBeUndefined();
		for (const locale of LOCALES) {
			expect(RHYME_BANK[locale]).toHaveLength(12);
		}
	});
});

describe('pickRounds', () => {
	test('the answer is the other half of the pair', () => {
		for (const locale of LOCALES) {
			for (let level = 1; level <= 10; level++) {
				const config = getRhymeLevel(level)!;
				const rounds = pickRounds(locale, config, () => 0.25);
				expect(rounds).toHaveLength(RHYME_ROUNDS);
				const bank = bankFor(locale).slice(0, config.poolSize);
				for (const round of rounds) {
					expect(round.options).toHaveLength(config.optionCount);
					expect(new Set(round.options.map((word) => word.word)).size).toBe(
						round.options.length
					);
					expect(round.options.map((word) => word.word)).toContain(round.answer.word);
					expect(round.options.map((word) => word.word)).not.toContain(round.prompt.word);
					const pair = bank.find(
						(entry) =>
							(entry.a.word === round.prompt.word && entry.b.word === round.answer.word) ||
							(entry.b.word === round.prompt.word && entry.a.word === round.answer.word)
					);
					expect(pair).toBeDefined();
				}
			}
		}
	});
});
