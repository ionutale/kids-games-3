/**
 * Pure rules for "Follow the path".
 * A short maze fork. Tap which way to go next (toward the green goal).
 */

export type PathDir = 'up' | 'down' | 'left' | 'right';

/** Visual fork layouts for the maze art. */
export type PathLayout =
	| 'straight-right'
	| 'straight-left'
	| 'straight-down'
	| 'turn-right'
	| 'turn-left'
	| 'T-pick-right';

export interface PathRound {
	answer: PathDir;
	options: PathDir[];
	layout: PathLayout;
}

export interface PathLevelConfig {
	level: number;
	layouts: PathLayout[];
	optionCount: number;
}

export const MAX_PATH_LEVEL = 10;
export const PATH_ROUNDS = 3;

/** Correct next step toward the green goal. */
export const LAYOUT_ANSWER: Record<PathLayout, PathDir> = {
	'straight-right': 'right',
	'straight-left': 'left',
	'straight-down': 'down',
	'turn-right': 'right',
	'turn-left': 'left',
	'T-pick-right': 'right'
};

const EARLY: PathLayout[] = ['straight-right', 'straight-left', 'straight-down'];
const MID: PathLayout[] = [
	'straight-right',
	'straight-left',
	'straight-down',
	'turn-right',
	'turn-left'
];
const ALL: PathLayout[] = [
	'straight-right',
	'straight-left',
	'straight-down',
	'turn-right',
	'turn-left',
	'T-pick-right'
];

export const PATH_LEVELS: PathLevelConfig[] = [
	{ level: 1, layouts: EARLY, optionCount: 2 },
	{ level: 2, layouts: EARLY, optionCount: 2 },
	{ level: 3, layouts: EARLY, optionCount: 2 },
	{ level: 4, layouts: MID, optionCount: 3 },
	{ level: 5, layouts: MID, optionCount: 3 },
	{ level: 6, layouts: MID, optionCount: 3 },
	{ level: 7, layouts: ALL, optionCount: 3 },
	{ level: 8, layouts: ALL, optionCount: 4 },
	{ level: 9, layouts: ALL, optionCount: 4 },
	{ level: 10, layouts: ALL, optionCount: 4 }
];

export function getPathLevel(level: number): PathLevelConfig | undefined {
	return PATH_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

const ALL_DIRS: PathDir[] = ['up', 'down', 'left', 'right'];

/** Three forks. Options always include the correct exit. */
export function pickRounds(
	config: PathLevelConfig,
	rand: () => number = Math.random
): PathRound[] {
	const layouts = shuffled(config.layouts, rand);
	return Array.from({ length: PATH_ROUNDS }, (_, index) => {
		const layout = layouts[index % layouts.length];
		const answer = LAYOUT_ANSWER[layout];
		const others = shuffled(
			ALL_DIRS.filter((dir) => dir !== answer),
			rand
		).slice(0, config.optionCount - 1);
		return {
			answer,
			options: shuffled([answer, ...others], rand),
			layout
		};
	});
}
