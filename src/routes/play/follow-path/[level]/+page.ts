import { PATH_LEVELS } from '#lib/follow-path.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return PATH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
