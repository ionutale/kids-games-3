import { describe, expect, test } from 'vitest';
import { SMALL_BIG_ROUNDS, getSmallBigLevel, isNextPile, nextPile, pickRounds } from './small-big';

describe('small to big levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSmallBigLevel(level)).toBeDefined();
		}
		expect(getSmallBigLevel(1)!.minSpan).toBe(3);
		expect(getSmallBigLevel(6)!.minSpan).toBe(getSmallBigLevel(6)!.maxSpan);
		expect(getSmallBigLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('three piles, each with a different count inside the span', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSmallBigLevel(level)!;
			const rounds = pickRounds(config, () => 0.3);
			expect(rounds).toHaveLength(SMALL_BIG_ROUNDS);
			for (const round of rounds) {
				const sorted = [...round.counts].sort((a, b) => a - b);
				expect(new Set(round.counts).size).toBe(3);
				expect(sorted[0]).toBeGreaterThanOrEqual(config.min);
				expect(sorted[2]).toBeLessThanOrEqual(config.max);
				const span = sorted[2] - sorted[0];
				expect(span).toBeGreaterThanOrEqual(config.minSpan);
				expect(span).toBeLessThanOrEqual(config.maxSpan);
				expect(isNextPile(round.counts, 0, nextPile(round.counts, 0))).toBe(true);
				expect(round.counts[nextPile(round.counts, 0)]).toBe(sorted[0]);
				expect(round.counts[nextPile(round.counts, 1)]).toBe(sorted[1]);
				expect(round.counts[nextPile(round.counts, 2)]).toBe(sorted[2]);
			}
		}
	});
});
