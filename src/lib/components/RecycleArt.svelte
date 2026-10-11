<script lang="ts">
	import type { BinId, RecycleItem } from '#lib/recycle-sort.js';
	let {
		item,
		dropBin = null
	}: { item: RecycleItem; dropBin?: BinId | null } = $props();
</script>

<div class="recycle-art-wrap" aria-hidden="true">
	<div
		class="recycle-item"
		class:dropping={dropBin !== null}
		style={dropBin === 'paper'
			? '--tx:-2.55rem'
			: dropBin === 'plastic'
				? '--tx:0'
				: dropBin === 'trash'
					? '--tx:2.55rem'
					: '--tx:0'}
	>
		{#if item === 'newspaper' || item === 'cardboard'}
			<svg viewBox="0 0 40 40"><rect x="8" y="6" width="24" height="28" rx="2" fill="#f5f0e0" stroke="#c4b896" stroke-width="2" /><path d="M12,14 H28 M12,20 H24 M12,26 H26" stroke="#a09078" stroke-width="2" /></svg>
		{:else if item === 'bottle' || item === 'cup'}
			<svg viewBox="0 0 40 40"><rect x="14" y="8" width="12" height="8" fill="#7ec8e8" /><rect x="12" y="16" width="16" height="18" rx="3" fill="#5aa0d0" /></svg>
		{:else if item === 'banana'}
			<svg viewBox="0 0 40 40"><path d="M10,28 Q20,8 32,22 Q22,30 10,28 Z" fill="#f5c84c" stroke="#e0a820" stroke-width="2" /></svg>
		{:else}
			<svg viewBox="0 0 40 40"><path d="M8,28 Q20,8 32,28 Z" fill="#e07070" opacity="0.85" /><path d="M12,28 H28" stroke="#c04040" stroke-width="2" /></svg>
		{/if}
	</div>
	<div class="recycle-bins">
		<div class="bin paper" class:target={dropBin === 'paper'}>
			<span class="lid"></span><span class="label">P</span>
		</div>
		<div class="bin plastic" class:target={dropBin === 'plastic'}>
			<span class="lid"></span><span class="label">Pl</span>
		</div>
		<div class="bin trash" class:target={dropBin === 'trash'}>
			<span class="lid"></span><span class="label">T</span>
		</div>
	</div>
</div>

<style>
	.recycle-art-wrap {
		position: relative;
		width: 12rem;
		height: 11rem;
		margin: 0.35rem auto;
	}
	.recycle-item {
		position: absolute;
		left: 50%;
		top: 0.2rem;
		width: 2.8rem;
		height: 2.8rem;
		transform: translateX(-50%);
		z-index: 3;
		transition:
			transform 0.75s cubic-bezier(0.45, 0.05, 0.2, 1),
			top 0.75s cubic-bezier(0.45, 0.05, 0.2, 1),
			opacity 0.35s ease 0.45s;
	}
	.recycle-item svg {
		width: 100%;
		height: 100%;
		display: block;
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.15));
	}
	.recycle-item.dropping {
		top: 6.4rem;
		transform: translateX(calc(-50% + var(--tx))) scale(0.45) rotate(20deg);
		opacity: 0.15;
	}
	.recycle-bins {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0.15rem;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}
	.bin {
		position: relative;
		width: 3rem;
		height: 3.5rem;
		border-radius: 0.35rem 0.35rem 0.6rem 0.6rem;
		display: grid;
		place-items: center;
		border: 3px solid rgba(0, 0, 0, 0.12);
		font-weight: 800;
		font-size: 0.75rem;
		color: #fff;
		transition: transform 0.35s ease, filter 0.35s ease;
	}
	.bin .lid {
		position: absolute;
		top: -0.35rem;
		left: 8%;
		right: 8%;
		height: 0.45rem;
		border-radius: 0.25rem;
		background: rgba(255, 255, 255, 0.35);
		transform-origin: left center;
		transition: transform 0.35s ease;
	}
	.bin .label { z-index: 1; }
	.bin.paper { background: #4a90d0; }
	.bin.plastic { background: #e0b040; color: #4a2c2a; }
	.bin.trash { background: #6a6a6a; }
	.bin.target {
		transform: scale(1.12) translateY(-4px);
		filter: brightness(1.08);
	}
	.bin.target .lid {
		transform: rotate(-28deg);
	}
</style>
