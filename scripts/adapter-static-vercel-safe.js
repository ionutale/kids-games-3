/**
 * Wraps @sveltejs/adapter-static and, on Vercel, collapses the per-page
 * trailing-slash rewrite/redirect pairs into one regex rule.
 *
 * Vercel caps routes at 2048. Fully prerendered Lumi (4 locales × games ×
 * levels) crosses that because each HTML page adds two routing entries.
 * Overrides stay as-is; only the routes array is compacted.
 */
import adapter from '@sveltejs/adapter-static';
import fs from 'node:fs';

/**
 * @param {string} src
 * @param {string} location
 */
function isSlashRedirect(src, location) {
	const bare = src.replace(/\/\?$/, '').replace(/\/$/, '');
	return bare === location;
}

/**
 * @param {import('@sveltejs/kit').Builder['log']} log
 */
function compactVercelRoutes(log) {
	const configPath = '.vercel/output/config.json';
	if (!fs.existsSync(configPath)) return;

	const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
	const before = Array.isArray(config.routes) ? config.routes.length : 0;

	/** @type {any[]} */
	const kept = [];
	let dropped = 0;

	for (const route of config.routes ?? []) {
		if (route.handle || typeof route.src !== 'string') {
			kept.push(route);
			continue;
		}

		// Per-page rewrite: `/path` → `/path/`
		if (
			typeof route.dest === 'string' &&
			!route.status &&
			(route.dest === `${route.src}/` || route.dest === route.src.replace(/\/?$/, '/'))
		) {
			dropped += 1;
			continue;
		}

		// Per-page redirect: `/path/` → 308 `/path`
		if (
			route.status === 308 &&
			typeof route.headers?.Location === 'string' &&
			isSlashRedirect(route.src, route.headers.Location)
		) {
			dropped += 1;
			continue;
		}

		kept.push(route);
	}

	const slashRule = {
		src: '^/(.+)/$',
		headers: { Location: '/$1' },
		status: 308
	};

	const fsIndex = kept.findIndex((route) => route.handle === 'filesystem');
	if (fsIndex >= 0) kept.splice(fsIndex, 0, slashRule);
	else kept.push(slashRule);

	config.routes = kept;
	fs.writeFileSync(configPath, JSON.stringify(config, null, '  '));

	log?.success?.(
		`Compacted Vercel routes: ${before} → ${kept.length} (dropped ${dropped} trailing-slash pairs)`
	);
	console.log(
		`[@adapter-static-vercel-safe] Compacted Vercel routes: ${before} → ${kept.length} (dropped ${dropped} trailing-slash pairs)`
	);
}

/** @param {import('@sveltejs/adapter-static').AdapterOptions} [options] */
export default function (options) {
	const base = adapter(options);
	return {
		name: 'adapter-static-vercel-safe',
		/** @param {import('@sveltejs/kit').Builder} builder */
		async adapt(builder) {
			await base.adapt(builder);
			compactVercelRoutes(builder.log);
		}
	};
}
