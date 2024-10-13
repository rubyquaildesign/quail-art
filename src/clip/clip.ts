import { buildClipper } from '../lib/clipping.js';
const clipLib = await buildClipper();
console.log(clipLib);

(globalThis as any).clip = clipLib;
declare global {
	const clip: typeof clipLib;
}
