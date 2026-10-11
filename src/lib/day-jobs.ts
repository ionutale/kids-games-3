/**
 * Pure rules for "Day jobs".
 * See a helper scene. Tap who helps — doctor, teacher, firefighter…
 */

export type JobId = 'doctor' | 'teacher' | 'firefighter' | 'cook' | 'farmer' | 'builder';

export type JobScene =
	| 'bandage'
	| 'book'
	| 'fire'
	| 'kitchen'
	| 'crops'
	| 'bricks';

export const SCENE_JOB: Record<JobScene, JobId> = {
	bandage: 'doctor',
	book: 'teacher',
	fire: 'firefighter',
	kitchen: 'cook',
	crops: 'farmer',
	bricks: 'builder'
};

export interface DayJobsRound {
	scene: JobScene;
	answer: JobId;
	options: JobId[];
}

export interface DayJobsLevelConfig {
	level: number;
	scenes: JobScene[];
	optionCount: number;
}

export const MAX_DAY_JOBS_LEVEL = 10;
export const DAY_JOBS_ROUNDS = 3;

const EARLY: JobScene[] = ['bandage', 'book', 'fire'];
const MID: JobScene[] = ['bandage', 'book', 'fire', 'kitchen', 'crops'];
const ALL: JobScene[] = ['bandage', 'book', 'fire', 'kitchen', 'crops', 'bricks'];

export const DAY_JOBS_LEVELS: DayJobsLevelConfig[] = [
	{ level: 1, scenes: EARLY, optionCount: 2 },
	{ level: 2, scenes: EARLY, optionCount: 2 },
	{ level: 3, scenes: EARLY, optionCount: 3 },
	{ level: 4, scenes: MID, optionCount: 3 },
	{ level: 5, scenes: MID, optionCount: 3 },
	{ level: 6, scenes: MID, optionCount: 4 },
	{ level: 7, scenes: ALL, optionCount: 4 },
	{ level: 8, scenes: ALL, optionCount: 4 },
	{ level: 9, scenes: ALL, optionCount: 5 },
	{ level: 10, scenes: ALL, optionCount: 5 }
];

export function getDayJobsLevel(level: number): DayJobsLevelConfig | undefined {
	return DAY_JOBS_LEVELS.find((entry) => entry.level === level);
}

function shuffled<T>(items: T[], rand: () => number): T[] {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export function pickRounds(
	config: DayJobsLevelConfig,
	rand: () => number = Math.random
): DayJobsRound[] {
	const scenes = shuffled(config.scenes, rand);
	const allJobs = shuffled(
		[...new Set(config.scenes.map((scene) => SCENE_JOB[scene]))],
		rand
	) as JobId[];
	return Array.from({ length: DAY_JOBS_ROUNDS }, (_, index) => {
		const scene = scenes[index % scenes.length];
		const answer = SCENE_JOB[scene];
		const distractors = allJobs.filter((job) => job !== answer);
		const options = shuffled(
			[answer, ...distractors.slice(0, Math.max(0, config.optionCount - 1))],
			rand
		);
		return { scene, answer, options };
	});
}
