import { describe, expect, test } from 'vitest';
import {
	ADDING_ROUNDS_PER_LEVEL,
	MAX_ADDING_LEVEL,
	getAddingLevel,
	makeTotalOptions,
	pickSums,
	totalOf
} from './adding';

describe('adding levels', () => {
	test('ten levels with room for three different totals', () => {
		expect(MAX_ADDING_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getAddingLevel(level)!;
			expect(config).toBeDefined();
			expect(config.maxTotal - config.minPart * 2 + 1).toBeGreaterThanOrEqual(
				ADDING_ROUNDS_PER_LEVEL
			);
		}
		expect(getAddingLevel(1)!.maxTotal).toBe(4);
		expect(getAddingLevel(10)!.tight).toBe(true);
		expect(getAddingLevel(11)).toBeUndefined();
	});
});

describe('pickSums', () => {
	test('three sums with different totals inside the level', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAddingLevel(level)!;
			const sums = pickSums(config, () => 0.42);
			expect(sums).toHaveLength(ADDING_ROUNDS_PER_LEVEL);
			const totals = sums.map(totalOf);
			expect(new Set(totals).size).toBe(ADDING_ROUNDS_PER_LEVEL);
			for (const sum of sums) {
				expect(sum.left).toBeGreaterThanOrEqual(config.minPart);
				expect(sum.right).toBeGreaterThanOrEqual(config.minPart);
				expect(totalOf(sum)).toBeLessThanOrEqual(config.maxTotal);
			}
		}
	});
});

describe('makeTotalOptions', () => {
	test('three options including the total', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAddingLevel(level)!;
			for (const sum of pickSums(config, () => 0.3)) {
				const options = makeTotalOptions(config, sum, () => 0.7);
				expect(options).toHaveLength(3);
				expect(options).toContain(totalOf(sum));
				expect(new Set(options).size).toBe(3);
			}
		}
	});

	test('tight levels prefer neighbours of the total', () => {
		const config = getAddingLevel(10)!;
		const options = makeTotalOptions(config, { left: 4, right: 4 }, () => 0.99);
		expect(options).toContain(8);
		expect(options.some((option) => option === 7 || option === 9)).toBe(true);
	});
});
