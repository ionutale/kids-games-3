import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, ROUGH_SMOOTH_ROUNDS, getRoughSmoothLevel, pickRounds } from './rough-smooth';

describe('rough-smooth', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getRoughSmoothLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ROUGH_SMOOTH_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getRoughSmoothLevel(11)).toBeUndefined();
	});
});
