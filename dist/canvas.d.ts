import './main.js';
import { path } from 'd3';
import { V as Vec } from './vec-qmCeDHMU.js';

type Loop$1 = [number, number][];
type SplineType = 'closed' | 'clamped' | 'open';
declare class BasisSpline {
    controlPoints: Vec[];
    type: SplineType;
    knots: number[];
    degree: number;
    useLUT: boolean;
    lut?: number[];
    totalLength?: number;
    interpolateLut?: (t: number) => number;
    depth: number;
    constructor(cps: Loop$1, degree: number, type: SplineType, useLUT?: boolean, depth?: number, knots?: number[]);
}
declare function bSpline(cps: Vec[], degree: number, closed?: SplineType, useLUT?: boolean, depth?: number): BasisSpline;

type BSpline = ReturnType<typeof bSpline>;
type Path = ReturnType<typeof path>;
type Drawable = Path | CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type TDPT = [number, number];
type Line = [TDPT, TDPT];
type Loop = TDPT[];
type Shape = Loop[];
type Pt = TDPT | number[];
type XYPt = {
    x: number;
    y: number;
};
declare const PI: number;
declare const TAU: number;
declare function equivilant(a: number, b: number): boolean;
declare function rndm(): number;
declare function rndm(max: number): number;
declare function rndm(min: number, max: number): number;
declare function flr(value: number): number;
declare function length<T extends XYPt | Pt>(a: T, b: T): number;
declare function sub(a: Pt, b: Pt): Pt;
declare function drawLine(line: Line, ctx: Path): string;
declare function drawLine(line: Line, ctx?: CanvasRenderingContext2D): void | string;
declare function drawLoop(loop: Loop | Iterable<Pt>, close: boolean, ctx: Path): string;
declare function drawLoop(loop: Loop | Iterable<Pt>, close: boolean, ctx?: CanvasRenderingContext2D, drawType?: 'fill' | 'stroke'): void | string;
declare function drawBezierLoop(loop: Loop, close: boolean, ctx: Path): string;
declare function drawBezierLoop(loop: Loop, close: boolean, ctx?: CanvasRenderingContext2D, drawType?: 'fill' | 'stroke'): void | string;
declare function drawShape(shape: Shape, ctx: Path): string;
declare function drawShape(shape: Shape, ctx?: CanvasRenderingContext2D, drawType?: 'fill' | 'stroke'): void | string;
declare function drawBezierShape(shape: Shape, ctx?: Path): string;
declare function drawBezierShape(shape: Shape, ctx: CanvasRenderingContext2D, drawType?: 'fill' | 'stroke'): void;
declare function drawDot(point: Pt, radius: number, ctx?: OffscreenCanvasRenderingContext2D | undefined, drawType?: 'fill' | 'stroke'): void;
declare function drawFauxQuadLoop(loop: Loop, close: boolean, ctx?: Path): string;
declare function drawFauxQuadLoop(loop: Loop, close: boolean, ctx: CanvasRenderingContext2D): void;
declare function drawFauxCubicLoop(loop: Loop, close: boolean, ctx?: Path): string;
declare function drawFauxCubicLoop(loop: Loop, close: boolean, ctx: CanvasRenderingContext2D): void;
declare function drawBSpline(spline: BSpline, ctx: Drawable, resolution?: number): void;

type draw_Loop = Loop;
declare const draw_PI: typeof PI;
type draw_Shape = Shape;
declare const draw_TAU: typeof TAU;
declare const draw_drawBSpline: typeof drawBSpline;
declare const draw_drawBezierLoop: typeof drawBezierLoop;
declare const draw_drawBezierShape: typeof drawBezierShape;
declare const draw_drawDot: typeof drawDot;
declare const draw_drawFauxCubicLoop: typeof drawFauxCubicLoop;
declare const draw_drawFauxQuadLoop: typeof drawFauxQuadLoop;
declare const draw_drawLine: typeof drawLine;
declare const draw_drawLoop: typeof drawLoop;
declare const draw_drawShape: typeof drawShape;
declare const draw_equivilant: typeof equivilant;
declare const draw_flr: typeof flr;
declare const draw_length: typeof length;
declare const draw_rndm: typeof rndm;
declare const draw_sub: typeof sub;
declare namespace draw {
  export { type draw_Loop as Loop, draw_PI as PI, type draw_Shape as Shape, draw_TAU as TAU, draw_drawBSpline as drawBSpline, draw_drawBezierLoop as drawBezierLoop, draw_drawBezierShape as drawBezierShape, draw_drawDot as drawDot, draw_drawFauxCubicLoop as drawFauxCubicLoop, draw_drawFauxQuadLoop as drawFauxQuadLoop, draw_drawLine as drawLine, draw_drawLoop as drawLoop, draw_drawShape as drawShape, draw_equivilant as equivilant, draw_flr as flr, draw_length as length, draw_rndm as rndm, draw_sub as sub };
}

declare global {
    const width: number, height: number, r: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, d: typeof draw;
}
declare function setSize(width: number, height: number): void;

export { setSize };
