import { MORNING_EVENING_LEVELS } from '#lib/morning-evening.js';
export function entries() {
	return MORNING_EVENING_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
