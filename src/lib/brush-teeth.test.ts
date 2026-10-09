import { describe, expect, test } from 'vitest';
import {
	BRUSH_ORDER,
	MAX_BRUSH_LEVEL,
	dealBrushSteps,
	getBrushLevel,
	isNextBrushStep,
	keepsBrushOrder
} from './brush-teeth';

describe('brush levels', () => {
	test('ten levels stay in the real order', () => {
		expect(MAX_BRUSH_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getBrushLevel(level)!;
			expect(config.steps.length).toBeGreaterThanOrEqual(3);
			expect(keepsBrushOrder(config.steps)).toBe(true);
		}
		expect(getBrushLevel(1)!.steps).toEqual(['paste', 'top', 'rinse']);
		expect(getBrushLevel(10)!.steps).toEqual(BRUSH_ORDER);
		expect(getBrushLevel(11)).toBeUndefined();
	});
});

describe('dealing', () => {
	test('a deal contains each step once', () => {
		const steps = getBrushLevel(10)!.steps;
		const dealt = dealBrushSteps(steps, () => 0.2);
		expect(new Set(dealt)).toEqual(new Set(steps));
	});

	test('only the step at the placed index is correct', () => {
		const order = getBrushLevel(5)!.steps;
		expect(isNextBrushStep(order, 0, 'wet')).toBe(true);
		expect(isNextBrushStep(order, 0, 'paste')).toBe(false);
		expect(isNextBrushStep(order, 2, 'top')).toBe(true);
	});
});
