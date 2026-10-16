<script lang="ts">
	import type { SkyId, WayId } from '#lib/opposites.js';

	interface Props {
		sky?: SkyId;
		way?: WayId;
		label?: string;
		/** Stagger index for the idle motion phase. */
		i?: number;
	}

	let { sky, way, label = '', i = 0 }: Props = $props();

	const turn =
		way === 'down'
			? 'rotate(180 32 32)'
			: way === 'side'
				? 'rotate(90 32 32)'
				: way === 'left'
					? 'rotate(-90 32 32)'
					: '';
</script>

<svg viewBox="0 0 64 64" role="img" aria-label={label} style="--mn-d:{(i % 6) * 140}ms">
	{#if sky === 'sun'}
		<circle class="idle-pulse" cx="32" cy="32" r="12" fill="#f5a623" />
		<g class="rays" stroke="#f5a623" stroke-width="3" stroke-linecap="round">
			<path d="M32 8 V16" />
			<path d="M32 48 V56" />
			<path d="M8 32 H16" />
			<path d="M48 32 H56" />
			<path d="M14 14 L20 20" />
			<path d="M44 44 L50 50" />
			<path d="M50 14 L44 20" />
			<path d="M20 44 L14 50" />
		</g>
	{:else if sky === 'moon'}
		<g class="idle-pulse">
			<circle cx="30" cy="32" r="16" fill="#f2c230" />
			<circle cx="40" cy="26" r="13" fill="#fffdf8" />
		</g>
	{:else if sky === 'cloud'}
		<g class="idle-drift">
			<ellipse cx="26" cy="36" rx="12" ry="9" fill="#d7e8f6" />
			<ellipse cx="40" cy="34" rx="12" ry="10" fill="#e7f3fb" />
			<ellipse cx="32" cy="28" rx="10" ry="8" fill="#f4fbff" />
		</g>
	{:else if sky === 'star'}
		<polygon
			class="idle-shine"
			points="32,8 37,24 54,24 40,34 46,52 32,42 18,52 24,34 10,24 27,24"
			fill="#f5a623"
		/>
	{:else if sky === 'rainbow'}
		<g class="idle-pulse">
			<path d="M10 44 Q32 12 54 44" fill="none" stroke="#e4574f" stroke-width="4" />
			<path d="M16 44 Q32 20 48 44" fill="none" stroke="#f5a623" stroke-width="4" />
			<path d="M22 44 Q32 28 42 44" fill="none" stroke="#5aa9e6" stroke-width="4" />
		</g>
	{:else if way}
		<g transform={turn}>
			<g class="idle-bob">
				<polygon points="32,8 50,30 40,30 40,54 24,54 24,30 14,30" fill="#5aa9e6" />
			</g>
		</g>
	{/if}
</svg>

<style>
	.rays {
		transform-box: view-box;
		transform-origin: 32px 32px;
		animation: rays-spin 30s linear infinite;
	}
	@keyframes rays-spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.rays {
			animation: none;
		}
	}
</style>
