import { SHARE_KEEP_LEVELS } from '#lib/share-keep.js';
export function entries() {
	return SHARE_KEEP_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
