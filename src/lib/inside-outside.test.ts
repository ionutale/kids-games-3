import { describe, expect, test } from 'vitest';
import {
	INSIDE_OUTSIDE_ROUNDS,
	SCENE_ANSWER,
	getInsideOutsideLevel,
	pickRounds
} from './inside-outside';

describe('inside-outside levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getInsideOutsideLevel(level)).toBeDefined();
		}
		expect(getInsideOutsideLevel(1)!.scenes).toEqual(['bedroom', 'park']);
		expect(getInsideOutsideLevel(10)!.scenes.length).toBe(6);
		expect(getInsideOutsideLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches the scene and options are inside and outside', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getInsideOutsideLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(INSIDE_OUTSIDE_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain('inside');
				expect(round.options).toContain('outside');
				expect(round.options).toHaveLength(2);
				expect(config.scenes).toContain(round.scene);
			}
		}
	});
});
