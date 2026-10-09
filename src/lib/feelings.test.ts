import { describe, expect, test } from 'vitest';
import {
	FEELINGS_ROUNDS_PER_LEVEL,
	MAX_FEELINGS_LEVEL,
	getFeelingsLevel,
	makeEmotionOptions,
	pickEmotions,
	type EmotionId
} from './feelings';

describe('feelings levels', () => {
	test('ten levels with at least three emotions', () => {
		expect(MAX_FEELINGS_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getFeelingsLevel(level)!;
			expect(config).toBeDefined();
			expect(config.emotions.length).toBeGreaterThanOrEqual(FEELINGS_ROUNDS_PER_LEVEL);
		}
		expect(getFeelingsLevel(1)!.emotions).toEqual(['happy', 'sad', 'angry']);
		expect(getFeelingsLevel(7)!.tight).toBe(true);
		expect(getFeelingsLevel(11)).toBeUndefined();
	});
});

describe('pickEmotions', () => {
	test('three different emotions from the level set', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFeelingsLevel(level)!;
			const emotions = pickEmotions(config, () => 0.42);
			expect(emotions).toHaveLength(FEELINGS_ROUNDS_PER_LEVEL);
			expect(new Set(emotions).size).toBe(FEELINGS_ROUNDS_PER_LEVEL);
			for (const emotion of emotions) {
				expect(config.emotions).toContain(emotion);
			}
		}
	});
});

describe('makeEmotionOptions', () => {
	test('three options including the right feeling', () => {
		for (let level = 1; level <= 10; level++) {
			const config = getFeelingsLevel(level)!;
			for (const correct of config.emotions) {
				const options = makeEmotionOptions(config, correct, () => 0.7);
				expect(options).toHaveLength(3);
				expect(options).toContain(correct);
				expect(new Set(options).size).toBe(3);
			}
		}
	});

	test('tight levels prefer easily confused feelings', () => {
		const config = getFeelingsLevel(7)!;
		const options = makeEmotionOptions(config, 'sad', () => 0.99);
		const others = options.filter((emotion) => emotion !== 'sad');
		expect(others).toContain('tired');
	});

	test('loose levels shuffle every feeling in', () => {
		const config = getFeelingsLevel(1)!;
		const seen = new Set<EmotionId>();
		for (let i = 0; i < 20; i++) {
			for (const option of makeEmotionOptions(config, 'happy', () => Math.random())) {
				seen.add(option);
			}
		}
		expect(seen).toEqual(new Set(['happy', 'sad', 'angry']));
	});
});
