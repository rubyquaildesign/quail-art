import './main';
import { draw } from './lib';
const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext('2d')!;
const forExport = {
	width,
	height,
	r: min(width, height),
	canvas,
	ctx,
	d: draw,
};
Object.entries(forExport).forEach(([key, value]) => {
	(globalThis as any)[key] = value;
});
declare global {
	const { width, height, r, canvas, ctx, d }: typeof forExport;
}
export function setSize(width: number, height: number): void {
	canvas.width = width;
	canvas.height = height;
	(globalThis as any).width = width;
	(globalThis as any).height = height;
	(globalThis as any).r = min(width, height);
}
