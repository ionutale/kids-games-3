<script lang="ts">
	import type { JobScene } from '#lib/day-jobs.js';
	let { scene }: { scene: JobScene } = $props();
</script>

<svg class="day-jobs-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill="#f5efe4" />
	{#if scene === 'bandage'}
		<g class="idle-bob">
			<circle cx="60" cy="48" r="22" fill="#f4d6a8" />
			<rect x="48" y="44" width="24" height="10" rx="2" fill="#fff" stroke="#e07070" stroke-width="2" />
			<path d="M60,44 V54 M54,49 H66" stroke="#e07070" stroke-width="2" />
			<rect x="40" y="72" width="40" height="28" rx="4" fill="#7ec8e8" />
		</g>
	{:else if scene === 'book'}
		<g class="idle-bob">
			<rect x="28" y="30" width="64" height="48" rx="4" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
			<rect x="36" y="40" width="20" height="28" fill="#fff8e0" />
			<path d="M62,48 H82 M62,58 H78" stroke="#4a2c2a" stroke-width="3" />
			<circle cx="60" cy="92" r="8" fill="#f5c84c" />
		</g>
	{:else if scene === 'fire'}
		<g class="idle-pulse">
			<path d="M50,70 C42,52 52,40 60,28 C68,40 78,52 70,70 Z" fill="#e07040" />
			<path d="M54,70 C50,58 58,50 60,42 C62,50 70,58 66,70 Z" fill="#f5c84c" />
			<rect x="34" y="72" width="52" height="20" rx="3" fill="#c04040" />
		</g>
	{:else if scene === 'kitchen'}
		<g class="idle-bob">
			<rect x="24" y="48" width="72" height="36" rx="4" fill="#e8d0b0" />
			<ellipse cx="60" cy="56" rx="18" ry="8" fill="#c45c3a" />
			<path d="M48,40 Q60,28 72,40" fill="none" stroke="#8b5a3c" stroke-width="3" />
			<circle cx="88" cy="36" r="8" fill="#e07070" />
		</g>
	{:else if scene === 'crops'}
		<rect x="0" y="70" width="120" height="50" fill="#b8e0a0" />
		<g class="idle-sway">
			{#each [28, 48, 68, 88] as x}
				<rect {x} y="46" width="5" height="28" fill="#5da85f" />
				<circle cx={x + 2} cy="42" r="8" fill="#f5c84c" />
			{/each}
		</g>
	{:else}
		<g class="idle-bob">
			<rect x="30" y="50" width="24" height="16" fill="#e07070" />
			<rect x="56" y="38" width="24" height="16" fill="#7ec8e8" />
			<rect x="42" y="66" width="24" height="16" fill="#f0c060" />
			<path d="M20,90 H100" stroke="#8b5a3c" stroke-width="4" />
		</g>
	{/if}
</svg>
