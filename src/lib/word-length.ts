/** Short / long word — two words → tap which is longer. */

export type WordLengthId = 'short' | 'long';

export type LengthWord = 'cat' | 'dog' | 'sun' | 'butterfly' | 'elephant' | 'helicopter';

export const WORD_LETTERS: Record<LengthWord, number> = {
	cat: 3,
	dog: 3,
	sun: 3,
	butterfly: 9,
	elephant: 8,
	helicopter: 10
};

export interface WordLengthRound {
	left: LengthWord;
	right: LengthWord;
	ask: 'longer' | 'shorter';
	answer: LengthWord;
	options: LengthWord[];
}

export interface WordLengthLevelConfig {
	level: number;
	shorts: LengthWord[];
	longs: LengthWord[];
	asks: Array<'longer' | 'shorter'>;
}

export const MAX_WORD_LENGTH_LEVEL = 10;
export const WORD_LENGTH_ROUNDS = 3;

const SHORTS: LengthWord[] = ['cat', 'dog', 'sun'];
const LONGS: LengthWord[] = ['butterfly', 'elephant', 'helicopter'];

export const WORD_LENGTH_LEVELS: WordLengthLevelConfig[] = [
	{ level: 1, shorts: SHORTS, longs: LONGS, asks: ['longer'] },
	{ level: 2, shorts: SHORTS, longs: LONGS, asks: ['longer'] },
	{ level: 3, shorts: SHORTS, longs: LONGS, asks: ['shorter'] },
	{ level: 4, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 5, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 6, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 7, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 8, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 9, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] },
	{ level: 10, shorts: SHORTS, longs: LONGS, asks: ['longer', 'shorter'] }
];

export function getWordLengthLevel(level: number): WordLengthLevelConfig | undefined {
	return WORD_LENGTH_LEVELS.find((entry) => entry.level === level);
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
	config: WordLengthLevelConfig,
	rand: () => number = Math.random
): WordLengthRound[] {
	const asks = shuffled(config.asks, rand);
	return Array.from({ length: WORD_LENGTH_ROUNDS }, (_, index) => {
		const short = config.shorts[Math.floor(rand() * config.shorts.length)];
		const long = config.longs[Math.floor(rand() * config.longs.length)];
		const pair = shuffled([short, long], rand);
		const ask = asks[index % asks.length];
		const answer = ask === 'longer' ? long : short;
		return {
			left: pair[0],
			right: pair[1],
			ask,
			answer,
			options: shuffled([short, long], rand)
		};
	});
}
