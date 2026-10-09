import { describe, expect, test } from 'vitest';
import { MISSING_ROUNDS, getMissingLevel, pickRounds } from './missing';

describe('missing number levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getMissingLevel(level)).toBeDefined();
		}
		expect(getMissingLevel(1)!.blank).toBe('middle');
		expect(getMissingLevel(6)!.step).toBe(2);
		expect(getMissingLevel(8)!.tight).toBe(true);
		expect(getMissingLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('one blank, and the answer keeps the count steady', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMissingLevel(level)!;
			const rounds = pickRounds(config, () => 0.4);
			expect(rounds).toHaveLength(MISSING_ROUNDS);
			for (const round of rounds) {
				expect(round.slots.filter((slot) => slot === null)).toHaveLength(1);
				expect(round.options).toHaveLength(3);
				expect(new Set(round.options).size).toBe(3);
				expect(round.options).toContain(round.answer);
				const filled = round.slots.map((slot) => (slot === null ? round.answer : slot));
				for (let i = 1; i < filled.length; i++) {
					expect(filled[i] - filled[i - 1]).toBe(config.step);
				}
				const visible = round.slots.filter((slot) => slot !== null);
				expect(visible).not.toContain(round.answer);
			}
		}
	});
});
