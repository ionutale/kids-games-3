import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, FRONT_BEHIND_ROUNDS, getFrontBehindLevel, pickRounds } from './front-behind';

describe('front-behind', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFrontBehindLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(FRONT_BEHIND_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getFrontBehindLevel(11)).toBeUndefined();
	});
});
