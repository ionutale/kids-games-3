/** Hungry or thirsty — food vs drink cue → tap. */

export type HungryThirstyId = 'hungry' | 'thirsty';

export type HungryThirstyCue =
	| 'apple'
	| 'bread'
	| 'cookie'
	| 'water'
	| 'juice'
	| 'milk';

export const CUE_ANSWER: Record<HungryThirstyCue, HungryThirstyId> = {
	apple: 'hungry',
	bread: 'hungry',
	cookie: 'hungry',
	water: 'thirsty',
	juice: 'thirsty',
	milk: 'thirsty'
};

export interface HungryThirstyRound {
	cue: HungryThirstyCue;
	answer: HungryThirstyId;
	options: HungryThirstyId[];
}

export interface HungryThirstyLevelConfig {
	level: number;
	cues: HungryThirstyCue[];
}

export const MAX_HUNGRY_THIRSTY_LEVEL = 10;
export const HUNGRY_THIRSTY_ROUNDS = 3;

const EARLY: HungryThirstyCue[] = ['apple', 'water'];
const MID: HungryThirstyCue[] = ['apple', 'bread', 'water', 'juice'];
const ALL: HungryThirstyCue[] = ['apple', 'bread', 'cookie', 'water', 'juice', 'milk'];

export const HUNGRY_THIRSTY_LEVELS: HungryThirstyLevelConfig[] = [
	{ level: 1, cues: EARLY },
	{ level: 2, cues: EARLY },
	{ level: 3, cues: EARLY },
	{ level: 4, cues: MID },
	{ level: 5, cues: MID },
	{ level: 6, cues: MID },
	{ level: 7, cues: ALL },
	{ level: 8, cues: ALL },
	{ level: 9, cues: ALL },
	{ level: 10, cues: ALL }
];

export function getHungryThirstyLevel(level: number): HungryThirstyLevelConfig | undefined {
	return HUNGRY_THIRSTY_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(
	config: HungryThirstyLevelConfig,
	rand: () => number = Math.random
): HungryThirstyRound[] {
	const cues = shuffled(config.cues, rand);
	return Array.from({ length: HUNGRY_THIRSTY_ROUNDS }, (_, index) => {
		const cue = cues[index % cues.length];
		return {
			cue,
			answer: CUE_ANSWER[cue],
			options: shuffled(['hungry', 'thirsty'], rand)
		};
	});
}
