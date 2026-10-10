import { LEFT_RIGHT_LEVELS } from '#lib/left-right.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return LEFT_RIGHT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
