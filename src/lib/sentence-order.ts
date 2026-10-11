/** Sentence order — 3 picture cards → tap first / next / last. */

export type OrderSlot = 'first' | 'next' | 'last';

export type StoryId = 'wash' | 'plant' | 'snack';

export interface SentenceOrderRound {
	story: StoryId;
	ask: OrderSlot;
	answer: number;
	/** Card indices 0,1,2 in story order; display order is shuffled. */
	display: number[];
	options: OrderSlot[];
}

export interface SentenceOrderLevelConfig {
	level: number;
	stories: StoryId[];
	asks: OrderSlot[];
}

export const MAX_SENTENCE_ORDER_LEVEL = 10;
export const SENTENCE_ORDER_ROUNDS = 3;

const EARLY: OrderSlot[] = ['first', 'last'];
const ALL_ASKS: OrderSlot[] = ['first', 'next', 'last'];

export const SENTENCE_ORDER_LEVELS: SentenceOrderLevelConfig[] = [
	{ level: 1, stories: ['wash'], asks: EARLY },
	{ level: 2, stories: ['wash', 'snack'], asks: EARLY },
	{ level: 3, stories: ['wash', 'snack'], asks: EARLY },
	{ level: 4, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 5, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 6, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 7, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 8, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 9, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS },
	{ level: 10, stories: ['wash', 'plant', 'snack'], asks: ALL_ASKS }
];

export function getSentenceOrderLevel(level: number): SentenceOrderLevelConfig | undefined {
	return SENTENCE_ORDER_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

const SLOT_INDEX: Record<OrderSlot, number> = { first: 0, next: 1, last: 2 };

export function pickRounds(
	config: SentenceOrderLevelConfig,
	rand: () => number = Math.random
): SentenceOrderRound[] {
	const stories = shuffled(config.stories, rand);
	const asks = shuffled(config.asks, rand);
	return Array.from({ length: SENTENCE_ORDER_ROUNDS }, (_, index) => {
		const story = stories[index % stories.length];
		const ask = asks[index % asks.length];
		return {
			story,
			ask,
			answer: SLOT_INDEX[ask],
			display: shuffled([0, 1, 2], rand),
			options: shuffled(config.asks, rand)
		};
	});
}
