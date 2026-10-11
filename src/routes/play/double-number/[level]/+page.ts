import { DOUBLE_NUMBER_LEVELS } from '#lib/double-number.js';
export function entries() {
	return DOUBLE_NUMBER_LEVELS.map((e) => ({ level: String(e.level) }));
}
