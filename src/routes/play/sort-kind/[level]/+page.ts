import { KIND_LEVELS } from '#lib/sort-kind.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return KIND_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
