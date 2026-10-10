/**
 * Pure rules for "Capital / lowercase".
 * See a letter. Tap its matching pair (Aa, Bb).
 */

export type CaseAsk = 'toLower' | 'toUpper';

export interface CaseRound {
	ask: CaseAsk;
	shown: string;
	answer: string;
	options: string[];
}

export interface CaseLevelConfig {
	level: number;
	/** Inclusive letter indexes (0 = A). */
	min: number;
	max: number;
	ask: CaseAsk | 'mixed';
	optionCount: number;
	tight: boolean;
}

export const MAX_CASE_LEVEL = 10;
export const CASE_ROUNDS = 3;

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const CASE_LEVELS: CaseLevelConfig[] = [
	{ level: 1, min: 0, max: 3, ask: 'toLower', optionCount: 2, tight: false },
	{ level: 2, min: 0, max: 5, ask: 'toLower', optionCount: 2, tight: false },
	{ level: 3, min: 0, max: 7, ask: 'toLower', optionCount: 3, tight: false },
	{ level: 4, min: 0, max: 9, ask: 'toUpper', optionCount: 3, tight: false },
	{ level: 5, min: 0, max: 12, ask: 'toUpper', optionCount: 3, tight: false },
	{ level: 6, min: 0, max: 15, ask: 'mixed', optionCount: 3, tight: false },
	{ level: 7, min: 0, max: 19, ask: 'mixed', optionCount: 3, tight: true },
	{ level: 8, min: 0, max: 22, ask: 'mixed', optionCount: 3, tight: true },
	{ level: 9, min: 0, max: 25, ask: 'mixed', optionCount: 3, tight: true },
	{ level: 10, min: 0, max: 25, ask: 'mixed', optionCount: 4, tight: true }
];

export function getCaseLevel(level: number): CaseLevelConfig | undefined {
	return CASE_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function pickAsk(mode: CaseLevelConfig['ask'], rand: () => number): CaseAsk {
	if (mode === 'mixed') return rand() < 0.5 ? 'toLower' : 'toUpper';
	return mode;
}

function optionsFor(
	answerIndex: number,
	ask: CaseAsk,
	min: number,
	max: number,
	count: number,
	tight: boolean,
	rand: () => number
): string[] {
	const candidates: number[] = [];
	for (let i = min; i <= max; i++) {
		if (i !== answerIndex) candidates.push(i);
	}
	const near = candidates.filter((i) => Math.abs(i - answerIndex) === 1);
	const far = candidates.filter((i) => Math.abs(i - answerIndex) > 1);
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [...shuffled(far.length > 0 ? far : candidates, rand), ...near];
	const picked: number[] = [];
	for (const i of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(i)) picked.push(i);
	}
	const indexes = shuffled([answerIndex, ...picked], rand);
	return indexes.map((i) => (ask === 'toLower' ? LETTERS[i].toLowerCase() : LETTERS[i]));
}

/** Three letter-case rounds. */
export function pickRounds(
	config: CaseLevelConfig,
	rand: () => number = Math.random
): CaseRound[] {
	const pool: number[] = [];
	for (let i = config.min; i <= config.max; i++) pool.push(i);
	const picks = shuffled(pool, rand);
	const rounds: CaseRound[] = [];
	for (let i = 0; i < CASE_ROUNDS; i++) {
		const index = picks[i % picks.length];
		const ask = pickAsk(config.ask, rand);
		const shown = ask === 'toLower' ? LETTERS[index] : LETTERS[index].toLowerCase();
		const answer = ask === 'toLower' ? LETTERS[index].toLowerCase() : LETTERS[index];
		rounds.push({
			ask,
			shown,
			answer,
			options: optionsFor(
				index,
				ask,
				config.min,
				config.max,
				config.optionCount,
				config.tight,
				rand
			)
		});
	}
	return rounds;
}
