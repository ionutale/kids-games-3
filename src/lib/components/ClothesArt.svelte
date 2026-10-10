<script lang="ts">
	import type { ClothesId } from '#lib/dress-weather.js';

	let { clothes }: { clothes: ClothesId } = $props();
</script>

{#if clothes === 'hat'}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="52" rx="28" ry="8" fill="#e07070" />
		<path d="M22,52 Q22,28 40,24 Q58,28 58,52" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<rect x="18" y="48" width="44" height="8" rx="3" fill="#c04040" />
	</svg>
{:else if clothes === 'coat'}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M24,22 L18,68 Q40,74 62,68 L56,22 Q40,28 24,22 Z"
			fill="#4a7fc0"
			stroke="#2a5fa0"
			stroke-width="3"
		/>
		<path d="M40,28 L40,68" stroke="#2a5fa0" stroke-width="2.5" />
		<circle cx="34" cy="42" r="2.5" fill="#f5c84c" />
		<circle cx="34" cy="52" r="2.5" fill="#f5c84c" />
	</svg>
{:else if clothes === 'raincoat'}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M24,24 L18,66 Q40,72 62,66 L56,24 Q40,30 24,24 Z"
			fill="#6fbf73"
			stroke="#4a9a50"
			stroke-width="3"
		/>
		<path d="M28,20 Q40,12 52,20" fill="#6fbf73" stroke="#4a9a50" stroke-width="3" />
		<circle cx="46" cy="44" r="2.5" fill="#f5c84c" />
	</svg>
{:else if clothes === 'boots'}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M22,28 L22,58 Q22,66 36,66 L48,66 L48,54 L34,54 L34,28 Z"
			fill="#8b5a3c"
			stroke="#6a4020"
			stroke-width="3"
		/>
		<path
			d="M46,28 L46,58 Q46,66 60,66 L70,66 L70,54 L58,54 L58,28 Z"
			fill="#8b5a3c"
			stroke="#6a4020"
			stroke-width="3"
		/>
	</svg>
{:else if clothes === 'scarf'}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M18,36 Q40,22 62,36 Q54,48 40,46 Q26,48 18,36 Z"
			fill="#e07070"
			stroke="#c04040"
			stroke-width="3"
		/>
		<path d="M48,44 L58,70" stroke="#e07070" stroke-width="10" stroke-linecap="round" />
		<path d="M54,44 L66,68" stroke="#f5c84c" stroke-width="6" stroke-linecap="round" />
	</svg>
{:else}
	<svg class="clothes-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="26" cy="40" rx="12" ry="10" fill="#4a2c2a" />
		<ellipse cx="54" cy="40" rx="12" ry="10" fill="#4a2c2a" />
		<path d="M34,40 L46,40" stroke="#4a2c2a" stroke-width="4" />
		<circle cx="26" cy="40" r="4" fill="#7ec8e8" opacity="0.5" />
		<circle cx="54" cy="40" r="4" fill="#7ec8e8" opacity="0.5" />
	</svg>
{/if}
