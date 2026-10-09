/**
 * Pure rules for "Take a bath". The child taps the steps in order.
 * One sequence is the whole level.
 */

export type BathStepId = 'water' | 'undress' | 'soap' | 'hair' | 'rinse' | 'dry';

export const BATH_ORDER: BathStepId[] = ['water', 'undress', 'soap', 'hair', 'rinse', 'dry'];

export interface BathLevelConfig {
	level: number;
	steps: BathStepId[];
}

export const MAX_BATH_LEVEL = 10;

export const BATH_LEVELS: BathLevelConfig[] = [
	{ level: 1, steps: ['water', 'soap', 'dry'] },
	{ level: 2, steps: ['water', 'soap', 'rinse'] },
	{ level: 3, steps: ['water', 'soap', 'hair', 'dry'] },
	{ level: 4, steps: ['water', 'undress', 'soap', 'dry'] },
	{ level: 5, steps: ['water', 'soap', 'hair', 'rinse', 'dry'] },
	{ level: 6, steps: ['water', 'undress', 'soap', 'rinse', 'dry'] },
	{ level: 7, steps: ['water', 'undress', 'soap', 'hair', 'rinse'] },
	{ level: 8, steps: [...BATH_ORDER] },
	{ level: 9, steps: [...BATH_ORDER] },
	{ level: 10, steps: [...BATH_ORDER] }
];

export function getBathLevel(level: number): BathLevelConfig | undefined {
	return BATH_LEVELS.find((entry) => entry.level === level);
}

export function keepsBathOrder(steps: BathStepId[]): boolean {
	const indexes = steps.map((step) => BATH_ORDER.indexOf(step));
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

export function dealBathSteps(steps: BathStepId[], rand: () => number = Math.random): BathStepId[] {
	return shuffled(steps, rand);
}

export function isNextBathStep(order: BathStepId[], placed: number, tapped: BathStepId): boolean {
	return order[placed] === tapped;
}
