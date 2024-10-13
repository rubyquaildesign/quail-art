export * from './matrices.js';
export * from './vec.js';
export * from './xy-point-helpers.js';
export * from './line.js';
export * from './djikstra.js';
export * from './pg.js';
export * from './path.js';
export function mod(diviend: number, divisor: number) {
	const quotiont = Math.floor(diviend / divisor);
	return diviend - divisor * quotiont;
}
