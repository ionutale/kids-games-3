import { describe, expect, test } from 'vitest';
import { POSITION_ROUNDS, getPositionLevel, indexFor, pickRounds } from './position';

describe('first or last levels', () => {
	test('ten levels, and middle is only on an odd row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPositionLevel(level)!;
			expect(config).toBeDefined();
			if (config.asks.includes('middle')) expect(config.length % 2).toBe(1);
		}
		expect(getPositionLevel(1)!.asks).toEqual(['first']);
		expect(getPositionLevel(6)!.asks).toEqual(['middle']);
		expect(getPositionLevel(11)).toBeUndefined();
	});
});

describe('indexFor', () => {
	test('first is the left end and last is the right end', () => {
		expect(indexFor('first', 5)).toBe(0);
		expect(indexFor('second', 5)).toBe(1);
		expect(indexFor('middle', 3)).toBe(1);
		expect(indexFor('middle', 5)).toBe(2);
		expect(indexFor('last', 4)).toBe(3);
	});
});

describe('pickRounds', () => {
	test('three places, each inside the row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPositionLevel(level)!;
			const rounds = pickRounds(config, () => 0.2);
			expect(rounds).toHaveLength(POSITION_ROUNDS);
			for (const round of rounds) {
				expect(config.asks).toContain(round.ask);
				expect(round.answerIndex).toBe(indexFor(round.ask, round.length));
				expect(round.answerIndex).toBeGreaterThanOrEqual(0);
				expect(round.answerIndex).toBeLessThan(round.length);
			}
		}
	});
});
