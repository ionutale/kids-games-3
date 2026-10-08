import { describe, expect, test } from 'vitest';
import {
	MAX_LEVEL,
	OPTIONS_PER_ROUND,
	ROUNDS_PER_LEVEL,
	getLevel,
	hintStage,
	isLevelOpen,
	makeOptions,
	pickCounts,
	scatterPositions
} from './count-fruit';

describe('levels', () => {
	test('ten levels exist with growing ranges', () => {
		expect(MAX_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getLevel(level);
			expect(config).toBeDefined();
			expect(config!.max - config!.min + 1 >= ROUNDS_PER_LEVEL).toBe(true);
		}
		expect(getLevel(1)!.fruit).toBe('apple');
		expect(getLevel(1)!.min).toBe(1);
		expect(getLevel(1)!.max).toBe(3);
		expect(getLevel(11)).toBeUndefined();
	});

	test('only the first level is open before anything is cleared', () => {
		expect(isLevelOpen(0, 1)).toBe(true);
		expect(isLevelOpen(0, 2)).toBe(false);
		expect(isLevelOpen(3, 4)).toBe(true);
		expect(isLevelOpen(3, 5)).toBe(false);
		expect(isLevelOpen(10, 10)).toBe(true);
		expect(isLevelOpen(10, 11)).toBe(false);
		expect(isLevelOpen(0, 0)).toBe(false);
	});
});

describe('pickCounts', () => {
	test('three different counts inside the level range', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLevel(level)!;
			const counts = pickCounts(config, () => 0.42);
			expect(counts).toHaveLength(ROUNDS_PER_LEVEL);
			expect(new Set(counts).size).toBe(ROUNDS_PER_LEVEL);
			for (const count of counts) {
				expect(count).toBeGreaterThanOrEqual(config.min);
				expect(count).toBeLessThanOrEqual(config.max);
			}
		}
	});
});

describe('makeOptions', () => {
	test('three options including the right count', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLevel(level)!;
			for (let correct = config.min; correct <= config.max; correct++) {
				const options = makeOptions(config, correct, () => 0.7);
				expect(options).toHaveLength(OPTIONS_PER_ROUND);
				expect(options).toContain(correct);
				expect(new Set(options).size).toBe(OPTIONS_PER_ROUND);
			}
		}
	});

	test('level 1 always offers 1, 2 and 3', () => {
		const config = getLevel(1)!;
		expect([...makeOptions(config, 2, () => 0.1)].sort((a, b) => a - b)).toEqual([1, 2, 3]);
	});

	test('tight levels prefer neighbours of the answer', () => {
		const config = getLevel(10)!;
		const options = makeOptions(config, 8, () => 0.99);
		expect(options).toContain(8);
		expect(options.some((option) => option === 7 || option === 9)).toBe(true);
	});
});

describe('hintStage', () => {
	test('quiet start shows no hint', () => {
		expect(hintStage(0, 0, false)).toBe(0);
		expect(hintStage(1, 0, false)).toBe(0);
	});

	test('two misses, a Help press or a quiet spell nudge first', () => {
		expect(hintStage(2, 0, false)).toBe(1);
		expect(hintStage(0, 1, false)).toBe(1);
		expect(hintStage(0, 0, true)).toBe(1);
	});

	test('four misses or a second Help press name the answer', () => {
		expect(hintStage(4, 0, false)).toBe(2);
		expect(hintStage(0, 2, false)).toBe(2);
		expect(hintStage(3, 1, false)).toBe(1);
	});
});

describe('scatterPositions', () => {
	test('deterministic positions inside the board', () => {
		const first = scatterPositions(7, 42, false);
		const second = scatterPositions(7, 42, false);
		expect(first).toEqual(second);
		expect(first).toHaveLength(7);
		for (const spot of first) {
			expect(spot.x).toBeGreaterThanOrEqual(0);
			expect(spot.x).toBeLessThanOrEqual(100);
			expect(spot.y).toBeGreaterThanOrEqual(0);
			expect(spot.y).toBeLessThanOrEqual(100);
		}
		expect(scatterPositions(7, 43, false)).not.toEqual(first);
	});
});
