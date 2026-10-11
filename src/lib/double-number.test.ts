import { describe, expect, test } from 'vitest';
import { getDoubleNumberLevel, pickRounds } from './double-number';
describe('double-number', () => {
	test('answer is double', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDoubleNumberLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(round.shown * 2);
			}
		}
		expect(getDoubleNumberLevel(11)).toBeUndefined();
	});
});
