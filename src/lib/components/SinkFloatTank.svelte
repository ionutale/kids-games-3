<script lang="ts">
	import type { SinkFloatObject } from '#lib/sink-float.js';

	let {
		object,
		result = null
	}: {
		object: SinkFloatObject;
		result?: 'sink' | 'float' | null;
	} = $props();
</script>

<div class="sf-tank" class:active={result !== null} aria-hidden="true">
	<div class="sf-sky"></div>
	<div
		class="sf-object"
		class:dropping={result !== null}
		class:sunk={result === 'sink'}
		class:floating={result === 'float'}
	>
		{#if object === 'rock'}
			<svg viewBox="0 0 40 40"><ellipse cx="20" cy="22" rx="14" ry="10" fill="#8a8070" /><ellipse cx="16" cy="18" rx="5" ry="3" fill="#a09888" opacity="0.6" /></svg>
		{:else if object === 'key'}
			<svg viewBox="0 0 40 40"><circle cx="14" cy="14" r="7" fill="none" stroke="#c0a040" stroke-width="4" /><rect x="18" y="12" width="16" height="4" rx="1" fill="#c0a040" /><rect x="28" y="16" width="3" height="6" fill="#c0a040" /><rect x="24" y="16" width="3" height="4" fill="#c0a040" /></svg>
		{:else if object === 'coin'}
			<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="#f0c060" stroke="#d4a020" stroke-width="3" /><text x="20" y="25" text-anchor="middle" font-size="12" fill="#a07010" font-weight="700">1</text></svg>
		{:else if object === 'leaf'}
			<svg viewBox="0 0 40 40"><path d="M20,6 C32,14 32,28 20,34 C8,28 8,14 20,6 Z" fill="#6fbf73" /><path d="M20,8 V32" stroke="#4a8a4a" stroke-width="2" /></svg>
		{:else if object === 'cork'}
			<svg viewBox="0 0 40 40"><rect x="12" y="10" width="16" height="20" rx="3" fill="#d4a574" stroke="#b08050" stroke-width="2" /><path d="M14,16 H26 M14,22 H26" stroke="#b08050" stroke-width="1.5" /></svg>
		{:else}
			<svg viewBox="0 0 40 40"><path d="M6,24 L34,24 L28,32 H12 Z" fill="#c45c3a" /><rect x="18" y="8" width="3" height="16" fill="#8b5a3c" /><path d="M21,10 L32,18 H21 Z" fill="#fff8e0" /></svg>
		{/if}
	</div>
	{#if result !== null}
		<div class="sf-splash" class:splash-on></div>
	{/if}
	<div class="sf-water">
		<svg class="sf-wave" viewBox="0 0 200 24" preserveAspectRatio="none">
			<path d="M0,12 Q25,0 50,12 T100,12 T150,12 T200,12 V24 H0 Z" fill="#5aa8d8" />
		</svg>
		<svg class="sf-wave w2" viewBox="0 0 200 24" preserveAspectRatio="none">
			<path d="M0,14 Q25,4 50,14 T100,14 T150,14 T200,14 V24 H0 Z" fill="#6eb8e0" opacity="0.55" />
		</svg>
		<div class="sf-water-body">
			<span class="sf-bubble b1"></span>
			<span class="sf-bubble b2"></span>
			<span class="sf-bubble b3"></span>
			<span class="sf-bubble b4"></span>
		</div>
	</div>
	<div class="sf-glass"></div>
</div>

<style>
	.sf-tank {
		position: relative;
		width: 12rem;
		height: 13rem;
		margin: 0.5rem auto;
		border-radius: 1rem 1rem 1.25rem 1.25rem;
		overflow: hidden;
		border: 4px solid #7aa0b8;
		background: linear-gradient(180deg, #d8eef8 0%, #b8d8e8 40%, #5aa8d8 40%, #3a88b8 100%);
		box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.35);
	}
	.sf-sky {
		position: absolute;
		inset: 0 0 60% 0;
		background: linear-gradient(180deg, #e8f6ff, #c8e4f4);
	}
	.sf-water {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 60%;
		overflow: hidden;
	}
	.sf-wave {
		position: absolute;
		top: -8px;
		left: -25%;
		width: 150%;
		height: 22px;
		animation: sf-wave 2.2s ease-in-out infinite;
	}
	.sf-wave.w2 {
		top: -2px;
		animation-duration: 2.8s;
		animation-direction: reverse;
	}
	.sf-tank.active .sf-wave {
		animation-duration: 0.9s;
	}
	.sf-water-body {
		position: absolute;
		inset: 10px 0 0;
		background: linear-gradient(180deg, #6eb8e0 0%, #3a88b8 100%);
	}
	.sf-bubble {
		position: absolute;
		bottom: 10%;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.5);
		animation: sf-bubble 2.6s ease-in infinite;
	}
	.sf-bubble.b1 { left: 18%; }
	.sf-bubble.b2 { left: 40%; width: 0.35rem; height: 0.35rem; animation-delay: 0.7s; }
	.sf-bubble.b3 { left: 62%; animation-delay: 1.3s; }
	.sf-bubble.b4 { left: 80%; width: 0.4rem; height: 0.4rem; animation-delay: 1.9s; }
	.sf-object {
		position: absolute;
		left: 50%;
		top: 8%;
		width: 3rem;
		height: 3rem;
		transform: translateX(-50%);
		z-index: 3;
		transition:
			top 0.95s cubic-bezier(0.45, 0.05, 0.25, 1),
			transform 0.95s cubic-bezier(0.45, 0.05, 0.25, 1);
	}
	.sf-object svg {
		width: 100%;
		height: 100%;
		display: block;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.18));
	}
	.sf-object.dropping.sunk {
		top: 74%;
		transform: translateX(-50%) rotate(18deg) scale(0.92);
	}
	.sf-object.dropping.floating {
		top: 34%;
		animation: sf-bob 1.25s ease-in-out 0.85s infinite;
	}
	.sf-splash {
		position: absolute;
		left: 50%;
		top: 36%;
		width: 3.5rem;
		height: 1.2rem;
		margin-left: -1.75rem;
		border-radius: 50%;
		border: 3px solid rgba(255, 255, 255, 0.65);
		opacity: 0;
		z-index: 4;
		pointer-events: none;
	}
	.sf-splash.splash-on {
		animation: sf-splash 0.7s ease-out forwards;
	}
	.sf-glass {
		pointer-events: none;
		position: absolute;
		inset: 0;
		border-radius: inherit;
		box-shadow: inset -10px 0 16px rgba(255, 255, 255, 0.18);
		z-index: 5;
	}
	@keyframes sf-wave {
		0%, 100% { transform: translateX(0); }
		50% { transform: translateX(14%); }
	}
	@keyframes sf-bubble {
		0% { transform: translateY(0); opacity: 0; }
		15% { opacity: 0.75; }
		100% { transform: translateY(-5rem); opacity: 0; }
	}
	@keyframes sf-bob {
		0%, 100% { transform: translateX(-50%) translateY(0) rotate(-4deg); }
		50% { transform: translateX(-50%) translateY(-10px) rotate(4deg); }
	}
	@keyframes sf-splash {
		0% { transform: scale(0.4); opacity: 0.9; }
		100% { transform: scale(1.8); opacity: 0; }
	}
</style>
