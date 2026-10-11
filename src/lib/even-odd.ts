/** Even / odd — count pile → tap even or odd. */

export type EvenOddId = 'even' | 'odd';

export interface EvenOddRound {
	count: number;
	answer: EvenOddId;
	options: EvenOddId[];
}

export interface EvenOddLevelConfig {
	level: number;
	maxCount: number;
}

export const MAX_EVEN_ODD_LEVEL = 10;
export const EVEN_ODD_ROUNDS = 3;

export const EVEN_ODD_LEVELS: EvenOddLevelConfig[] = [
	{ level: 1, maxCount: 4 },
	{ level: 2, maxCount: 4 },
	{ level: 3, maxCount: 5 },
	{ level: 4, maxCount: 6 },
	{ level: 5, maxCount: 6 },
	{ level: 6, maxCount: 7 },
	{ level: 7, maxCount: 8 },
	{ level: 8, maxCount: 8 },
	{ level: 9, maxCount: 9 },
	{ level: 10, maxCount: 10 }
];

export function getEvenOddLevel(level: number): EvenOddLevelConfig | undefined {
	return EVEN_ODD_LEVELS.find((entry) => entry.level === level);
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
	config: EvenOddLevelConfig,
	rand: () => number = Math.random
): EvenOddRound[] {
	return Array.from({ length: EVEN_ODD_ROUNDS }, () => {
		const count = 1 + Math.floor(rand() * config.maxCount);
		const answer: EvenOddId = count % 2 === 0 ? 'even' : 'odd';
		return { count, answer, options: shuffled(['even', 'odd'], rand) };
	});
}
