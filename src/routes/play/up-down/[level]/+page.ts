import { UP_DOWN_LEVELS } from '#lib/up-down.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return UP_DOWN_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
