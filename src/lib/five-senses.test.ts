import { describe, expect, test } from 'vitest';
import { CUE_SENSE, getFiveSensesLevel, pickRounds } from './five-senses';

describe('five-senses', () => {
	test('levels and answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFiveSensesLevel(level)!;
			for (const round of pickRounds(config, () => 0.35)) {
				expect(round.answer).toBe(CUE_SENSE[round.cue]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getFiveSensesLevel(11)).toBeUndefined();
	});
});
