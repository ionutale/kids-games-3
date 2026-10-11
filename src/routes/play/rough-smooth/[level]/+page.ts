import { ROUGH_SMOOTH_LEVELS } from '#lib/rough-smooth.js';
export function entries() {
	return ROUGH_SMOOTH_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
