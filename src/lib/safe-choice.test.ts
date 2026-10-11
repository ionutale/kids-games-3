import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, getSafeChoiceLevel, pickRounds } from './safe-choice';

describe('safe-choice', () => {
	test('levels and answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSafeChoiceLevel(level)!;
			for (const round of pickRounds(config, () => 0.3)) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
			}
		}
		expect(getSafeChoiceLevel(11)).toBeUndefined();
	});
});
