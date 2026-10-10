/**
 * Pure rules for "Rhyming pair". A word (with a picture) is shown.
 * The child taps the word that rhymes. Pairs are locale-specific.
 */

export type RhymeLocale = 'it' | 'ro' | 'en' | 'de';

export interface RhymeWord {
	word: string;
	picture: string;
}

export interface RhymePair {
	a: RhymeWord;
	b: RhymeWord;
}

export interface RhymeRound {
	prompt: RhymeWord;
	answer: RhymeWord;
	options: RhymeWord[];
}

export interface RhymeLevelConfig {
	level: number;
	/** How many pairs from the start of the bank are in play. */
	poolSize: number;
	optionCount: number;
	/** Wrong answers share the same starting letter when possible. */
	tight: boolean;
}

export const MAX_RHYME_LEVEL = 10;
export const RHYME_ROUNDS = 3;

export const RHYME_LEVELS: RhymeLevelConfig[] = [
	{ level: 1, poolSize: 4, optionCount: 2, tight: false },
	{ level: 2, poolSize: 5, optionCount: 2, tight: false },
	{ level: 3, poolSize: 6, optionCount: 3, tight: false },
	{ level: 4, poolSize: 7, optionCount: 3, tight: false },
	{ level: 5, poolSize: 8, optionCount: 3, tight: false },
	{ level: 6, poolSize: 9, optionCount: 3, tight: true },
	{ level: 7, poolSize: 10, optionCount: 3, tight: true },
	{ level: 8, poolSize: 11, optionCount: 3, tight: true },
	{ level: 9, poolSize: 12, optionCount: 3, tight: true },
	{ level: 10, poolSize: 12, optionCount: 3, tight: true }
];

/** Kid-friendly rhyme pairs for each language. */
export const RHYME_BANK: Record<RhymeLocale, RhymePair[]> = {
	en: [
		{ a: { word: 'cat', picture: '🐱' }, b: { word: 'hat', picture: '🎩' } },
		{ a: { word: 'dog', picture: '🐶' }, b: { word: 'frog', picture: '🐸' } },
		{ a: { word: 'sun', picture: '☀️' }, b: { word: 'run', picture: '🏃' } },
		{ a: { word: 'bee', picture: '🐝' }, b: { word: 'tree', picture: '🌳' } },
		{ a: { word: 'star', picture: '⭐' }, b: { word: 'car', picture: '🚗' } },
		{ a: { word: 'boat', picture: '⛵' }, b: { word: 'goat', picture: '🐐' } },
		{ a: { word: 'mouse', picture: '🐭' }, b: { word: 'house', picture: '🏠' } },
		{ a: { word: 'fish', picture: '🐟' }, b: { word: 'dish', picture: '🍽️' } },
		{ a: { word: 'cake', picture: '🎂' }, b: { word: 'lake', picture: '🌊' } },
		{ a: { word: 'ball', picture: '⚽' }, b: { word: 'wall', picture: '🧱' } },
		{ a: { word: 'king', picture: '👑' }, b: { word: 'ring', picture: '💍' } },
		{ a: { word: 'book', picture: '📖' }, b: { word: 'hook', picture: '🪝' } }
	],
	it: [
		{ a: { word: 'gatto', picture: '🐱' }, b: { word: 'matto', picture: '🤪' } },
		{ a: { word: 'cane', picture: '🐶' }, b: { word: 'pane', picture: '🍞' } },
		{ a: { word: 'fiore', picture: '🌸' }, b: { word: 'cuore', picture: '❤️' } },
		{ a: { word: 'mela', picture: '🍎' }, b: { word: 'tela', picture: '🖼️' } },
		{ a: { word: 'pera', picture: '🍐' }, b: { word: 'sera', picture: '🌆' } },
		{ a: { word: 'letto', picture: '🛏️' }, b: { word: 'tetto', picture: '🏠' } },
		{ a: { word: 'nave', picture: '⛵' }, b: { word: 'chiave', picture: '🔑' } },
		{ a: { word: 'palla', picture: '⚽' }, b: { word: 'stalla', picture: '🐴' } },
		{ a: { word: 'fuoco', picture: '🔥' }, b: { word: 'cuoco', picture: '👨‍🍳' } },
		{ a: { word: 'treno', picture: '🚂' }, b: { word: 'freno', picture: '🛑' } },
		{ a: { word: 'notte', picture: '🌙' }, b: { word: 'botte', picture: '🛢️' } },
		{ a: { word: 'muro', picture: '🧱' }, b: { word: 'duro', picture: '🪨' } }
	],
	ro: [
		{ a: { word: 'casă', picture: '🏠' }, b: { word: 'masă', picture: '🪵' } },
		{ a: { word: 'soare', picture: '☀️' }, b: { word: 'floare', picture: '🌸' } },
		{ a: { word: 'câine', picture: '🐶' }, b: { word: 'pâine', picture: '🍞' } },
		{ a: { word: 'măr', picture: '🍎' }, b: { word: 'păr', picture: '🍐' } },
		{ a: { word: 'cal', picture: '🐴' }, b: { word: 'mal', picture: '🏖️' } },
		{ a: { word: 'carte', picture: '📖' }, b: { word: 'parte', picture: '🧩' } },
		{ a: { word: 'lună', picture: '🌙' }, b: { word: 'bună', picture: '👋' } },
		{ a: { word: 'munte', picture: '⛰️' }, b: { word: 'punte', picture: '🌉' } },
		{ a: { word: 'nor', picture: '☁️' }, b: { word: 'dor', picture: '💙' } },
		{ a: { word: 'urs', picture: '🐻' }, b: { word: 'curs', picture: '🏫' } },
		{ a: { word: 'tren', picture: '🚂' }, b: { word: 'fren', picture: '🛑' } },
		{ a: { word: 'apă', picture: '💧' }, b: { word: 'sapă', picture: '⛏️' } }
	],
	de: [
		{ a: { word: 'Haus', picture: '🏠' }, b: { word: 'Maus', picture: '🐭' } },
		{ a: { word: 'Ball', picture: '⚽' }, b: { word: 'Fall', picture: '🍂' } },
		{ a: { word: 'Hund', picture: '🐶' }, b: { word: 'Mund', picture: '👄' } },
		{ a: { word: 'Fisch', picture: '🐟' }, b: { word: 'Tisch', picture: '🪵' } },
		{ a: { word: 'Buch', picture: '📖' }, b: { word: 'Tuch', picture: '🧣' } },
		{ a: { word: 'Baum', picture: '🌳' }, b: { word: 'Traum', picture: '💭' } },
		{ a: { word: 'Brot', picture: '🍞' }, b: { word: 'Rot', picture: '🔴' } },
		{ a: { word: 'Kind', picture: '🧒' }, b: { word: 'Wind', picture: '💨' } },
		{ a: { word: 'Hand', picture: '✋' }, b: { word: 'Sand', picture: '🏖️' } },
		{ a: { word: 'Schuh', picture: '👟' }, b: { word: 'Kuh', picture: '🐄' } },
		{ a: { word: 'Zug', picture: '🚂' }, b: { word: 'Flug', picture: '✈️' } },
		{ a: { word: 'Stern', picture: '⭐' }, b: { word: 'Fern', picture: '🔭' } }
	]
};

export function getRhymeLevel(level: number): RhymeLevelConfig | undefined {
	return RHYME_LEVELS.find((entry) => entry.level === level);
}

export function bankFor(locale: RhymeLocale): RhymePair[] {
	return RHYME_BANK[locale] ?? RHYME_BANK.en;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function sameStart(a: string, b: string): boolean {
	return a.charAt(0).toLocaleLowerCase() === b.charAt(0).toLocaleLowerCase();
}

function optionsFor(
	answer: RhymeWord,
	prompt: RhymeWord,
	pool: RhymeWord[],
	count: number,
	tight: boolean,
	rand: () => number
): RhymeWord[] {
	const others = pool.filter((word) => word.word !== answer.word && word.word !== prompt.word);
	const near = others.filter((word) => sameStart(word.word, answer.word));
	const far = others.filter((word) => !sameStart(word.word, answer.word));
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : others, rand), ...near];
	const picked: RhymeWord[] = [];
	for (const word of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.some((entry) => entry.word === word.word)) picked.push(word);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three rhyme prompts from the locale bank. */
export function pickRounds(
	locale: RhymeLocale,
	config: RhymeLevelConfig,
	rand: () => number = Math.random
): RhymeRound[] {
	const pairs = bankFor(locale).slice(0, config.poolSize);
	const chosen = shuffled(pairs, rand).slice(0, RHYME_ROUNDS);
	const pool = pairs.flatMap((pair) => [pair.a, pair.b]);
	return chosen.map((pair) => {
		const promptFirst = rand() < 0.5;
		const prompt = promptFirst ? pair.a : pair.b;
		const answer = promptFirst ? pair.b : pair.a;
		return {
			prompt,
			answer,
			options: optionsFor(answer, prompt, pool, config.optionCount, config.tight, rand)
		};
	});
}
