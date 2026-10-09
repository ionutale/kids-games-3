import { describe, expect, test } from 'vitest';
import { READ_ROUNDS, closePartner, getReadLevel, makeRounds } from './read-word';

describe('read the word levels', () => {
	test('ten levels of three words', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getReadLevel(level)!;
			expect(config.kinds).toHaveLength(READ_ROUNDS);
			expect(config.optionCount).toBeGreaterThanOrEqual(2);
		}
		expect(getReadLevel(1)!.optionCount).toBe(2);
		expect(getReadLevel(3)!.tight).toBe(true);
		expect(getReadLevel(11)).toBeUndefined();
	});
});

describe('makeRounds', () => {
	test('the matching picture is one of the choices', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getReadLevel(level)!;
			const rounds = makeRounds(config, () => 0.4);
			expect(rounds).toHaveLength(READ_ROUNDS);
			for (const round of rounds) {
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(round.options).toContain(round.answer);
				expect(config.kinds).toContain(round.kind);
				if (config.tight) {
					const partner = closePartner(round.kind, round.answer);
					if (partner) expect(round.options).toContain(partner);
				}
			}
		}
	});
});
