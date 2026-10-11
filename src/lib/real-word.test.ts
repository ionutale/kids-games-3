import { describe, expect, test } from 'vitest';
import { WORD_ANSWER, getRealWordLevel, pickRounds } from './real-word';
describe('real-word', () => {
	test('answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getRealWordLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(WORD_ANSWER[round.word]);
			}
		}
		expect(getRealWordLevel(11)).toBeUndefined();
	});
});
