import { describe, expect, test } from 'vitest';
import {
	ANIMAL_FOR,
	HOME_FOR,
	HOME_ROUNDS,
	getHomeLevel,
	isHomeId,
	pickRounds
} from './animal-homes';

describe('animal-homes levels', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getHomeLevel(level)).toBeDefined();
		}
		expect(getHomeLevel(1)!.optionCount).toBe(2);
		expect(getHomeLevel(10)!.animals.length).toBe(7);
		expect(getHomeLevel(11)).toBeUndefined();
	});
});

describe('pickRounds', () => {
	test('answer matches the animal–home pair', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getHomeLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(HOME_ROUNDS);
			for (const round of rounds) {
				expect(HOME_FOR[round.animal]).toBe(round.home);
				expect(ANIMAL_FOR[round.home]).toBe(round.animal);
				expect(round.options).toContain(round.answer);
				expect(round.options).toHaveLength(config.optionCount);
				expect(new Set(round.options).size).toBe(round.options.length);
				expect(config.modes).toContain(round.mode);
				if (round.mode === 'animal-to-home') {
					expect(isHomeId(round.answer)).toBe(true);
					expect(round.answer).toBe(round.home);
				} else {
					expect(isHomeId(round.answer)).toBe(false);
					expect(round.answer).toBe(round.animal);
				}
			}
		}
	});
});
