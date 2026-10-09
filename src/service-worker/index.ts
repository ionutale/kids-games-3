import { immutable, assets, prerendered } from '$app/manifest';
import { version } from '$app/env';
import { self } from '$app/service-worker';

// One cache per build. Old caches go away on activate, so a redeploy
// never serves last month's game.
const CACHE = `lumi-${version}`;

const ASSETS = [...immutable, ...assets, ...prerendered].map((entry) => entry.path);

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE)
			.then((cache) => cache.addAll(ASSETS))
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	if (new URL(event.request.url).origin !== self.location.origin) return;

	event.respondWith(
		caches.match(event.request).then(
			(cached) =>
				cached ??
				fetch(event.request)
					.then((response) => {
						if (response.ok) {
							const copy = response.clone();
							caches.open(CACHE).then((cache) => cache.put(event.request, copy));
						}
						return response;
					})
					// Offline and never cached: fall back to the shelf.
					.catch(() =>
						caches.match('/').then((fallback) => {
							if (!fallback) throw new Error('offline and nothing cached');
							return fallback;
						})
					)
		)
	);
});
