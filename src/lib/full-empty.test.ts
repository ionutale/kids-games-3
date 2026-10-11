import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, FULL_EMPTY_ROUNDS, getFullEmptyLevel, pickRounds } from './full-empty';

describe('full-empty', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFullEmptyLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(FULL_EMPTY_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getFullEmptyLevel(11)).toBeUndefined();
	});
});
