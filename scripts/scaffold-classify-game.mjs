#!/usr/bin/env node
/**
 * Scaffold a classify-style Lumi game from day-night templates.
 * Usage: node scripts/scaffold-classify-game.mjs <slug>
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: node scripts/scaffold-classify-game.mjs <slug>');
	process.exit(1);
}

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src/routes/play/day-night');
const dest = join(root, `src/routes/play/${slug}`);

function pascal(s) {
	return s
		.split('-')
		.map((p) => p[0].toUpperCase() + p.slice(1))
		.join('');
}

function camel(s) {
	const p = pascal(s);
	return p[0].toLowerCase() + p.slice(1);
}

function upper(s) {
	return s.replace(/-/g, '_').toUpperCase();
}

const P = pascal(slug);
const C = camel(slug);
const U = upper(slug);
const msg = slug.replace(/-/g, '');

function transform(text) {
	return text
		.replaceAll('day-night', slug)
		.replaceAll('DAY_NIGHT', U)
		.replaceAll('DayNight', P)
		.replaceAll('dayNight', C)
		.replaceAll('daynight', msg)
		.replaceAll('getDayNightLevel', `get${P}Level`)
		.replaceAll('#lib/day-night', `#lib/${slug}`);
}

mkdirSync(join(dest, '[level]'), { recursive: true });
for (const rel of ['+page.svelte', '[level]/+page.svelte', '[level]/+page.ts']) {
	const from = join(src, rel);
	const to = join(dest, rel);
	if (!existsSync(from)) continue;
	writeFileSync(to, transform(readFileSync(from, 'utf8')));
}
console.log(`Scaffolded routes for ${slug} → ${dest}`);
