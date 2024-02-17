import {
  draw_exports
} from "./chunk-XN5PZ7IL.js";
import "./chunk-REREWCK7.js";

// src/canvas.ts
var canvas = document.querySelector("#canvas");
var width = canvas.width;
var height = canvas.height;
var ctx = canvas.getContext("2d");
var forExport = {
  width,
  height,
  r: min(width, height),
  canvas,
  ctx,
  d: draw_exports
};
Object.entries(forExport).forEach(([key, value]) => {
  globalThis[key] = value;
});
function setSize(width2, height2) {
  canvas.width = width2;
  canvas.height = height2;
  globalThis.width = width2;
  globalThis.height = height2;
  globalThis.r = min(width2, height2);
}
export {
  setSize
};
//# sourceMappingURL=canvas.js.map