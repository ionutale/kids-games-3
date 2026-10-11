import { INSIDE_OUTSIDE_LEVELS } from '#lib/inside-outside.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return INSIDE_OUTSIDE_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
