import { describe, expect, test } from 'vitest';
import { getMakeTenLevel, pickRounds } from './make-ten';

describe('make-ten', () => {
	test('pairs sum to 10', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMakeTenLevel(level)!;
			for (const round of pickRounds(config, () => 0.15)) {
				expect(round.shown + round.answer).toBe(10);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getMakeTenLevel(11)).toBeUndefined();
	});
});
