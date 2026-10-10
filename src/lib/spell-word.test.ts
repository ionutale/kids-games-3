import { describe, expect, test } from 'vitest';
import { SPELL_BANK, SPELL_ROUNDS, getSpellLevel, pickRounds } from './spell-word';

describe('spell-word levels', () => {
	test('ten levels and locale banks', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSpellLevel(level)).toBeDefined();
		}
		expect(SPELL_BANK.en.length).toBeGreaterThanOrEqual(12);
		expect(getSpellLevel(3)!.decoys).toBe(1);
		expect(getSpellLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('tray contains every letter of the word', () => {
		for (const locale of ['en', 'it', 'ro', 'de'] as const) {
			for (let level = 1; level <= 10; level++) {
				const config = getSpellLevel(level)!;
				const rounds = pickRounds(config, locale, () => 0.25);
				expect(rounds).toHaveLength(SPELL_ROUNDS);
				for (const round of rounds) {
					expect(round.letters.join('')).toBe(round.word);
					expect(round.tray).toHaveLength(round.letters.length + config.decoys);
					for (const ch of round.letters) {
						expect(round.tray).toContain(ch);
					}
				}
			}
		}
	});
});
