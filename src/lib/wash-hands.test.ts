import { describe, expect, test } from 'vitest';
import {
	MAX_WASH_LEVEL,
	WASH_ORDER,
	dealSteps,
	getWashLevel,
	isNextStep,
	keepsRealOrder,
	nextStep
} from './wash-hands';

describe('wash levels', () => {
	test('ten levels stay in the real order and grow toward six steps', () => {
		expect(MAX_WASH_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getWashLevel(level)!;
			expect(config.steps.length).toBeGreaterThanOrEqual(3);
			expect(keepsRealOrder(config.steps)).toBe(true);
		}
		expect(getWashLevel(1)!.steps).toEqual(['wet', 'soap', 'dry']);
		expect(getWashLevel(10)!.steps).toEqual(WASH_ORDER);
		expect(getWashLevel(11)).toBeUndefined();
	});
});

describe('dealing', () => {
	test('a deal contains each step once', () => {
		const steps = getWashLevel(10)!.steps;
		const dealt = dealSteps(steps, () => 0.2);
		expect(dealt).toHaveLength(steps.length);
		expect(new Set(dealt)).toEqual(new Set(steps));
	});

	test('the next step is the one at the placed index', () => {
		const order = getWashLevel(5)!.steps;
		expect(nextStep(order, 0)).toBe('wet');
		expect(isNextStep(order, 0, 'wet')).toBe(true);
		expect(isNextStep(order, 0, 'soap')).toBe(false);
		expect(isNextStep(order, 2, 'rub')).toBe(true);
		expect(nextStep(order, order.length)).toBeUndefined();
	});
});
