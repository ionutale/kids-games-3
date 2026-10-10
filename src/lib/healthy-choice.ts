/**
 * Pure rules for "Healthy choice".
 * Gentle: pick a body-friendly food next to a treat. No shame language.
 */

export type HealthyId =
	| 'apple'
	| 'banana'
	| 'carrot'
	| 'water'
	| 'milk'
	| 'broccoli'
	| 'grapes'
	| 'pear';

export type TreatId =
	| 'candy'
	| 'cookie'
	| 'soda'
	| 'chips'
	| 'donut'
	| 'ice-cream'
	| 'cake'
	| 'lollipop';

export type FoodId = HealthyId | TreatId;

export interface HealthyRound {
	healthy: HealthyId;
	treat: TreatId;
	/** Left / right order of the two choices. */
	options: FoodId[];
	answer: HealthyId;
}

export interface HealthyLevelConfig {
	level: number;
	healthy: HealthyId[];
	treats: TreatId[];
}

export const MAX_HEALTHY_LEVEL = 10;
export const HEALTHY_ROUNDS = 3;

const EARLY_HEALTHY: HealthyId[] = ['apple', 'banana', 'carrot', 'water'];
const EARLY_TREATS: TreatId[] = ['candy', 'cookie', 'soda', 'chips'];
const ALL_HEALTHY: HealthyId[] = [
	'apple',
	'banana',
	'carrot',
	'water',
	'milk',
	'broccoli',
	'grapes',
	'pear'
];
const ALL_TREATS: TreatId[] = [
	'candy',
	'cookie',
	'soda',
	'chips',
	'donut',
	'ice-cream',
	'cake',
	'lollipop'
];

export const HEALTHY_LEVELS: HealthyLevelConfig[] = [
	{ level: 1, healthy: EARLY_HEALTHY, treats: EARLY_TREATS },
	{ level: 2, healthy: EARLY_HEALTHY, treats: EARLY_TREATS },
	{ level: 3, healthy: EARLY_HEALTHY, treats: EARLY_TREATS },
	{ level: 4, healthy: EARLY_HEALTHY, treats: EARLY_TREATS },
	{ level: 5, healthy: EARLY_HEALTHY, treats: EARLY_TREATS },
	{ level: 6, healthy: ALL_HEALTHY, treats: ALL_TREATS },
	{ level: 7, healthy: ALL_HEALTHY, treats: ALL_TREATS },
	{ level: 8, healthy: ALL_HEALTHY, treats: ALL_TREATS },
	{ level: 9, healthy: ALL_HEALTHY, treats: ALL_TREATS },
	{ level: 10, healthy: ALL_HEALTHY, treats: ALL_TREATS }
];

export function getHealthyLevel(level: number): HealthyLevelConfig | undefined {
	return HEALTHY_LEVELS.find((entry) => entry.level === level);
}

export function isHealthy(food: FoodId): food is HealthyId {
	return (
		food === 'apple' ||
		food === 'banana' ||
		food === 'carrot' ||
		food === 'water' ||
		food === 'milk' ||
		food === 'broccoli' ||
		food === 'grapes' ||
		food === 'pear'
	);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three gentle pairs: one healthy food, one treat. */
export function pickRounds(
	config: HealthyLevelConfig,
	rand: () => number = Math.random
): HealthyRound[] {
	const healthyPicks = shuffled(config.healthy, rand);
	const treatPicks = shuffled(config.treats, rand);
	return Array.from({ length: HEALTHY_ROUNDS }, (_, index) => {
		const healthy = healthyPicks[index % healthyPicks.length];
		const treat = treatPicks[index % treatPicks.length];
		const options = shuffled([healthy, treat] as FoodId[], rand);
		return { healthy, treat, options, answer: healthy };
	});
}
