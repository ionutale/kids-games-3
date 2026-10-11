<script lang="ts">
	import type { SenseCue } from '#lib/five-senses.js';
	import KindArt from '#lib/components/KindArt.svelte';
	let { cue }: { cue: SenseCue } = $props();
</script>

<span class="senses-art pulse">
	{#if cue === 'cookie'}
		<KindArt face="cookie" />
	{:else if cue === 'rainbow'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<path d="M10,50 Q40,10 70,50" fill="none" stroke="#e07070" stroke-width="5" />
			<path d="M16,50 Q40,18 64,50" fill="none" stroke="#f5c84c" stroke-width="5" />
			<path d="M22,50 Q40,26 58,50" fill="none" stroke="#6fbf73" stroke-width="5" />
			<path d="M28,50 Q40,34 52,50" fill="none" stroke="#7ec8e8" stroke-width="5" />
		</svg>
	{:else if cue === 'book'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<rect x="16" y="18" width="48" height="44" rx="4" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
			<path d="M40,18 V62" stroke="#4a8fc0" stroke-width="3" />
		</svg>
	{:else if cue === 'drum'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<ellipse cx="40" cy="30" rx="22" ry="10" fill="#e07070" />
			<path d="M18,30 V52 Q40,62 62,52 V30" fill="#c04040" />
			<ellipse cx="40" cy="52" rx="22" ry="10" fill="#a03030" />
		</svg>
	{:else if cue === 'bell'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<path d="M28,34 Q28,18 40,16 Q52,18 52,34 L58,50 H22 Z" fill="#f5c84c" stroke="#e0a820" stroke-width="3" />
			<circle cx="40" cy="56" r="5" fill="#e0a820" />
		</svg>
	{:else if cue === 'flower'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<circle cx="40" cy="22" r="7" fill="#e8a0b0" /><circle cx="54" cy="32" r="7" fill="#e8a0b0" />
			<circle cx="50" cy="48" r="7" fill="#e8a0b0" /><circle cx="30" cy="48" r="7" fill="#e8a0b0" />
			<circle cx="26" cy="32" r="7" fill="#e8a0b0" /><circle cx="40" cy="36" r="8" fill="#f5c84c" />
		</svg>
	{:else if cue === 'ice'}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<path d="M40,12 L52,40 L40,68 L28,40 Z" fill="#b8e8f8" stroke="#7ec8e8" stroke-width="3" />
		</svg>
	{:else}
		<svg viewBox="0 0 80 80" role="img" aria-hidden="true">
			<ellipse cx="40" cy="44" rx="24" ry="16" fill="#f0c0d0" />
			<path d="M20,40 Q40,28 60,40" fill="none" stroke="#e8a0b0" stroke-width="3" />
		</svg>
	{/if}
</span>

<style>
	.senses-art { display: grid; place-items: center; width: 5.5rem; height: 5.5rem; }
	.senses-art :global(svg) { width: 100%; height: auto; }
	.pulse { animation: sense-pulse 2s ease-in-out infinite; }
	@keyframes sense-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.05); }
	}
</style>
