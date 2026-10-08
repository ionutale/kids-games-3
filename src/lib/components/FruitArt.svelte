<script lang="ts">
	import type { FruitId } from '#lib/count-fruit.js';

	interface Props {
		fruit: FruitId;
		happy?: boolean;
		label?: string;
	}

	let { fruit, happy = false, label = '' }: Props = $props();

	const mouth = $derived(happy ? 'M25,40 Q32,47 39,40' : 'M27,41 L37,41');
</script>

{#snippet face(cx: number, cy: number)}
	<g aria-hidden="true">
		<circle cx={cx - 7} {cy} r="3" fill="#4a2c2a" />
		<circle cx={cx + 7} {cy} r="3" fill="#4a2c2a" />
		<path
			d={mouth}
			transform={`translate(${cx - 32},${cy - 30})`}
			stroke="#4a2c2a"
			stroke-width="2.4"
			stroke-linecap="round"
			fill="none"
		/>
		{#if happy}
			<ellipse cx={cx - 11} cy={cy + 6} rx="3.4" ry="2.2" fill="#f4a3a3" opacity="0.8" />
			<ellipse cx={cx + 11} cy={cy + 6} rx="3.4" ry="2.2" fill="#f4a3a3" opacity="0.8" />
		{/if}
	</g>
{/snippet}

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if fruit === 'apple'}
		<rect x="30" y="10" width="4" height="9" rx="2" fill="#8a5a3b" />
		<ellipse cx="40" cy="15" rx="7" ry="4" fill="#6aa84f" transform="rotate(-25 40 15)" />
		<circle cx="32" cy="37" r="18" fill="#e4574f" />
		<ellipse cx="25" cy="30" rx="5" ry="7" fill="#fff" opacity="0.25" />
		{@render face(32, 35)}
	{:else if fruit === 'pear'}
		<rect x="30" y="8" width="4" height="8" rx="2" fill="#8a5a3b" />
		<ellipse cx="39" cy="13" rx="6" ry="3.6" fill="#6aa84f" transform="rotate(-25 39 13)" />
		<ellipse cx="32" cy="22" rx="9" ry="8" fill="#9ccc65" />
		<ellipse cx="32" cy="43" rx="15" ry="13" fill="#7cb342" />
		<ellipse cx="26" cy="38" rx="4" ry="6" fill="#fff" opacity="0.25" />
		{@render face(32, 42)}
	{:else if fruit === 'orange'}
		<ellipse cx="39" cy="15" rx="7" ry="4" fill="#6aa84f" transform="rotate(-25 39 15)" />
		<circle cx="32" cy="37" r="17" fill="#f5a623" />
		<circle cx="25" cy="30" r="1.6" fill="#d98a1f" />
		<circle cx="38" cy="27" r="1.6" fill="#d98a1f" />
		<circle cx="31" cy="44" r="1.6" fill="#d98a1f" />
		<ellipse cx="25" cy="31" rx="4" ry="6" fill="#fff" opacity="0.25" />
		{@render face(32, 36)}
	{:else if fruit === 'banana'}
		<path
			d="M14,18 Q28,52 52,38 Q50,52 30,55 Q12,52 14,18 Z"
			fill="#f7d154"
			stroke="#d9a92b"
			stroke-width="2"
		/>
		<circle cx="15" cy="18" r="2.6" fill="#8a5a3b" />
		<circle cx="51" cy="39" r="2.6" fill="#8a5a3b" />
		{@render face(31, 38)}
	{:else if fruit === 'grapes'}
		<rect x="30" y="6" width="4" height="8" rx="2" fill="#8a5a3b" />
		<ellipse cx="39" cy="10" rx="6" ry="3.4" fill="#6aa84f" transform="rotate(-25 39 10)" />
		<circle cx="32" cy="22" r="7" fill="#9b7ed9" />
		<circle cx="24" cy="31" r="7" fill="#8a6fd0" />
		<circle cx="40" cy="31" r="7" fill="#a78fde" />
		<circle cx="21" cy="41" r="7" fill="#9b7ed9" />
		<circle cx="33" cy="41" r="7" fill="#8a6fd0" />
		<circle cx="44" cy="41" r="7" fill="#9b7ed9" />
		<circle cx="27" cy="51" r="7" fill="#a78fde" />
		<circle cx="39" cy="51" r="7" fill="#8a6fd0" />
		{@render face(32, 36)}
	{:else if fruit === 'strawberry'}
		<path d="M20,28 Q32,23 44,28 Q44,47 32,56 Q20,47 20,28 Z" fill="#e94f5c" />
		<path d="M20,28 L26,20 L32,27 L38,20 L44,28 Q38,25 32,26 Q26,25 20,28 Z" fill="#5da85f" />
		<rect x="30" y="12" width="4" height="8" rx="2" fill="#4c8a4e" />
		<ellipse cx="27" cy="37" rx="1.4" ry="2" fill="#ffd9de" />
		<ellipse cx="37" cy="37" rx="1.4" ry="2" fill="#ffd9de" />
		<ellipse cx="32" cy="46" rx="1.4" ry="2" fill="#ffd9de" />
		{@render face(32, 35)}
	{:else if fruit === 'lemon'}
		<circle cx="14" cy="36" r="3" fill="#f2d24b" />
		<circle cx="50" cy="36" r="3" fill="#f2d24b" />
		<ellipse cx="32" cy="36" rx="18" ry="13" fill="#f2d24b" transform="rotate(-12 32 36)" />
		<ellipse cx="39" cy="14" rx="6" ry="3.4" fill="#6aa84f" transform="rotate(-25 39 14)" />
		<ellipse cx="25" cy="31" rx="4" ry="5" fill="#fff" opacity="0.3" />
		{@render face(32, 36)}
	{:else if fruit === 'cherry'}
		<path
			d="M24,44 Q28,28 37,16 M42,46 Q40,30 37,16"
			stroke="#5da85f"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
		/>
		<ellipse cx="43" cy="15" rx="6" ry="3.4" fill="#6aa84f" transform="rotate(-20 43 15)" />
		<circle cx="24" cy="45" r="10" fill="#d63d4e" />
		<circle cx="43" cy="47" r="10" fill="#c93345" />
		<ellipse cx="20" cy="41" rx="2.6" ry="3.6" fill="#fff" opacity="0.3" />
		{@render face(24, 44)}
	{:else if fruit === 'peach'}
		<circle cx="32" cy="37" r="16" fill="#f6a56b" />
		<circle cx="38" cy="41" r="8" fill="#ef7d54" opacity="0.55" />
		<path
			d="M32,22 Q28,37 32,52"
			stroke="#d97b4a"
			stroke-width="2"
			fill="none"
			stroke-linecap="round"
		/>
		<ellipse cx="39" cy="16" rx="6" ry="3.4" fill="#6aa84f" transform="rotate(-25 39 16)" />
		{@render face(30, 36)}
	{:else if fruit === 'watermelon'}
		<path d="M8,28 A24,24 0 0,0 56,28 L8,28 Z" fill="#3e9e4d" />
		<path d="M13,28 A19,19 0 0,0 51,28 L13,28 Z" fill="#f4f1e4" />
		<path d="M17,28 A15,15 0 0,0 47,28 L17,28 Z" fill="#f0616e" />
		<ellipse cx="26" cy="36" rx="1.6" ry="2.2" fill="#4a2c2a" />
		<ellipse cx="33" cy="40" rx="1.6" ry="2.2" fill="#4a2c2a" />
		<ellipse cx="39" cy="35" rx="1.6" ry="2.2" fill="#4a2c2a" />
		{@render face(32, 33)}
	{/if}
</svg>
