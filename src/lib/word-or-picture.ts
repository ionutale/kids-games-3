/** Word or picture? — see word or picture, tap the match. */

export type WopItem = 'cat' | 'dog' | 'sun' | 'ball' | 'fish' | 'cup';
export type WopMode = 'word-to-pic' | 'pic-to-word';

export interface WordOrPictureRound {
	item: WopItem;
	mode: WopMode;
	answer: WopItem;
	options: WopItem[];
}

export interface WordOrPictureLevelConfig {
	level: number;
	items: WopItem[];
	modes: WopMode[];
	optionCount: number;
}

export const MAX_WORD_OR_PICTURE_LEVEL = 10;
export const WORD_OR_PICTURE_ROUNDS = 3;
const EARLY: WopItem[] = ['cat', 'dog', 'sun', 'ball'];
const ALL: WopItem[] = ['cat', 'dog', 'sun', 'ball', 'fish', 'cup'];

export const WORD_OR_PICTURE_LEVELS: WordOrPictureLevelConfig[] = [
	{ level: 1, items: EARLY, modes: ['word-to-pic'], optionCount: 2 },
	{ level: 2, items: EARLY, modes: ['word-to-pic'], optionCount: 2 },
	{ level: 3, items: EARLY, modes: ['pic-to-word'], optionCount: 2 },
	{ level: 4, items: EARLY, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 5, items: EARLY, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 6, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 3 },
	{ level: 7, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 8, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 9, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 4 },
	{ level: 10, items: ALL, modes: ['word-to-pic', 'pic-to-word'], optionCount: 5 }
];

export function getWordOrPictureLevel(level: number): WordOrPictureLevelConfig | undefined {
	return WORD_OR_PICTURE_LEVELS.find((entry) => entry.level === level);
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
	config: WordOrPictureLevelConfig,
	rand: () => number = Math.random
): WordOrPictureRound[] {
	const items = shuffled(config.items, rand);
	const modes = shuffled(config.modes, rand);
	return Array.from({ length: WORD_OR_PICTURE_ROUNDS }, (_, index) => {
		const item = items[index % items.length];
		const mode = modes[index % modes.length];
		const distractors = shuffled(config.items.filter((i) => i !== item), rand).slice(0, config.optionCount - 1);
		return {
			item,
			mode,
			answer: item,
			options: shuffled([item, ...distractors], rand)
		};
	});
}
