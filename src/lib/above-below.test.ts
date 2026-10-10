import { describe, expect, test } from 'vitest';
import { ABOVE_ROUNDS, getAboveLevel, indexFor, pickRounds } from './above-below';

describe('above-below levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getAboveLevel(level)).toBeDefined();
		}
		expect(getAboveLevel(1)!.asks).toEqual(['above']);
		expect(getAboveLevel(5)!.asks).toEqual(['between']);
		expect(getAboveLevel(11)).toBeUndefined();
	});
});

describe('indexFor', () => {
	test('maps spots to column indices', () => {
		expect(indexFor('above')).toBe(0);
		expect(indexFor('between')).toBe(1);
		expect(indexFor('below')).toBe(2);
	});
});

describe('pickRounds', () => {
	test('three distinct fruits and matching answer index', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getAboveLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(ABOVE_ROUNDS);
			for (const round of rounds) {
				expect(round.items).toHaveLength(3);
				expect(new Set(round.items).size).toBe(3);
				expect(round.answerIndex).toBe(indexFor(round.ask));
				expect(config.asks).toContain(round.ask);
			}
		}
	});
});
