/**
 * Pure rules for "Money coins".
 * Match a coin picture to its value: 1, 5, or 10.
 */

export type CoinValue = 1 | 5 | 10;

export interface MoneyRound {
	/** Mode: see coin → tap number, or see number → tap coin. */
	mode: 'coin-to-value' | 'value-to-coin';
	answer: CoinValue;
	options: CoinValue[];
}

export interface MoneyLevelConfig {
	level: number;
	values: CoinValue[];
	optionCount: number;
	modes: Array<'coin-to-value' | 'value-to-coin'>;
}

export const MAX_MONEY_LEVEL = 10;
export const MONEY_ROUNDS = 3;

const ONE_FIVE: CoinValue[] = [1, 5];
const ALL: CoinValue[] = [1, 5, 10];

export const MONEY_LEVELS: MoneyLevelConfig[] = [
	{ level: 1, values: ONE_FIVE, optionCount: 2, modes: ['coin-to-value'] },
	{ level: 2, values: ONE_FIVE, optionCount: 2, modes: ['coin-to-value'] },
	{ level: 3, values: ONE_FIVE, optionCount: 2, modes: ['value-to-coin'] },
	{ level: 4, values: ALL, optionCount: 3, modes: ['coin-to-value'] },
	{ level: 5, values: ALL, optionCount: 3, modes: ['value-to-coin'] },
	{ level: 6, values: ALL, optionCount: 3, modes: ['coin-to-value', 'value-to-coin'] },
	{ level: 7, values: ALL, optionCount: 3, modes: ['coin-to-value', 'value-to-coin'] },
	{ level: 8, values: ALL, optionCount: 3, modes: ['coin-to-value', 'value-to-coin'] },
	{ level: 9, values: ALL, optionCount: 3, modes: ['coin-to-value', 'value-to-coin'] },
	{ level: 10, values: ALL, optionCount: 3, modes: ['coin-to-value', 'value-to-coin'] }
];

export function getMoneyLevel(level: number): MoneyLevelConfig | undefined {
	return MONEY_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three coin/value matches. */
export function pickRounds(
	config: MoneyLevelConfig,
	rand: () => number = Math.random
): MoneyRound[] {
	const values = shuffled(config.values, rand);
	const modes = shuffled(config.modes, rand);
	return Array.from({ length: MONEY_ROUNDS }, (_, index) => {
		const answer = values[index % values.length];
		const others = shuffled(
			config.values.filter((value) => value !== answer),
			rand
		).slice(0, config.optionCount - 1);
		return {
			mode: modes[index % modes.length],
			answer,
			options: shuffled([answer, ...others], rand)
		};
	});
}
