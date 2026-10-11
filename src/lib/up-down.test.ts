import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, getUpDownLevel, pickRounds } from './up-down';

describe('up-down', () => {
	test('levels', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getUpDownLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
			}
		}
		expect(getUpDownLevel(11)).toBeUndefined();
	});
});
