import { HARD_SOFT_LEVELS } from '#lib/hard-soft.js';
export function entries() {
	return HARD_SOFT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
