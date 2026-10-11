import { describe, expect, test } from 'vitest';
import { CUE_ANSWER, getHungryThirstyLevel, pickRounds } from './hungry-thirsty';

describe('hungry-thirsty', () => {
	test('levels and answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHungryThirstyLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(CUE_ANSWER[round.cue]);
			}
		}
		expect(getHungryThirstyLevel(11)).toBeUndefined();
	});
});
