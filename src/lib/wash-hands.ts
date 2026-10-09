/**
 * Pure rules for "Wash your hands". The child taps the steps in order.
 * One sequence is the whole level: ordering six pictures three times
 * would be too long for ages 6–8.
 */

export type StepId = 'wet' | 'soap' | 'rub' | 'fingers' | 'rinse' | 'dry';

/** The real order. Every level uses a subset that keeps this order. */
export const WASH_ORDER: StepId[] = ['wet', 'soap', 'rub', 'fingers', 'rinse', 'dry'];

export interface WashLevelConfig {
	level: number;
	steps: StepId[];
}

export const MAX_WASH_LEVEL = 10;

export const WASH_LEVELS: WashLevelConfig[] = [
	{ level: 1, steps: ['wet', 'soap', 'dry'] },
	{ level: 2, steps: ['wet', 'soap', 'rinse'] },
	{ level: 3, steps: ['wet', 'soap', 'rub', 'dry'] },
	{ level: 4, steps: ['wet', 'soap', 'rub', 'rinse'] },
	{ level: 5, steps: ['wet', 'soap', 'rub', 'rinse', 'dry'] },
	{ level: 6, steps: ['wet', 'soap', 'fingers', 'rinse', 'dry'] },
	{ level: 7, steps: ['wet', 'soap', 'rub', 'fingers', 'rinse'] },
	{ level: 8, steps: [...WASH_ORDER] },
	{ level: 9, steps: [...WASH_ORDER] },
	{ level: 10, steps: [...WASH_ORDER] }
];

export function getWashLevel(level: number): WashLevelConfig | undefined {
	return WASH_LEVELS.find((entry) => entry.level === level);
}

/** True when every step sits in the real hand-washing order. */
export function keepsRealOrder(steps: StepId[]): boolean {
	const indexes = steps.map((step) => WASH_ORDER.indexOf(step));
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

/** The steps as dealt, not in the answer order. */
export function dealSteps(steps: StepId[], rand: () => number = Math.random): StepId[] {
	return shuffled(steps, rand);
}

export function nextStep(order: StepId[], placed: number): StepId | undefined {
	return order[placed];
}

export function isNextStep(order: StepId[], placed: number, tapped: StepId): boolean {
	return order[placed] === tapped;
}
