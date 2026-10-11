import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, MAGNET_OR_NOT_ROUNDS, getMagnetOrNotLevel, pickRounds } from './magnet-or-not';

describe('magnet-or-not', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMagnetOrNotLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(MAGNET_OR_NOT_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getMagnetOrNotLevel(11)).toBeUndefined();
	});
});
