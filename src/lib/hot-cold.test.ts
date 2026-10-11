import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, HOT_COLD_ROUNDS, getHotColdLevel, pickRounds } from './hot-cold';

describe('hot-cold', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHotColdLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(HOT_COLD_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getHotColdLevel(11)).toBeUndefined();
	});
});
