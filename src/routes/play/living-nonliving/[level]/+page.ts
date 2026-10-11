import { LIVING_NONLIVING_LEVELS } from '#lib/living-nonliving.js';
export function entries() {
	return LIVING_NONLIVING_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
