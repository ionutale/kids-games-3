/**
 * Pure rules for "Dress for weather".
 * See a weather cue. Tap the matching clothing (pairs with Weather).
 */

import type { WeatherId } from './weather.js';

export type ClothesId = 'hat' | 'coat' | 'raincoat' | 'boots' | 'scarf' | 'sunglasses';

export interface DressRound {
	weather: WeatherId;
	answer: ClothesId;
	options: ClothesId[];
}

export interface DressLevelConfig {
	level: number;
	weathers: WeatherId[];
	optionCount: number;
}

export const MAX_DRESS_LEVEL = 10;
export const DRESS_ROUNDS = 3;

/** Best clothing for each weather (early levels use first pick). */
export const CLOTHES_FOR: Record<WeatherId, ClothesId[]> = {
	sunny: ['hat', 'sunglasses'],
	rainy: ['raincoat', 'boots'],
	snowy: ['coat', 'scarf'],
	cloudy: ['coat', 'hat']
};

const ALL_CLOTHES: ClothesId[] = ['hat', 'coat', 'raincoat', 'boots', 'scarf', 'sunglasses'];

export const DRESS_LEVELS: DressLevelConfig[] = [
	{ level: 1, weathers: ['sunny', 'rainy'], optionCount: 2 },
	{ level: 2, weathers: ['sunny', 'snowy'], optionCount: 2 },
	{ level: 3, weathers: ['rainy', 'snowy'], optionCount: 2 },
	{ level: 4, weathers: ['sunny', 'rainy', 'snowy'], optionCount: 3 },
	{ level: 5, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 3 },
	{ level: 6, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 3 },
	{ level: 7, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 4 },
	{ level: 8, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 4 },
	{ level: 9, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 4 },
	{ level: 10, weathers: ['sunny', 'rainy', 'snowy', 'cloudy'], optionCount: 4 }
];

export function getDressLevel(level: number): DressLevelConfig | undefined {
	return DRESS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three weather → clothing matches. */
export function pickRounds(
	config: DressLevelConfig,
	rand: () => number = Math.random
): DressRound[] {
	const weathers = shuffled(config.weathers, rand);
	return Array.from({ length: DRESS_ROUNDS }, (_, index) => {
		const weather = weathers[index % weathers.length];
		const fits = CLOTHES_FOR[weather];
		const answer = fits[Math.floor(rand() * fits.length)];
		const wrongPool = ALL_CLOTHES.filter((item) => !fits.includes(item));
		const others = shuffled(wrongPool, rand).slice(0, config.optionCount - 1);
		return {
			weather,
			answer,
			options: shuffled([answer, ...others], rand)
		};
	});
}
