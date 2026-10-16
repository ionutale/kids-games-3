<script lang="ts">
	import type { SafeScene } from '#lib/safe-choice.js';
	let { scene }: { scene: SafeScene } = $props();
</script>

<svg class="safe-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill="#d8e8f0" />
	<rect x="0" y="70" width="120" height="30" fill="#8a9098" />
	{#if scene === 'crosswalk' || scene === 'mid-street'}
		{#if scene === 'crosswalk'}
			{#each [28, 44, 60, 76] as x}
				<rect {x} y="70" width="10" height="30" fill="#fff" />
			{/each}
		{/if}
		<g class="idle-bob">
			<circle cx={scene === 'crosswalk' ? 50 : 60} cy="48" r="10" fill="#f4d6a8" />
			<rect x={scene === 'crosswalk' ? 42 : 52} y="58" width="16" height="18" rx="3" fill="#7ec8e8" />
		</g>
		{#if scene === 'mid-street'}
			<rect x="10" y="78" width="22" height="12" rx="3" fill="#e07070" />
		{/if}
	{:else if scene === 'helmet' || scene === 'no-helmet'}
		<circle cx="56" cy="40" r="10" fill="#f4d6a8" />
		{#if scene === 'helmet'}
			<path class="idle-pulse" d="M44,38 Q56,22 68,38" fill="#4a90d0" />
		{/if}
		<ellipse cx="56" cy="72" rx="22" ry="8" fill="#5a5a5a" />
		<circle cx="40" cy="72" r="8" fill="#333" /><circle cx="72" cy="72" r="8" fill="#333" />
	{:else if scene === 'hand-adult'}
		<circle cx="44" cy="46" r="9" fill="#f4d6a8" />
		<rect x="38" y="55" width="12" height="20" fill="#7ec8e8" />
		<circle cx="70" cy="36" r="11" fill="#f4d6a8" />
		<rect x="62" y="48" width="16" height="28" fill="#6fbf73" />
		<path d="M50,62 H66" stroke="#f4d6a8" stroke-width="4" stroke-linecap="round" />
	{:else}
		<circle cx="40" cy="50" r="9" fill="#f4d6a8" />
		<rect x="34" y="59" width="12" height="18" fill="#e8a04a" />
		<rect x="70" y="78" width="28" height="12" rx="3" fill="#e07070" />
	{/if}
</svg>
