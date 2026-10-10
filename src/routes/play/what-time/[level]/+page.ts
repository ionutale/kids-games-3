import { TIME_LEVELS } from '#lib/what-time.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return TIME_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
