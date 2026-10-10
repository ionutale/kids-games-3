<script lang="ts">
	import type { PlaceId } from '#lib/map-places.js';

	let { place }: { place: PlaceId } = $props();
</script>

{#if place === 'home'}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M12,40 L40,14 L68,40" fill="none" stroke="#c45c3a" stroke-width="5" stroke-linejoin="round" />
		<rect x="20" y="40" width="40" height="28" rx="3" fill="#f4d6a8" stroke="#d4a574" stroke-width="3" />
		<rect x="34" y="48" width="12" height="20" rx="2" fill="#7ec8e8" />
		<circle cx="42" cy="58" r="1.6" fill="#4a2c2a" />
	</svg>
{:else if place === 'school'}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="14" y="28" width="52" height="36" rx="4" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<path d="M10,28 L40,12 L70,28" fill="#e8a04a" stroke="#c47a28" stroke-width="3" stroke-linejoin="round" />
		<rect x="34" y="42" width="12" height="22" rx="2" fill="#fff8e8" />
		<rect x="20" y="36" width="10" height="8" rx="1" fill="#fff8e8" />
		<rect x="50" y="36" width="10" height="8" rx="1" fill="#fff8e8" />
	</svg>
{:else if place === 'park'}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="62" rx="28" ry="8" fill="#b8e0a0" />
		<rect x="36" y="40" width="8" height="22" rx="2" fill="#8b5a3c" />
		<circle cx="40" cy="32" r="16" fill="#6fbf73" />
		<circle cx="28" cy="36" r="10" fill="#7fd18a" />
		<circle cx="52" cy="36" r="10" fill="#7fd18a" />
	</svg>
{:else if place === 'store'}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="16" y="34" width="48" height="30" rx="3" fill="#f0c060" stroke="#d4a020" stroke-width="3" />
		<path d="M14,34 L22,22 L58,22 L66,34 Z" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<rect x="34" y="44" width="12" height="20" rx="2" fill="#fff8e8" />
		<rect x="22" y="42" width="8" height="8" rx="1" fill="#7ec8e8" />
		<rect x="50" y="42" width="8" height="8" rx="1" fill="#7ec8e8" />
	</svg>
{:else if place === 'library'}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="18" y="22" width="44" height="42" rx="4" fill="#d4b896" stroke="#a07850" stroke-width="3" />
		<rect x="24" y="30" width="8" height="28" rx="1" fill="#e07070" />
		<rect x="36" y="30" width="8" height="28" rx="1" fill="#7ec8e8" />
		<rect x="48" y="30" width="8" height="28" rx="1" fill="#6fbf73" />
	</svg>
{:else}
	<svg class="place-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="52" rx="30" ry="12" fill="#7ec8e8" />
		<path d="M14,48 Q28,28 40,36 Q52,28 66,48" fill="#f4e0a0" stroke="#e0c060" stroke-width="2" />
		<circle cx="58" cy="22" r="8" fill="#f5c84c" />
	</svg>
{/if}
