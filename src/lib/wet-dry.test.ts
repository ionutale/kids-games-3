import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, WET_DRY_ROUNDS, getWetDryLevel, pickRounds } from './wet-dry';

describe('wet-dry levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getWetDryLevel(level)).toBeDefined();
		}
		expect(getWetDryLevel(1)!.scenes).toEqual(['puddle', 'towel']);
		expect(getWetDryLevel(10)!.scenes.length).toBe(6);
		expect(getWetDryLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches the scene and options are wet and dry', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWetDryLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(WET_DRY_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain('wet');
				expect(round.options).toContain('dry');
				expect(round.options).toHaveLength(2);
				expect(config.scenes).toContain(round.scene);
			}
		}
	});
});
