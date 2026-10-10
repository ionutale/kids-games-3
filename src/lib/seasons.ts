/**
 * Pure rules for "Seasons". A seasonal scene is shown.
 * The child taps spring, summer, autumn, or winter.
 */

export type SeasonId = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SeasonRound {
	season: SeasonId;
	answer: SeasonId;
	options: SeasonId[];
}

export interface SeasonLevelConfig {
	level: number;
	seasons: SeasonId[];
	optionCount: number;
	/** Wrong answers are neighboring seasons. */
	tight: boolean;
}

export const MAX_SEASON_LEVEL = 10;
export const SEASON_ROUNDS = 3;

export const SEASON_ORDER: SeasonId[] = ['spring', 'summer', 'autumn', 'winter'];

export const SEASON_LEVELS: SeasonLevelConfig[] = [
	{ level: 1, seasons: ['spring', 'winter'], optionCount: 2, tight: false },
	{ level: 2, seasons: ['summer', 'winter'], optionCount: 2, tight: false },
	{ level: 3, seasons: ['spring', 'autumn'], optionCount: 2, tight: false },
	{ level: 4, seasons: ['spring', 'summer', 'winter'], optionCount: 3, tight: false },
	{ level: 5, seasons: SEASON_ORDER, optionCount: 3, tight: false },
	{ level: 6, seasons: SEASON_ORDER, optionCount: 4, tight: false },
	{ level: 7, seasons: SEASON_ORDER, optionCount: 4, tight: false },
	{ level: 8, seasons: SEASON_ORDER, optionCount: 3, tight: true },
	{ level: 9, seasons: SEASON_ORDER, optionCount: 4, tight: true },
	{ level: 10, seasons: SEASON_ORDER, optionCount: 4, tight: true }
];

export function getSeasonLevel(level: number): SeasonLevelConfig | undefined {
	return SEASON_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function neighbors(season: SeasonId): SeasonId[] {
	const index = SEASON_ORDER.indexOf(season);
	return [SEASON_ORDER[(index + 3) % 4], SEASON_ORDER[(index + 1) % 4]];
}

function optionsFor(
	answer: SeasonId,
	pool: SeasonId[],
	count: number,
	tight: boolean,
	rand: () => number
): SeasonId[] {
	const near = neighbors(answer).filter((season) => pool.includes(season));
	const far = pool.filter((season) => season !== answer && !near.includes(season));
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [
				...shuffled(far.length > 0 ? far : pool.filter((season) => season !== answer), rand),
				...near
			];
	const picked: SeasonId[] = [];
	for (const season of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(season)) picked.push(season);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three seasonal scenes. The answer is the matching season name. */
export function pickRounds(
	config: SeasonLevelConfig,
	rand: () => number = Math.random
): SeasonRound[] {
	const seasons = shuffled(config.seasons, rand);
	return Array.from({ length: SEASON_ROUNDS }, (_, index) => {
		const season = seasons[index % seasons.length];
		return {
			season,
			answer: season,
			options: optionsFor(season, config.seasons, config.optionCount, config.tight, rand)
		};
	});
}
