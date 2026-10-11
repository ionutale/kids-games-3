import { HOME_LEVELS } from '#lib/animal-homes.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return HOME_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
