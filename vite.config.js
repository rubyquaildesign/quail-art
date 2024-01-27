import { defineConfig } from 'vite';
import plugin from '@rupertofly/wgsl-importable-plugin/vite';
export default defineConfig({
	build: {
		sourcemap: true,
		outDir: 'build',
		target: 'chrome100',
		minify: false,
	},
	plugins: [plugin()],
	server: {
		open: false,
		port: 8080,
	},
});
