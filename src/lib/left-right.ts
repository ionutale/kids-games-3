/**
 * Pure rules for "Left or right". An arrow or side cue is shown.
 * The child taps left or right.
 */

export type SideId = 'left' | 'right';
export type CueKind = 'arrow' | 'side';

export interface LeftRightRound {
	side: SideId;
	answer: SideId;
	cue: CueKind;
	options: SideId[];
	/** Smaller / subtler visual on harder levels. */
	subtle: boolean;
}

export interface LeftRightLevelConfig {
	level: number;
	cues: CueKind[];
	sides: SideId[];
	subtle: boolean;
}

export const MAX_LEFT_RIGHT_LEVEL = 10;
export const LEFT_RIGHT_ROUNDS = 3;

export const LEFT_RIGHT_LEVELS: LeftRightLevelConfig[] = [
	{ level: 1, cues: ['arrow'], sides: ['left', 'right'], subtle: false },
	{ level: 2, cues: ['arrow'], sides: ['left', 'right'], subtle: false },
	{ level: 3, cues: ['side'], sides: ['left', 'right'], subtle: false },
	{ level: 4, cues: ['side'], sides: ['left', 'right'], subtle: false },
	{ level: 5, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: false },
	{ level: 6, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: false },
	{ level: 7, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: false },
	{ level: 8, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: true },
	{ level: 9, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: true },
	{ level: 10, cues: ['arrow', 'side'], sides: ['left', 'right'], subtle: true }
];

export function getLeftRightLevel(level: number): LeftRightLevelConfig | undefined {
	return LEFT_RIGHT_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three cues. The answer is the matching side. */
export function pickRounds(
	config: LeftRightLevelConfig,
	rand: () => number = Math.random
): LeftRightRound[] {
	const sides = shuffled(config.sides, rand);
	const cues = shuffled(config.cues, rand);
	return Array.from({ length: LEFT_RIGHT_ROUNDS }, (_, index) => {
		const side = sides[index % sides.length];
		const cue = cues[index % cues.length];
		return {
			side,
			answer: side,
			cue,
			options: shuffled(['left', 'right'], rand),
			subtle: config.subtle
		};
	});
}
