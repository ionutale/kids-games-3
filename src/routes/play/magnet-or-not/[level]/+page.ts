import { MAGNET_OR_NOT_LEVELS } from '#lib/magnet-or-not.js';
export function entries() {
	return MAGNET_OR_NOT_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
