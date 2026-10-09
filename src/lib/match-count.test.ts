import { describe, expect, test } from 'vitest';
import { MATCH_ROUNDS, getMatchLevel, pickRounds } from './match-count';

describe('match the number levels', () => {
	test('ten levels with at least three possible numbers', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMatchLevel(level)!;
			expect(config).toBeDefined();
			expect(config.max - config.min + 1).toBeGreaterThanOrEqual(MATCH_ROUNDS);
		}
		expect(getMatchLevel(1)!.pileCount).toBe(2);
		expect(getMatchLevel(6)!.tight).toBe(true);
		expect(getMatchLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('exactly one pile matches the number', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMatchLevel(level)!;
			const rounds = pickRounds(config, () => 0.35);
			expect(rounds).toHaveLength(MATCH_ROUNDS);
			for (const round of rounds) {
				expect(round.piles).toHaveLength(config.pileCount);
				expect(round.piles.filter((count) => count === round.target)).toHaveLength(1);
				expect(new Set(round.piles).size).toBe(round.piles.length);
				for (const count of round.piles) {
					expect(count).toBeGreaterThanOrEqual(config.min);
					expect(count).toBeLessThanOrEqual(config.max);
				}
				if (config.tight) {
					const wrong = round.piles.filter((count) => count !== round.target);
					const hasNeighbour = wrong.some((count) => Math.abs(count - round.target) === 1);
					const neighbourExists =
						wrong.length > 0 && (round.target > config.min || round.target < config.max);
					if (neighbourExists) expect(hasNeighbour).toBe(true);
				}
			}
		}
	});
});
