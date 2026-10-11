import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, SOLID_LIQUID_ROUNDS, getSolidLiquidLevel, pickRounds } from './solid-liquid';

describe('solid-liquid', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSolidLiquidLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SOLID_LIQUID_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getSolidLiquidLevel(11)).toBeUndefined();
	});
});
