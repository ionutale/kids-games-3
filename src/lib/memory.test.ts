import { describe, expect, test } from 'vitest';
import { MAX_MEMORY_LEVEL, dealMemory, faceKey, getMemoryLevel, pairCounts } from './memory';

describe('memory levels', () => {
	test('ten levels with distinct faces', () => {
		expect(MAX_MEMORY_LEVEL).toBe(10);
		for (let level = 1; level <= 10; level++) {
			const config = getMemoryLevel(level)!;
			expect(config.faces.length).toBeGreaterThanOrEqual(2);
			expect(new Set(config.faces.map(faceKey)).size).toBe(config.faces.length);
		}
		expect(getMemoryLevel(1)!.faces).toHaveLength(2);
		expect(getMemoryLevel(10)!.faces).toHaveLength(8);
		expect(getMemoryLevel(11)).toBeUndefined();
	});
});

describe('dealMemory', () => {
	test('every face appears exactly twice', () => {
		for (let level = 1; level <= 10; level++) {
			const faces = getMemoryLevel(level)!.faces;
			const deck = dealMemory(faces, () => 0.4);
			expect(deck).toHaveLength(faces.length * 2);
			for (const count of pairCounts(deck).values()) {
				expect(count).toBe(2);
			}
		}
	});
});
