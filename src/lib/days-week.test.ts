import { describe, expect, test } from 'vitest';
import { DAYS_ROUNDS, WEEK_DAYS, getDaysLevel, pickRounds } from './days-week';

describe('days-week levels', () => {
	test('ten levels, next then fill after level 5', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getDaysLevel(level)).toBeDefined();
		}
		expect(WEEK_DAYS).toEqual(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
		expect(getDaysLevel(1)!.mode).toBe('next');
		expect(getDaysLevel(5)!.mode).toBe('next');
		expect(getDaysLevel(6)!.mode).toBe('fill');
		expect(getDaysLevel(6)!.blankCount).toBe(2);
		expect(getDaysLevel(10)!.blankCount).toBe(5);
		expect(getDaysLevel(10)!.decoy).toBe(true);
		expect(getDaysLevel(11)).toBeUndefined();

		let prevBlanks = 0;
		for (let level = 6; level <= 10; level++) {
			const config = getDaysLevel(level)!;
			expect(config.blankCount).toBeGreaterThanOrEqual(prevBlanks);
			prevBlanks = config.blankCount;
		}
	});
});

describe('pickRounds', () => {
	test('next levels: answer is the day after the shown row', () => {
		for (let level = 1; level <= 5; level++) {
			const config = getDaysLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DAYS_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('next');
				if (round.mode !== 'next') continue;
				expect(round.shown).toHaveLength(config.shown);
				const last = WEEK_DAYS.indexOf(round.shown[round.shown.length - 1]);
				expect(WEEK_DAYS[last + 1]).toBe(round.answer);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
			}
		}
	});

	test('fill levels: multiple blanks and a matching tray', () => {
		for (let level = 6; level <= 10; level++) {
			const config = getDaysLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(DAYS_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('fill');
				if (round.mode !== 'fill') continue;
				expect(round.board).toEqual(WEEK_DAYS.slice(config.min, config.max + 1));
				expect(round.blanks).toHaveLength(config.blankCount);
				expect(new Set(round.blanks).size).toBe(round.blanks.length);
				for (const blank of round.blanks) {
					expect(round.board).toContain(blank);
					expect(round.tray).toContain(blank);
				}
				const expectedTray = config.decoy ? config.blankCount + 1 : config.blankCount;
				expect(round.tray).toHaveLength(expectedTray);
				expect(new Set(round.tray).size).toBe(round.tray.length);
			}
		}
	});
});
