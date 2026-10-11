import { describe, expect, test } from 'vitest';
import { OBJECT_ANSWER, SINK_FLOAT_ROUNDS, getSinkFloatLevel, pickRounds } from './sink-float';

describe('sink-float', () => {
	test('ten levels and matching answers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSinkFloatLevel(level)!;
			expect(config).toBeDefined();
			const rounds = pickRounds(config, () => 0.3);
			expect(rounds).toHaveLength(SINK_FLOAT_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(OBJECT_ANSWER[round.object]);
			}
		}
		expect(getSinkFloatLevel(11)).toBeUndefined();
	});
});
