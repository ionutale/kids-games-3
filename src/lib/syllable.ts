/**
 * Pure rules for "Syllable clap". A word (with a picture) is shown.
 * The child taps how many spoken parts the word has.
 */

export type SylLocale = 'it' | 'ro' | 'en' | 'de';

export interface SylWord {
	word: string;
	picture: string;
	parts: number;
}

export interface SylRound {
	prompt: SylWord;
	answer: number;
	options: number[];
}

export interface SylLevelConfig {
	level: number;
	minParts: number;
	maxParts: number;
}

export const MAX_SYL_LEVEL = 10;
export const SYL_ROUNDS = 3;

export const SYL_LEVELS: SylLevelConfig[] = [
	{ level: 1, minParts: 1, maxParts: 2 },
	{ level: 2, minParts: 1, maxParts: 2 },
	{ level: 3, minParts: 1, maxParts: 2 },
	{ level: 4, minParts: 1, maxParts: 3 },
	{ level: 5, minParts: 1, maxParts: 3 },
	{ level: 6, minParts: 2, maxParts: 3 },
	{ level: 7, minParts: 1, maxParts: 3 },
	{ level: 8, minParts: 1, maxParts: 4 },
	{ level: 9, minParts: 2, maxParts: 4 },
	{ level: 10, minParts: 1, maxParts: 4 }
];

/** Kid-friendly words with syllable counts for each language. */
export const SYL_BANK: Record<SylLocale, SylWord[]> = {
	en: [
		{ word: 'cat', picture: '🐱', parts: 1 },
		{ word: 'dog', picture: '🐶', parts: 1 },
		{ word: 'sun', picture: '☀️', parts: 1 },
		{ word: 'bee', picture: '🐝', parts: 1 },
		{ word: 'ball', picture: '⚽', parts: 1 },
		{ word: 'fish', picture: '🐟', parts: 1 },
		{ word: 'book', picture: '📖', parts: 1 },
		{ word: 'star', picture: '⭐', parts: 1 },
		{ word: 'apple', picture: '🍎', parts: 2 },
		{ word: 'tiger', picture: '🐯', parts: 2 },
		{ word: 'happy', picture: '😊', parts: 2 },
		{ word: 'water', picture: '💧', parts: 2 },
		{ word: 'pizza', picture: '🍕', parts: 2 },
		{ word: 'rabbit', picture: '🐰', parts: 2 },
		{ word: 'banana', picture: '🍌', parts: 3 },
		{ word: 'elephant', picture: '🐘', parts: 3 },
		{ word: 'butterfly', picture: '🦋', parts: 3 },
		{ word: 'dinosaur', picture: '🦕', parts: 3 },
		{ word: 'helicopter', picture: '🚁', parts: 4 },
		{ word: 'alligator', picture: '🐊', parts: 4 },
		{ word: 'watermelon', picture: '🍉', parts: 4 },
		{ word: 'television', picture: '📺', parts: 4 }
	],
	it: [
		{ word: 'blu', picture: '🔵', parts: 1 },
		{ word: 're', picture: '👑', parts: 1 },
		{ word: 'tè', picture: '🍵', parts: 1 },
		{ word: 'sci', picture: '⛷️', parts: 1 },
		{ word: 'cane', picture: '🐶', parts: 2 },
		{ word: 'sole', picture: '☀️', parts: 2 },
		{ word: 'gatto', picture: '🐱', parts: 2 },
		{ word: 'casa', picture: '🏠', parts: 2 },
		{ word: 'pane', picture: '🍞', parts: 2 },
		{ word: 'mela', picture: '🍎', parts: 2 },
		{ word: 'fiore', picture: '🌸', parts: 2 },
		{ word: 'cuore', picture: '❤️', parts: 2 },
		{ word: 'banana', picture: '🍌', parts: 3 },
		{ word: 'limone', picture: '🍋', parts: 3 },
		{ word: 'farfalla', picture: '🦋', parts: 3 },
		{ word: 'macchina', picture: '🚗', parts: 3 },
		{ word: 'elefante', picture: '🐘', parts: 4 },
		{ word: 'anguria', picture: '🍉', parts: 4 },
		{ word: 'telefono', picture: '☎️', parts: 4 },
		{ word: 'bicicletta', picture: '🚲', parts: 4 }
	],
	ro: [
		{ word: 'cal', picture: '🐴', parts: 1 },
		{ word: 'măr', picture: '🍎', parts: 1 },
		{ word: 'nor', picture: '☁️', parts: 1 },
		{ word: 'urs', picture: '🐻', parts: 1 },
		{ word: 'tren', picture: '🚂', parts: 1 },
		{ word: 'casă', picture: '🏠', parts: 2 },
		{ word: 'pâine', picture: '🍞', parts: 2 },
		{ word: 'soare', picture: '☀️', parts: 2 },
		{ word: 'floare', picture: '🌸', parts: 2 },
		{ word: 'carte', picture: '📖', parts: 2 },
		{ word: 'mână', picture: '✋', parts: 2 },
		{ word: 'pisică', picture: '🐱', parts: 3 },
		{ word: 'banană', picture: '🍌', parts: 3 },
		{ word: 'elefant', picture: '🐘', parts: 3 },
		{ word: 'fluture', picture: '🦋', parts: 3 },
		{ word: 'mașină', picture: '🚗', parts: 3 },
		{ word: 'telefon', picture: '☎️', parts: 3 },
		{ word: 'elicopter', picture: '🚁', parts: 4 },
		{ word: 'televizor', picture: '📺', parts: 4 },
		{ word: 'aligator', picture: '🐊', parts: 4 }
	],
	de: [
		{ word: 'Hut', picture: '🎩', parts: 1 },
		{ word: 'Ball', picture: '⚽', parts: 1 },
		{ word: 'Hund', picture: '🐶', parts: 1 },
		{ word: 'Fisch', picture: '🐟', parts: 1 },
		{ word: 'Buch', picture: '📖', parts: 1 },
		{ word: 'Stern', picture: '⭐', parts: 1 },
		{ word: 'Brot', picture: '🍞', parts: 1 },
		{ word: 'Kind', picture: '🧒', parts: 1 },
		{ word: 'Apfel', picture: '🍎', parts: 2 },
		{ word: 'Sonne', picture: '☀️', parts: 2 },
		{ word: 'Katze', picture: '🐱', parts: 2 },
		{ word: 'Wasser', picture: '💧', parts: 2 },
		{ word: 'Tiger', picture: '🐯', parts: 2 },
		{ word: 'Blume', picture: '🌸', parts: 2 },
		{ word: 'Banane', picture: '🍌', parts: 3 },
		{ word: 'Elefant', picture: '🐘', parts: 3 },
		{ word: 'Schmetterling', picture: '🦋', parts: 3 },
		{ word: 'Erdbeere', picture: '🍓', parts: 3 },
		{ word: 'Helikopter', picture: '🚁', parts: 4 },
		{ word: 'Telefon', picture: '☎️', parts: 3 },
		{ word: 'Krokodil', picture: '🐊', parts: 3 },
		{ word: 'Schokolade', picture: '🍫', parts: 4 }
	]
};

export function getSylLevel(level: number): SylLevelConfig | undefined {
	return SYL_LEVELS.find((entry) => entry.level === level);
}

export function bankFor(locale: SylLocale): SylWord[] {
	return SYL_BANK[locale] ?? SYL_BANK.en;
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function optionsFor(config: SylLevelConfig): number[] {
	const options: number[] = [];
	for (let value = config.minParts; value <= config.maxParts; value++) options.push(value);
	return options;
}

function poolFor(locale: SylLocale, config: SylLevelConfig): SylWord[] {
	return bankFor(locale).filter(
		(word) => word.parts >= config.minParts && word.parts <= config.maxParts
	);
}

/** Three words. The answer is how many parts each word has. */
export function pickRounds(
	locale: SylLocale,
	config: SylLevelConfig,
	rand: () => number = Math.random
): SylRound[] {
	const pool = shuffled(poolFor(locale, config), rand);
	const options = optionsFor(config);
	return pool.slice(0, SYL_ROUNDS).map((prompt) => ({
		prompt,
		answer: prompt.parts,
		options
	}));
}
