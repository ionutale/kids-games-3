import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, ASK_GRAB_ROUNDS, getAskGrabLevel, pickRounds } from './ask-grab';

describe('ask-grab', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAskGrabLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ASK_GRAB_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getAskGrabLevel(11)).toBeUndefined();
	});
});
