import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import adapter from './scripts/adapter-static-vercel-safe.js';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Same as adapter-static, but collapses Vercel's per-page trailing-slash
			// route pairs so we stay under the 2048 route cap.
			adapter: adapter()
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			emitTsDeclarations: true,
			// Bare "/" carries no locale so the first visit falls through to
			// cookie -> browser language -> Italian. Prefixed URLs (/it, /ro,
			// /en, /de) always win so shared links stay in their language.
			strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
			urlPatterns: [
				{
					pattern: '/:path(.*)?',
					localized: [
						['it', '/it/:path(.*)?'],
						['ro', '/ro/:path(.*)?'],
						['en', '/en/:path(.*)?'],
						['de', '/de/:path(.*)?']
					]
				}
			]
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
