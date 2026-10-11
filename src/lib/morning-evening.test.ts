import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, MORNING_EVENING_ROUNDS, getMorningEveningLevel, pickRounds } from './morning-evening';

describe('morning-evening', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMorningEveningLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(MORNING_EVENING_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getMorningEveningLevel(11)).toBeUndefined();
	});
});
