import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, getInOnUnderLevel, pickRounds } from './in-on-under';
describe('in-on-under', () => {
	test('levels', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getInOnUnderLevel(level)!;
			for (const round of pickRounds(config, () => 0.3)) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
			}
		}
		expect(getInOnUnderLevel(11)).toBeUndefined();
	});
});
