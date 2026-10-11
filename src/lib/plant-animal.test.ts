import { describe, expect, test } from 'vitest';
import {
	PLANT_ANIMAL_ROUNDS,
	SUBJECT_ANSWER,
	getPlantAnimalLevel,
	pickRounds
} from './plant-animal';

describe('plant-animal', () => {
	test('ten levels', () => {
		for (let level = 1; level <= 10; level++) {
			expect(getPlantAnimalLevel(level)).toBeDefined();
		}
		expect(getPlantAnimalLevel(11)).toBeUndefined();
	});

	test('pickRounds answers match subjects', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getPlantAnimalLevel(level)!;
			const rounds = pickRounds(config, () => 0.25);
			expect(rounds).toHaveLength(PLANT_ANIMAL_ROUNDS);
			for (const round of rounds) {
				expect(round.answer).toBe(SUBJECT_ANSWER[round.subject]);
				expect(round.options).toContain('plant');
				expect(round.options).toContain('animal');
			}
		}
	});
});
