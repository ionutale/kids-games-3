<script lang="ts">
	import type { WeightObjectId } from '#lib/heavy-light.js';

	interface Props {
		object: WeightObjectId;
		/** Stagger index for the idle motion phase. */
		i?: number;
	}

	let { object, i = 0 }: Props = $props();
</script>

{#if object === 'feather'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M40,12 Q58,28 48,68 Q40,58 32,68 Q22,28 40,12 Z"
			fill="#f5e8c8"
			stroke="#d4c090"
			stroke-width="2.5"
		/>
		<path d="M40,16 L40,64" stroke="#c4a870" stroke-width="2" />
		<path d="M40,28 Q48,32 44,40" stroke="#c4a870" stroke-width="1.5" fill="none" />
		<path d="M40,40 Q32,44 36,52" stroke="#c4a870" stroke-width="1.5" fill="none" />
	</svg>
{:else if object === 'balloon'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<ellipse cx="40" cy="34" rx="18" ry="22" fill="#e07070" stroke="#c04040" stroke-width="3" />
		<path d="M40,56 L40,70" stroke="#888" stroke-width="2" />
		<path d="M36,56 L40,56 L44,56 L40,60 Z" fill="#c04040" />
	</svg>
{:else if object === 'leaf'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M40,14 Q62,30 52,62 Q40,54 28,62 Q18,30 40,14 Z"
			fill="#6fbf73"
			stroke="#4a9a50"
			stroke-width="3"
		/>
		<path d="M40,18 L40,58" stroke="#4a9a50" stroke-width="2" />
	</svg>
{:else if object === 'cotton'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="32" cy="38" r="14" fill="#fffdf7" stroke="#d4c8b0" stroke-width="2.5" />
		<circle cx="48" cy="36" r="14" fill="#fffdf7" stroke="#d4c8b0" stroke-width="2.5" />
		<circle cx="40" cy="48" r="12" fill="#fff8e8" stroke="#d4c8b0" stroke-width="2.5" />
	</svg>
{:else if object === 'apple'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<circle cx="40" cy="46" r="22" fill="#e07070" />
		<path d="M40,24 Q40,18 46,16" stroke="#6fbf73" stroke-width="4" fill="none" stroke-linecap="round" />
		<ellipse cx="48" cy="22" rx="8" ry="4" fill="#7fd18a" transform="rotate(20 48 22)" />
	</svg>
{:else if object === 'book'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="18" y="20" width="44" height="44" rx="3" fill="#4a7fc0" stroke="#2a5fa0" stroke-width="3" />
		<rect x="22" y="24" width="8" height="36" rx="1" fill="#f5c84c" />
		<path d="M34,32 H54 M34,40 H52 M34,48 H50" stroke="#fff8e8" stroke-width="2.5" stroke-linecap="round" />
	</svg>
{:else if object === 'shoe'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M16,44 Q16,32 28,30 L44,30 Q52,30 56,38 L68,42 Q72,44 72,50 L16,50 Z"
			fill="#8b5a3c"
			stroke="#6a4020"
			stroke-width="3"
		/>
		<path d="M28,30 L28,44" stroke="#6a4020" stroke-width="2" />
		<path d="M36,30 L36,44" stroke="#6a4020" stroke-width="2" />
	</svg>
{:else if object === 'rock'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path
			d="M22,48 Q18,32 32,24 Q48,18 58,28 Q66,40 58,54 Q44,64 28,58 Q20,54 22,48 Z"
			fill="#9a9aa8"
			stroke="#6a6a78"
			stroke-width="3"
		/>
	</svg>
{:else if object === 'brick'}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="14" y="28" width="52" height="28" rx="3" fill="#c45c3a" stroke="#a04028" stroke-width="3" />
		<path d="M14,42 H66 M40,28 V56" stroke="#a04028" stroke-width="2" />
	</svg>
{:else}
	<svg class="weight-art idle-bob" style="--mn-d:{(i % 6) * 140}ms" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<rect x="26" y="18" width="28" height="14" rx="2" fill="#6a6a78" stroke="#4a4a58" stroke-width="2.5" />
		<path d="M22,32 H58 L54,62 H26 Z" fill="#888898" stroke="#4a4a58" stroke-width="3" />
		<path d="M32,40 H48 M30,50 H50" stroke="#c0c0c8" stroke-width="2" />
	</svg>
{/if}
