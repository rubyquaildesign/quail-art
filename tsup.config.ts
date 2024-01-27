import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/main.ts', 'src/canvas.ts', 'src/webgpu.ts','src/clip.ts'],
	format: 'esm',
	splitting: true,
	minify: false,
	sourcemap: true,
	clean: true,
	dts: { entry: ['src/canvas.ts', 'src/main.ts', 'src/webgpu.ts', 'src/clip.ts'] },
});
