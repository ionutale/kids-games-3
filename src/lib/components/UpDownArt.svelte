<script lang="ts">
	import type { UpDownScene } from '#lib/up-down.js';
	let { scene }: { scene: UpDownScene } = $props();
	const goingUp = $derived(scene === 'balloon' || scene === 'bird-up' || scene === 'rocket');
</script>

<svg class="up-down-art" class:up={goingUp} class:down={!goingUp} viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill="#b8dcf0" />
	<rect x="0" y="88" width="120" height="32" fill="#6fbf73" />
	{#if scene === 'balloon'}
		<g class="mover">
			<ellipse cx="60" cy="40" rx="18" ry="24" fill="#e07070" />
			<path d="M60,64 V78" stroke="#4a2c2a" stroke-width="2" />
			<path d="M54,78 H66 L63,86 H57 Z" fill="#c04040" />
		</g>
	{:else if scene === 'bird-up'}
		<g class="mover">
			<ellipse cx="60" cy="48" rx="16" ry="10" fill="#7ec8e8" />
			<path class="wing" d="M44,48 Q28,30 44,46" fill="#7ec8e8" />
			<path class="wing" d="M76,48 Q92,30 76,46" fill="#7ec8e8" />
		</g>
	{:else if scene === 'rocket'}
		<g class="mover">
			<path d="M60,18 L72,50 L60,46 L48,50 Z" fill="#e07070" />
			<rect x="52" y="46" width="16" height="28" fill="#7ec8e8" />
			<path class="flame" d="M52,74 L48,92 L60,82 L72,92 L68,74" fill="#f5c84c" />
		</g>
	{:else if scene === 'slide'}
		<path d="M24,30 H48 V70 L96,90" fill="none" stroke="#e07070" stroke-width="8" stroke-linecap="round" />
		<g class="mover"><circle cx="70" cy="78" r="8" fill="#f4d6a8" /><rect x="64" y="84" width="12" height="10" fill="#7ec8e8" /></g>
	{:else if scene === 'rain'}
		<ellipse cx="60" cy="28" rx="28" ry="12" fill="#c8d0d8" />
		<g class="mover">
			<line x1="40" y1="48" x2="32" y2="86" stroke="#5aa0d0" stroke-width="4" stroke-linecap="round" />
			<line x1="58" y1="46" x2="50" y2="88" stroke="#5aa0d0" stroke-width="4" stroke-linecap="round" />
			<line x1="76" y1="48" x2="68" y2="86" stroke="#5aa0d0" stroke-width="4" stroke-linecap="round" />
		</g>
	{:else}
		<rect x="70" y="40" width="8" height="40" fill="#8b5a3c" />
		<circle cx="74" cy="34" r="14" fill="#6fbf73" />
		<g class="mover"><circle cx="48" cy="70" r="10" fill="#e07070" /></g>
	{/if}
</svg>

<style>
	.up-down-art.up .mover {
		animation: go-up 1.5s ease-in-out infinite;
	}
	.up-down-art.down .mover {
		animation: go-down 1.35s ease-in-out infinite;
	}
	.up-down-art .flame {
		animation: flicker 0.35s ease-in-out infinite alternate;
		transform-origin: 60px 74px;
	}
	@keyframes go-up {
		0%, 100% { transform: translateY(10px); }
		50% { transform: translateY(-16px); }
	}
	@keyframes go-down {
		0%, 100% { transform: translateY(-12px); }
		50% { transform: translateY(14px); }
	}
	@keyframes flicker {
		from { transform: scaleY(1); }
		to { transform: scaleY(1.25); }
	}
</style>
