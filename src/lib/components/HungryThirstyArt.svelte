<script lang="ts">
	import type { HungryThirstyCue } from '#lib/hungry-thirsty.js';
	import KindArt from '#lib/components/KindArt.svelte';
	let { cue }: { cue: HungryThirstyCue } = $props();
</script>

{#if cue === 'apple' || cue === 'cookie' || cue === 'bread'}
	<span class="hunger-art"><KindArt face={cue === 'bread' ? 'bread' : cue} /></span>
{:else if cue === 'water'}
	<svg class="hunger-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M28,20 H52 L48,64 H32 Z" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
		<path d="M32,36 Q40,44 48,36" fill="#5aa0d0" opacity="0.7" />
	</svg>
{:else if cue === 'juice'}
	<svg class="hunger-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M28,20 H52 L48,64 H32 Z" fill="#f0a040" stroke="#d08020" stroke-width="3" />
		<rect x="36" y="12" width="8" height="10" fill="#e8d0b0" />
	</svg>
{:else}
	<svg class="hunger-art" viewBox="0 0 80 80" role="img" aria-hidden="true">
		<path d="M30,22 H50 L46,62 H34 Z" fill="#fff8e8" stroke="#d4c4a0" stroke-width="3" />
		<ellipse cx="40" cy="38" rx="8" ry="4" fill="#fff" opacity="0.7" />
	</svg>
{/if}
