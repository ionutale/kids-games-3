/**
 * Pure rules for "Syllable clap". A word (with a picture) is shown,
 * split into spoken parts. The child taps how many parts the word has.
 */

export type SylLocale = 'it' | 'ro' | 'en' | 'de';

export interface SylWord {
	word: string;
	picture: string;
	/** Spoken parts, in order. Length must match `parts`. */
	chunks: string[];
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

/** Kid-friendly words with syllable splits for each language. */
export const SYL_BANK: Record<SylLocale, SylWord[]> = {
	en: [
		{ word: 'cat', picture: '🐱', chunks: ['cat'], parts: 1 },
		{ word: 'dog', picture: '🐶', chunks: ['dog'], parts: 1 },
		{ word: 'sun', picture: '☀️', chunks: ['sun'], parts: 1 },
		{ word: 'bee', picture: '🐝', chunks: ['bee'], parts: 1 },
		{ word: 'ball', picture: '⚽', chunks: ['ball'], parts: 1 },
		{ word: 'fish', picture: '🐟', chunks: ['fish'], parts: 1 },
		{ word: 'book', picture: '📖', chunks: ['book'], parts: 1 },
		{ word: 'star', picture: '⭐', chunks: ['star'], parts: 1 },
		{ word: 'apple', picture: '🍎', chunks: ['ap', 'ple'], parts: 2 },
		{ word: 'tiger', picture: '🐯', chunks: ['ti', 'ger'], parts: 2 },
		{ word: 'happy', picture: '😊', chunks: ['hap', 'py'], parts: 2 },
		{ word: 'water', picture: '💧', chunks: ['wa', 'ter'], parts: 2 },
		{ word: 'pizza', picture: '🍕', chunks: ['piz', 'za'], parts: 2 },
		{ word: 'rabbit', picture: '🐰', chunks: ['rab', 'bit'], parts: 2 },
		{ word: 'banana', picture: '🍌', chunks: ['ba', 'na', 'na'], parts: 3 },
		{ word: 'elephant', picture: '🐘', chunks: ['el', 'e', 'phant'], parts: 3 },
		{ word: 'butterfly', picture: '🦋', chunks: ['but', 'ter', 'fly'], parts: 3 },
		{ word: 'dinosaur', picture: '🦕', chunks: ['di', 'no', 'saur'], parts: 3 },
		{ word: 'helicopter', picture: '🚁', chunks: ['hel', 'i', 'cop', 'ter'], parts: 4 },
		{ word: 'alligator', picture: '🐊', chunks: ['al', 'li', 'ga', 'tor'], parts: 4 },
		{ word: 'watermelon', picture: '🍉', chunks: ['wa', 'ter', 'mel', 'on'], parts: 4 },
		{ word: 'television', picture: '📺', chunks: ['tel', 'e', 'vi', 'sion'], parts: 4 }
	],
	it: [
		{ word: 'blu', picture: '🔵', chunks: ['blu'], parts: 1 },
		{ word: 're', picture: '👑', chunks: ['re'], parts: 1 },
		{ word: 'tè', picture: '🍵', chunks: ['tè'], parts: 1 },
		{ word: 'sci', picture: '⛷️', chunks: ['sci'], parts: 1 },
		{ word: 'cane', picture: '🐶', chunks: ['ca', 'ne'], parts: 2 },
		{ word: 'sole', picture: '☀️', chunks: ['so', 'le'], parts: 2 },
		{ word: 'gatto', picture: '🐱', chunks: ['gat', 'to'], parts: 2 },
		{ word: 'casa', picture: '🏠', chunks: ['ca', 'sa'], parts: 2 },
		{ word: 'pane', picture: '🍞', chunks: ['pa', 'ne'], parts: 2 },
		{ word: 'mela', picture: '🍎', chunks: ['me', 'la'], parts: 2 },
		{ word: 'fiore', picture: '🌸', chunks: ['fio', 're'], parts: 2 },
		{ word: 'cuore', picture: '❤️', chunks: ['cuo', 're'], parts: 2 },
		{ word: 'banana', picture: '🍌', chunks: ['ba', 'na', 'na'], parts: 3 },
		{ word: 'limone', picture: '🍋', chunks: ['li', 'mo', 'ne'], parts: 3 },
		{ word: 'farfalla', picture: '🦋', chunks: ['far', 'fal', 'la'], parts: 3 },
		{ word: 'macchina', picture: '🚗', chunks: ['mac', 'chi', 'na'], parts: 3 },
		{ word: 'elefante', picture: '🐘', chunks: ['e', 'le', 'fan', 'te'], parts: 4 },
		{ word: 'anguria', picture: '🍉', chunks: ['an', 'gu', 'ri', 'a'], parts: 4 },
		{ word: 'telefono', picture: '☎️', chunks: ['te', 'le', 'fo', 'no'], parts: 4 },
		{ word: 'bicicletta', picture: '🚲', chunks: ['bi', 'ci', 'clet', 'ta'], parts: 4 }
	],
	ro: [
		{ word: 'cal', picture: '🐴', chunks: ['cal'], parts: 1 },
		{ word: 'măr', picture: '🍎', chunks: ['măr'], parts: 1 },
		{ word: 'nor', picture: '☁️', chunks: ['nor'], parts: 1 },
		{ word: 'urs', picture: '🐻', chunks: ['urs'], parts: 1 },
		{ word: 'tren', picture: '🚂', chunks: ['tren'], parts: 1 },
		{ word: 'casă', picture: '🏠', chunks: ['ca', 'să'], parts: 2 },
		{ word: 'pâine', picture: '🍞', chunks: ['pâi', 'ne'], parts: 2 },
		{ word: 'soare', picture: '☀️', chunks: ['soa', 're'], parts: 2 },
		{ word: 'floare', picture: '🌸', chunks: ['floa', 're'], parts: 2 },
		{ word: 'carte', picture: '📖', chunks: ['car', 'te'], parts: 2 },
		{ word: 'mână', picture: '✋', chunks: ['mâ', 'nă'], parts: 2 },
		{ word: 'pisică', picture: '🐱', chunks: ['pi', 'si', 'că'], parts: 3 },
		{ word: 'banană', picture: '🍌', chunks: ['ba', 'na', 'nă'], parts: 3 },
		{ word: 'elefant', picture: '🐘', chunks: ['e', 'le', 'fant'], parts: 3 },
		{ word: 'fluture', picture: '🦋', chunks: ['flu', 'tu', 're'], parts: 3 },
		{ word: 'mașină', picture: '🚗', chunks: ['ma', 'și', 'nă'], parts: 3 },
		{ word: 'telefon', picture: '☎️', chunks: ['te', 'le', 'fon'], parts: 3 },
		{ word: 'elicopter', picture: '🚁', chunks: ['e', 'li', 'cop', 'ter'], parts: 4 },
		{ word: 'televizor', picture: '📺', chunks: ['te', 'le', 'vi', 'zor'], parts: 4 },
		{ word: 'aligator', picture: '🐊', chunks: ['a', 'li', 'ga', 'tor'], parts: 4 }
	],
	de: [
		{ word: 'Hut', picture: '🎩', chunks: ['Hut'], parts: 1 },
		{ word: 'Ball', picture: '⚽', chunks: ['Ball'], parts: 1 },
		{ word: 'Hund', picture: '🐶', chunks: ['Hund'], parts: 1 },
		{ word: 'Fisch', picture: '🐟', chunks: ['Fisch'], parts: 1 },
		{ word: 'Buch', picture: '📖', chunks: ['Buch'], parts: 1 },
		{ word: 'Stern', picture: '⭐', chunks: ['Stern'], parts: 1 },
		{ word: 'Brot', picture: '🍞', chunks: ['Brot'], parts: 1 },
		{ word: 'Kind', picture: '🧒', chunks: ['Kind'], parts: 1 },
		{ word: 'Apfel', picture: '🍎', chunks: ['Ap', 'fel'], parts: 2 },
		{ word: 'Sonne', picture: '☀️', chunks: ['Son', 'ne'], parts: 2 },
		{ word: 'Katze', picture: '🐱', chunks: ['Kat', 'ze'], parts: 2 },
		{ word: 'Wasser', picture: '💧', chunks: ['Was', 'ser'], parts: 2 },
		{ word: 'Tiger', picture: '🐯', chunks: ['Ti', 'ger'], parts: 2 },
		{ word: 'Blume', picture: '🌸', chunks: ['Blu', 'me'], parts: 2 },
		{ word: 'Banane', picture: '🍌', chunks: ['Ba', 'na', 'ne'], parts: 3 },
		{ word: 'Elefant', picture: '🐘', chunks: ['E', 'le', 'fant'], parts: 3 },
		{ word: 'Schmetterling', picture: '🦋', chunks: ['Schmet', 'ter', 'ling'], parts: 3 },
		{ word: 'Erdbeere', picture: '🍓', chunks: ['Erd', 'bee', 're'], parts: 3 },
		{ word: 'Helikopter', picture: '🚁', chunks: ['He', 'li', 'kop', 'ter'], parts: 4 },
		{ word: 'Telefon', picture: '☎️', chunks: ['Te', 'le', 'fon'], parts: 3 },
		{ word: 'Krokodil', picture: '🐊', chunks: ['Kro', 'ko', 'dil'], parts: 3 },
		{ word: 'Schokolade', picture: '🍫', chunks: ['Scho', 'ko', 'la', 'de'], parts: 4 }
	]
};

export function getSylLevel(level: number): SylLevelConfig | undefined {
	return SYL_LEVELS.find((entry) => entry.level === level);
}

export function bankFor(locale: SylLocale): SylWord[] {
	return SYL_BANK[locale] ?? SYL_BANK.en;
}

/** Join chunks with a kid-friendly separator, e.g. ba·na·na */
export function joinChunks(chunks: string[], sep = '·'): string {
	return chunks.join(sep);
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
