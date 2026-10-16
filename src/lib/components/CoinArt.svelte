<script lang="ts">
	import type { CoinValue } from '#lib/money-coins.js';

	interface Props {
		value: CoinValue;
		/** Stagger index for the idle motion phase. */
		i?: number;
	}

	let { value, i = 0 }: Props = $props();

	const fill = $derived(value === 1 ? '#c0c8d0' : value === 5 ? '#e8b878' : '#f0d070');
	const stroke = $derived(value === 1 ? '#8890a0' : value === 5 ? '#c48840' : '#d0a820');
</script>

<svg
	class="coin-art idle-shine"
	viewBox="0 0 80 80"
	role="img"
	aria-hidden="true"
	style="--mn-d:{(i % 6) * 140}ms"
>
	<circle cx="40" cy="42" r="28" fill={fill} stroke={stroke} stroke-width="4" />
	<circle cx="40" cy="42" r="20" fill="none" stroke={stroke} stroke-width="2" opacity="0.45" />
	<text
		x="40"
		y="48"
		text-anchor="middle"
		font-size="22"
		font-weight="800"
		fill="#4a2c2a"
		font-family="system-ui, sans-serif">{value}</text
	>
</svg>
