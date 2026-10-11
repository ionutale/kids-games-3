/** Five senses — scene cue → tap which sense. */

export type SenseId = 'see' | 'hear' | 'smell' | 'taste' | 'touch';

export type SenseCue =
	| 'rainbow'
	| 'book'
	| 'drum'
	| 'bell'
	| 'flower'
	| 'cookie'
	| 'ice'
	| 'soft';

export const CUE_SENSE: Record<SenseCue, SenseId> = {
	rainbow: 'see',
	book: 'see',
	drum: 'hear',
	bell: 'hear',
	flower: 'smell',
	cookie: 'taste',
	ice: 'touch',
	soft: 'touch'
};

export interface FiveSensesRound {
	cue: SenseCue;
	answer: SenseId;
	options: SenseId[];
}

export interface FiveSensesLevelConfig {
	level: number;
	cues: SenseCue[];
	senses: SenseId[];
}

export const MAX_FIVE_SENSES_LEVEL = 10;
export const FIVE_SENSES_ROUNDS = 3;

const SEE_HEAR: SenseCue[] = ['rainbow', 'drum'];
const THREE: SenseCue[] = ['rainbow', 'drum', 'flower', 'bell'];
const ALL: SenseCue[] = ['rainbow', 'book', 'drum', 'bell', 'flower', 'cookie', 'ice', 'soft'];

export const FIVE_SENSES_LEVELS: FiveSensesLevelConfig[] = [
	{ level: 1, cues: SEE_HEAR, senses: ['see', 'hear'] },
	{ level: 2, cues: SEE_HEAR, senses: ['see', 'hear'] },
	{ level: 3, cues: THREE, senses: ['see', 'hear', 'smell'] },
	{ level: 4, cues: THREE, senses: ['see', 'hear', 'smell'] },
	{ level: 5, cues: ALL, senses: ['see', 'hear', 'smell', 'taste'] },
	{ level: 6, cues: ALL, senses: ['see', 'hear', 'smell', 'taste'] },
	{ level: 7, cues: ALL, senses: ['see', 'hear', 'smell', 'taste', 'touch'] },
	{ level: 8, cues: ALL, senses: ['see', 'hear', 'smell', 'taste', 'touch'] },
	{ level: 9, cues: ALL, senses: ['see', 'hear', 'smell', 'taste', 'touch'] },
	{ level: 10, cues: ALL, senses: ['see', 'hear', 'smell', 'taste', 'touch'] }
];

export function getFiveSensesLevel(level: number): FiveSensesLevelConfig | undefined {
	return FIVE_SENSES_LEVELS.find((entry) => entry.level === level);
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
	config: FiveSensesLevelConfig,
	rand: () => number = Math.random
): FiveSensesRound[] {
	const pool = config.cues.filter((cue) => config.senses.includes(CUE_SENSE[cue]));
	const cues = shuffled(pool, rand);
	return Array.from({ length: FIVE_SENSES_ROUNDS }, (_, index) => {
		const cue = cues[index % cues.length];
		return {
			cue,
			answer: CUE_SENSE[cue],
			options: shuffled(config.senses, rand)
		};
	});
}
