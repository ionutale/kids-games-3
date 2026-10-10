<script lang="ts">
	import type { SetFaceId } from '#lib/complete-set.js';
	import { isFruitFace } from '#lib/complete-set.js';
	import FruitArt from '#lib/components/FruitArt.svelte';

	let { face }: { face: SetFaceId } = $props();
</script>

{#if isFruitFace(face)}
	<FruitArt fruit={face} />
{:else if face === 'ball'}
	<svg class="set-face-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="42" r="24" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<path d="M18,42 Q40,28 62,42" stroke="#fff" stroke-width="3" fill="none" opacity="0.5" />
		<path d="M40,18 L40,66" stroke="#fff" stroke-width="2.5" opacity="0.45" />
	</svg>
{:else if face === 'star'}
	<svg class="set-face-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M40,12 L46,32 L68,32 L50,44 L56,64 L40,52 L24,64 L30,44 L12,32 L34,32 Z"
			fill="#f5c84c"
			stroke="#e0a820"
			stroke-width="3"
			stroke-linejoin="round"
		/>
	</svg>
{:else if face === 'heart'}
	<svg class="set-face-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M40,66 C40,66 14,48 14,32 C14,22 22,16 30,16 C35,16 38,19 40,24 C42,19 45,16 50,16 C58,16 66,22 66,32 C66,48 40,66 40,66 Z"
			fill="#f070a0"
			stroke="#d04070"
			stroke-width="3"
		/>
	</svg>
{:else}
	<svg class="set-face-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="18" y="18" width="20" height="20" rx="3" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="2.5" />
		<rect x="42" y="18" width="20" height="20" rx="3" fill="#f5c84c" stroke="#e0a820" stroke-width="2.5" />
		<rect x="18" y="42" width="20" height="20" rx="3" fill="#6fbf73" stroke="#4a9a50" stroke-width="2.5" />
		<rect x="42" y="42" width="20" height="20" rx="3" fill="#e07070" stroke="#c04040" stroke-width="2.5" />
	</svg>
{/if}
