<script lang="ts">
	import type { SoundWord } from '#lib/first-sound.js';
	import KindArt from '#lib/components/KindArt.svelte';
	import DayNightArt from '#lib/components/DayNightArt.svelte';

	let { word }: { word: SoundWord } = $props();
</script>

{#if word === 'dog' || word === 'cat' || word === 'fish' || word === 'ball' || word === 'apple'}
	<span class="first-sound-art"><KindArt face={word} /></span>
{:else if word === 'sun'}
	<span class="first-sound-art"><DayNightArt scene="sunny" /></span>
{:else if word === 'moon'}
	<span class="first-sound-art"><DayNightArt scene="moon" /></span>
{:else}
	<svg class="first-sound-art idle-sway" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="36" y="40" width="8" height="28" fill="#8b5a3c" />
		<circle cx="40" cy="30" r="18" fill="#6fbf73" />
	</svg>
{/if}
