import { describe, expect, test } from 'vitest';
import { SCENE_ANSWER, LOUD_QUIET_ROUNDS, getLoudQuietLevel, pickRounds } from './loud-quiet';

describe('loud-quiet', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLoudQuietLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(LOUD_QUIET_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SCENE_ANSWER[round.scene]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getLoudQuietLevel(11)).toBeUndefined();
	});
});
