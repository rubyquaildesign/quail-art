import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'src/main.ts',
		'src/canvas/canvas.ts',
		'src/webgpu/webgpu.ts',
		'src/clip/clip.ts',
	],
	format: 'esm',
	splitting: true,
	minify: false,
	sourcemap: true,
	clean: true,
	dts: true,
});
