import { describe, expect, test } from 'vitest';
import { BLEND_BANK, BLEND_ROUNDS, getBlendLevel, pickRounds } from './blend-sounds';

describe('blend-sounds levels', () => {
	test('ten levels and banks for each locale', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getBlendLevel(level)).toBeDefined();
		}
		expect(BLEND_BANK.en.length).toBeGreaterThanOrEqual(12);
		expect(BLEND_BANK.it.length).toBeGreaterThanOrEqual(12);
		expect(BLEND_BANK.ro.length).toBeGreaterThanOrEqual(12);
		expect(BLEND_BANK.de.length).toBeGreaterThanOrEqual(12);
		expect(getBlendLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('onset + rime matches the answer word picture options', () => {
		for (const locale of ['en', 'it', 'ro', 'de'] as const) {
			for (let level = 1; level <= 10; level++) {
				const config = getBlendLevel(level)!;
				const rounds = pickRounds(config, locale, () => 0.25);
				expect(rounds).toHaveLength(BLEND_ROUNDS);
				for (const round of rounds) {
					expect(round.onset).toBe(round.answer.onset);
					expect(round.rime).toBe(round.answer.rime);
					expect(round.options).toContainEqual(round.answer);
					expect(round.options).toHaveLength(config.optionCount);
					expect(new Set(round.options.map((o) => o.word)).size).toBe(round.options.length);
				}
			}
		}
	});
});
