import { buildClipper } from './lib/clipping';
const clipLib = await buildClipper();
console.log(clipLib);

(globalThis as any).clip = clipLib;
declare global {
	const clip: typeof clipLib;
}
