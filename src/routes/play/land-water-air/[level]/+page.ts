import { LAND_WATER_AIR_LEVELS } from '#lib/land-water-air.js';

/** Prerender every level so a refresh mid-game never lands on a 404. */
export function entries() {
	return LAND_WATER_AIR_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
