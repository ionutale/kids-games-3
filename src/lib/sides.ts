/**
 * Pure rules for "How many sides?". A shape is shown.
 * The child taps how many straight sides it has.
 */

export type SideShape = 'triangle' | 'square' | 'pentagon' | 'hexagon';

export interface SidesRound {
	shape: SideShape;
	answer: number;
	options: number[];
}

export interface SidesLevelConfig {
	level: number;
	shapes: SideShape[];
	tight: boolean;
}

export const SIDES: Record<SideShape, number> = {
	triangle: 3,
	square: 4,
	pentagon: 5,
	hexagon: 6
};

export const MAX_SIDES_LEVEL = 10;
export const SIDES_ROUNDS = 3;

const TWO: SideShape[] = ['triangle', 'square'];
const THREE: SideShape[] = ['triangle', 'square', 'pentagon'];
const ALL: SideShape[] = ['triangle', 'square', 'pentagon', 'hexagon'];

export const SIDES_LEVELS: SidesLevelConfig[] = [
	{ level: 1, shapes: TWO, tight: false },
	{ level: 2, shapes: TWO, tight: false },
	{ level: 3, shapes: THREE, tight: false },
	{ level: 4, shapes: ALL, tight: false },
	{ level: 5, shapes: ALL, tight: false },
	{ level: 6, shapes: ALL, tight: true },
	{ level: 7, shapes: ALL, tight: true },
	{ level: 8, shapes: THREE, tight: true },
	{ level: 9, shapes: ALL, tight: true },
	{ level: 10, shapes: ALL, tight: true }
];

export function getSidesLevel(level: number): SidesLevelConfig | undefined {
	return SIDES_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function optionsFor(answer: number, tight: boolean, rand: () => number): number[] {
	const near = [answer - 1, answer + 1].filter((value) => value >= 2 && value <= 8);
	const far = [2, 3, 4, 5, 6, 7, 8].filter((value) => value !== answer && !near.includes(value));
	const ordered = tight ? [...near, ...shuffled(far, rand)] : [...shuffled(far, rand), ...near];
	const picked = [answer];
	for (const value of ordered) {
		if (picked.length >= 3) break;
		if (!picked.includes(value)) picked.push(value);
	}
	return shuffled(picked, rand);
}

/** Three shapes. The answer is the number of straight sides. */
export function pickRounds(
	config: SidesLevelConfig,
	rand: () => number = Math.random
): SidesRound[] {
	const shapes = shuffled(config.shapes, rand);
	return Array.from({ length: SIDES_ROUNDS }, (_, index) => {
		const shape = shapes[index % shapes.length];
		const answer = SIDES[shape];
		return { shape, answer, options: optionsFor(answer, config.tight, rand) };
	});
}
