/**
 * One child's progress on this device. Storage is injected so the pure
 * functions stay unit-testable in Node; components pass `localStorage`.
 */

export const PROGRESS_KEY = 'lumi-progress';
export const MUTE_KEY = 'lumi-mute';

export interface GameProgress {
	cleared: number;
}

export type GameId =
	| 'count-fruit'
	| 'color-shapes'
	| 'feelings'
	| 'letters'
	| 'adding'
	| 'wash-hands'
	| 'brush-teeth'
	| 'bath'
	| 'subtract'
	| 'memory'
	| 'odd-one'
	| 'more-less'
	| 'opposites'
	| 'read-word'
	| 'small-big'
	| 'missing'
	| 'position'
	| 'match-count'
	| 'pattern'
	| 'sides'
	| 'shape-pattern'
	| 'same-pair'
	| 'next-number'
	| 'abc-order'
	| 'before-after'
	| 'rhyme'
	| 'syllable'
	| 'sort-color'
	| 'shadow-match'
	| 'what-time'
	| 'seasons'
	| 'days-week'
	| 'weather'
	| 'left-right'
	| 'jigsaw'
	| 'one-less'
	| 'one-more'
	| 'months'
	| 'skip-count'
	| 'sort-kind'
	| 'half-share';

export interface Progress {
	'count-fruit': GameProgress;
	'color-shapes': GameProgress;
	feelings: GameProgress;
	letters: GameProgress;
	adding: GameProgress;
	'wash-hands': GameProgress;
	'brush-teeth': GameProgress;
	bath: GameProgress;
	subtract: GameProgress;
	memory: GameProgress;
	'odd-one': GameProgress;
	'more-less': GameProgress;
	opposites: GameProgress;
	'read-word': GameProgress;
	'small-big': GameProgress;
	missing: GameProgress;
	position: GameProgress;
	'match-count': GameProgress;
	pattern: GameProgress;
	sides: GameProgress;
	'shape-pattern': GameProgress;
	'same-pair': GameProgress;
	'next-number': GameProgress;
	'abc-order': GameProgress;
	'before-after': GameProgress;
	rhyme: GameProgress;
	syllable: GameProgress;
	'sort-color': GameProgress;
	'shadow-match': GameProgress;
	'what-time': GameProgress;
	seasons: GameProgress;
	'days-week': GameProgress;
	weather: GameProgress;
	'left-right': GameProgress;
	jigsaw: GameProgress;
	'one-less': GameProgress;
	'one-more': GameProgress;
	months: GameProgress;
	'skip-count': GameProgress;
	'sort-kind': GameProgress;
	'half-share': GameProgress;
}

export interface KeyValueStorage {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export function defaultProgress(): Progress {
	return {
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
		weather: { cleared: 0 },
		'left-right': { cleared: 0 },
		jigsaw: { cleared: 0 },
		'one-less': { cleared: 0 },
		'one-more': { cleared: 0 },
		months: { cleared: 0 },
		'skip-count': { cleared: 0 },
		'sort-kind': { cleared: 0 },
		'half-share': { cleared: 0 }
	};
}

function sanitizeCleared(value: unknown): number {
	if (typeof value !== 'number' || !Number.isInteger(value)) return 0;
	return Math.min(10, Math.max(0, value));
}

function sanitizeGame(value: unknown): GameProgress {
	if (typeof value !== 'object' || value === null) return { cleared: 0 };
	return { cleared: sanitizeCleared((value as Record<string, unknown>).cleared) };
}

export function loadProgress(storage?: KeyValueStorage | null): Progress {
	if (!storage) return defaultProgress();
	try {
		const raw = storage.getItem(PROGRESS_KEY);
		if (!raw) return defaultProgress();
		const parsed: unknown = JSON.parse(raw);
		if (typeof parsed !== 'object' || parsed === null) return defaultProgress();
		const games = parsed as Record<string, unknown>;
		return {
			'count-fruit': sanitizeGame(games['count-fruit']),
			'color-shapes': sanitizeGame(games['color-shapes']),
			feelings: sanitizeGame(games['feelings']),
			letters: sanitizeGame(games['letters']),
			adding: sanitizeGame(games['adding']),
			'wash-hands': sanitizeGame(games['wash-hands']),
			'brush-teeth': sanitizeGame(games['brush-teeth']),
			bath: sanitizeGame(games['bath']),
			subtract: sanitizeGame(games['subtract']),
			memory: sanitizeGame(games['memory']),
			'odd-one': sanitizeGame(games['odd-one']),
			'more-less': sanitizeGame(games['more-less']),
			opposites: sanitizeGame(games['opposites']),
			'read-word': sanitizeGame(games['read-word']),
			'small-big': sanitizeGame(games['small-big']),
			missing: sanitizeGame(games['missing']),
			position: sanitizeGame(games['position']),
			'match-count': sanitizeGame(games['match-count']),
			pattern: sanitizeGame(games['pattern']),
			sides: sanitizeGame(games['sides']),
			'shape-pattern': sanitizeGame(games['shape-pattern']),
			'same-pair': sanitizeGame(games['same-pair']),
			'next-number': sanitizeGame(games['next-number']),
			'abc-order': sanitizeGame(games['abc-order']),
			'before-after': sanitizeGame(games['before-after']),
			rhyme: sanitizeGame(games['rhyme']),
			syllable: sanitizeGame(games['syllable']),
			'sort-color': sanitizeGame(games['sort-color']),
			'shadow-match': sanitizeGame(games['shadow-match']),
			'what-time': sanitizeGame(games['what-time']),
			seasons: sanitizeGame(games.seasons),
			'days-week': sanitizeGame(games['days-week']),
			weather: sanitizeGame(games.weather),
			'left-right': sanitizeGame(games['left-right']),
			jigsaw: sanitizeGame(games.jigsaw),
			'one-less': sanitizeGame(games['one-less']),
			'one-more': sanitizeGame(games['one-more']),
			months: sanitizeGame(games.months),
			'skip-count': sanitizeGame(games['skip-count']),
			'sort-kind': sanitizeGame(games['sort-kind']),
			'half-share': sanitizeGame(games['half-share'])
		};
	} catch {
		return defaultProgress();
	}
}

export function saveProgress(progress: Progress, storage: KeyValueStorage): void {
	storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

/** Record a finished level. Returns the new cleared count. */
export function clearLevel(progress: Progress, game: GameId, level: number): number {
	const next = Math.max(progress[game].cleared, level);
	progress[game].cleared = Math.min(10, next);
	return progress[game].cleared;
}

export function loadMuted(storage?: KeyValueStorage | null): boolean {
	if (!storage) return false;
	return storage.getItem(MUTE_KEY) === '1';
}

export function saveMuted(muted: boolean, storage: KeyValueStorage): void {
	storage.setItem(MUTE_KEY, muted ? '1' : '0');
}
