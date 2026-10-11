<script lang="ts">
	import type { HomeAnimalId } from '#lib/animal-homes.js';
	import KindArt from '#lib/components/KindArt.svelte';

	let { animal }: { animal: HomeAnimalId } = $props();
</script>

{#if animal === 'bee'}
	<svg class="home-animal-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="42" rx="18" ry="14" fill="#f5c84c" stroke="#e0a820" stroke-width="3" />
		<path d="M28,36 H52 M28,42 H52 M28,48 H52" stroke="#4a2c2a" stroke-width="3" />
		<ellipse cx="22" cy="34" rx="10" ry="8" fill="#fff" stroke="#c8d8e8" stroke-width="2" opacity="0.85" />
		<ellipse cx="58" cy="34" rx="10" ry="8" fill="#fff" stroke="#c8d8e8" stroke-width="2" opacity="0.85" />
		<circle cx="34" cy="38" r="2.2" fill="#4a2c2a" />
		<circle cx="46" cy="38" r="2.2" fill="#4a2c2a" />
	</svg>
{:else}
	<span class="home-animal-wrap">
		<KindArt face={animal} />
	</span>
{/if}
