import { PUSH_PULL_LEVELS } from '#lib/push-pull.js';
export function entries() {
	return PUSH_PULL_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
