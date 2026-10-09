/**
 * Pure rules for "Feelings faces". The bunny shows an emotion and the
 * child taps the face that matches the prompt. Later levels prefer
 * easily confused pairs (sad/tired, angry/surprised).
 */

export type EmotionId = 'happy' | 'sad' | 'angry' | 'scared' | 'surprised' | 'tired';

export interface FeelingsLevelConfig {
	level: number;
	emotions: EmotionId[];
	/** Distractors prefer easily confused emotions. */
	tight: boolean;
}

export const MAX_FEELINGS_LEVEL = 10;
export const FEELINGS_ROUNDS_PER_LEVEL = 3;

const ALL: EmotionId[] = ['happy', 'sad', 'angry', 'scared', 'surprised', 'tired'];

export const FEELINGS_LEVELS: FeelingsLevelConfig[] = [
	{ level: 1, emotions: ['happy', 'sad', 'angry'], tight: false },
	{ level: 2, emotions: ['happy', 'sad', 'surprised'], tight: false },
	{ level: 3, emotions: ['happy', 'sad', 'angry', 'surprised'], tight: false },
	{ level: 4, emotions: ['happy', 'sad', 'angry', 'surprised', 'scared'], tight: false },
	{ level: 5, emotions: ['happy', 'sad', 'angry', 'surprised', 'scared', 'tired'], tight: false },
	{ level: 6, emotions: [...ALL], tight: false },
	{ level: 7, emotions: ['sad', 'tired', 'scared', 'happy'], tight: true },
	{ level: 8, emotions: ['angry', 'surprised', 'scared', 'happy'], tight: true },
	{ level: 9, emotions: [...ALL], tight: true },
	{ level: 10, emotions: [...ALL], tight: true }
];

/** Emotions kids mix up: preferred distractors on tight levels. */
export const CLOSE_FEELINGS: Record<EmotionId, EmotionId[]> = {
	happy: ['surprised'],
	sad: ['tired', 'scared'],
	angry: ['surprised', 'scared'],
	scared: ['surprised', 'sad', 'tired'],
	surprised: ['happy', 'scared'],
	tired: ['sad', 'scared']
};

export function getFeelingsLevel(level: number): FeelingsLevelConfig | undefined {
	return FEELINGS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Three different emotions for one level, in play order. */
export function pickEmotions(
	config: FeelingsLevelConfig,
	rand: () => number = Math.random
): EmotionId[] {
	return shuffled(config.emotions, rand).slice(0, FEELINGS_ROUNDS_PER_LEVEL);
}

/** Three faces: the right feeling plus two distractors. */
export function makeEmotionOptions(
	config: FeelingsLevelConfig,
	correct: EmotionId,
	rand: () => number = Math.random
): EmotionId[] {
	const others = config.emotions.filter((emotion) => emotion !== correct);
	if (!config.tight) return shuffled([correct, ...shuffled(others, rand).slice(0, 2)], rand);
	const close = CLOSE_FEELINGS[correct].filter((emotion) => others.includes(emotion));
	const rest = others.filter((emotion) => !close.includes(emotion));
	const distractors = [...shuffled(close, rand), ...shuffled(rest, rand)].slice(0, 2);
	return shuffled([correct, ...distractors], rand);
}
