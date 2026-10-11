import { describe, expect, test } from 'vitest';
import {
	WEIGHT_RANK,
	WEIGHT_ROUNDS,
	correctSide,
	getWeightLevel,
	pickRounds
} from './heavy-light';

describe('heavy-light levels', () => {
	test('ten levels, and the question flips to lighter', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getWeightLevel(level)).toBeDefined();
		}
		expect(getWeightLevel(1)!.ask).toBe('heavy');
		expect(getWeightLevel(8)!.ask).toBe('light');
		expect(getWeightLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('three unequal pairs that match the ask', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getWeightLevel(level)!;
			const rounds = pickRounds(config, () => 0.2);
			expect(rounds).toHaveLength(WEIGHT_ROUNDS);
			for (const round of rounds) {
				const gap = Math.abs(WEIGHT_RANK[round.left] - WEIGHT_RANK[round.right]);
				expect(gap).toBeGreaterThanOrEqual(config.minGap);
				expect(config.pool).toContain(round.left);
				expect(config.pool).toContain(round.right);
				const side = correctSide(round, config.ask);
				const chosen = side === 'left' ? round.left : round.right;
				const other = side === 'left' ? round.right : round.left;
				if (config.ask === 'heavy') {
					expect(WEIGHT_RANK[chosen]).toBeGreaterThan(WEIGHT_RANK[other]);
				} else {
					expect(WEIGHT_RANK[chosen]).toBeLessThan(WEIGHT_RANK[other]);
				}
			}
		}
	});
});
