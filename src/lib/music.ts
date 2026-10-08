/**
 * Two looping tracks (home + game) with a short crossfade. The tracks are
 * supplied later as static files; a missing file stays quiet instead of
 * throwing. Browsers only allow sound after a tap, so `unlock()` runs on
 * the first pointer or key press.
 */

export type TrackName = 'home' | 'game';

const TRACK_SRC: Record<TrackName, string> = {
	home: '/music/home.mp3',
	game: '/music/game.mp3'
};

const FADE_MS = 500;
const VOLUME = 0.35;

export class MusicPlayer {
	private elements = new Map<TrackName, HTMLAudioElement>();
	private current: TrackName | null = null;
	private muted = false;
	private fadeTimer: ReturnType<typeof setInterval> | null = null;
	private available = new Map<TrackName, boolean>();

	constructor() {
		// Elements are created lazily so a missing file never breaks the page.
	}

	get isMuted(): boolean {
		return this.muted;
	}

	setMuted(muted: boolean): void {
		this.muted = muted;
		for (const element of this.elements.values()) {
			element.muted = muted;
		}
		if (muted) this.stopFade();
		else if (this.current) void this.playTrack(this.current, false);
	}

	private elementFor(track: TrackName): HTMLAudioElement | null {
		if (typeof Audio === 'undefined') return null;
		let element = this.elements.get(track);
		if (!element) {
			element = new Audio(TRACK_SRC[track]);
			element.loop = true;
			element.preload = 'auto';
			element.volume = 0;
			element.muted = this.muted;
			element.addEventListener('error', () => {
				this.available.set(track, false);
			});
			this.elements.set(track, element);
			this.available.set(track, true);
		}
		return element;
	}

	private stopFade(): void {
		if (this.fadeTimer) {
			clearInterval(this.fadeTimer);
			this.fadeTimer = null;
		}
	}

	private async playTrack(track: TrackName, fadeIn: boolean): Promise<void> {
		if (this.muted || this.available.get(track) === false) return;
		const element = this.elementFor(track);
		if (!element) return;
		try {
			if (element.paused) await element.play();
		} catch (error) {
			// Browsers block sound before the first tap; retry on unlock.
			if (error instanceof DOMException && error.name === 'NotAllowedError') return;
			this.available.set(track, false);
			return;
		}
		this.stopFade();
		if (!fadeIn) {
			element.volume = VOLUME;
			return;
		}
		const steps = 10;
		const step = VOLUME / steps;
		this.fadeTimer = setInterval(() => {
			if (element.volume + step >= VOLUME) {
				element.volume = VOLUME;
				this.stopFade();
			} else {
				element.volume = Math.min(VOLUME, element.volume + step);
			}
		}, FADE_MS / steps);
	}

	private fadeOut(track: TrackName): void {
		const element = this.elements.get(track);
		if (!element || element.paused) return;
		const steps = 10;
		const step = element.volume / steps || VOLUME / steps;
		const timer = setInterval(() => {
			if (element.volume - step <= 0) {
				element.volume = 0;
				element.pause();
				clearInterval(timer);
			} else {
				element.volume -= step;
			}
		}, FADE_MS / steps);
	}

	/** Call from the first user gesture; starts the current track quietly. */
	unlock(track: TrackName): void {
		if (this.current === null) this.current = track;
		if (!this.muted) void this.playTrack(this.current, false);
	}

	/** Switch loops when moving between home and the game. */
	switchTo(track: TrackName): void {
		if (this.current === track) return;
		if (this.current) this.fadeOut(this.current);
		this.current = track;
		if (!this.muted) void this.playTrack(track, true);
	}
}

/** Home pages play the home loop, everything under /play/ the game loop. */
export function trackForPath(pathname: string): TrackName {
	return pathname.includes('/play/') ? 'game' : 'home';
}
