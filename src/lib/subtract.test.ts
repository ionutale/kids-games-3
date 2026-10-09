import { describe, expect, test } from 'vitest';
import {
	MAX_SUBTRACT_LEVEL,
	SUBTRACT_ROUNDS_PER_LEVEL,
	getSubtractLevel,
	makeRemainOptions,
	pickDifferences,
	remainOf
} from './subtract';

describe('subtract levels', () => {
	test('ten levels have at least three different remainders', () => {
		expect(MAX_SUBTRACT_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getSubtractLevel(level)!;
			expect(config.maxRemain - config.minRemain + 1).toBeGreaterThanOrEqual(
				SUBTRACT_ROUNDS_PER_LEVEL
			);
		}
		expect(getSubtractLevel(1)!.maxTaken).toBe(1);
		expect(getSubtractLevel(10)!.tight).toBe(true);
		expect(getSubtractLevel(11)).toBeUndefined();
	});
});

describe('pickDifferences', () => {
	test('three problems with different remainders', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSubtractLevel(level)!;
			const problems = pickDifferences(config, () => 0.42);
			expect(problems).toHaveLength(SUBTRACT_ROUNDS_PER_LEVEL);
			const remains = problems.map(remainOf);
			expect(new Set(remains).size).toBe(SUBTRACT_ROUNDS_PER_LEVEL);
			for (const problem of problems) {
				expect(problem.taken).toBeGreaterThanOrEqual(config.minTaken);
				expect(problem.taken).toBeLessThanOrEqual(config.maxTaken);
				expect(remainOf(problem)).toBeGreaterThanOrEqual(config.minRemain);
				expect(remainOf(problem)).toBeLessThanOrEqual(config.maxRemain);
				expect(problem.start).toBe(remainOf(problem) + problem.taken);
			}
		}
	});
});

describe('makeRemainOptions', () => {
	test('three options including the remainder', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSubtractLevel(level)!;
			for (const problem of pickDifferences(config, () => 0.3)) {
				const options = makeRemainOptions(config, problem, () => 0.7);
				expect(options).toHaveLength(3);
				expect(options).toContain(remainOf(problem));
				expect(new Set(options).size).toBe(3);
			}
		}
	});

	test('tight levels prefer neighbours of the remainder', () => {
		const config = getSubtractLevel(10)!;
		const options = makeRemainOptions(config, { start: 9, taken: 2 }, () => 0.99);
		expect(options).toContain(7);
		expect(options.some((option) => option === 6 || option === 8)).toBe(true);
	});
});
