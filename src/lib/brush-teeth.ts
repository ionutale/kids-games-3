/**
 * Pure rules for "Brush your teeth". The child taps the steps in order.
 * One sequence is the whole level, same shape as washing hands.
 */

export type ToothStepId = 'wet' | 'paste' | 'top' | 'bottom' | 'tongue' | 'rinse';

export const BRUSH_ORDER: ToothStepId[] = ['wet', 'paste', 'top', 'bottom', 'tongue', 'rinse'];

export interface BrushLevelConfig {
	level: number;
	steps: ToothStepId[];
}

export const MAX_BRUSH_LEVEL = 10;

export const BRUSH_LEVELS: BrushLevelConfig[] = [
	{ level: 1, steps: ['paste', 'top', 'rinse'] },
	{ level: 2, steps: ['wet', 'paste', 'rinse'] },
	{ level: 3, steps: ['paste', 'top', 'bottom', 'rinse'] },
	{ level: 4, steps: ['wet', 'paste', 'top', 'rinse'] },
	{ level: 5, steps: ['wet', 'paste', 'top', 'bottom', 'rinse'] },
	{ level: 6, steps: ['paste', 'top', 'bottom', 'tongue', 'rinse'] },
	{ level: 7, steps: ['wet', 'paste', 'top', 'bottom', 'tongue'] },
	{ level: 8, steps: [...BRUSH_ORDER] },
	{ level: 9, steps: [...BRUSH_ORDER] },
	{ level: 10, steps: [...BRUSH_ORDER] }
];

export function getBrushLevel(level: number): BrushLevelConfig | undefined {
	return BRUSH_LEVELS.find((entry) => entry.level === level);
}

export function keepsBrushOrder(steps: ToothStepId[]): boolean {
	const indexes = steps.map((step) => BRUSH_ORDER.indexOf(step));
	return indexes.every((index, i) => index !== -1 && (i === 0 || index > indexes[i - 1]));
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function dealBrushSteps(
	steps: ToothStepId[],
	rand: () => number = Math.random
): ToothStepId[] {
	return shuffled(steps, rand);
}

export function isNextBrushStep(
	order: ToothStepId[],
	placed: number,
	tapped: ToothStepId
): boolean {
	return order[placed] === tapped;
}
