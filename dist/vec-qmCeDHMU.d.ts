declare class Matrix extends Array<number[]> {
    static fromDomMatrix(input: DOMMatrix): Matrix;
    numRows: number;
    numCols: number;
    constructor(data: number[][]);
    mapMatrix(func: (v: number, x: number, y: number) => number): Matrix;
    setPos(newValue: number, col: number, row: number): Matrix;
    mul(other: Matrix): Matrix;
}

type Point = [number, number];
type TransformMatrix = [
    [
        number,
        number,
        number
    ],
    [
        number,
        number,
        number
    ]
];
type Vp = Point | number[];
declare const pointConstructor: new (...p: [number, number]) => [number, number];
declare class Vec extends pointConstructor implements Point, Array<number> {
    static fromObject(input: {
        x: number;
        y: number;
    }): Vec;
    static rad2deg(r: number): number;
    static deg2rad(d: number): number;
    static determinate(i: Vec, j: Vec): number;
    static direction(i: Vec, j: Vec, k: Vec): number;
    static lerp(p0: Vp, p1: Vp, t: number): Vec;
    static distance(a: Vec, b: Vec): number;
    get x(): number;
    get y(): number;
    constructor(x: number, y: number);
    constructor(input: Vp);
    [Symbol.iterator](): Generator<number, undefined, unknown>;
    magnitude(): number;
    updateX(nx: number): Vec;
    updateY(ny: number): Vec;
    get tup(): readonly [x: number, y: number];
    add(no: number): Vec;
    add(vec: Vp): Vec;
    sub(no: number): Vec;
    sub(vec: Vp): Vec;
    mul(no: number): Vec;
    mul(vec: Vp): Vec;
    transformMatrix(mat: Matrix): Vec;
    div(no: number): Vec;
    div(vec: Vp): Vec;
    perpendicular(useX?: boolean): Vec;
    setLength(length: number): Vec;
    clampLength(length: number): Vec;
    invertX(): Vec;
    invertY(): Vec;
    invert(): Vec;
    round(): Vec;
    mixX(inp: Vp, amnt?: number): Vec;
    mixY(inp: Vp, amnt?: number): Vec;
    mix(inp: Vp, amnt?: number): Vec;
    /**
    * @description Clones vec
    * @returns  vec
    @deprecated
    */
    clone(): Vec;
    call(functor: (n: number) => number): Vec;
    call(xfunctor: (n: number) => number, yfunctor: (n: number) => number): Vec;
    dot(inp: Vp): number;
    cross(inp: Vp): number;
    angle(): number;
    rotate(amt: number): Vec;
    rotateTo(ang: number): Vec;
    distSq(inp: Vp): number;
    dist(inp: Vp): number;
    manhattenDist(inp: Vp): number;
    isEqualTo(inp: Vp): boolean;
    angleBetween(inp: Vp): number;
    lenSq(): number;
    len(): number;
    limitSq(max: number, value?: number): Vec;
    limit(max: number, value?: number): Vec;
    norm(): Vec;
    toString(): string;
    inspect(): string;
    projectOn(inp: Vp): Vec;
    isZero(): boolean;
    equals([ix, iy]: Vp): boolean;
    matTransform(mat: TransformMatrix): Vec;
    matTransform(u: number, i: number, o: number, j: number, k: number, l: number): Vec;
    private _update;
    private _matTransform;
    private _distX;
    private _distY;
}

export { Vec as V };
