import { HOT_COLD_LEVELS } from '#lib/hot-cold.js';
export function entries() {
	return HOT_COLD_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
