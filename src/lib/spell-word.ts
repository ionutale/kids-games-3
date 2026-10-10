/**
 * Pure rules for "Spell short word".
 * See a picture. Drag/tap letters into boxes to spell the word.
 * Banks are locale-specific.
 */

export type SpellLocale = 'it' | 'ro' | 'en' | 'de';

export interface SpellEntry {
	word: string;
	picture: string;
}

export interface SpellRound {
	word: string;
	picture: string;
	letters: string[];
	tray: string[];
}

export interface SpellLevelConfig {
	level: number;
	poolSize: number;
	/** Extra decoy letters in the tray. */
	decoys: number;
}

export const MAX_SPELL_LEVEL = 10;
export const SPELL_ROUNDS = 3;

export const SPELL_LEVELS: SpellLevelConfig[] = [
	{ level: 1, poolSize: 4, decoys: 0 },
	{ level: 2, poolSize: 5, decoys: 0 },
	{ level: 3, poolSize: 6, decoys: 1 },
	{ level: 4, poolSize: 7, decoys: 1 },
	{ level: 5, poolSize: 8, decoys: 1 },
	{ level: 6, poolSize: 9, decoys: 2 },
	{ level: 7, poolSize: 10, decoys: 2 },
	{ level: 8, poolSize: 11, decoys: 2 },
	{ level: 9, poolSize: 12, decoys: 3 },
	{ level: 10, poolSize: 12, decoys: 3 }
];

export const SPELL_BANK: Record<SpellLocale, SpellEntry[]> = {
	en: [
		{ word: 'cat', picture: '🐱' },
		{ word: 'dog', picture: '🐶' },
		{ word: 'sun', picture: '☀️' },
		{ word: 'hat', picture: '🎩' },
		{ word: 'bed', picture: '🛏️' },
		{ word: 'pig', picture: '🐷' },
		{ word: 'cup', picture: '🧁' },
		{ word: 'bus', picture: '🚌' },
		{ word: 'fish', picture: '🐟' },
		{ word: 'ball', picture: '⚽' },
		{ word: 'tree', picture: '🌳' },
		{ word: 'star', picture: '⭐' }
	],
	it: [
		{ word: 'mela', picture: '🍎' },
		{ word: 'cane', picture: '🐶' },
		{ word: 'sole', picture: '☀️' },
		{ word: 'pane', picture: '🍞' },
		{ word: 'luna', picture: '🌙' },
		{ word: 'mare', picture: '🌊' },
		{ word: 'pera', picture: '🍐' },
		{ word: 'nave', picture: '⛵' },
		{ word: 'palla', picture: '⚽' },
		{ word: 'gatto', picture: '🐱' },
		{ word: 'fiore', picture: '🌸' },
		{ word: 'letto', picture: '🛏️' }
	],
	ro: [
		{ word: 'urs', picture: '🐻' },
		{ word: 'cal', picture: '🐴' },
		{ word: 'nor', picture: '☁️' },
		{ word: 'măr', picture: '🍎' },
		{ word: 'casă', picture: '🏠' },
		{ word: 'lună', picture: '🌙' },
		{ word: 'tren', picture: '🚂' },
		{ word: 'masă', picture: '🪵' },
		{ word: 'apă', picture: '💧' },
		{ word: 'pâine', picture: '🍞' },
		{ word: 'floare', picture: '🌸' },
		{ word: 'câine', picture: '🐶' }
	],
	de: [
		{ word: 'Hut', picture: '🎩' },
		{ word: 'Bus', picture: '🚌' },
		{ word: 'Ball', picture: '⚽' },
		{ word: 'Hund', picture: '🐶' },
		{ word: 'Haus', picture: '🏠' },
		{ word: 'Maus', picture: '🐭' },
		{ word: 'Baum', picture: '🌳' },
		{ word: 'Buch', picture: '📖' },
		{ word: 'Brot', picture: '🍞' },
		{ word: 'Stern', picture: '⭐' },
		{ word: 'Fisch', picture: '🐟' },
		{ word: 'Sonne', picture: '☀️' }
	]
};

export function getSpellLevel(level: number): SpellLevelConfig | undefined {
	return SPELL_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three spelling boards for the locale. */
export function pickRounds(
	config: SpellLevelConfig,
	locale: SpellLocale,
	rand: () => number = Math.random
): SpellRound[] {
	const bank = SPELL_BANK[locale] ?? SPELL_BANK.en;
	const pool = bank.slice(0, Math.min(config.poolSize, bank.length));
	const picks = shuffled(pool, rand);
	const alphabet = [...new Set(pool.flatMap((entry) => [...entry.word]))];
	const rounds: SpellRound[] = [];
	for (let i = 0; i < SPELL_ROUNDS; i++) {
		const entry = picks[i % picks.length];
		const letters = [...entry.word];
		let tray = [...letters];
		const extras = alphabet.filter((ch) => !letters.includes(ch));
		const decoyPool = shuffled(extras.length > 0 ? extras : alphabet, rand);
		for (let d = 0; d < config.decoys && d < decoyPool.length; d++) {
			tray.push(decoyPool[d]);
		}
		tray = shuffled(tray, rand);
		if (tray.length > 1 && tray.every((ch, idx) => ch === letters[idx])) {
			tray = shuffled(tray, () => 0.9);
		}
		rounds.push({ word: entry.word, picture: entry.picture, letters, tray });
	}
	return rounds;
}
