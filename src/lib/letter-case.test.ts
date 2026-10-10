import { describe, expect, test } from 'vitest';
import { CASE_ROUNDS, getCaseLevel, pickRounds } from './letter-case';

describe('letter-case levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getCaseLevel(level)).toBeDefined();
		}
		expect(getCaseLevel(1)!.ask).toBe('toLower');
		expect(getCaseLevel(4)!.ask).toBe('toUpper');
		expect(getCaseLevel(6)!.ask).toBe('mixed');
		expect(getCaseLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer is the matching case pair', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getCaseLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(CASE_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(round.shown.toLowerCase()).toBe(round.answer.toLowerCase());
				if (round.ask === 'toLower') {
					expect(round.shown).toBe(round.shown.toUpperCase());
					expect(round.answer).toBe(round.answer.toLowerCase());
				} else {
					expect(round.shown).toBe(round.shown.toLowerCase());
					expect(round.answer).toBe(round.answer.toUpperCase());
				}
			}
		}
	});
});
