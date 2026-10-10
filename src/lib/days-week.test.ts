import { describe, expect, test } from 'vitest';
import { DAYS_ROUNDS, WEEK_DAYS, getDaysLevel, pickRounds } from './days-week';

describe('days-week levels', () => {
	test('ten levels, week starts Monday', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getDaysLevel(level)).toBeDefined();
		}
		expect(WEEK_DAYS).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
		expect(getDaysLevel(1)!.max).toBe(3);
		expect(getDaysLevel(1)!.optionCount).toBe(2);
		expect(getDaysLevel(8)!.tight).toBe(true);
		expect(getDaysLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('the answer is the day after the shown row', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getDaysLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DAYS_ROUNDS);
			for (const round of rounds) {
				expect(round.shown).toHaveLength(config.shown);
				const last = WEEK_DAYS.indexOf(round.shown[round.shown.length - 1]);
				expect(WEEK_DAYS[last + 1]).toBe(round.answer);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				for (const day of [...round.shown, ...round.options]) {
					const index = WEEK_DAYS.indexOf(day);
					expect(index).toBeGreaterThanOrEqual(config.min);
					expect(index).toBeLessThanOrEqual(config.max);
				}
			}
		}
	});
});
