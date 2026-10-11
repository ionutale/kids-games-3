import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, DAY_NIGHT_ANIMAL_ROUNDS, getDayNightAnimalLevel, pickRounds } from './day-night-animal';

describe('day-night-animal', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDayNightAnimalLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DAY_NIGHT_ANIMAL_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getDayNightAnimalLevel(11)).toBeUndefined();
	});
});
