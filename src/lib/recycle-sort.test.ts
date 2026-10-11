import { describe, expect, test } from 'vitest';
import { ITEM_BIN, RECYCLE_ROUNDS, getRecycleLevel, pickRounds } from './recycle-sort';

describe('recycle-sort', () => {
	test('ten levels and bin matches', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getRecycleLevel(level)!;
			const rounds = pickRounds(config, () => 0.4);
			expect(rounds).toHaveLength(RECYCLE_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(ITEM_BIN[round.item]);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getRecycleLevel(11)).toBeUndefined();
	});
});
