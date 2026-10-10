import { describe, expect, test } from 'vitest';
import { KIND_ROUNDS, getKindLevel, pickRounds } from './sort-kind';

describe('sort by kind levels', () => {
	test('ten levels, toys from level 3', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getKindLevel(level)).toBeDefined();
		}
		expect(getKindLevel(1)!.bucketCount).toBe(2);
		expect(getKindLevel(1)!.kinds).toEqual(['animal', 'food']);
		expect(getKindLevel(3)!.kinds).toContain('toy');
		expect(getKindLevel(3)!.bucketCount).toBe(3);
		expect(getKindLevel(10)!.itemCount).toBe(8);
		expect(getKindLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('every item matches one of the buckets', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getKindLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(KIND_ROUNDS);
			for (const round of rounds) {
				expect(round.buckets).toHaveLength(config.bucketCount);
				expect(new Set(round.buckets).size).toBe(config.bucketCount);
				expect(round.items).toHaveLength(config.itemCount);
				expect(new Set(round.items.map((item) => item.id)).size).toBe(config.itemCount);
				for (const item of round.items) {
					expect(round.buckets).toContain(item.kind);
					expect(config.faces[item.kind]).toContain(item.face);
				}
				for (const bucket of round.buckets) {
					expect(round.items.some((item) => item.kind === bucket)).toBe(true);
				}
			}
		}
	});
});
