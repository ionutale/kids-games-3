<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocale, localizeHref, locales } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { loadProgress } from '#lib/progress.js';
	import FruitArt from '#lib/components/FruitArt.svelte';
	import favicon from '#lib/assets/favicon.svg';

	let cleared = $state(0);

	const locale = $derived(getLocale() as (typeof locales)[number]);
	const gameHref = $derived(localizeHref('/play/count-fruit', { locale }));

	onMount(() => {
		cleared = loadProgress(localStorage)['count-fruit'].cleared;
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
