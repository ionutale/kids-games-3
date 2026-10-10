/**
 * Pure rules for "Weather". A weather scene is shown.
 * The child taps sunny, rainy, cloudy, or snowy.
 */

export type WeatherId = 'sunny' | 'cloudy' | 'rainy' | 'snowy';

export interface WeatherRound {
	weather: WeatherId;
	answer: WeatherId;
	options: WeatherId[];
}

export interface WeatherLevelConfig {
	level: number;
	weathers: WeatherId[];
	optionCount: number;
	/** Wrong answers are neighboring weathers. */
	tight: boolean;
}

export const MAX_WEATHER_LEVEL = 10;
export const WEATHER_ROUNDS = 3;

export const WEATHER_ORDER: WeatherId[] = ['sunny', 'cloudy', 'rainy', 'snowy'];

export const WEATHER_LEVELS: WeatherLevelConfig[] = [
	{ level: 1, weathers: ['sunny', 'rainy'], optionCount: 2, tight: false },
	{ level: 2, weathers: ['sunny', 'snowy'], optionCount: 2, tight: false },
	{ level: 3, weathers: ['cloudy', 'rainy'], optionCount: 2, tight: false },
	{ level: 4, weathers: ['sunny', 'cloudy', 'rainy'], optionCount: 3, tight: false },
	{ level: 5, weathers: WEATHER_ORDER, optionCount: 3, tight: false },
	{ level: 6, weathers: WEATHER_ORDER, optionCount: 4, tight: false },
	{ level: 7, weathers: WEATHER_ORDER, optionCount: 4, tight: false },
	{ level: 8, weathers: WEATHER_ORDER, optionCount: 3, tight: true },
	{ level: 9, weathers: WEATHER_ORDER, optionCount: 4, tight: true },
	{ level: 10, weathers: WEATHER_ORDER, optionCount: 4, tight: true }
];

export function getWeatherLevel(level: number): WeatherLevelConfig | undefined {
	return WEATHER_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

function neighbors(weather: WeatherId): WeatherId[] {
	const index = WEATHER_ORDER.indexOf(weather);
	return [WEATHER_ORDER[(index + 3) % 4], WEATHER_ORDER[(index + 1) % 4]];
}

function optionsFor(
	answer: WeatherId,
	pool: WeatherId[],
	count: number,
	tight: boolean,
	rand: () => number
): WeatherId[] {
	const near = neighbors(answer).filter((weather) => pool.includes(weather));
	const far = pool.filter((weather) => weather !== answer && !near.includes(weather));
	const ordered = tight
		? [...near, ...shuffled(far, rand)]
		: [
				...shuffled(far.length > 0 ? far : pool.filter((weather) => weather !== answer), rand),
				...near
			];
	const picked: WeatherId[] = [];
	for (const weather of ordered) {
		if (picked.length >= count - 1) break;
		if (!picked.includes(weather)) picked.push(weather);
	}
	return shuffled([answer, ...picked], rand);
}

/** Three weather scenes. The answer is the matching weather name. */
export function pickRounds(
	config: WeatherLevelConfig,
	rand: () => number = Math.random
): WeatherRound[] {
	const weathers = shuffled(config.weathers, rand);
	return Array.from({ length: WEATHER_ROUNDS }, (_, index) => {
		const weather = weathers[index % weathers.length];
		return {
			weather,
			answer: weather,
			options: optionsFor(weather, config.weathers, config.optionCount, config.tight, rand)
		};
	});
}
