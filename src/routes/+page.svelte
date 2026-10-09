<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { loadProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import ShapeArt from '#lib/components/ShapeArt.svelte';
	import BunnyFace from '#lib/components/BunnyFace.svelte';
	import favicon from '#lib/assets/favicon.svg';

	let cleared = $state(0);
	let clearedShapes = $state(0);
	let clearedFeelings = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const gameHref = $derived(localizeHref('/play/count-fruit', { locale }));
	const shapesHref = $derived(localizeHref('/play/color-shapes', { locale }));
	const feelingsHref = $derived(localizeHref('/play/feelings', { locale }));

	onMount(() => {
		const progress = loadProgress(localStorage);
		cleared = progress['count-fruit'].cleared;
		clearedShapes = progress['color-shapes'].cleared;
		clearedFeelings = progress['feelings'].cleared;
	});
</script>

<svelte:head>
	<title>Lumi — {m.game_name()}</title>
</svelte:head>

<div class="hero">
	<div class="hero-art">
		<img src={favicon} alt="" width="112" height="112" />
	</div>
	<h1>Lumi</h1>
	<p>{m.tagline()}</p>
</div>

<section class="card game-card" aria-label={m.game_name()}>
	<div class="thumb">
		<FruitArt fruit="apple" happy={true} />
	</div>
	<div>
		<h2>{m.game_name()}</h2>
		<p>{m.game_desc()}</p>
		<div class="row">
			<a class="btn" href={gameHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: cleared })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.shapes_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<ShapeArt shape="star" color="blue" happy={true} />
	</div>
	<div>
		<h2>{m.shapes_name()}</h2>
		<p>{m.shapes_desc()}</p>
		<div class="row">
			<a class="btn" href={shapesHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedShapes })}</span>
		</div>
	</div>
</section>

<section class="card game-card" aria-label={m.feelings_name()} style="margin-top: 1.25rem;">
	<div class="thumb">
		<BunnyFace emotion="happy" />
	</div>
	<div>
		<h2>{m.feelings_name()}</h2>
		<p>{m.feelings_desc()}</p>
		<div class="row">
			<a class="btn" href={feelingsHref}>{m.play()}</a>
			<span class="progress-note">{m.progress({ done: clearedFeelings })}</span>
		</div>
	</div>
</section>
