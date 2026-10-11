import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, SHARE_KEEP_ROUNDS, getShareKeepLevel, pickRounds } from './share-keep';

describe('share-keep', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getShareKeepLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SHARE_KEEP_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getShareKeepLevel(11)).toBeUndefined();
	});
});
