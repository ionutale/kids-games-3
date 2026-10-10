/**
 * Pure rules for "Blend sounds".
 * See onset + rime (c + at). Tap the matching picture word.
 * Banks are locale-specific.
 */

export type BlendLocale = 'it' | 'ro' | 'en' | 'de';

export interface BlendEntry {
	onset: string;
	rime: string;
	word: string;
	picture: string;
}

export interface BlendRound {
	onset: string;
	rime: string;
	answer: BlendEntry;
	options: BlendEntry[];
}

export interface BlendLevelConfig {
	level: number;
	poolSize: number;
	optionCount: number;
	tight: boolean;
}

export const MAX_BLEND_LEVEL = 10;
export const BLEND_ROUNDS = 3;

export const BLEND_LEVELS: BlendLevelConfig[] = [
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

/** Onset + rime blends that form a kid word. */
export const BLEND_BANK: Record<BlendLocale, BlendEntry[]> = {
	en: [
		{ onset: 'c', rime: 'at', word: 'cat', picture: '🐱' },
		{ onset: 'h', rime: 'at', word: 'hat', picture: '🎩' },
		{ onset: 'b', rime: 'at', word: 'bat', picture: '🦇' },
		{ onset: 's', rime: 'un', word: 'sun', picture: '☀️' },
		{ onset: 'b', rime: 'ug', word: 'bug', picture: '🐛' },
		{ onset: 'p', rime: 'ig', word: 'pig', picture: '🐷' },
		{ onset: 'd', rime: 'og', word: 'dog', picture: '🐶' },
		{ onset: 'c', rime: 'up', word: 'cup', picture: '🧁' },
		{ onset: 'b', rime: 'ed', word: 'bed', picture: '🛏️' },
		{ onset: 'r', rime: 'ed', word: 'red', picture: '🔴' },
		{ onset: 'f', rime: 'ish', word: 'fish', picture: '🐟' },
		{ onset: 'b', rime: 'ell', word: 'bell', picture: '🔔' }
	],
	it: [
		{ onset: 'g', rime: 'atto', word: 'gatto', picture: '🐱' },
		{ onset: 'p', rime: 'ane', word: 'pane', picture: '🍞' },
		{ onset: 'c', rime: 'ane', word: 'cane', picture: '🐶' },
		{ onset: 'm', rime: 'ela', word: 'mela', picture: '🍎' },
		{ onset: 'p', rime: 'era', word: 'pera', picture: '🍐' },
		{ onset: 'l', rime: 'etto', word: 'letto', picture: '🛏️' },
		{ onset: 't', rime: 'etto', word: 'tetto', picture: '🏠' },
		{ onset: 'n', rime: 'ave', word: 'nave', picture: '⛵' },
		{ onset: 'p', rime: 'alla', word: 'palla', picture: '⚽' },
		{ onset: 'f', rime: 'iore', word: 'fiore', picture: '🌸' },
		{ onset: 'l', rime: 'una', word: 'luna', picture: '🌙' },
		{ onset: 'm', rime: 'are', word: 'mare', picture: '🌊' }
	],
	ro: [
		{ onset: 'c', rime: 'asă', word: 'casă', picture: '🏠' },
		{ onset: 'm', rime: 'asă', word: 'masă', picture: '🪵' },
		{ onset: 'c', rime: 'âine', word: 'câine', picture: '🐶' },
		{ onset: 'p', rime: 'âine', word: 'pâine', picture: '🍞' },
		{ onset: 'm', rime: 'ăr', word: 'măr', picture: '🍎' },
		{ onset: 'c', rime: 'al', word: 'cal', picture: '🐴' },
		{ onset: 'u', rime: 'rs', word: 'urs', picture: '🐻' },
		{ onset: 'l', rime: 'ună', word: 'lună', picture: '🌙' },
		{ onset: 'n', rime: 'or', word: 'nor', picture: '☁️' },
		{ onset: 't', rime: 'ren', word: 'tren', picture: '🚂' },
		{ onset: 'f', rime: 'loare', word: 'floare', picture: '🌸' },
		{ onset: 'a', rime: 'pă', word: 'apă', picture: '💧' }
	],
	de: [
		{ onset: 'H', rime: 'aus', word: 'Haus', picture: '🏠' },
		{ onset: 'M', rime: 'aus', word: 'Maus', picture: '🐭' },
		{ onset: 'B', rime: 'all', word: 'Ball', picture: '⚽' },
		{ onset: 'H', rime: 'und', word: 'Hund', picture: '🐶' },
		{ onset: 'F', rime: 'isch', word: 'Fisch', picture: '🐟' },
		{ onset: 'B', rime: 'uch', word: 'Buch', picture: '📖' },
		{ onset: 'B', rime: 'aum', word: 'Baum', picture: '🌳' },
		{ onset: 'B', rime: 'rot', word: 'Brot', picture: '🍞' },
		{ onset: 'S', rime: 'tern', word: 'Stern', picture: '⭐' },
		{ onset: 'T', rime: 'ür', word: 'Tür', picture: '🚪' },
		{ onset: 'K', rime: 'atz', word: 'Katze', picture: '🐱' },
		{ onset: 'S', rime: 'onne', word: 'Sonne', picture: '☀️' }
	]
};

export function getBlendLevel(level: number): BlendLevelConfig | undefined {
	return BLEND_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function optionsFor(
	answer: BlendEntry,
	pool: BlendEntry[],
	count: number,
	tight: boolean,
	rand: () => number
): BlendEntry[] {
	const others = pool.filter((entry) => entry.word !== answer.word);
	const sameRime = others.filter((entry) => entry.rime === answer.rime);
	const sameOnset = others.filter((entry) => entry.onset === answer.onset);
	const far = others.filter(
		(entry) => entry.rime !== answer.rime && entry.onset !== answer.onset
	);
	const ordered = tight
		? [...sameRime, ...sameOnset, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : others, rand), ...sameRime, ...sameOnset];
	const picked: BlendEntry[] = [];
	for (const entry of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.some((item) => item.word === entry.word)) picked.push(entry);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three blend rounds for the locale. */
export function pickRounds(
	config: BlendLevelConfig,
	locale: BlendLocale,
	rand: () => number = Math.random
): BlendRound[] {
	const bank = BLEND_BANK[locale] ?? BLEND_BANK.en;
	const pool = bank.slice(0, Math.min(config.poolSize, bank.length));
	const prompts = shuffled(pool, rand);
	const rounds: BlendRound[] = [];
	for (let i = 0; i < BLEND_ROUNDS; i++) {
		const answer = prompts[i % prompts.length];
		rounds.push({
			onset: answer.onset,
			rime: answer.rime,
			answer,
			options: optionsFor(answer, pool, config.optionCount, config.tight, rand)
		});
	}
	return rounds;
}
