import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, getNearFarLevel, pickRounds } from './near-far';

describe('near-far', () => {
	test('levels', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getNearFarLevel(level)!;
			for (const round of pickRounds(config, () => 0.25)) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
			}
		}
		expect(getNearFarLevel(11)).toBeUndefined();
	});
});
