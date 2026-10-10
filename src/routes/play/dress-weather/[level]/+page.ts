import { DRESS_LEVELS } from '#lib/dress-weather.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return DRESS_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
