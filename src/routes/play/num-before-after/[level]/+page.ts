import { NUM_BEFORE_AFTER_LEVELS } from '#lib/num-before-after.js';
export function entries() {
	return NUM_BEFORE_AFTER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
