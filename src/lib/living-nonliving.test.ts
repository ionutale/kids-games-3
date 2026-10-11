import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, LIVING_NONLIVING_ROUNDS, getLivingNonlivingLevel, pickRounds } from './living-nonliving';

describe('living-nonliving', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLivingNonlivingLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(LIVING_NONLIVING_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getLivingNonlivingLevel(11)).toBeUndefined();
	});
});
