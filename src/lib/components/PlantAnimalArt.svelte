<script lang="ts">
	import type { PlantAnimalSubject } from '#lib/plant-animal.js';
	import KindArt from '#lib/components/KindArt.svelte';

	let { subject }: { subject: PlantAnimalSubject } = $props();
</script>

{#if subject === 'dog' || subject === 'fish' || subject === 'bird'}
	<span class="plant-animal-art"><KindArt face={subject} /></span>
{:else if subject === 'leaf'}
	<svg class="plant-animal-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M40,10 C62,24 62,52 40,70 C18,52 18,24 40,10 Z" fill="#6fbf73" />
		<path d="M40,14 V66" stroke="#4a8a4a" stroke-width="3" />
	</svg>
{:else if subject === 'flower'}
	<svg class="plant-animal-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="34" r="10" fill="#f5c84c" />
		<circle cx="40" cy="18" r="8" fill="#e07070" /><circle cx="54" cy="28" r="8" fill="#e07070" />
		<circle cx="50" cy="44" r="8" fill="#e07070" /><circle cx="30" cy="44" r="8" fill="#e07070" />
		<circle cx="26" cy="28" r="8" fill="#e07070" />
		<rect x="37" y="44" width="6" height="24" fill="#5da85f" />
	</svg>
{:else}
	<svg class="plant-animal-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="36" y="40" width="8" height="28" fill="#8b5a3c" />
		<circle cx="40" cy="30" r="18" fill="#6fbf73" />
		<circle cx="28" cy="36" r="10" fill="#7fd18a" />
		<circle cx="52" cy="36" r="10" fill="#7fd18a" />
	</svg>
{/if}
