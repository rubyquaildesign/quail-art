import * as clipperLibrary from 'js-angusj-clipper/universal';
import { ClipperLibWrapper } from 'js-angusj-clipper/universal';
import { V as Vec } from './vec-qmCeDHMU.js';

type Point = [number, number] | Vec | number[];
type Loop = Point[];
type Shape = Loop[];
type VecShape = Vec[][];
declare const jts: {
    miter: clipperLibrary.JoinType;
    round: clipperLibrary.JoinType;
    square: clipperLibrary.JoinType;
};
type JoinType = keyof typeof jts;
declare class Clip {
    ajc: ClipperLibWrapper;
    factor: number;
    preserveColinear: boolean;
    constructor(ajc: ClipperLibWrapper, factor?: number);
    private isLoop;
    private toShape;
    union(inputShapes: Shape | Shape[]): VecShape | undefined;
    intersect(subjectShape: Shape | Loop, clipShape: Shape | Loop): VecShape | undefined;
    offset(subjectSet: Shape | Loop | Shape[], ammount: number, joinType?: JoinType, miterLimit?: number): VecShape | undefined;
}

declare const clipLib: Clip;
declare global {
    const clip: typeof clipLib;
}
