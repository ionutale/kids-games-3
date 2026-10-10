/**
 * Music entry point. Loops and SFX live in `sound.ts` (Web Audio).
 * Re-exported here so older imports keep working.
 */

export {
	MusicPlayer,
	SoundPlayer,
	getSound,
	playSfx,
	trackForPath,
	type TrackName,
	type SfxName
} from './sound.js';
