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
			? '--tx:-2.4rem'
			: dropBin === 'plastic'
				? '--tx:0'
				: dropBin === 'trash'
					? '--tx:2.4rem'
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
		<div class="bin paper" class:target={dropBin === 'paper'}><span>P</span></div>
		<div class="bin plastic" class:target={dropBin === 'plastic'}><span>Pl</span></div>
		<div class="bin trash" class:target={dropBin === 'trash'}><span>T</span></div>
	</div>
</div>

<style>
	.recycle-art-wrap {
		position: relative;
		width: 11rem;
		height: 10rem;
		margin: 0.35rem auto;
	}
	.recycle-item {
		position: absolute;
		left: 50%;
		top: 0.4rem;
		width: 2.6rem;
		height: 2.6rem;
		transform: translateX(-50%);
		z-index: 2;
		transition: transform 0.7s cubic-bezier(0.4, 0.1, 0.2, 1), top 0.7s cubic-bezier(0.4, 0.1, 0.2, 1);
	}
	.recycle-item svg { width: 100%; height: 100%; display: block; }
	.recycle-item.dropping {
		top: 5.6rem;
		transform: translateX(calc(-50% + var(--tx))) scale(0.7);
	}
	.recycle-bins {
		position: absolute;
		left: 0; right: 0; bottom: 0.2rem;
		display: flex; justify-content: center; gap: 0.45rem;
	}
	.bin {
		width: 2.8rem; height: 3.2rem; border-radius: 0.4rem 0.4rem 0.55rem 0.55rem;
		display: grid; place-items: center; border: 3px solid rgba(0,0,0,0.12);
		font-weight: 800; font-size: 0.75rem; color: #fff;
		transition: transform 0.3s ease;
	}
	.bin.paper { background: #4a90d0; }
	.bin.plastic { background: #e0b040; color: #4a2c2a; }
	.bin.trash { background: #6a6a6a; }
	.bin.target { transform: scale(1.08); }
</style>
