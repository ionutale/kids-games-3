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
	test('starts with nothing cleared', () => {
		expect(defaultProgress()).toEqual({ 'count-fruit': { cleared: 0 } });
		expect(loadProgress(memoryStorage())).toEqual(defaultProgress());
		expect(loadProgress(null)).toEqual(defaultProgress());
	});

	test('clearing a level never moves backwards', () => {
		const progress = defaultProgress();
		expect(clearLevel(progress, 1)).toBe(1);
		expect(clearLevel(progress, 1)).toBe(1);
		expect(clearLevel(progress, 3)).toBe(3);
	});

	test('progress survives a save and load round trip', () => {
		const storage = memoryStorage();
		const progress = defaultProgress();
		clearLevel(progress, 2);
		saveProgress(progress, storage);
		expect(loadProgress(storage)).toEqual({ 'count-fruit': { cleared: 2 } });
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
		).toEqual({ 'count-fruit': { cleared: 10 } });
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
