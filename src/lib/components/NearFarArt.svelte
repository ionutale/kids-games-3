<script lang="ts">
	import type { NearFarScene } from '#lib/near-far.js';
	let { scene }: { scene: NearFarScene } = $props();
	const near = $derived(scene.endsWith('near'));
</script>

<svg class="near-far-art" class:near class:far={!near} viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill="#9ed0f0" />
	<rect x="0" y="78" width="120" height="42" fill="#7aba6a" />
	{#if scene === 'ball-near'}
		<circle class="focus" cx="70" cy="70" r="28" fill="#e07070" />
		<circle cx="78" cy="62" r="6" fill="#fff" opacity="0.4" />
	{:else if scene === 'tree-far'}
		<rect class="focus" x="72" y="48" width="5" height="18" fill="#8b5a3c" />
		<circle class="focus" cx="74" cy="42" r="12" fill="#5da85f" />
		<path d="M0,78 Q60,70 120,78" fill="none" stroke="#6aaa5a" stroke-width="2" />
	{:else if scene === 'bird-near'}
		<ellipse class="focus" cx="60" cy="55" rx="26" ry="16" fill="#7ec8e8" />
		<path class="focus" d="M40,50 Q30,40 38,48" fill="#7ec8e8" />
		<circle class="focus" cx="78" cy="50" r="8" fill="#7ec8e8" />
	{:else if scene === 'moon-far'}
		<circle class="focus" cx="88" cy="28" r="10" fill="#f0e8c8" />
		<circle cx="92" cy="26" r="7" fill="#9ed0f0" />
	{:else if scene === 'car-near'}
		<rect class="focus" x="24" y="52" width="70" height="28" rx="8" fill="#e07070" />
		<path class="focus" d="M36,52 L46,34 H74 L84,52" fill="#7ec8e8" />
		<circle class="focus" cx="40" cy="82" r="10" fill="#333" />
		<circle class="focus" cx="78" cy="82" r="10" fill="#333" />
	{:else}
		<path class="focus" d="M20,78 L50,50 L80,78 Z" fill="#8a9a70" />
		<path class="focus" d="M50,78 L85,40 L110,78 Z" fill="#6a7a58" />
	{/if}
</svg>

<style>
	.near-far-art.near .focus { transform-origin: center; animation: near-pulse 1.8s ease-in-out infinite; }
	.near-far-art.far .focus { opacity: 0.95; }
	@keyframes near-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.04); }
	}
</style>
