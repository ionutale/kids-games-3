<script lang="ts">
	import type { KindFaceId } from '#lib/sort-kind.js';

	interface Props {
		face: KindFaceId;
		happy?: boolean;
		label?: string;
	}

	let { face, happy = false, label = '' }: Props = $props();

	const mouth = $derived(happy ? 'M25,40 Q32,47 39,40' : 'M27,41 L37,41');
</script>

{#snippet eyes(cx: number, cy: number)}
	<circle cx={cx - 6} {cy} r="2.6" fill="#4a2c2a" />
	<circle cx={cx + 6} {cy} r="2.6" fill="#4a2c2a" />
{/snippet}

<svg viewBox="0 0 64 64" role="img" aria-label={label}>
	{#if face === 'cat'}
		<ellipse cx="32" cy="36" rx="18" ry="16" fill="#f0c27a" />
		<path d="M16,28 L20,12 L28,26 Z" fill="#f0c27a" />
		<path d="M48,28 L44,12 L36,26 Z" fill="#f0c27a" />
		<path d="M18,26 L22,16 L26,25 Z" fill="#f4a3a3" opacity="0.85" />
		<path d="M46,26 L42,16 L38,25 Z" fill="#f4a3a3" opacity="0.85" />
		{@render eyes(32, 34)}
		<path d="M32,36 L28,40 L32,39 L36,40 Z" fill="#e08a6a" />
		<path
			d={mouth}
			transform="translate(0,2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'dog'}
		<ellipse cx="32" cy="36" rx="17" ry="15" fill="#d4a574" />
		<ellipse cx="14" cy="34" rx="7" ry="10" fill="#c48a55" />
		<ellipse cx="50" cy="34" rx="7" ry="10" fill="#c48a55" />
		{@render eyes(32, 33)}
		<ellipse cx="32" cy="42" rx="6" ry="4.5" fill="#f0c9a0" />
		<path
			d={mouth}
			transform="translate(0,4)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'bird'}
		<ellipse cx="32" cy="36" rx="16" ry="14" fill="#7ec8e8" />
		<ellipse cx="20" cy="30" rx="8" ry="5" fill="#5aa9e6" transform="rotate(-20 20 30)" />
		{@render eyes(34, 33)}
		<path d="M42,36 L54,34 L42,40 Z" fill="#f2c230" />
		<path d="M28,48 Q32,56 36,48" fill="#ef8c3b" />
	{:else if face === 'fish'}
		<ellipse cx="30" cy="32" rx="16" ry="11" fill="#5aa9e6" />
		<path d="M44,32 L58,22 L58,42 Z" fill="#3d8fd1" />
		<circle cx="22" cy="30" r="2.8" fill="#4a2c2a" />
		<circle cx="23" cy="29" r="0.9" fill="#fff" />
		<path d="M14,32 Q10,28 14,24" stroke="#3d8fd1" stroke-width="3" fill="none" />
		<path d="M14,32 Q10,36 14,40" stroke="#3d8fd1" stroke-width="3" fill="none" />
	{:else if face === 'bunny'}
		<ellipse cx="24" cy="16" rx="6" ry="12" fill="#fffdf7" stroke="#ead9bd" stroke-width="2" />
		<ellipse cx="40" cy="16" rx="6" ry="12" fill="#fffdf7" stroke="#ead9bd" stroke-width="2" />
		<ellipse cx="24" cy="17" rx="2.8" ry="7" fill="#f4a3a3" opacity="0.8" />
		<ellipse cx="40" cy="17" rx="2.8" ry="7" fill="#f4a3a3" opacity="0.8" />
		<circle cx="32" cy="38" r="16" fill="#fffdf7" stroke="#ead9bd" stroke-width="2" />
		{@render eyes(32, 36)}
		<path
			d={mouth}
			transform="translate(0,2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'bear'}
		<circle cx="18" cy="20" r="8" fill="#a67c52" />
		<circle cx="46" cy="20" r="8" fill="#a67c52" />
		<circle cx="32" cy="36" r="18" fill="#c49a6c" />
		{@render eyes(32, 33)}
		<ellipse cx="32" cy="42" rx="7" ry="5" fill="#e8c9a0" />
		<path
			d={mouth}
			transform="translate(0,4)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'apple'}
		<rect x="30" y="10" width="4" height="9" rx="2" fill="#8a5a3b" />
		<ellipse cx="40" cy="15" rx="7" ry="4" fill="#6aa84f" transform="rotate(-25 40 15)" />
		<circle cx="32" cy="37" r="18" fill="#e4574f" />
		{@render eyes(32, 34)}
		<path
			d={mouth}
			transform="translate(0,2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'banana'}
		<path
			d="M18,20 Q12,36 22,50 Q34,56 44,46 Q40,30 28,18 Z"
			fill="#f2c230"
			stroke="#e0a820"
			stroke-width="2"
		/>
		{@render eyes(30, 34)}
		<path
			d={mouth}
			transform="translate(-2,2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'carrot'}
		<path d="M32,14 L20,52 L44,52 Z" fill="#ef8c3b" />
		<path d="M26,12 Q32,4 38,12 Q32,16 26,12 Z" fill="#5da85f" />
		{@render eyes(32, 34)}
		<path
			d={mouth}
			transform="translate(0,4)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'bread'}
		<ellipse cx="32" cy="36" rx="20" ry="14" fill="#e8c48a" />
		<ellipse cx="32" cy="30" rx="16" ry="8" fill="#f0d6a8" />
		{@render eyes(32, 34)}
		<path
			d={mouth}
			transform="translate(0,2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'cookie'}
		<circle cx="32" cy="34" r="18" fill="#d4a574" />
		<circle cx="24" cy="28" r="2.4" fill="#8a5a3b" />
		<circle cx="38" cy="26" r="2.2" fill="#8a5a3b" />
		<circle cx="28" cy="40" r="2.2" fill="#8a5a3b" />
		<circle cx="40" cy="38" r="2.4" fill="#8a5a3b" />
		{@render eyes(32, 32)}
		<path
			d={mouth}
			transform="translate(0,0)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'cheese'}
		<path d="M12,44 L32,14 L52,44 Z" fill="#f2c230" stroke="#e0a820" stroke-width="2" />
		<circle cx="28" cy="34" r="3" fill="#e8b24a" />
		<circle cx="38" cy="38" r="2.4" fill="#e8b24a" />
		{@render eyes(32, 30)}
		<path
			d={mouth}
			transform="translate(0,-2)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'ball'}
		<circle cx="32" cy="34" r="18" fill="#e4574f" />
		<path d="M14,34 Q32,20 50,34 Q32,48 14,34 Z" fill="none" stroke="#fff" stroke-width="2.5" />
		<path d="M32,16 L32,52" stroke="#fff" stroke-width="2.5" />
		{@render eyes(32, 32)}
		<path
			d={mouth}
			transform="translate(0,0)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'block'}
		<rect x="14" y="18" width="36" height="36" rx="6" fill="#5aa9e6" />
		<rect x="18" y="22" width="28" height="10" rx="3" fill="#fff" opacity="0.35" />
		{@render eyes(32, 36)}
		<path
			d={mouth}
			transform="translate(0,4)"
			stroke="#4a2c2a"
			stroke-width="2.2"
			stroke-linecap="round"
			fill="none"
		/>
	{:else if face === 'car'}
		<rect x="10" y="30" width="44" height="16" rx="5" fill="#9b7ed9" />
		<path d="M18,30 L24,18 L40,18 L46,30 Z" fill="#b9a0e8" />
		<circle cx="20" cy="48" r="6" fill="#4a2c2a" />
		<circle cx="44" cy="48" r="6" fill="#4a2c2a" />
		{@render eyes(28, 28)}
	{:else if face === 'doll'}
		<circle cx="32" cy="18" r="10" fill="#f3e2cf" />
		{@render eyes(32, 17)}
		<path d="M28,22 Q32,25 36,22" stroke="#4a2c2a" stroke-width="1.8" fill="none" />
		<path d="M22,30 L42,30 L46,54 L18,54 Z" fill="#ef8c3b" />
		<rect x="18" y="34" width="8" height="16" rx="3" fill="#f3e2cf" />
		<rect x="38" y="34" width="8" height="16" rx="3" fill="#f3e2cf" />
	{:else if face === 'kite'}
		<path d="M32,8 L50,32 L32,40 L14,32 Z" fill="#5da85f" />
		<path d="M32,8 L32,40" stroke="#fff" stroke-width="2" />
		<path d="M14,32 L50,32" stroke="#fff" stroke-width="2" />
		<path
			d="M32,40 Q28,48 34,54 Q26,56 32,60"
			stroke="#e08a1a"
			stroke-width="2.4"
			fill="none"
			stroke-linecap="round"
		/>
	{:else}
		<!-- drum -->
		<ellipse cx="32" cy="42" rx="18" ry="10" fill="#c48a55" />
		<rect x="14" y="24" width="36" height="18" fill="#d4a574" />
		<ellipse cx="32" cy="24" rx="18" ry="10" fill="#e8c48a" />
		<path d="M20,18 L28,8" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round" />
		<path d="M44,18 L52,8" stroke="#8a5a3b" stroke-width="3" stroke-linecap="round" />
		{@render eyes(32, 24)}
	{/if}
</svg>
