import { FULL_EMPTY_LEVELS } from '#lib/full-empty.js';
export function entries() {
	return FULL_EMPTY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
