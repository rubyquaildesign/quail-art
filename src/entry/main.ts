import { Vec } from '../lib/vec.js';
import { range } from 'd3';
import { c, maths as m } from '../lib/index.js';
/* eslint-disable no-var */

const PI = Math.PI;
const TAU = Math.PI * 2;
const vec = (x: number, y: number) => new Vec(x, y);
const { random, floor, ceil, abs, atan2, sin, cos, tan, min, max, sqrt } = Math;
const forExport = {
	random,
	floor,
	ceil,
	abs,
	range,
	m,
	c,
	atan2,
	sin,
	cos,
	tan,
	min,
	max,
	PI,
	TAU,
	sqrt,
	vec,
	lerp: Vec.lerp,
	r2d: Vec.rad2deg,
	d2r: Vec.deg2rad,
};
Object.entries(forExport).forEach(([key, value]) => {
	(globalThis as typeof globalThis & typeof forExport)[
		key as keyof typeof forExport
	] = value;
});
declare global {
	var {
		random,
		floor,
		ceil,
		range,
		abs,
		c,
		atan2,
		sin,
		cos,
		tan,
		min,
		max,
		PI,
		TAU,
		sqrt,
		vec,
		lerp,
		r2d,
		d2r,
	}: typeof forExport;
}
export * as d3 from 'd3';
