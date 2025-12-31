import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'src/entry/main.ts',
		'src/canvas/canvas.ts',
		'src/webgpu/webgpu.ts',
		'src/webgpu/webgpu-utils.ts',
		'src/clip/clip.ts',
	],
	tsconfig: './tsconfig.json',
	format: 'esm',
	splitting: true,
	sourcemap: true,
	clean: true,
	dts: true,
	esbuildOptions(opt) {
		opt.loader = { ...opt.loader, '.wgsl': 'text' };
	},
});
