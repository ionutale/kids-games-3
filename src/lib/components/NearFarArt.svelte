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
		<g class="focus">
			<rect x="72" y="48" width="5" height="18" fill="#8b5a3c" />
			<circle cx="74" cy="42" r="12" fill="#5da85f" />
		</g>
		<path d="M0,78 Q60,70 120,78" fill="none" stroke="#6aaa5a" stroke-width="2" />
	{:else if scene === 'bird-near'}
		<g class="focus">
			<ellipse cx="60" cy="55" rx="26" ry="16" fill="#7ec8e8" />
			<path d="M40,50 Q30,40 38,48" fill="#7ec8e8" />
			<circle cx="78" cy="50" r="8" fill="#7ec8e8" />
		</g>
	{:else if scene === 'moon-far'}
		<g class="focus">
			<circle cx="88" cy="28" r="10" fill="#f0e8c8" />
			<circle cx="92" cy="26" r="7" fill="#9ed0f0" />
		</g>
	{:else if scene === 'car-near'}
		<g class="focus">
			<rect x="24" y="52" width="70" height="28" rx="8" fill="#e07070" />
			<path d="M36,52 L46,34 H74 L84,52" fill="#7ec8e8" />
			<circle cx="40" cy="82" r="10" fill="#333" />
			<circle cx="78" cy="82" r="10" fill="#333" />
		</g>
	{:else}
		<g class="focus">
			<path d="M20,78 L50,50 L80,78 Z" fill="#8a9a70" />
			<path d="M50,78 L85,40 L110,78 Z" fill="#6a7a58" />
		</g>
	{/if}
</svg>

<style>
	.near-far-art.near .focus {
		transform-origin: center;
		transform-box: fill-box;
		animation: near-loom 1.7s ease-in-out infinite;
	}
	.near-far-art.far .focus {
		transform-origin: center;
		transform-box: fill-box;
		animation: far-drift 2.4s ease-in-out infinite;
	}
	@keyframes near-loom {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.1); }
	}
	@keyframes far-drift {
		0%, 100% { transform: translateY(0) scale(0.92); opacity: 0.85; }
		50% { transform: translateY(-3px) scale(0.96); opacity: 1; }
	}
</style>
