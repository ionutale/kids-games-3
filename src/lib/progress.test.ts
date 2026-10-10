import { describe, expect, test } from 'vitest';
import {
	clearLevel,
	defaultProgress,
	loadMuted,
	loadProgress,
	saveMuted,
	saveProgress,
	type KeyValueStorage
} from './progress';

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage {
	const data = { ...initial };
	return {
		getItem: (key) => (key in data ? data[key] : null),
		setItem: (key, value) => {
			data[key] = value;
		}
	};
}

describe('progress', () => {
	test('starts with nothing cleared in either game', () => {
		expect(defaultProgress()).toEqual({
			'count-fruit': { cleared: 0 },
			'color-shapes': { cleared: 0 },
			feelings: { cleared: 0 },
			letters: { cleared: 0 },
			adding: { cleared: 0 },
			'wash-hands': { cleared: 0 },
			'brush-teeth': { cleared: 0 },
			bath: { cleared: 0 },
			subtract: { cleared: 0 },
			memory: { cleared: 0 },
			'odd-one': { cleared: 0 },
			'more-less': { cleared: 0 },
			opposites: { cleared: 0 },
			'read-word': { cleared: 0 },
			'small-big': { cleared: 0 },
			missing: { cleared: 0 },
			position: { cleared: 0 },
			'match-count': { cleared: 0 },
			pattern: { cleared: 0 },
			sides: { cleared: 0 },
			'shape-pattern': { cleared: 0 },
			'same-pair': { cleared: 0 },
			'next-number': { cleared: 0 },
			'abc-order': { cleared: 0 },
			'before-after': { cleared: 0 },
			rhyme: { cleared: 0 },
			syllable: { cleared: 0 },
			'sort-color': { cleared: 0 },
			'shadow-match': { cleared: 0 },
			'what-time': { cleared: 0 },
			seasons: { cleared: 0 },
			'days-week': { cleared: 0 },
			weather: { cleared: 0 }
		});
		expect(loadProgress(memoryStorage())).toEqual(defaultProgress());
		expect(loadProgress(null)).toEqual(defaultProgress());
	});

	test('clearing a level never moves backwards', () => {
		const progress = defaultProgress();
		expect(clearLevel(progress, 'count-fruit', 1)).toBe(1);
		expect(clearLevel(progress, 'count-fruit', 1)).toBe(1);
		expect(clearLevel(progress, 'color-shapes', 3)).toBe(3);
		expect(clearLevel(progress, 'feelings', 2)).toBe(2);
		expect(clearLevel(progress, 'letters', 4)).toBe(4);
		expect(clearLevel(progress, 'adding', 5)).toBe(5);
		expect(clearLevel(progress, 'wash-hands', 2)).toBe(2);
		expect(clearLevel(progress, 'brush-teeth', 3)).toBe(3);
		expect(clearLevel(progress, 'bath', 1)).toBe(1);
		expect(clearLevel(progress, 'subtract', 2)).toBe(2);
		expect(clearLevel(progress, 'memory', 1)).toBe(1);
		expect(clearLevel(progress, 'odd-one', 1)).toBe(1);
		expect(clearLevel(progress, 'more-less', 1)).toBe(1);
		expect(clearLevel(progress, 'opposites', 1)).toBe(1);
		expect(clearLevel(progress, 'read-word', 1)).toBe(1);
		expect(clearLevel(progress, 'small-big', 1)).toBe(1);
		expect(clearLevel(progress, 'missing', 1)).toBe(1);
		expect(clearLevel(progress, 'position', 1)).toBe(1);
		expect(clearLevel(progress, 'match-count', 1)).toBe(1);
		expect(clearLevel(progress, 'pattern', 1)).toBe(1);
		expect(clearLevel(progress, 'sides', 1)).toBe(1);
		expect(clearLevel(progress, 'shape-pattern', 1)).toBe(1);
		expect(clearLevel(progress, 'same-pair', 1)).toBe(1);
		expect(clearLevel(progress, 'next-number', 1)).toBe(1);
		expect(clearLevel(progress, 'abc-order', 1)).toBe(1);
		expect(clearLevel(progress, 'before-after', 1)).toBe(1);
		expect(clearLevel(progress, 'rhyme', 1)).toBe(1);
		expect(clearLevel(progress, 'syllable', 1)).toBe(1);
		expect(clearLevel(progress, 'sort-color', 1)).toBe(1);
		expect(clearLevel(progress, 'shadow-match', 1)).toBe(1);
		expect(clearLevel(progress, 'what-time', 1)).toBe(1);
		expect(clearLevel(progress, 'seasons', 1)).toBe(1);
		expect(clearLevel(progress, 'days-week', 1)).toBe(1);
		expect(clearLevel(progress, 'weather', 1)).toBe(1);
		expect(progress['count-fruit'].cleared).toBe(1);
	});

	test('progress survives a save and load round trip', () => {
		const storage = memoryStorage();
		const progress = defaultProgress();
		clearLevel(progress, 'count-fruit', 2);
		saveProgress(progress, storage);
		expect(loadProgress(storage)).toEqual({
			'count-fruit': { cleared: 2 },
			'color-shapes': { cleared: 0 },
			feelings: { cleared: 0 },
			letters: { cleared: 0 },
			adding: { cleared: 0 },
			'wash-hands': { cleared: 0 },
			'brush-teeth': { cleared: 0 },
			bath: { cleared: 0 },
			subtract: { cleared: 0 },
			memory: { cleared: 0 },
			'odd-one': { cleared: 0 },
			'more-less': { cleared: 0 },
			opposites: { cleared: 0 },
			'read-word': { cleared: 0 },
			'small-big': { cleared: 0 },
			missing: { cleared: 0 },
			position: { cleared: 0 },
			'match-count': { cleared: 0 },
			pattern: { cleared: 0 },
			sides: { cleared: 0 },
			'shape-pattern': { cleared: 0 },
			'same-pair': { cleared: 0 },
			'next-number': { cleared: 0 },
			'abc-order': { cleared: 0 },
			'before-after': { cleared: 0 },
			rhyme: { cleared: 0 },
			syllable: { cleared: 0 },
			'sort-color': { cleared: 0 },
			'shadow-match': { cleared: 0 },
			'what-time': { cleared: 0 },
			seasons: { cleared: 0 },
			'days-week': { cleared: 0 },
			weather: { cleared: 0 }
		});
	});

	test('broken saves fall back to a fresh start', () => {
		expect(loadProgress(memoryStorage({ 'lumi-progress': 'oops' }))).toEqual(defaultProgress());
		expect(
			loadProgress(memoryStorage({ 'lumi-progress': JSON.stringify({ 'count-fruit': null }) }))
		).toEqual(defaultProgress());
		expect(
			loadProgress(
				memoryStorage({ 'lumi-progress': JSON.stringify({ 'count-fruit': { cleared: 99 } }) })
			)
		).toEqual({
			'count-fruit': { cleared: 10 },
			'color-shapes': { cleared: 0 },
			feelings: { cleared: 0 },
			letters: { cleared: 0 },
			adding: { cleared: 0 },
			'wash-hands': { cleared: 0 },
			'brush-teeth': { cleared: 0 },
			bath: { cleared: 0 },
			subtract: { cleared: 0 },
			memory: { cleared: 0 },
			'odd-one': { cleared: 0 },
			'more-less': { cleared: 0 },
			opposites: { cleared: 0 },
			'read-word': { cleared: 0 },
			'small-big': { cleared: 0 },
			missing: { cleared: 0 },
			position: { cleared: 0 },
			'match-count': { cleared: 0 },
			pattern: { cleared: 0 },
			sides: { cleared: 0 },
			'shape-pattern': { cleared: 0 },
			'same-pair': { cleared: 0 },
			'next-number': { cleared: 0 },
			'abc-order': { cleared: 0 },
			'before-after': { cleared: 0 },
			rhyme: { cleared: 0 },
			syllable: { cleared: 0 },
			'sort-color': { cleared: 0 },
			'shadow-match': { cleared: 0 },
			'what-time': { cleared: 0 },
			seasons: { cleared: 0 },
			'days-week': { cleared: 0 },
			weather: { cleared: 0 }
		});
	});
});

describe('mute', () => {
	test('quiet by default, remembered once set', () => {
		const storage = memoryStorage();
		expect(loadMuted(storage)).toBe(false);
		saveMuted(true, storage);
		expect(loadMuted(storage)).toBe(true);
		saveMuted(false, storage);
		expect(loadMuted(storage)).toBe(false);
	});
});
