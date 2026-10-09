import { describe, expect, test } from 'vitest';
import { MORE_ROUNDS, correctSide, getMoreLevel, pickPairs } from './more-less';

describe('more or less levels', () => {
	test('ten levels, and the question flips to fewer', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getMoreLevel(level)).toBeDefined();
		}
		expect(getMoreLevel(1)!.ask).toBe('more');
		expect(getMoreLevel(8)!.ask).toBe('less');
		expect(getMoreLevel(11)).toBeUndefined();
	});
});

describe('pickPairs', () => {
	test('three unequal piles inside the level gap', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getMoreLevel(level)!;
			const pairs = pickPairs(config, () => 0.2);
			expect(pairs).toHaveLength(MORE_ROUNDS);
			for (const pair of pairs) {
				const gap = Math.abs(pair.left - pair.right);
				expect(gap).toBeGreaterThanOrEqual(1);
				expect(gap).toBeLessThanOrEqual(config.maxGap);
				expect(pair.left).toBeGreaterThanOrEqual(config.min);
				expect(pair.right).toBeLessThanOrEqual(config.max);
				const side = correctSide(pair, config.ask);
				const chosen = side === 'left' ? pair.left : pair.right;
				const other = side === 'left' ? pair.right : pair.left;
				if (config.ask === 'more') expect(chosen).toBeGreaterThan(other);
				else expect(chosen).toBeLessThan(other);
			}
		}
	});
});
