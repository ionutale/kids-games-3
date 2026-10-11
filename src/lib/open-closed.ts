/** Open / closed — door, box, book → tap. */

export type OpenClosedId = 'open' | 'closed';

export type OpenClosedSubject =
	| 'door-open'
	| 'door-closed'
	| 'box-open'
	| 'box-closed'
	| 'book-open'
	| 'book-closed';

export const SUBJECT_ANSWER: Record<OpenClosedSubject, OpenClosedId> = {
	'door-open': 'open',
	'door-closed': 'closed',
	'box-open': 'open',
	'box-closed': 'closed',
	'book-open': 'open',
	'book-closed': 'closed'
};

export interface OpenClosedRound {
	subject: OpenClosedSubject;
	answer: OpenClosedId;
	options: OpenClosedId[];
}

export interface OpenClosedLevelConfig {
	level: number;
	subjects: OpenClosedSubject[];
}

export const MAX_OPEN_CLOSED_LEVEL = 10;
export const OPEN_CLOSED_ROUNDS = 3;

const EARLY: OpenClosedSubject[] = ['door-open', 'door-closed'];
const MID: OpenClosedSubject[] = ['door-open', 'door-closed', 'box-open', 'box-closed'];
const ALL: OpenClosedSubject[] = [
	'door-open',
	'door-closed',
	'box-open',
	'box-closed',
	'book-open',
	'book-closed'
];

export const OPEN_CLOSED_LEVELS: OpenClosedLevelConfig[] = [
	{ level: 1, subjects: EARLY },
	{ level: 2, subjects: EARLY },
	{ level: 3, subjects: EARLY },
	{ level: 4, subjects: MID },
	{ level: 5, subjects: MID },
	{ level: 6, subjects: MID },
	{ level: 7, subjects: ALL },
	{ level: 8, subjects: ALL },
	{ level: 9, subjects: ALL },
	{ level: 10, subjects: ALL }
];

export function getOpenClosedLevel(level: number): OpenClosedLevelConfig | undefined {
	return OPEN_CLOSED_LEVELS.find((entry) => entry.level === level);
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
	config: OpenClosedLevelConfig,
	rand: () => number = Math.random
): OpenClosedRound[] {
	const subjects = shuffled(config.subjects, rand);
	return Array.from({ length: OPEN_CLOSED_ROUNDS }, (_, index) => {
		const subject = subjects[index % subjects.length];
		return {
			subject,
			answer: SUBJECT_ANSWER[subject],
			options: shuffled(['open', 'closed'], rand)
		};
	});
}
