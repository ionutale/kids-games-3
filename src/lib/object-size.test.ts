import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, OBJECT_SIZE_ROUNDS, getObjectSizeLevel, pickRounds } from './object-size';

describe('object-size', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getObjectSizeLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(OBJECT_SIZE_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getObjectSizeLevel(11)).toBeUndefined();
	});
});
