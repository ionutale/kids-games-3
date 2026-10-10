import { WEATHER_LEVELS } from '#lib/weather.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return WEATHER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
