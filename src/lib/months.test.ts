import { describe, expect, test } from 'vitest';
import { MONTHS_ROUNDS, YEAR_MONTHS, getMonthsLevel, pickRounds } from './months';

describe('months levels', () => {
	test('ten levels, next then fill after level 5', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getMonthsLevel(level)).toBeDefined();
		}
		expect(YEAR_MONTHS).toEqual([
			'jan',
			'feb',
			'mar',
			'apr',
			'may',
			'jun',
			'jul',
			'aug',
			'sep',
			'oct',
			'nov',
			'dec'
		]);
		expect(getMonthsLevel(1)!.mode).toBe('next');
		expect(getMonthsLevel(5)!.mode).toBe('next');
		expect(getMonthsLevel(6)!.mode).toBe('fill');
		expect(getMonthsLevel(6)!.blankCount).toBe(2);
		expect(getMonthsLevel(10)!.blankCount).toBe(6);
		expect(getMonthsLevel(10)!.decoy).toBe(true);
		expect(getMonthsLevel(11)).toBeUndefined();

		let prevBlanks = 0;
		for (let level = 6; level <= 10; level++) {
			const config = getMonthsLevel(level)!;
			expect(config.blankCount).toBeGreaterThanOrEqual(prevBlanks);
			prevBlanks = config.blankCount;
		}
	});
});

describe('pickRounds', () => {
	test('next levels: answer is the month after the shown row', () => {
		for (let level = 1; level <= 5; level++) {
			const config = getMonthsLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(MONTHS_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('next');
				if (round.mode !== 'next') continue;
				expect(round.shown).toHaveLength(config.shown);
				const last = YEAR_MONTHS.indexOf(round.shown[round.shown.length - 1]);
				expect(YEAR_MONTHS[last + 1]).toBe(round.answer);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
			}
		}
	});

	test('fill levels: multiple blanks and a matching tray', () => {
		for (let level = 6; level <= 10; level++) {
			const config = getMonthsLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(MONTHS_ROUNDS);
			for (const round of rounds) {
				expect(round.mode).toBe('fill');
				if (round.mode !== 'fill') continue;
				expect(round.board).toEqual(YEAR_MONTHS.slice(config.min, config.max + 1));
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
