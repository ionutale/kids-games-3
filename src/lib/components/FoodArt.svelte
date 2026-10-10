<script lang="ts">
	import type { FoodId } from '#lib/healthy-choice.js';

	let { food }: { food: FoodId } = $props();
</script>

{#if food === 'apple'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="46" r="22" fill="#e07070" />
		<path d="M40,24 Q40,18 46,16" stroke="#6fbf73" stroke-width="4" fill="none" stroke-linecap="round" />
		<ellipse cx="48" cy="22" rx="8" ry="4" fill="#7fd18a" transform="rotate(20 48 22)" />
	</svg>
{:else if food === 'banana'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M22,28 Q18,50 30,62 Q48,70 60,52 Q52,58 38,52 Q28,46 28,30 Z"
			fill="#f5c84c"
			stroke="#e0a820"
			stroke-width="3"
		/>
	</svg>
{:else if food === 'carrot'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M40,28 L52,68 L28,68 Z" fill="#f08a40" stroke="#d07020" stroke-width="3" />
		<path d="M34,28 Q40,12 46,28" stroke="#6fbf73" stroke-width="4" fill="none" />
		<path d="M36,26 Q30,14 34,22" stroke="#7fd18a" stroke-width="3" fill="none" />
	</svg>
{:else if food === 'water'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M28,22 L32,58 Q40,68 48,58 L52,22 Z" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<rect x="30" y="18" width="20" height="8" rx="2" fill="#a0d8f0" />
		<path d="M34,40 Q40,46 46,40" stroke="#fff" stroke-width="2" fill="none" opacity="0.7" />
	</svg>
{:else if food === 'milk'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M30,20 L28,62 Q40,70 52,62 L50,20 Z" fill="#fffdf7" stroke="#d4c8b0" stroke-width="3" />
		<rect x="32" y="14" width="16" height="10" rx="2" fill="#7ec8e8" />
		<ellipse cx="40" cy="42" rx="8" ry="10" fill="#f0e8d8" />
	</svg>
{:else if food === 'broccoli'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="34" y="44" width="12" height="20" rx="3" fill="#8b9a4a" />
		<circle cx="32" cy="36" r="12" fill="#6fbf73" />
		<circle cx="48" cy="36" r="12" fill="#6fbf73" />
		<circle cx="40" cy="28" r="12" fill="#7fd18a" />
	</svg>
{:else if food === 'grapes'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="34" cy="36" r="9" fill="#9b6ec8" />
		<circle cx="48" cy="36" r="9" fill="#8a5cb8" />
		<circle cx="40" cy="48" r="9" fill="#a878d0" />
		<path d="M40,22 L40,30" stroke="#6fbf73" stroke-width="3" stroke-linecap="round" />
	</svg>
{:else if food === 'pear'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M40,22 Q28,30 28,44 Q28,62 40,66 Q52,62 52,44 Q52,30 40,22 Z"
			fill="#c8e070"
			stroke="#90b040"
			stroke-width="3"
		/>
		<path d="M40,18 L40,26" stroke="#8b5a3c" stroke-width="3" stroke-linecap="round" />
	</svg>
{:else if food === 'candy'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="40" rx="14" ry="12" fill="#f070a0" />
		<path d="M26,40 L12,28 L14,40 L12,52 Z" fill="#f5a0c0" />
		<path d="M54,40 L68,28 L66,40 L68,52 Z" fill="#f5a0c0" />
	</svg>
{:else if food === 'cookie'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="42" r="22" fill="#d4a060" />
		<circle cx="32" cy="36" r="3" fill="#6b4420" />
		<circle cx="46" cy="34" r="3" fill="#6b4420" />
		<circle cx="38" cy="48" r="3" fill="#6b4420" />
		<circle cx="50" cy="48" r="2.5" fill="#6b4420" />
	</svg>
{:else if food === 'soda'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="28" y="22" width="24" height="44" rx="4" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<rect x="30" y="18" width="20" height="8" rx="2" fill="#a0a0a0" />
		<ellipse cx="40" cy="40" rx="6" ry="10" fill="#fff" opacity="0.35" />
	</svg>
{:else if food === 'chips'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="42" rx="20" ry="14" fill="#f5c84c" stroke="#e0a820" stroke-width="3" transform="rotate(-15 40 42)" />
		<ellipse cx="36" cy="36" rx="16" ry="11" fill="#f0d070" stroke="#e0a820" stroke-width="2" transform="rotate(10 36 36)" />
	</svg>
{:else if food === 'donut'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="42" r="22" fill="#f5a0c0" />
		<circle cx="40" cy="42" r="8" fill="#fff8e8" />
		<circle cx="28" cy="34" r="2" fill="#7ec8e8" />
		<circle cx="48" cy="32" r="2" fill="#f5c84c" />
		<circle cx="52" cy="46" r="2" fill="#6fbf73" />
	</svg>
{:else if food === 'ice-cream'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M28,42 L40,70 L52,42 Z" fill="#e8b878" stroke="#c49858" stroke-width="3" />
		<circle cx="40" cy="34" r="16" fill="#f5a0c0" />
		<circle cx="34" cy="28" r="3" fill="#fff" opacity="0.5" />
	</svg>
{:else if food === 'cake'}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="18" y="40" width="44" height="22" rx="3" fill="#f5c8d8" stroke="#e090a8" stroke-width="3" />
		<path d="M18,40 Q40,28 62,40" fill="#fff8e8" stroke="#e0d0b0" stroke-width="2" />
		<rect x="38" y="22" width="4" height="12" fill="#f5c84c" />
		<circle cx="40" cy="20" r="4" fill="#e07070" />
	</svg>
{:else}
	<svg class="food-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M40,22 L40,58" stroke="#7ec8e8" stroke-width="4" stroke-linecap="round" />
		<circle cx="40" cy="58" r="12" fill="#f070a0" />
		<path d="M28,58 Q40,48 52,58" fill="#ff90b8" />
	</svg>
{/if}
