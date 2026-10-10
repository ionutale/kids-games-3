import { describe, expect, test } from 'vitest';
import { SORT_ROUNDS, getSortLevel, pickRounds } from './sort-color';

describe('sort by color levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getSortLevel(level)).toBeDefined();
		}
		expect(getSortLevel(1)!.bucketCount).toBe(2);
		expect(getSortLevel(1)!.itemCount).toBe(2);
		expect(getSortLevel(10)!.bucketCount).toBe(6);
		expect(getSortLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('every item matches one of the buckets', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSortLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(SORT_ROUNDS);
			for (const round of rounds) {
				expect(round.buckets).toHaveLength(config.bucketCount);
				expect(new Set(round.buckets).size).toBe(config.bucketCount);
				expect(round.items).toHaveLength(config.itemCount);
				expect(new Set(round.items.map((item) => item.id)).size).toBe(config.itemCount);
				for (const item of round.items) {
					expect(round.buckets).toContain(item.color);
					expect(config.shapes).toContain(item.shape);
				}
				for (const bucket of round.buckets) {
					expect(round.items.some((item) => item.color === bucket)).toBe(true);
				}
			}
		}
	});
});
