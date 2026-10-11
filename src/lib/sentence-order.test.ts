import { describe, expect, test } from 'vitest';
import { getSentenceOrderLevel, pickRounds } from './sentence-order';

describe('sentence-order', () => {
	test('ask maps to card index', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getSentenceOrderLevel(level)!;
			for (const round of pickRounds(config, () => 0.33)) {
				const expected = round.ask === 'first' ? 0 : round.ask === 'next' ? 1 : 2;
				expect(round.answer).toBe(expected);
				expect(round.display).toHaveLength(3);
			}
		}
		expect(getSentenceOrderLevel(11)).toBeUndefined();
	});
});
