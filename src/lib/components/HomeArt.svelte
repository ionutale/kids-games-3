<script lang="ts">
	import type { HomeId } from '#lib/animal-homes.js';

	let { home }: { home: HomeId } = $props();
</script>

{#if home === 'nest'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="52" rx="28" ry="14" fill="#c4a060" stroke="#a08040" stroke-width="3" />
		<ellipse cx="40" cy="48" rx="20" ry="8" fill="#8b5a3c" />
		<ellipse cx="36" cy="46" rx="5" ry="6" fill="#fff8e8" />
		<ellipse cx="44" cy="46" rx="5" ry="6" fill="#fff8e8" />
	</svg>
{:else if home === 'water'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="48" rx="30" ry="16" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<path d="M20,48 Q30,40 40,48 Q50,56 60,48" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.6" />
		<ellipse cx="28" cy="36" rx="6" ry="4" fill="#a0d8f0" opacity="0.7" />
	</svg>
{:else if home === 'burrow'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M10,58 Q40,20 70,58 Z" fill="#8b9a4a" stroke="#6a7a30" stroke-width="3" />
		<ellipse cx="40" cy="52" rx="14" ry="10" fill="#4a2c2a" />
		<path d="M10,58 H70" stroke="#6a5020" stroke-width="4" stroke-linecap="round" />
	</svg>
{:else if home === 'kennel'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M16,40 L40,18 L64,40" fill="#e8a04a" stroke="#c47a28" stroke-width="3" stroke-linejoin="round" />
		<rect x="20" y="40" width="40" height="28" rx="2" fill="#f4d6a8" stroke="#d4a574" stroke-width="3" />
		<path d="M32,68 Q40,48 48,68 Z" fill="#4a2c2a" />
	</svg>
{:else if home === 'cave'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M12,62 Q16,28 40,22 Q64,28 68,62 Z"
			fill="#9a9aa8"
			stroke="#6a6a78"
			stroke-width="3"
		/>
		<ellipse cx="40" cy="52" rx="14" ry="16" fill="#3a3a48" />
	</svg>
{:else if home === 'hive'}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="28" rx="18" ry="10" fill="#f5c84c" stroke="#e0a820" stroke-width="2.5" />
		<ellipse cx="40" cy="40" rx="22" ry="12" fill="#f0d070" stroke="#e0a820" stroke-width="2.5" />
		<ellipse cx="40" cy="54" rx="18" ry="10" fill="#f5c84c" stroke="#e0a820" stroke-width="2.5" />
		<ellipse cx="40" cy="42" rx="5" ry="4" fill="#6a4020" />
	</svg>
{:else}
	<svg class="home-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="48" rx="26" ry="16" fill="#f5a0c0" stroke="#d07090" stroke-width="3" />
		<path d="M20,48 Q40,28 60,48" fill="#ffc0d8" stroke="#d07090" stroke-width="2" />
		<circle cx="32" cy="44" r="3" fill="#fff" opacity="0.5" />
	</svg>
{/if}
