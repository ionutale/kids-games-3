import { ASK_GRAB_LEVELS } from '#lib/ask-grab.js';
export function entries() {
	return ASK_GRAB_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
