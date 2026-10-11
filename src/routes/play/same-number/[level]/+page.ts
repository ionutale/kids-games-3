import { SAME_NUMBER_LEVELS } from '#lib/same-number.js';
export function entries() {
	return SAME_NUMBER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
