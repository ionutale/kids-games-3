<script lang="ts">
	import type { WetDryScene } from '#lib/wet-dry.js';

	let { scene }: { scene: WetDryScene } = $props();

	const isWet = $derived(scene === 'puddle' || scene === 'rain' || scene === 'bath');
</script>

<svg class="wet-dry-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	{#if isWet}
		{#if scene === 'puddle'}
			<rect width="120" height="120" rx="18" fill="#b8d8a0" />
			<ellipse cx="60" cy="72" rx="36" ry="16" fill="#5aa0d0" stroke="#3a80b0" stroke-width="3" />
			<ellipse cx="52" cy="68" rx="10" ry="4" fill="#fff" opacity="0.45" />
			<circle class="idle-pulse" cx="88" cy="28" r="12" fill="#f5c84c" />
		{:else if scene === 'rain'}
			<rect width="120" height="120" rx="18" fill="#6a8aaa" />
			<g class="idle-drift">
				<ellipse cx="40" cy="28" rx="22" ry="12" fill="#c8d0d8" />
				<ellipse cx="58" cy="26" rx="18" ry="10" fill="#d8e0e8" />
				<ellipse cx="76" cy="30" rx="16" ry="9" fill="#c8d0d8" />
			</g>
			<line x1="30" y1="48" x2="24" y2="68" stroke="#a0c8e8" stroke-width="3" stroke-linecap="round" />
			<line x1="48" y1="46" x2="42" y2="70" stroke="#a0c8e8" stroke-width="3" stroke-linecap="round" />
			<line x1="66" y1="48" x2="60" y2="72" stroke="#a0c8e8" stroke-width="3" stroke-linecap="round" />
			<line x1="84" y1="50" x2="78" y2="74" stroke="#a0c8e8" stroke-width="3" stroke-linecap="round" />
			<rect x="0" y="88" width="120" height="32" fill="#5da85f" />
		{:else}
			<rect width="120" height="120" rx="18" fill="#e8f4f8" />
			<rect class="idle-shine" x="22" y="48" width="76" height="42" rx="8" fill="#7ec8e8" stroke="#4a8fc0" stroke-width="3" />
			<path d="M22,58 Q60,40 98,58" fill="none" stroke="#4a8fc0" stroke-width="3" />
			<ellipse cx="48" cy="66" rx="8" ry="3" fill="#fff" opacity="0.5" />
			<rect x="86" y="36" width="10" height="18" rx="2" fill="#c8b090" />
		{/if}
	{:else if scene === 'towel'}
		<rect width="120" height="120" rx="18" fill="#f5e6d0" />
		<g class="idle-sway">
			<rect x="28" y="30" width="64" height="60" rx="6" fill="#f0a0b0" stroke="#d07080" stroke-width="3" />
			<path d="M36,42 H84 M36,54 H84 M36,66 H84" stroke="#fff" stroke-width="3" opacity="0.5" />
		</g>
	{:else if scene === 'desert'}
		<rect width="120" height="120" rx="18" fill="#f0d080" />
		<path d="M0,70 Q30,50 60,70 Q90,90 120,65 L120,120 L0,120 Z" fill="#e8c060" />
		<circle class="idle-pulse" cx="88" cy="28" r="14" fill="#f5c84c" />
		<g class="idle-sway">
			<path d="M40,78 Q40,50 40,78 M28,62 Q40,55 52,62" fill="none" stroke="#5da85f" stroke-width="4" stroke-linecap="round" />
		</g>
	{:else}
		<rect width="120" height="120" rx="18" fill="#7ec8ff" />
		<circle class="idle-pulse" cx="90" cy="26" r="12" fill="#f5c84c" />
		<path d="M0,72 Q40,58 80,74 Q100,82 120,70 L120,120 L0,120 Z" fill="#e8d090" />
		<ellipse cx="36" cy="88" rx="10" ry="4" fill="#d4b870" />
		<ellipse cx="70" cy="92" rx="14" ry="5" fill="#d4b870" />
	{/if}
</svg>
