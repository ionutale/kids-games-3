/** Real / nonsense word — tap real or nonsense. */

export type RealWordId = 'real' | 'nonsense';
export type RealWordItem = 'cat' | 'dog' | 'sun' | 'blorp' | 'zorp' | 'miffle';

export const WORD_ANSWER: Record<RealWordItem, RealWordId> = {
	cat: 'real', dog: 'real', sun: 'real', blorp: 'nonsense', zorp: 'nonsense', miffle: 'nonsense'
};

export interface RealWordRound {
	word: RealWordItem;
	answer: RealWordId;
	options: RealWordId[];
}

export interface RealWordLevelConfig {
	level: number;
	words: RealWordItem[];
}

export const MAX_REAL_WORD_LEVEL = 10;
export const REAL_WORD_ROUNDS = 3;
const EARLY: RealWordItem[] = ['cat', 'blorp'];
const MID: RealWordItem[] = ['cat', 'dog', 'blorp', 'zorp'];
const ALL: RealWordItem[] = ['cat', 'dog', 'sun', 'blorp', 'zorp', 'miffle'];

export const REAL_WORD_LEVELS: RealWordLevelConfig[] = [
	{ level: 1, words: EARLY }, { level: 2, words: EARLY }, { level: 3, words: EARLY },
	{ level: 4, words: MID }, { level: 5, words: MID }, { level: 6, words: MID },
	{ level: 7, words: ALL }, { level: 8, words: ALL }, { level: 9, words: ALL }, { level: 10, words: ALL }
];

export function getRealWordLevel(level: number): RealWordLevelConfig | undefined {
	return REAL_WORD_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(config: RealWordLevelConfig, rand: () => number = Math.random): RealWordRound[] {
	const words = shuffled(config.words, rand);
	return Array.from({ length: REAL_WORD_ROUNDS }, (_, index) => {
		const word = words[index % words.length];
		return { word, answer: WORD_ANSWER[word], options: shuffled(['real', 'nonsense'], rand) };
	});
}
