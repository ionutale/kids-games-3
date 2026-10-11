import { describe, expect, test } from 'vitest';
import { getNumBeforeAfterLevel, pickRounds } from './num-before-after';

describe('num-before-after', () => {
	test('answer is neighbor of anchor', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getNumBeforeAfterLevel(level)!;
			for (const round of pickRounds(config, () => 0.2)) {
				expect(round.answer).toBe(round.ask === 'before' ? round.anchor - 1 : round.anchor + 1);
				expect(round.options).toContain(round.answer);
			}
		}
		expect(getNumBeforeAfterLevel(11)).toBeUndefined();
	});
});
