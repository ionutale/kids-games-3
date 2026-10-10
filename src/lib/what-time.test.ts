import { describe, expect, test } from 'vitest';
import { PART_HOUR, TIME_ROUNDS, getTimeLevel, partForHour, pickRounds } from './what-time';

describe('what time levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getTimeLevel(level)).toBeDefined();
		}
		expect(getTimeLevel(1)!.mode).toBe('part');
		expect(getTimeLevel(1)!.optionCount).toBe(2);
		expect(getTimeLevel(6)!.mode).toBe('hour');
		expect(getTimeLevel(11)).toBeUndefined();
	});
});

describe('partForHour', () => {
	test('maps kid-friendly hours to day parts', () => {
		expect(partForHour(8)).toBe('morning');
		expect(partForHour(12)).toBe('day');
		expect(partForHour(2)).toBe('day');
		expect(partForHour(5)).toBe('night');
		expect(PART_HOUR.morning).toBe(8);
	});
});

describe('pickRounds', () => {
	test('part rounds answer with the day part', () => {
		for (let level = 1; level <= 5; level++) {
			const config = getTimeLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(TIME_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('part');
				expect(round.answer).toBe(round.part);
				expect(round.hour).toBe(PART_HOUR[round.part]);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
			}
		}
	});

	test('hour rounds answer with the clock hour', () => {
		for (let level = 6; level <= 10; level++) {
			const config = getTimeLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(TIME_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('hour');
				expect(round.answer).toBe(String(round.hour));
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
			}
		}
	});
});
