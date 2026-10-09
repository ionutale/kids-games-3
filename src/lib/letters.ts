/**
 * Pure rules for "First letters". A fruit picture is shown and the child
 * taps its first letter. Early levels use capitals, later ones lowercase,
 * then mixed, with look-alike distractors at the end.
 */

import type { FruitId } from './count-fruit.js';

export type { FruitId };

export type WordLocale = 'it' | 'ro' | 'en' | 'de';
export type Casing = 'upper' | 'lower' | 'mixed';

export interface LetterLevelConfig {
	level: number;
	fruits: FruitId[];
	casing: Casing;
	tight: boolean;
}

export const MAX_LETTER_LEVEL = 10;
export const LETTER_ROUNDS_PER_LEVEL = 3;

const APPLE: FruitId[] = ['apple', 'pear', 'orange'];
const FOUR: FruitId[] = [...APPLE, 'banana'];
const SIX: FruitId[] = [...FOUR, 'grapes', 'lemon'];
const EIGHT: FruitId[] = [...SIX, 'strawberry', 'cherry'];
const ALL: FruitId[] = [...EIGHT, 'peach', 'watermelon'];

export const LETTER_LEVELS: LetterLevelConfig[] = [
	{ level: 1, fruits: APPLE, casing: 'upper', tight: false },
	{ level: 2, fruits: FOUR, casing: 'upper', tight: false },
	{ level: 3, fruits: SIX, casing: 'upper', tight: false },
	{ level: 4, fruits: SIX, casing: 'lower', tight: false },
	{ level: 5, fruits: EIGHT, casing: 'lower', tight: false },
	{ level: 6, fruits: ALL, casing: 'lower', tight: false },
	{ level: 7, fruits: ALL, casing: 'upper', tight: true },
	{ level: 8, fruits: ALL, casing: 'lower', tight: true },
	{ level: 9, fruits: ALL, casing: 'mixed', tight: false },
	{ level: 10, fruits: ALL, casing: 'mixed', tight: true }
];

/** Display nouns for the prompt, with article where the language needs it. */
export const WORDS: Record<WordLocale, Record<FruitId, string>> = {
	it: {
		apple: 'La mela',
		pear: 'La pera',
		orange: "L'arancia",
		banana: 'La banana',
		grapes: "L'uva",
		strawberry: 'La fragola',
		lemon: 'Il limone',
		cherry: 'La ciliegia',
		peach: 'La pesca',
		watermelon: "L'anguria"
	},
	ro: {
		apple: 'Mărul',
		pear: 'Para',
		orange: 'Portocala',
		banana: 'Banana',
		grapes: 'Strugurii',
		strawberry: 'Căpșunile',
		lemon: 'Lămâia',
		cherry: 'Cireașa',
		peach: 'Piersica',
		watermelon: 'Pepenele'
	},
	en: {
		apple: 'Apple',
		pear: 'Pear',
		orange: 'Orange',
		banana: 'Banana',
		grapes: 'Grapes',
		strawberry: 'Strawberry',
		lemon: 'Lemon',
		cherry: 'Cherry',
		peach: 'Peach',
		watermelon: 'Watermelon'
	},
	de: {
		apple: 'Apfel',
		pear: 'Birne',
		orange: 'Orange',
		banana: 'Banane',
		grapes: 'Trauben',
		strawberry: 'Erdbeere',
		lemon: 'Zitrone',
		cherry: 'Kirsche',
		peach: 'Pfirsich',
		watermelon: 'Wassermelone'
	}
};

/** First letter of the bare noun, always plain A-Z. */
export const INITIALS: Record<WordLocale, Record<FruitId, string>> = {
	it: {
		apple: 'M',
		pear: 'P',
		orange: 'A',
		banana: 'B',
		grapes: 'U',
		strawberry: 'F',
		lemon: 'L',
		cherry: 'C',
		peach: 'P',
		watermelon: 'A'
	},
	ro: {
		apple: 'M',
		pear: 'P',
		orange: 'P',
		banana: 'B',
		grapes: 'S',
		strawberry: 'C',
		lemon: 'L',
		cherry: 'C',
		peach: 'P',
		watermelon: 'P'
	},
	en: {
		apple: 'A',
		pear: 'P',
		orange: 'O',
		banana: 'B',
		grapes: 'G',
		strawberry: 'S',
		lemon: 'L',
		cherry: 'C',
		peach: 'P',
		watermelon: 'W'
	},
	de: {
		apple: 'A',
		pear: 'B',
		orange: 'O',
		banana: 'B',
		grapes: 'T',
		strawberry: 'E',
		lemon: 'Z',
		cherry: 'K',
		peach: 'P',
		watermelon: 'W'
	}
};

/** Look-alike capitals sharing one alphabet in all four languages. */
export const SIMILAR_LETTERS: Record<string, string[]> = {
	A: ['H'],
	B: ['D', 'P'],
	C: ['G'],
	D: ['B', 'P'],
	E: ['F'],
	F: ['E'],
	G: ['C'],
	H: ['A'],
	I: ['J', 'L', 'T'],
	J: ['I'],
	K: ['R'],
	L: ['I', 'T'],
	M: ['N'],
	N: ['M'],
	O: ['Q'],
	P: ['B', 'D', 'R'],
	Q: ['O'],
	R: ['K', 'P'],
	S: ['Z'],
	T: ['L'],
	U: ['V'],
	V: ['U'],
	W: ['V', 'U'],
	Z: ['S']
};

export interface LetterOption {
	/** Capital for comparison. */
	key: string;
	/** As shown on the button. */
	show: string;
}

export function getLetterLevel(level: number): LetterLevelConfig | undefined {
	return LETTER_LEVELS.find((entry) => entry.level === level);
}

/** Distinct initials available in a level, for loose distractors. */
export function levelLetters(locale: WordLocale, config: LetterLevelConfig): string[] {
	return [...new Set(config.fruits.map((fruit) => INITIALS[locale][fruit]))];
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three different fruits for one level, in play order. */
export function pickLetterTargets(
	config: LetterLevelConfig,
	rand: () => number = Math.random
): FruitId[] {
	return shuffled(config.fruits, rand).slice(0, LETTER_ROUNDS_PER_LEVEL);
}

function applyCase(letter: string, casing: Casing, rand: () => number): string {
	if (casing === 'lower') return letter.toLowerCase();
	if (casing === 'mixed') return rand() < 0.5 ? letter : letter.toLowerCase();
	return letter;
}

/** Three letter buttons: the right initial plus two distractors. */
export function makeLetterOptions(
	locale: WordLocale,
	config: LetterLevelConfig,
	target: FruitId,
	rand: () => number = Math.random
): LetterOption[] {
	const correct = INITIALS[locale][target];
	const pool = levelLetters(locale, config).filter((letter) => letter !== correct);
	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).filter(
		(letter) => letter !== correct && !pool.includes(letter)
	);
	const fill = (wanted: string[]): string[] => {
		const picked = [...wanted];
		if (picked.length < 2) {
			picked.push(...shuffled(alphabet, rand).slice(0, 2 - picked.length));
		}
		return picked.slice(0, 2);
	};
	let distractors: string[];
	if (config.tight) {
		const close = (SIMILAR_LETTERS[correct] ?? []).filter((letter) => letter !== correct);
		distractors = fill([...shuffled(close, rand), ...shuffled(pool, rand)]);
	} else {
		distractors = fill(shuffled(pool, rand));
	}
	return shuffled(
		[correct, ...distractors].map((key) => ({ key, show: applyCase(key, config.casing, rand) })),
		rand
	);
}
