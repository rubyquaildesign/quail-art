import { Matrix } from './matrices.js';

const PI: number = Math.PI;
const TAU: number = PI * 2;
const DEG: number = 180 / PI;
const { sin, cos, atan2, round, abs }: typeof Math = Math;
const EPSILON = 1e-6;
type Point = [number, number];
export type TransformMatrix = [
	[number, number, number],
	[number, number, number],
];
export type Vp = Point | number[];
const pointConstructor: new (...p: [number, number]) => [number, number] =
	// biome-ignore lint/suspicious/noExplicitAny: shenanigans
	Array as any;
export class Vec extends pointConstructor implements Point, Array<number> {
	static fromObject(input: { x: number; y: number }): Vec {
		return new Vec([input.x, input.y]);
	}

	static rad2deg(r: number): number {
		return r * DEG;
	}

	static deg2rad(d: number): number {
		return d / DEG;
	}

	static determinate(i: Vec, j: Vec): number {
		/* Matrix is  =
    | i.x  j.x |
    | i.y  j.y |

    det is equal to (i.x)(j.y) - (j.x)(i.y)
     */
		return i.x * j.y - j.x * i.y;
	}

	static direction(i: Vec, j: Vec, k: Vec): number {
		return Math.sign(Vec.determinate(k.sub(i), j.sub(i)));
	}

	static lerp(p0: Vp, p1: Vp, t: number): Vec {
		return new Vec(p0).add(new Vec(p1).sub(p0).mul(t));
	}

	static distance(a: Vec, b: Vec): number {
		return a.dist(b);
	}

	get x(): number {
		return this[0];
	}

	get y(): number {
		return this[1];
	}

	constructor(x: number, y: number);
	constructor(input: Vp);
	constructor(a: Vp | number, b?: number) {
		if (typeof a === 'number' && typeof b === 'number') {
			super(a, b);
		} else if (Array.isArray(a)) {
			super(a[0] ?? 0, a[1] ?? 0);
		} else {
			super(0, 0);
		}
	}

	*[Symbol.iterator](): ArrayIterator<number> {
		yield this[0];
		yield this[1];
		return undefined;
	}

	magnitude(): number {
		return this.len();
	}

	updateX(nx: number): Vec {
		return new Vec(nx, this.y);
	}

	updateY(ny: number): Vec {
		return new Vec(this.x, ny);
	}

	get tup(): readonly [number, number] {
		return new Vec(this.x, this.y) as readonly [x: number, y: number];
	}

	add(no: number): Vec;
	add(vec: Vp): Vec;
	add(inp: Vp | number): Vec {
		if (typeof inp === 'number') return new Vec(this.x + inp, this.y + inp);
		return new Vec(this.x + inp[0], this.y + inp[1]);
	}

	sub(no: number): Vec;
	sub(vec: Vp): Vec;
	sub(inp: Vp | number): Vec {
		if (typeof inp === 'number') return new Vec(this.x - inp, this.y - inp);
		return new Vec(this.x - inp[0], this.y - inp[1]);
	}

	mul(no: number): Vec;
	mul(vec: Vp): Vec;
	mul(inp: Vp | number): Vec {
		if (typeof inp === 'number') return new Vec(this.x * inp, this.y * inp);
		return new Vec(this.x * inp[0], this.y * inp[1]);
	}

	transformMatrix(mat: Matrix): Vec {
		if (mat.numCols !== 2 || mat.numRows > 2 || mat.numRows === 1) {
			throw new Error(`matrix misssized`);
		}

		const is3 = mat.numRows === 3;
		const vecMatForm = is3
			? new Matrix([[this.x], [this.y], [1]])
			: new Matrix([[this.x], [this.y]]);
		const result = mat.mul(vecMatForm);
		return new Vec(result[0][0], result[0][1]);
	}

	div(no: number): Vec;
	div(vec: Vp): Vec;
	div(inp: Vp | number): Vec {
		if (typeof inp === 'number') {
			if (inp === 0) return new Vec(0, 0);
			return new Vec(this.x / inp, this.y / inp);
		}

		const nx = inp[0] === 0 ? 0 : this.x / inp[0];
		const ny = inp[1] === 0 ? 0 : this.y / inp[1];
		return new Vec(nx, ny);
	}

	perpendicular(useX: boolean = false): Vec {
		if (useX) {
			return this.invertX();
		}

		return this.invertY();
	}

	setLength(length: number): Vec {
		const ang = this.angle();
		return this._update(cos(ang), sin(ang)).mul(length);
	}

	clampLength(length: number): Vec {
		if (this.magnitude() > length) return this.setLength(length);
		return this;
	}

	invertX(): Vec {
		return this.mul([-1, 1]);
	}

	invertY(): Vec {
		return this.mul([1, -1]);
	}

	invert(): Vec {
		return this.mul(-1);
	}

	round(): Vec {
		return this._update(round(this.x), round(this.y));
	}

	mixX(inp: Vp, amnt: number = 0.5): Vec {
		const nx = (1 - amnt) * this.x + amnt * inp[0];
		return this.updateX(nx);
	}

	mixY(inp: Vp, amnt: number = 0.5): Vec {
		const ny = (1 - amnt) * this.y + amnt * inp[1];
		return this.updateY(ny);
	}

	mix(inp: Vp, amnt: number = 0.5): Vec {
		const nx = (1 - amnt) * this.x + amnt * inp[0];
		const ny = (1 - amnt) * this.y + amnt * inp[1];
		return this._update(nx, ny);
	}

	/**
	* @description Clones vec
	* @returns  vec
    @deprecated
	*/
	clone(): Vec {
		return new Vec(this);
	}

	call(functor: (n: number) => number): Vec;
	call(xfunctor: (n: number) => number, yfunctor: (n: number) => number): Vec;
	call(functor: (n: number) => number, b?: (n: number) => number): Vec {
		if (b) {
			return this._update(functor(this.x), b(this.y));
		}

		return this._update(functor(this.x), functor(this.y));
	}

	dot(inp: Vp): number {
		return this.x * inp[0] + this.y * inp[1];
	}

	cross(inp: Vp): number {
		return Vec.determinate(this, new Vec(inp[0], inp[1]));
	}

	angle(): number {
		const a = atan2(this.y, this.x);
		return (TAU + a) % TAU;
	}

	rotate(amt: number): Vec {
		const { x, y } = this;
		const nx = x * cos(amt) - y * sin(amt);
		const ny = x * sin(amt) + y * cos(amt);
		return this._update(nx, ny);
	}

	rotateTo(ang: number): Vec {
		return this.rotate(ang - this.angle());
	}

	distSq(inp: Vp): number {
		const dx = this._distX(inp);
		const dy = this._distY(inp);
		return dx ** 2 + dy ** 2;
	}

	dist(inp: Vp): number {
		return Math.sqrt(this.distSq(inp));
	}

	manhattenDist(inp: Vp): number {
		return abs(inp[0] - this.x) + abs(inp[1] - this.y);
	}

	isEqualTo(inp: Vp): boolean {
		return abs(inp[0] - this.x) < EPSILON && abs(inp[1] - this.y) < EPSILON;
	}

	angleBetween(inp: Vp): number {
		const [x2, y2] = inp;
		const ang = Math.acos(
			(this.x * x2 + this.y * y2) / (this.len() * new Vec(x2, y2).len()),
		);
		return ang;
	}

	lenSq(): number {
		const { x, y } = this;
		return x ** 2 + y ** 2;
	}

	len(): number {
		return Math.sqrt(this.lenSq());
	}

	limitSq(max: number, value?: number): Vec {
		value = value ?? max;
		if (this.lenSq() > max) {
			return this.setLength(value);
		}

		return this;
	}

	limit(max: number, value?: number): Vec {
		value = value ?? max;
		if (this.len() > max) {
			return this.setLength(value);
		}

		return this;
	}

	norm(): Vec {
		const length = this.len();
		if (length === 0) {
			return this._update(1, 0);
		}

		return this.div(length);
	}

	toString(): string {
		return `x:${this.x}, y:${this.y}`;
	}

	inspect(): string {
		return this.toString();
	}

	projectOn(inp: Vp): Vec {
		const [ix, iy] = inp;
		const { x, y } = this;
		const coeff = (x * ix + y * iy) / (ix * ix + iy * iy);
		return new Vec(inp).mul(coeff);
	}

	isZero(): boolean {
		return this.x === 0 && this.y === 0;
	}

	equals([ix, iy]: Vp): boolean {
		return this.x === ix && this.y === iy;
	}

	matTransform(mat: TransformMatrix): Vec;
	matTransform(
		u: number,
		i: number,
		o: number,
		j: number,
		k: number,
		l: number,
	): Vec;

	matTransform(...args: Array<number | TransformMatrix>): Vec {
		if ((args[0] as TransformMatrix).length !== undefined) {
			return this._matTransform(args[0] as TransformMatrix);
		}

		const a = args as number[];
		const tm: TransformMatrix = [
			[a[0], a[1], a[2]],
			[a[3], a[4], a[5]],
		];
		return this._matTransform(tm);
	}

	private _update(x: number, y: number): Vec {
		return new Vec(x, y);
	}

	private _matTransform(mat: TransformMatrix): Vec {
		const x = mat[0][0] * this.x + mat[0][1] * this.y + mat[0][2];
		const y = mat[1][0] * this.x + mat[1][1] * this.y + mat[1][2];
		return new Vec(x, y);
	}

	private _distX(inp: Vp): number {
		return this.x - inp[0];
	}

	private _distY(inp: Vp): number {
		return this.y - inp[1];
	}
}
