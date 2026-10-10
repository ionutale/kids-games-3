<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { getLocale, locales, localizeHref, setLocale } from '#lib/paraglide/runtime.js';
	import { m } from '#lib/paraglide/messages.js';
	import { getSound, trackForPath, type SoundPlayer } from '#lib/music.js';
	import { loadMuted, saveMuted } from '#lib/progress.js';
	import favicon from '#lib/assets/favicon.svg';
	import LumiSun from '#lib/components/LumiSun.svelte';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	type Locale = (typeof locales)[number];

	let muted = $state(false);
	let rememberedLocale = $state<Locale | null>(null);
	let soundStarted = false;
	let player: SoundPlayer | null = null;

	const pathname = $derived(page.url.pathname);

	function pathLocale(path: string): Locale | null {
		const first = path.split('/').filter(Boolean)[0] ?? '';
		return (locales as readonly string[]).includes(first) ? (first as Locale) : null;
	}

	/** The language the child sees: the URL when prefixed, else the last choice. */
	const locale = $derived<Locale>(pathLocale(pathname) ?? rememberedLocale ?? 'it');

	function hrefFor(path: string, target: Locale = locale): string {
		return localizeHref(path, { locale: target });
	}

	function switchLanguage(event: MouseEvent, target: Locale): void {
		event.preventDefault();
		rememberedLocale = target;
		setLocale(target);
	}

	function toggleMute(): void {
		muted = !muted;
		if (typeof localStorage !== 'undefined') saveMuted(muted, localStorage);
		player?.setMuted(muted);
	}

	function startSound(): void {
		soundStarted = true;
		player?.unlock(trackForPath(page.url.pathname));
	}

	onMount(() => {
		const resolved = getLocale() as Locale;
		rememberedLocale = resolved;
		// Bare URLs are prerendered in Italian. Bounce once to the resolved
		// language so the URL, title and <html lang> always agree with it.
		if (pathLocale(page.url.pathname) === null && resolved !== 'it') {
			window.location.assign(localizeHref('/', { locale: resolved }));
			return;
		}
		muted = loadMuted(localStorage);
		player = getSound();
		player.setMuted(muted);
		window.addEventListener('pointerdown', startSound, { once: true });
		window.addEventListener('keydown', startSound, { once: true });
		return () => {
			window.removeEventListener('pointerdown', startSound);
			window.removeEventListener('keydown', startSound);
		};
	});

	// Crossfade between the home loop and the game loop on navigation.
	$effect(() => {
		if (soundStarted && player) player.switchTo(trackForPath(pathname));
	});
</script>

<svelte:head>
	<title>Lumi</title>
	<meta name="description" content={m.tagline()} />
	<meta name="theme-color" content="#fff7ec" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Lumi" />
	<link rel="manifest" href="/manifest.webmanifest" />
	<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="lumi-shell">
	<header class="lumi-header">
		<a class="brand" href={hrefFor('/')}>
			<LumiSun />
			<span>Lumi</span>
		</a>
		<div class="header-tools">
			<nav class="lang-switch" aria-label={m.language()}>
				{#each locales as target (target)}
					<a
						href={hrefFor(pathname, target)}
						data-sveltekit-reload
						aria-current={target === locale ? 'true' : undefined}
						onclick={(event) => switchLanguage(event, target)}
					>
						{target === 'it'
							? 'Italiano'
							: target === 'ro'
								? 'Română'
								: target === 'en'
									? 'English'
									: 'Deutsch'}
					</a>
				{/each}
			</nav>
			<button
				class="tool-btn"
				type="button"
				onclick={toggleMute}
				aria-label={muted ? m.unmute() : m.mute()}
				aria-pressed={muted}
				title={muted ? m.unmute() : m.mute()}
			>
				{#if muted}
					<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M4,9 v6 h4 l5,4 V5 L8,9 Z M16,9 l5,6 M21,9 l-5,6"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="none"
						/>
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
						<path
							d="M4,9 v6 h4 l5,4 V5 L8,9 Z M16,8 a5,5 0 0,1 0,8 M18.5,5.5 a9,9 0 0,1 0,13"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							fill="none"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</header>

	<main>
		{@render children()}
	</main>
</div>
