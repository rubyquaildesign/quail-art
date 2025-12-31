import { defineConfig } from 'vite';
export default defineConfig({
	root: 'test',
	build: {
		sourcemap: true,
		outDir: 'build',
		target: 'chrome100',
		minify: false,
	},
	server: {
		open: false,
		port: 8080,
	},
});
