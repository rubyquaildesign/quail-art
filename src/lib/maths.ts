export * from './matrices';
export * from './vec';
export * from './xy-point-helpers';
export * from './line';
export * from './djikstra';
export * from './pg';
export * from './path';
export function mod(diviend: number, divisor: number) {
	const quotiont = Math.floor(diviend / divisor);
	return diviend - divisor * quotiont;
}
