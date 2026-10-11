import { LOUD_QUIET_LEVELS } from '#lib/loud-quiet.js';
export function entries() {
	return LOUD_QUIET_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
