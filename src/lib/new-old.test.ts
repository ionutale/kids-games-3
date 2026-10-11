import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, NEW_OLD_ROUNDS, getNewOldLevel, pickRounds } from './new-old';

describe('new-old', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getNewOldLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(NEW_OLD_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getNewOldLevel(11)).toBeUndefined();
	});
});
