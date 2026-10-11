/** Last sound — picture → tap ending letter. */

export type LastWord = 'cat' | 'dog' | 'sun' | 'ball' | 'fish' | 'moon' | 'cup' | 'bed';
export const WORD_END: Record<LastWord, string> = {
	cat: 't', dog: 'g', sun: 'n', ball: 'l', fish: 'h', moon: 'n', cup: 'p', bed: 'd'
};

export interface LastSoundRound {
	word: LastWord;
	answer: string;
	options: string[];
}

export interface LastSoundLevelConfig {
	level: number;
	words: LastWord[];
	optionCount: number;
}

export const MAX_LAST_SOUND_LEVEL = 10;
export const LAST_SOUND_ROUNDS = 3;
const EARLY: LastWord[] = ['cat', 'dog', 'sun', 'cup'];
const MID: LastWord[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'cup'];
const ALL: LastWord[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'moon', 'cup', 'bed'];

export const LAST_SOUND_LEVELS: LastSoundLevelConfig[] = [
	{ level: 1, words: EARLY, optionCount: 2 },
	{ level: 2, words: EARLY, optionCount: 2 },
	{ level: 3, words: EARLY, optionCount: 3 },
	{ level: 4, words: MID, optionCount: 3 },
	{ level: 5, words: MID, optionCount: 3 },
	{ level: 6, words: MID, optionCount: 4 },
	{ level: 7, words: ALL, optionCount: 4 },
	{ level: 8, words: ALL, optionCount: 4 },
	{ level: 9, words: ALL, optionCount: 5 },
	{ level: 10, words: ALL, optionCount: 5 }
];

export function getLastSoundLevel(level: number): LastSoundLevelConfig | undefined {
	return LAST_SOUND_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(config: LastSoundLevelConfig, rand: () => number = Math.random): LastSoundRound[] {
	const words = shuffled(config.words, rand);
	const letters = [...new Set(config.words.map((w) => WORD_END[w]))];
	return Array.from({ length: LAST_SOUND_ROUNDS }, (_, index) => {
		const word = words[index % words.length];
		const answer = WORD_END[word];
		const distractors = shuffled(letters.filter((l) => l !== answer), rand).slice(0, config.optionCount - 1);
		return { word, answer, options: shuffled([answer, ...distractors], rand) };
	});
}
