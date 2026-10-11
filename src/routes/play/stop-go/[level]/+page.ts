import { STOP_GO_LEVELS } from '#lib/stop-go.js';
export function entries() {
	return STOP_GO_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
