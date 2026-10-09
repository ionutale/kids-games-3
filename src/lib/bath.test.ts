import { describe, expect, test } from 'vitest';
import {
	BATH_ORDER,
	MAX_BATH_LEVEL,
	dealBathSteps,
	getBathLevel,
	isNextBathStep,
	keepsBathOrder
} from './bath';

describe('bath levels', () => {
	test('ten levels stay in the real order', () => {
		expect(MAX_BATH_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getBathLevel(level)!;
			expect(config.steps.length).toBeGreaterThanOrEqual(3);
			expect(keepsBathOrder(config.steps)).toBe(true);
		}
		expect(getBathLevel(1)!.steps).toEqual(['water', 'soap', 'dry']);
		expect(getBathLevel(10)!.steps).toEqual(BATH_ORDER);
		expect(getBathLevel(11)).toBeUndefined();
	});
});

describe('dealing', () => {
	test('a deal contains each step once', () => {
		const steps = getBathLevel(10)!.steps;
		expect(new Set(dealBathSteps(steps, () => 0.2))).toEqual(new Set(steps));
	});

	test('only the step at the placed index is correct', () => {
		const order = getBathLevel(4)!.steps;
		expect(isNextBathStep(order, 0, 'water')).toBe(true);
		expect(isNextBathStep(order, 0, 'soap')).toBe(false);
		expect(isNextBathStep(order, 1, 'undress')).toBe(true);
	});
});
