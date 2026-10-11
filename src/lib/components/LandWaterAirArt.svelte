<script lang="ts">
	import type { HabitatSubject } from '#lib/land-water-air.js';
	import KindArt from '#lib/components/KindArt.svelte';
	import HomeAnimalArt from '#lib/components/HomeAnimalArt.svelte';

	let { subject }: { subject: HabitatSubject } = $props();
</script>

{#if subject === 'dog' || subject === 'bunny' || subject === 'fish' || subject === 'bird' || subject === 'bee'}
	<span class="habitat-subject">
		{#if subject === 'bee'}
			<HomeAnimalArt animal="bee" />
		{:else if subject === 'dog'}
			<KindArt face="dog" />
		{:else if subject === 'bunny'}
			<KindArt face="bunny" />
		{:else if subject === 'fish'}
			<KindArt face="fish" />
		{:else}
			<KindArt face="bird" />
		{/if}
	</span>
{:else if subject === 'duck'}
	<svg class="habitat-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="58" rx="28" ry="8" fill="#7ec8e8" opacity="0.7" />
		<ellipse cx="38" cy="44" rx="18" ry="12" fill="#f5c84c" stroke="#e0a820" stroke-width="3" />
		<circle cx="52" cy="34" r="10" fill="#f5c84c" stroke="#e0a820" stroke-width="3" />
		<path d="M58,34 L72,36 L58,40 Z" fill="#e07040" />
		<circle cx="55" cy="32" r="2" fill="#4a2c2a" />
	</svg>
{:else if subject === 'car'}
	<svg class="habitat-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="12" y="38" width="56" height="20" rx="6" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<path d="M22,38 L30,24 H50 L58,38 Z" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<circle cx="24" cy="58" r="8" fill="#4a2c2a" />
		<circle cx="56" cy="58" r="8" fill="#4a2c2a" />
		<circle cx="24" cy="58" r="3" fill="#c8c0b0" />
		<circle cx="56" cy="58" r="3" fill="#c8c0b0" />
	</svg>
{:else if subject === 'boat'}
	<svg class="habitat-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="62" rx="30" ry="8" fill="#7ec8e8" />
		<path d="M14,48 L66,48 L58,62 H22 Z" fill="#c45c3a" stroke="#a04028" stroke-width="3" />
		<rect x="38" y="22" width="5" height="26" fill="#8b5a3c" />
		<path d="M43,24 L62,36 L43,36 Z" fill="#fff8e0" stroke="#e0d0a0" stroke-width="2" />
	</svg>
{:else}
	<svg class="habitat-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="48" rx="28" ry="10" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<path d="M20,48 L40,22 L60,48 Z" fill="#e8f0f8" stroke="#4a8fc0" stroke-width="3" />
		<circle cx="52" cy="40" r="3" fill="#f5c84c" />
		<path d="M28,48 Q40,56 52,48" fill="none" stroke="#4a8fc0" stroke-width="2" />
	</svg>
{/if}
