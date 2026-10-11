import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, STOP_GO_ROUNDS, getStopGoLevel, pickRounds } from './stop-go';

describe('stop-go', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getStopGoLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(STOP_GO_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getStopGoLevel(11)).toBeUndefined();
	});
});
