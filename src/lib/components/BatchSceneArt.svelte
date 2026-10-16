<script lang="ts">
	/** Compact scene art for batch-25 classify games. */
	let { game, scene }: { game: string; scene: string } = $props();
	const label = $derived(scene.replace(/-/g, ' '));
	const hue = $derived(
		[...`${game}:${scene}`].reduce((n, c) => n + c.charCodeAt(0), 0) % 360
	);
</script>

<svg class="batch-scene-art" viewBox="0 0 120 120" role="img" aria-hidden="true">
	<rect width="120" height="120" rx="18" fill={`hsl(${hue} 45% 88%)`} />
	{#if scene.includes('light') || scene === 'red-light' || scene === 'green-light'}
		<rect x="48" y="18" width="24" height="70" rx="8" fill="#333" />
		<circle cx="60" cy="38" r="10" fill={scene.includes('red') ? '#e04040' : '#555'} class:pulse={scene.includes('red')} />
		<circle cx="60" cy="68" r="10" fill={scene.includes('green') ? '#40b060' : '#555'} class:pulse={scene.includes('green')} />
	{:else if scene.includes('bowl') || scene.includes('glass') || scene.includes('box-full') || scene.includes('box-empty')}
		{#if scene.includes('bowl')}
			<path class="bob" d="M28,48 H92 L84,84 H36 Z" fill="#d4a574" stroke="#a07850" stroke-width="3" />
			{#if scene.includes('full')}<ellipse cx="60" cy="56" rx="26" ry="8" fill="#7ec8e8" class="bob" />{/if}
		{:else if scene.includes('glass')}
			<path class="bob" d="M40,28 H80 L74,90 H46 Z" fill="#c8e4f4" stroke="#7aa0b8" stroke-width="3" />
			{#if scene.includes('full')}<path d="M48,48 H72 L70,86 H50 Z" fill="#5aa0d0" class="bob" />{/if}
		{:else}
			<rect class="bob" x="30" y="36" width="60" height="48" rx="4" fill="#e8a04a" stroke="#c08030" stroke-width="3" />
			{#if scene.includes('full')}
				<circle class="bob" cx="48" cy="54" r="8" fill="#e07070" /><circle class="bob" cx="70" cy="60" r="7" fill="#7ec8e8" />
			{/if}
		{/if}
	{:else if scene.includes('drum') || scene === 'siren' || scene === 'cheer'}
		<ellipse cx="60" cy="40" rx="28" ry="12" fill="#e07070" class="bounce" />
		<path class="soft" d="M32,40 V70 Q60,84 88,70 V40" fill="#c04040" />
	{:else if scene.includes('whisper') || scene === 'library' || scene === 'sleep'}
		<circle class="bob" cx="60" cy="48" r="22" fill="#f4d6a8" />
		<path d="M48,52 Q60,48 72,52" fill="none" stroke="#4a2c2a" stroke-width="3" class="soft" />
		{#if scene === 'library'}<rect x="28" y="78" width="64" height="14" fill="#7ec8e8" />{/if}
	{:else if ['cat','fish','dog','bird','tree','rock','ball','car','block','key','teddy','pillow','cotton','ant','elephant','house','truck','marble','seed','rooster','owl','bat','butterfly','squirrel','firefly'].includes(scene) || scene.startsWith('cat') || scene.startsWith('ball') || scene.startsWith('bike')}
		{#if scene.includes('elephant') || scene === 'house' || scene === 'truck'}
			<ellipse class="loom" cx="60" cy="62" rx="40" ry="28" fill="#c4a070" />
		{:else if scene.includes('ant') || scene === 'seed' || scene === 'marble'}
			<circle class="tiny" cx="60" cy="60" r="10" fill="#6a6a6a" />
		{:else if scene.includes('tree')}
			<rect x="54" y="55" width="12" height="30" fill="#8b5a3c" /><circle cx="60" cy="45" r="22" fill="#6fbf73" class="sway" />
		{:else if scene.includes('rock') || scene === 'block' || scene === 'key'}
			<ellipse cx="60" cy="64" rx="28" ry="18" fill="#8a8070" />
		{:else if scene.includes('pillow') || scene === 'teddy' || scene === 'cotton'}
			<ellipse class="soft" cx="60" cy="60" rx="32" ry="24" fill="#f0c0d0" />
		{:else if scene.includes('owl') || scene === 'bat' || scene === 'firefly'}
			<ellipse class="night" cx="60" cy="55" rx="26" ry="20" fill="#4a3a68" />
			<circle cx="50" cy="50" r="5" fill="#f5c84c" /><circle cx="70" cy="50" r="5" fill="#f5c84c" />
		{:else}
			<circle class="wiggle" cx="60" cy="52" r="24" fill="#f4d6a8" />
			<circle cx="50" cy="48" r="3" fill="#4a2c2a" /><circle cx="70" cy="48" r="3" fill="#4a2c2a" />
		{/if}
		{#if scene.includes('behind')}
			<rect x="20" y="30" width="40" height="60" rx="4" fill="#8b5a3c" opacity="0.85" />
		{/if}
	{:else if scene.includes('bark') || scene === 'sandpaper' || scene === 'pinecone'}
		<rect x="28" y="24" width="64" height="72" rx="6" fill="#a07850" />
		<path class="rough soft" d="M36,40 H84 M36,55 H80 M36,70 H84" stroke="#6a4a30" stroke-width="4" stroke-linecap="round" />
	{:else if scene.includes('glass') || scene === 'marble' || scene === 'mirror'}
		<rect
			class="shine bob"
			x="28"
			y="24"
			width="64"
			height="72"
			rx="6"
			fill="#d8eef8"
			stroke="#7ec8e8"
			stroke-width="3"
		/>
	{:else if scene.includes('magnet') || scene === 'paperclip' || scene === 'nail' || scene === 'wood' || scene === 'plastic' || scene === 'paper'}
		{#if scene === 'paperclip' || scene === 'nail' || scene === 'key'}
			<path class="pull" d="M40,30 Q30,60 50,80 Q70,90 70,50 Q70,30 50,30" fill="none" stroke="#888" stroke-width="6" />
			<rect x="78" y="40" width="18" height="40" rx="4" fill="#e04040" />
		{:else}
			<rect class="bob" x="34" y="30" width="52" height="60" rx="4" fill="#d4b896" />
		{/if}
	{:else if scene.includes('water') || scene.includes('juice') || scene.includes('milk') || scene === 'ice-cube'}
		{#if scene === 'ice-cube'}
			<rect class="bob" x="40" y="40" width="40" height="40" rx="4" fill="#d8eefc" stroke="#7ec8e8" stroke-width="3" />
		{:else}
			<path class="wave" d="M20,50 Q40,40 60,50 T100,50 V90 H20 Z" fill="#5aa0d0" />
		{/if}
	{:else if scene.includes('push') || scene.includes('pull')}
		<rect x="70" y="28" width="18" height="64" rx="2" fill="#d4a574" />
		<circle cx="40" cy="60" r="16" fill="#f4d6a8" class="nudge" />
		{#if scene.includes('push')}
			<path d="M56,60 H68" stroke="#4a2c2a" stroke-width="4" marker-end="url(#arrow)" />
		{:else}
			<path d="M68,60 H56" stroke="#4a2c2a" stroke-width="4" />
		{/if}
	{:else if scene.includes('in') || scene.includes('on') || scene.includes('under')}
		<rect class="soft" x="24" y="48" width="72" height="40" rx="4" fill="#c4a070" />
		{#if scene.includes('-in')}
			<circle class="bob" cx="60" cy="62" r="14" fill="#e07070" />
		{:else if scene.includes('-on')}
			<circle class="bob" cx="60" cy="36" r="14" fill="#7ec8e8" />
		{:else}
			<circle class="bob" cx="60" cy="96" r="12" fill="#6fbf73" />
		{/if}
	{:else if scene.includes('sunrise') || scene.includes('sunset') || scene.includes('breakfast') || scene.includes('pajamas') || scene.includes('bedtime') || scene.includes('brush')}
		<rect width="120" height="120" rx="18" fill={scene.includes('sun') || scene.includes('break') || scene.includes('brush') ? '#f0d080' : '#2a3048'} />
		<circle class="core" cx="60" cy={scene.includes('set') || scene.includes('bed') || scene.includes('pajama') ? 70 : 40} r="18" fill="#f5c84c" />
	{:else if scene.includes('clean') || scene.includes('messy') || scene.includes('muddy') || scene.includes('soap') || scene.includes('stain')}
		<ellipse cx="60" cy="64" rx="34" ry="16" fill="#eee" stroke="#bbb" stroke-width="3" class="bob" />
		{#if scene.includes('messy') || scene.includes('muddy') || scene.includes('stain')}
			<circle cx="48" cy="58" r="8" fill="#8a5a3a" /><circle cx="70" cy="66" r="6" fill="#6a4030" />
		{:else}
			<path class="shine" d="M40,56 Q60,48 80,56" stroke="#7ec8e8" stroke-width="4" fill="none" />
		{/if}
	{:else if scene.includes('share') || scene.includes('keep') || scene.includes('ask') || scene.includes('grab') || scene.includes('snatch') || scene.includes('raise') || scene.includes('please') || scene.includes('wait') || scene.includes('push-in') || scene.includes('take') || scene.includes('split') || scene.includes('pass') || scene.includes('hug') || scene.includes('own') || scene.includes('private') || scene.includes('hand-stop') || scene.includes('walk') || scene.includes('gate') || scene.includes('shoe') || scene.includes('gift') || scene.includes('book') || scene.includes('toy') || scene.includes('wood') || scene.includes('plastic') || scene.includes('paper') && !scene.includes('clip')}
		<circle class="bob" cx="40" cy="48" r="14" fill="#f4d6a8" />
		<circle class="bob" cx="80" cy="48" r="14" fill="#f4d6a8" />
		{#if scene.includes('share') || scene.includes('split') || scene.includes('pass') || scene.includes('ask') || scene.includes('raise') || scene.includes('please') || scene.includes('wait')}
			<path class="soft" d="M50,70 Q60,82 70,70" fill="none" stroke="#6fbf73" stroke-width="4" />
		{:else}
			<path class="soft" d="M54,60 L66,48" stroke="#e07070" stroke-width="4" />
		{/if}
	{:else}
		<text
			class="soft"
			x="60"
			y="64"
			text-anchor="middle"
			font-size="14"
			font-weight="700"
			fill="#4a2c2a">{label.slice(0, 10)}</text
		>
	{/if}
</svg>

<style>
	.batch-scene-art { width: 11rem; height: 11rem; display: block; margin: 0.35rem auto; }
	.pulse { animation: pulse 1.2s ease-in-out infinite; }
	.bounce { animation: bounce 0.9s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
	.bob { animation: bob 1.5s ease-in-out infinite; }
	.soft { animation: soft 2s ease-in-out infinite; }
	.sway { animation: sway 2.2s ease-in-out infinite; transform-origin: center bottom; transform-box: fill-box; }
	.loom { animation: loom 1.8s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
	.tiny { animation: tiny 1.8s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
	.wiggle { animation: bob 1.6s ease-in-out infinite; }
	.night { animation: glow 1.8s ease-in-out infinite; }
	.rough { stroke-dasharray: 2 6; }
	.shine { animation: shine 1.6s ease-in-out infinite; }
	.pull { animation: pull 1.4s ease-in-out infinite; }
	.wave { animation: wave 1.8s ease-in-out infinite; }
	.nudge { animation: nudge 1.2s ease-in-out infinite; }
	.core { animation: pulse 1.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
	@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
	@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
	@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
	@keyframes soft { 0%,100%{opacity:0.5} 50%{opacity:1} }
	@keyframes sway { 0%,100%{transform:rotate(-3deg)} 50%{transform:rotate(3deg)} }
	@keyframes loom { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
	@keyframes tiny { 0%,100%{transform:scale(1)} 50%{transform:scale(0.9)} }
	@keyframes glow { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.2)} }
	@keyframes shine { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.15)} }
	@keyframes pull { 0%,100%{transform:translateX(0)} 50%{transform:translateX(4px)} }
	@keyframes wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
	@keyframes nudge { 0%,100%{transform:translateX(0)} 50%{transform:translateX(6px)} }
</style>
