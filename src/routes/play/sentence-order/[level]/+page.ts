import { SENTENCE_ORDER_LEVELS } from '#lib/sentence-order.js';

export function entries() {
	return SENTENCE_ORDER_LEVELS.map((entry) => ({ level: String(entry.level) }));
}
