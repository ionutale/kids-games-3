import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, PUSH_PULL_ROUNDS, getPushPullLevel, pickRounds } from './push-pull';

describe('push-pull', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPushPullLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PUSH_PULL_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getPushPullLevel(11)).toBeUndefined();
	});
});
