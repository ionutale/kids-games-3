/** Before / after numbers — see a number, tap the one before or after. */

export type NumAsk = 'before' | 'after';

export interface NumBeforeAfterRound {
	anchor: number;
	ask: NumAsk;
	answer: number;
	options: number[];
}

export interface NumBeforeAfterLevelConfig {
	level: number;
	min: number;
	max: number;
	asks: NumAsk[];
	optionCount: number;
}

export const MAX_NUM_BEFORE_AFTER_LEVEL = 10;
export const NUM_BEFORE_AFTER_ROUNDS = 3;

export const NUM_BEFORE_AFTER_LEVELS: NumBeforeAfterLevelConfig[] = [
	{ level: 1, min: 2, max: 5, asks: ['after'], optionCount: 2 },
	{ level: 2, min: 2, max: 5, asks: ['before'], optionCount: 2 },
	{ level: 3, min: 2, max: 6, asks: ['before', 'after'], optionCount: 2 },
	{ level: 4, min: 2, max: 7, asks: ['before', 'after'], optionCount: 3 },
	{ level: 5, min: 2, max: 8, asks: ['before', 'after'], optionCount: 3 },
	{ level: 6, min: 2, max: 9, asks: ['before', 'after'], optionCount: 3 },
	{ level: 7, min: 2, max: 10, asks: ['before', 'after'], optionCount: 3 },
	{ level: 8, min: 2, max: 10, asks: ['before', 'after'], optionCount: 4 },
	{ level: 9, min: 2, max: 10, asks: ['before', 'after'], optionCount: 4 },
	{ level: 10, min: 2, max: 10, asks: ['before', 'after'], optionCount: 4 }
];

export function getNumBeforeAfterLevel(level: number): NumBeforeAfterLevelConfig | undefined {
	return NUM_BEFORE_AFTER_LEVELS.find((entry) => entry.level === level);
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
	config: NumBeforeAfterLevelConfig,
	rand: () => number = Math.random
): NumBeforeAfterRound[] {
	const asks = shuffled(config.asks, rand);
	return Array.from({ length: NUM_BEFORE_AFTER_ROUNDS }, (_, index) => {
		const ask = asks[index % asks.length];
		const minAnchor = ask === 'before' ? config.min + 1 : config.min;
		const maxAnchor = ask === 'after' ? config.max - 1 : config.max;
		const span = Math.max(1, maxAnchor - minAnchor + 1);
		const anchor = minAnchor + Math.floor(rand() * span);
		const answer = ask === 'before' ? anchor - 1 : anchor + 1;
		const pool: number[] = [];
		for (let n = config.min; n <= config.max; n++) {
			if (n !== answer && n !== anchor) pool.push(n);
		}
		const distractors = shuffled(pool, rand).slice(0, config.optionCount - 1);
		return {
			anchor,
			ask,
			answer,
			options: shuffled([answer, ...distractors], rand)
		};
	});
}
