import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, CLEAN_DIRTY_ROUNDS, getCleanDirtyLevel, pickRounds } from './clean-dirty';

describe('clean-dirty', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getCleanDirtyLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(CLEAN_DIRTY_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getCleanDirtyLevel(11)).toBeUndefined();
	});
});
