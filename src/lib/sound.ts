/**
 * Warm cream-and-honey kids audio: soft pentatonic loops + gentle SFX.
 * Built with the Web Audio API so nothing breaks when mp3 files are missing.
 * Starts after the first tap; mute silences music and effects together.
 */

export type TrackName = 'home' | 'game';
export type SfxName = 'correct' | 'wrong' | 'win' | 'place' | 'tap';

/** C major pentatonic — soft, rounded, matches the cream/honey UI. */
const PENT = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25] as const;

const HOME_PATTERN = [0, 2, 4, 2, 3, 1, 4, 2] as const;
const GAME_PATTERN = [0, 1, 2, 4, 3, 2, 4, 5, 4, 2, 1, 0] as const;

const MUSIC_GAIN = 0.07;
const SFX_GAIN = 0.18;

export class SoundPlayer {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;
	private musicGain: GainNode | null = null;
	private sfxGain: GainNode | null = null;
	private muted = false;
	private current: TrackName | null = null;
	private nextNoteAt = 0;
	private timer: number | null = null;
	private step = 0;
	private unlocked = false;

	get isMuted(): boolean {
		return this.muted;
	}

	private ensureGraph(): boolean {
		if (typeof window === 'undefined') return false;
		const AC =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AC) return false;
		if (!this.ctx) {
			this.ctx = new AC();
			this.master = this.ctx.createGain();
			this.musicGain = this.ctx.createGain();
			this.sfxGain = this.ctx.createGain();
			this.musicGain.gain.value = MUSIC_GAIN;
			this.sfxGain.gain.value = SFX_GAIN;
			this.musicGain.connect(this.master);
			this.sfxGain.connect(this.master);
			this.master.connect(this.ctx.destination);
			this.applyMute();
		}
		return true;
	}

	private applyMute(): void {
		if (!this.master || !this.ctx) return;
		this.master.gain.setTargetAtTime(this.muted ? 0 : 1, this.ctx.currentTime, 0.03);
	}

	setMuted(muted: boolean): void {
		this.muted = muted;
		if (!this.ensureGraph()) return;
		this.applyMute();
		if (muted) this.stopLoop();
		else if (this.unlocked && this.current) this.startLoop(this.current);
	}

	/** Call from the first user gesture. */
	unlock(track: TrackName): void {
		if (!this.ensureGraph() || !this.ctx) return;
		this.unlocked = true;
		if (this.current === null) this.current = track;
		void this.ctx.resume();
		if (!this.muted) this.startLoop(this.current);
	}

	/** Crossfade-ish switch between shelf and in-game loops. */
	switchTo(track: TrackName): void {
		if (this.current === track) return;
		this.current = track;
		this.step = 0;
		if (!this.unlocked || this.muted) return;
		if (!this.ensureGraph() || !this.ctx || !this.musicGain) return;
		const now = this.ctx.currentTime;
		this.musicGain.gain.cancelScheduledValues(now);
		this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
		this.musicGain.gain.linearRampToValueAtTime(0, now + 0.25);
		this.musicGain.gain.linearRampToValueAtTime(MUSIC_GAIN, now + 0.55);
		this.startLoop(track);
	}

	private stopLoop(): void {
		if (this.timer !== null) {
			clearInterval(this.timer);
			this.timer = null;
		}
	}

	private startLoop(track: TrackName): void {
		this.stopLoop();
		if (!this.ctx) return;
		this.nextNoteAt = this.ctx.currentTime + 0.05;
		this.step = 0;
		const beat = track === 'home' ? 0.55 : 0.42;
		this.timer = window.setInterval(() => this.scheduleAhead(track, beat), 80);
		this.scheduleAhead(track, beat);
	}

	private scheduleAhead(track: TrackName, beat: number): void {
		if (!this.ctx || this.muted || !this.musicGain) return;
		const horizon = this.ctx.currentTime + 0.2;
		const pattern = track === 'home' ? HOME_PATTERN : GAME_PATTERN;
		while (this.nextNoteAt < horizon) {
			const idx = pattern[this.step % pattern.length];
			const freq = PENT[idx];
			const soft = track === 'home' || this.step % 4 !== 0;
			this.tone(freq, this.nextNoteAt, soft ? 0.45 : 0.28, soft ? 0.045 : 0.06, this.musicGain);
			if (track === 'game' && this.step % 4 === 0) {
				this.tone(freq * 0.5, this.nextNoteAt, 0.35, 0.03, this.musicGain);
			}
			this.nextNoteAt += beat;
			this.step += 1;
		}
	}

	private tone(
		freq: number,
		when: number,
		duration: number,
		peak: number,
		dest: GainNode
	): void {
		if (!this.ctx) return;
		const osc = this.ctx.createOscillator();
		const gain = this.ctx.createGain();
		osc.type = 'sine';
		osc.frequency.setValueAtTime(freq, when);
		gain.gain.setValueAtTime(0.0001, when);
		gain.gain.exponentialRampToValueAtTime(peak, when + 0.04);
		gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
		osc.connect(gain);
		gain.connect(dest);
		osc.start(when);
		osc.stop(when + duration + 0.02);
	}

	play(name: SfxName): void {
		if (!this.unlocked || this.muted) return;
		if (!this.ensureGraph() || !this.ctx || !this.sfxGain) return;
		void this.ctx.resume();
		const t = this.ctx.currentTime + 0.01;
		const dest = this.sfxGain;
		if (name === 'tap') {
			this.tone(PENT[2], t, 0.08, 0.05, dest);
			return;
		}
		if (name === 'place') {
			this.tone(PENT[3], t, 0.12, 0.09, dest);
			this.tone(PENT[4], t + 0.06, 0.14, 0.07, dest);
			return;
		}
		if (name === 'correct') {
			this.tone(PENT[2], t, 0.14, 0.11, dest);
			this.tone(PENT[4], t + 0.09, 0.16, 0.1, dest);
			this.tone(PENT[5], t + 0.18, 0.22, 0.09, dest);
			return;
		}
		if (name === 'wrong') {
			// Soft low blip — no harsh buzz; Lumi never scolds.
			this.tone(220, t, 0.16, 0.07, dest);
			this.tone(196, t + 0.08, 0.18, 0.05, dest);
			return;
		}
		// win — little honey sparkle
		this.tone(PENT[2], t, 0.14, 0.1, dest);
		this.tone(PENT[3], t + 0.1, 0.14, 0.1, dest);
		this.tone(PENT[4], t + 0.2, 0.16, 0.11, dest);
		this.tone(PENT[5], t + 0.32, 0.28, 0.12, dest);
		this.tone(PENT[5] * 1.5, t + 0.4, 0.3, 0.06, dest);
	}
}

/** Kept name so the layout and any older imports keep working. */
export class MusicPlayer extends SoundPlayer {}

let shared: SoundPlayer | null = null;

export function getSound(): SoundPlayer {
	if (!shared) shared = new SoundPlayer();
	return shared;
}

export function playSfx(name: SfxName): void {
	getSound().play(name);
}

/** Home pages play the home loop, everything under /play/ the game loop. */
export function trackForPath(pathname: string): TrackName {
	return pathname.includes('/play/') ? 'game' : 'home';
}
