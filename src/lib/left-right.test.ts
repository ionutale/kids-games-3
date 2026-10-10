import { describe, expect, test } from 'vitest';
import { LEFT_RIGHT_ROUNDS, getLeftRightLevel, pickRounds } from './left-right';

describe('left-right levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getLeftRightLevel(level)).toBeDefined();
		}
		expect(getLeftRightLevel(1)!.cues).toEqual(['arrow']);
		expect(getLeftRightLevel(3)!.cues).toEqual(['side']);
		expect(getLeftRightLevel(8)!.subtle).toBe(true);
		expect(getLeftRightLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer matches the shown side', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getLeftRightLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(LEFT_RIGHT_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(round.side);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(2);
				expect(new Set(round.options).size).toBe(2);
				expect(config.cues).toContain(round.cue);
				expect(config.sides).toContain(round.side);
				expect(round.subtle).toBe(config.subtle);
			}
		}
	});
});
