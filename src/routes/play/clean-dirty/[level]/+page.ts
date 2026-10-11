import { CLEAN_DIRTY_LEVELS } from '#lib/clean-dirty.js';
export function entries() {
	return CLEAN_DIRTY_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
