import { describe, expect, test } from 'vitest';
import { DAY_NIGHT_ROUNDS, SCENE_ANSWER, getDayNightLevel, pickRounds } from './day-night';

describe('day-night levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getDayNightLevel(level)).toBeDefined();
		}
		expect(getDayNightLevel(1)!.scenes).toEqual(['sunny', 'moon']);
		expect(getDayNightLevel(10)!.scenes.length).toBe(6);
		expect(getDayNightLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches the scene and options are day and night', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDayNightLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DAY_NIGHT_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain('day');
				expect(round.options).toContain('night');
				expect(round.options).toHaveLength(2);
				expect(config.scenes).toContain(round.scene);
			}
		}
	});
});
