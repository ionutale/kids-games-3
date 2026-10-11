<script lang="ts">
	import type { HotColdId, HotColdScene } from '#lib/hot-cold.js';
	let {
		scene,
		result = null
	}: { scene: HotColdScene; result?: HotColdId | null } = $props();
	const hot = $derived(scene === 'sun' || scene === 'soup' || scene === 'fire');
</script>

<div class="hc-art" class:hot class:cold={!hot} class:reveal={result !== null} aria-hidden="true">
	<svg viewBox="0 0 120 120" role="img">
		{#if scene === 'sun'}
			<rect width="120" height="120" rx="18" fill="#7ec8ff" />
			<g class="sun-spin">
				<line x1="60" y1="12" x2="60" y2="26" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="60" y1="78" x2="60" y2="92" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="12" y1="52" x2="26" y2="52" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="94" y1="52" x2="108" y2="52" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="26" y1="22" x2="36" y2="32" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="84" y1="72" x2="94" y2="82" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="94" y1="22" x2="84" y2="32" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
				<line x1="36" y1="72" x2="26" y2="82" stroke="#f5c84c" stroke-width="4" stroke-linecap="round" />
			</g>
			<circle class="core" cx="60" cy="52" r="20" fill="#f5c84c" />
		{:else if scene === 'soup'}
			<rect width="120" height="120" rx="18" fill="#f5efe4" />
			<ellipse cx="60" cy="70" rx="34" ry="14" fill="#c45c3a" />
			<ellipse class="core" cx="60" cy="58" rx="28" ry="12" fill="#e07040" />
			<path class="steam s1" d="M44,48 Q48,36 44,28" fill="none" stroke="#ccc" stroke-width="3" />
			<path class="steam s2" d="M60,46 Q64,34 60,26" fill="none" stroke="#ccc" stroke-width="3" />
			<path class="steam s3" d="M76,48 Q80,36 76,28" fill="none" stroke="#ccc" stroke-width="3" />
		{:else if scene === 'fire'}
			<rect width="120" height="120" rx="18" fill="#2a2030" />
			<path class="core" d="M48,88 C36,60 52,40 60,22 C68,40 84,60 72,88 Z" fill="#e07040" />
			<path d="M54,88 C48,68 58,52 60,40 C62,52 72,68 66,88 Z" fill="#f5c84c" />
		{:else if scene === 'snow'}
			<rect width="120" height="120" rx="18" fill="#c8dce8" />
			<circle class="flake" cx="30" cy="30" r="3" fill="#fff" />
			<circle class="flake f2" cx="60" cy="22" r="3" fill="#fff" />
			<circle class="flake f3" cx="90" cy="34" r="3" fill="#fff" />
			<circle class="flake" cx="40" cy="55" r="2.5" fill="#fff" />
			<circle class="flake f2" cx="75" cy="50" r="3" fill="#fff" />
			<path d="M0,80 Q40,60 80,78 T120,70 L120,120 L0,120 Z" fill="#fff" />
		{:else if scene === 'ice'}
			<rect width="120" height="120" rx="18" fill="#b8d8f0" />
			<path class="core" d="M30,70 L50,30 L70,70 L50,90 Z" fill="#e8f6ff" stroke="#7ec8e8" stroke-width="3" />
			<path d="M55,65 L75,28 L95,65 L75,85 Z" fill="#d8eefc" stroke="#7ec8e8" stroke-width="3" />
		{:else}
			<rect width="120" height="120" rx="18" fill="#e8eef4" />
			<rect x="28" y="24" width="64" height="72" rx="4" fill="#a0b8c8" stroke="#708898" stroke-width="3" />
			<rect class="core" x="36" y="34" width="48" height="28" rx="2" fill="#7ec8e8" />
			<rect x="36" y="68" width="48" height="20" rx="2" fill="#9ec8e0" />
		{/if}
	</svg>
	{#if result === 'hot'}
		<div class="shimmer"></div>
	{:else if result === 'cold'}
		<div class="frost"></div>
	{/if}
</div>

<style>
	.hc-art {
		position: relative;
		width: 11rem;
		height: 11rem;
		margin: 0.4rem auto;
		border-radius: 1.1rem;
		overflow: hidden;
		border: 3px solid #a09078;
	}
	.hc-art svg { width: 100%; height: 100%; display: block; }
	.hc-art.hot .core { animation: heat-pulse 1.4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
	.hc-art.hot .sun-spin { transform-origin: 60px 52px; animation: ray-spin 10s linear infinite; }
	.hc-art.hot .steam { animation: steam-up 1.6s ease-in-out infinite; }
	.hc-art.hot .steam.s2 { animation-delay: 0.3s; }
	.hc-art.hot .steam.s3 { animation-delay: 0.6s; }
	.hc-art.cold .flake { animation: flake-fall 2.4s linear infinite; }
	.hc-art.cold .flake.f2 { animation-delay: 0.5s; }
	.hc-art.cold .flake.f3 { animation-delay: 1s; }
	.hc-art.cold .core { animation: frost-glow 1.8s ease-in-out infinite; }
	.shimmer {
		pointer-events: none;
		position: absolute; inset: 0;
		background: linear-gradient(120deg, transparent 30%, rgba(255,220,120,0.35) 50%, transparent 70%);
		background-size: 200% 100%;
		animation: shimmer 1s linear infinite;
	}
	.frost {
		pointer-events: none;
		position: absolute; inset: 0;
		background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.55), transparent 45%),
			radial-gradient(circle at 80% 70%, rgba(200,230,255,0.4), transparent 40%);
		animation: frost-in 0.6s ease-out forwards;
	}
	@keyframes heat-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.06); }
	}
	@keyframes ray-spin { to { transform: rotate(360deg); } }
	@keyframes steam-up {
		0%, 100% { opacity: 0.3; transform: translateY(0); }
		50% { opacity: 0.9; transform: translateY(-8px); }
	}
	@keyframes flake-fall {
		0% { transform: translateY(-4px); opacity: 0.4; }
		50% { opacity: 1; }
		100% { transform: translateY(10px); opacity: 0.3; }
	}
	@keyframes frost-glow {
		0%, 100% { filter: brightness(1); }
		50% { filter: brightness(1.12); }
	}
	@keyframes shimmer {
		0% { background-position: 100% 0; }
		100% { background-position: -100% 0; }
	}
	@keyframes frost-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
