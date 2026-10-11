import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, HARD_SOFT_ROUNDS, getHardSoftLevel, pickRounds } from './hard-soft';

describe('hard-soft', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHardSoftLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(HARD_SOFT_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getHardSoftLevel(11)).toBeUndefined();
	});
});
