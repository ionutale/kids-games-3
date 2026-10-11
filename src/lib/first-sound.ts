/** First sound — picture → tap starting sound letter. */

export type SoundWord =
	| 'sun'
	| 'moon'
	| 'fish'
	| 'dog'
	| 'cat'
	| 'ball'
	| 'apple'
	| 'tree';

export const WORD_SOUND: Record<SoundWord, string> = {
	sun: 's',
	moon: 'm',
	fish: 'f',
	dog: 'd',
	cat: 'c',
	ball: 'b',
	apple: 'a',
	tree: 't'
};

export interface FirstSoundRound {
	word: SoundWord;
	answer: string;
	options: string[];
}

export interface FirstSoundLevelConfig {
	level: number;
	words: SoundWord[];
	optionCount: number;
}

export const MAX_FIRST_SOUND_LEVEL = 10;
export const FIRST_SOUND_ROUNDS = 3;

const EARLY: SoundWord[] = ['sun', 'moon', 'dog', 'cat'];
const MID: SoundWord[] = ['sun', 'moon', 'fish', 'dog', 'cat', 'ball'];
const ALL: SoundWord[] = ['sun', 'moon', 'fish', 'dog', 'cat', 'ball', 'apple', 'tree'];

export const FIRST_SOUND_LEVELS: FirstSoundLevelConfig[] = [
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

export function getFirstSoundLevel(level: number): FirstSoundLevelConfig | undefined {
	return FIRST_SOUND_LEVELS.find((entry) => entry.level === level);
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
	config: FirstSoundLevelConfig,
	rand: () => number = Math.random
): FirstSoundRound[] {
	const words = shuffled(config.words, rand);
	const letters = [...new Set(config.words.map((word) => WORD_SOUND[word]))];
	return Array.from({ length: FIRST_SOUND_ROUNDS }, (_, index) => {
		const word = words[index % words.length];
		const answer = WORD_SOUND[word];
		const distractors = shuffled(
			letters.filter((letter) => letter !== answer),
			rand
		).slice(0, config.optionCount - 1);
		return {
			word,
			answer,
			options: shuffled([answer, ...distractors], rand)
		};
	});
}
