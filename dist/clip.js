import {
  toVecShape,
  toXyShape
} from "./chunk-REREWCK7.js";

// src/lib/clipping.ts
import * as clipperLibrary from "js-angusj-clipper/universal";
function getLoopDepth(arr) {
  return Array.isArray(arr) ? 1 + getLoopDepth(arr[0]) : 0;
}
console.log("clippo");
console.log(clipperLibrary);
var c = clipperLibrary;
var jts = {
  miter: c.JoinType.Miter,
  round: c.JoinType.Round,
  square: c.JoinType.Square
};
var Clip = class {
  constructor(ajc, factor) {
    this.ajc = ajc;
    if (factor !== void 0) {
      this.factor = factor;
    }
  }
  factor = 1e3;
  preserveColinear = false;
  isLoop(source) {
    if (typeof source[0][0] === "number") {
      return true;
    }
    return false;
  }
  toShape(inputSet) {
    return this.isLoop(inputSet) ? [inputSet] : inputSet;
  }
  union(inputShapes) {
    const extractedShapes = this.isLoop(inputShapes[0]) ? [inputShapes] : inputShapes;
    const workingShapes = extractedShapes.map(
      (sh) => toXyShape(sh, this.factor)
    );
    const clipOptions = {
      clipType: c.ClipType.Union,
      subjectFillType: c.PolyFillType.NonZero,
      preserveCollinear: this.preserveColinear,
      subjectInputs: workingShapes.map((poly) => ({
        closed: true,
        data: poly
      }))
    };
    const result = this.ajc.clipToPaths(clipOptions);
    return toVecShape(result, this.factor);
  }
  intersect(subjectShape, clipShape) {
    const workingSubj = toXyShape(this.toShape(subjectShape), this.factor);
    const workingClip = toXyShape(this.toShape(clipShape), this.factor);
    const clipOptions = {
      clipType: c.ClipType.Intersection,
      subjectFillType: c.PolyFillType.EvenOdd,
      preserveCollinear: this.preserveColinear,
      subjectInputs: [
        {
          closed: true,
          data: workingSubj
        }
      ],
      clipInputs: [
        {
          data: workingClip
        }
      ]
    };
    const result = this.ajc.clipToPaths(clipOptions);
    return toVecShape(result, this.factor);
  }
  offset(subjectSet, ammount, joinType = "miter", miterLimit = 2) {
    const inputType = getLoopDepth(subjectSet);
    if (inputType > 4 || inputType < 2)
      throw new Error(`bad input not shape loop or list of shapes`);
    const workingShape = inputType === 4 ? subjectSet.map((s) => toXyShape(s)) : [this.toShape(subjectSet)].map(
      (s) => toXyShape(s, this.factor)
    );
    const workingAmmount = Math.round(ammount * this.factor);
    const offsetSettings = {
      delta: workingAmmount,
      miterLimit,
      arcTolerance: 5,
      offsetInputs: workingShape.map((sh) => ({
        data: sh,
        endType: c.EndType.ClosedPolygon,
        joinType: jts[joinType]
      }))
    };
    const output = this.ajc.offsetToPaths(offsetSettings);
    return output === void 0 ? void 0 : toVecShape(output, this.factor);
  }
};
async function buildClipper(factor) {
  console.log("building");
  const lib = await clipperLibrary.loadNativeClipperLibInstanceAsync(
    clipperLibrary.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback
  );
  return new Clip(lib, factor);
}

// src/clip.ts
var clipLib = await buildClipper();
console.log(clipLib);
globalThis.clip = clipLib;
//# sourceMappingURL=clip.js.map