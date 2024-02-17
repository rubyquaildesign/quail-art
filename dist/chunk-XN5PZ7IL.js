import {
  Matrix,
  Vec,
  __export,
  toVec,
  toVecFactory,
  toVecLoop,
  toVecShape,
  toXy,
  toXyFactory,
  toXyLoop,
  toXyShape
} from "./chunk-REREWCK7.js";

// src/main.ts
import { range as range2 } from "d3";

// src/lib/maths.ts
var maths_exports = {};
__export(maths_exports, {
  Line: () => Line,
  Matrix: () => Matrix,
  Vec: () => Vec,
  bSpline: () => bSpline,
  bsplineMat: () => bsplineMat,
  cubicBSplineToBezierSpline: () => cubicBSplineToBezierSpline,
  distToSegment: () => distToSegment,
  djikstraPath: () => djikstraPath,
  minDistFromCentroid: () => minDistFromCentroid,
  mod: () => mod,
  toVec: () => toVec,
  toVecFactory: () => toVecFactory,
  toVecLoop: () => toVecLoop,
  toVecShape: () => toVecShape,
  toXy: () => toXy,
  toXyFactory: () => toXyFactory,
  toXyLoop: () => toXyLoop,
  toXyShape: () => toXyShape
});

// src/lib/line.ts
var fractional = (t) => t >= 0 && t <= 1;
var Line = class _Line {
  start;
  end;
  constructor(a, b) {
    this.start = a;
    this.end = b;
  }
  get vector() {
    return this.end.sub(this.start);
  }
  get length() {
    return this.vector.len();
  }
  get arr() {
    return [this.start, this.end];
  }
  updateStart(n) {
    this.start = n.clone();
    return this;
  }
  updateEnd(n) {
    this.end = n.clone();
    return this;
  }
  cloneLine() {
    return new _Line(this.start, this.end);
  }
  reverse() {
    const temporary = this.start;
    this.updateStart(this.end).updateEnd(temporary);
    return this;
  }
  intersectionPoint(other) {
    const r = this.vector;
    const s = other.vector;
    const p = this.start;
    const q = other.start;
    const diffVec = q.sub(p);
    if (r.cross(s) === 0 && q.sub(p).cross(r) === 0) {
      const t0 = diffVec.dot(r) / r.dot(r);
      const t1 = t0 + s.dot(r) / r.dot(r);
      if (s.dot(r) < 0) {
        if (t1 > 1 || t0 < 0)
          return { kind: "parallel" /* parallel */, intersects: false };
        const minPoint2 = Math.max(0, t1);
        const maxPoint2 = Math.min(1, t0);
        return {
          kind: "overlap" /* overlap */,
          intersects: true,
          tRange: [minPoint2, maxPoint2]
        };
      }
      if (t0 > 1 || t1 < 0)
        return { kind: "parallel" /* parallel */, intersects: false };
      const minPoint = Math.max(0, t0);
      const maxPoint = Math.min(1, t1);
      return {
        kind: "overlap" /* overlap */,
        intersects: true,
        tRange: [minPoint, maxPoint]
      };
    }
    if (r.cross(s) === 0 && q.sub(p).cross(r) !== 0)
      return {
        kind: "parallel" /* parallel */,
        intersects: false
      };
    const t = diffVec.cross(s) / r.cross(s);
    const u = diffVec.cross(r) / r.cross(s);
    if (r.cross(s) && fractional(t) && fractional(u))
      return {
        kind: "intersect" /* intersect */,
        intersects: true,
        pt: p.add(r.mul(t)),
        tFromA: t
      };
    return { kind: "sepperate" /* sepperate */, intersects: false };
  }
  projectPointToLine(point) {
    const l2 = this.vector.lenSq();
    const pStart = point.sub(this.start);
    const t = pStart.dot(this.vector) / l2;
    const onLine = fractional(t);
    return { onLine, t, pt: this.vector.mul(t).add(this.start) };
  }
  minDistToPoint(point) {
    const l2 = this.vector.lenSq();
    if (l2 === 0) {
      return point.dist(this.start);
    }
    const proj = this.projectPointToLine(point);
    if (proj.onLine)
      return point.dist(proj.pt);
    if (proj.t < 0)
      return point.dist(this.start);
    return point.dist(this.end);
  }
  clockwiseDir() {
    return -1 * Math.sign(new Vec(0, 1).cross(this.vector)) * new Vec(0, 1).angleBetween(this.vector);
  }
  isEqualTo(other) {
    return this.start.isEqualTo(other.end) && this.end.isEqualTo(other.start) || this.start.isEqualTo(other.start) && this.end.isEqualTo(other.end);
  }
  clone() {
    return new _Line(this.start, this.end);
  }
  offsetStart(offset) {
    const t = this.vector.setLength(offset);
    return this.updateStart(this.start.add(t));
  }
  offsetEnd(offset) {
    const t = this.start.sub(this.end).setLength(offset);
    return this.updateEnd(this.end.add(t));
  }
  offsetBoth(offset) {
    return this.offsetStart(offset).offsetEnd(offset);
  }
};

// src/lib/djikstra.ts
import TinyQueue from "tinyqueue";
function djikstraPath(start, end, getNeighbours, getDistance = () => 1) {
  const frontier = new TinyQueue(
    void 0,
    (a, b) => b.n - a.n
  );
  frontier.push({ v: start, n: 0 });
  const cameFrom = /* @__PURE__ */ new Map();
  const distanceTo = /* @__PURE__ */ new Map();
  cameFrom.set(start, null);
  distanceTo.set(start, 0);
  while (frontier.length > 0) {
    const current = frontier.pop().v;
    if (current === end) {
      break;
    }
    for (const n of getNeighbours(current)) {
      const newDistance = distanceTo.get(current) + getDistance(current, n);
      if (!distanceTo.has(n) || newDistance < distanceTo.get(n)) {
        distanceTo.set(n, newDistance);
        frontier.push({ n: newDistance, v: n });
        cameFrom.set(n, current);
      }
    }
  }
  const path2 = [end];
  if (!cameFrom.has(end))
    throw new Error("No Route Found");
  let next = cameFrom.get(end);
  while (next !== void 0 && next !== null) {
    path2.unshift(next);
    next = cameFrom.get(next);
  }
  return path2;
}

// src/lib/pg.ts
import { polygonCentroid } from "d3";
function sqr(x) {
  return x * x;
}
function dist2(v, w) {
  return sqr(v[0] - w[0]) + sqr(v[1] - w[1]);
}
function distToSegmentSquared(p, v, w) {
  const l2 = dist2(v, w);
  if (l2 === 0)
    return dist2(p, v);
  let t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
  t = Math.max(0, Math.min(1, t));
  return dist2(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])]);
}
function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}
function minDistFromCentroid(poly) {
  const c = polygonCentroid(poly);
  const r = [];
  for (let i = 0; i < poly.length; i++) {
    const thisP = poly[i];
    const nextP = poly[(i + 1) % poly.length];
    r.push(distToSegment(c, thisP, nextP));
  }
  return Math.min(...r);
}

// src/lib/path.ts
import { range } from "d3";
import { matrix, multiply } from "mathjs";

// src/lib/mat.json
var mat_default = { "1": { mathjs: "DenseMatrix", data: [[1, 0], [-1, 1]], size: [2, 2] }, "2": { mathjs: "DenseMatrix", data: [[0.5, 0.5, 0], [-1, 1, 0], [0.5, -1, 0.5]], size: [3, 3] }, "3": { mathjs: "DenseMatrix", data: [[0.16666666666666666, 0.6666666666666666, 0.16666666666666666, 0], [-0.5, 0, 0.5, 0], [0.5, -1, 0.5, 0], [-0.16666666666666666, 0.5, -0.5, 0.16666666666666666]], size: [4, 4] }, "4": { mathjs: "DenseMatrix", data: [[0.041666666666666664, 0.4583333333333333, 0.4583333333333333, 0.041666666666666664, 0], [-0.16666666666666666, -0.5, 0.5, 0.16666666666666666, 0], [0.25, -0.25, -0.25, 0.25, 0], [-0.16666666666666666, 0.5, -0.5, 0.16666666666666666, 0], [0.041666666666666664, -0.16666666666666666, 0.25, -0.16666666666666666, 0.041666666666666664]], size: [5, 5] }, "5": { mathjs: "DenseMatrix", data: [[0.008333333333333333, 0.21666666666666667, 0.55, 0.21666666666666667, 0.008333333333333333, 0], [-0.041666666666666664, -0.41666666666666663, 0, 0.41666666666666663, 0.041666666666666664, 0], [0.08333333333333333, 0.16666666666666666, -0.5, 0.16666666666666666, 0.08333333333333333, 0], [-0.08333333333333333, 0.16666666666666666, 0, -0.16666666666666666, 0.08333333333333333, 0], [0.041666666666666664, -0.16666666666666666, 0.25, -0.16666666666666666, 0.041666666666666664, 0], [-0.008333333333333333, 0.041666666666666664, -0.08333333333333333, 0.08333333333333333, -0.041666666666666664, 0.008333333333333333]], size: [6, 6] }, "6": { mathjs: "DenseMatrix", data: [[0.001388888888888889, 0.07916666666666666, 0.41944444444444445, 0.41944444444444445, 0.07916666666666666, 0.001388888888888889, 0], [-0.008333333333333333, -0.20833333333333334, -0.3333333333333333, 0.3333333333333333, 0.20833333333333334, 0.008333333333333333, 0], [0.020833333333333336, 0.18750000000000003, -0.20833333333333337, -0.20833333333333337, 0.18750000000000003, 0.020833333333333336, 0], [-0.02777777777777778, -0.02777777777777778, 0.22222222222222224, -0.22222222222222224, 0.02777777777777778, 0.02777777777777778, 0], [0.020833333333333336, -0.0625, 0.04166666666666667, 0.04166666666666667, -0.0625, 0.020833333333333336, 0], [-0.008333333333333333, 0.041666666666666664, -0.08333333333333333, 0.08333333333333333, -0.041666666666666664, 0.008333333333333333, 0], [0.001388888888888889, -0.008333333333333333, 0.020833333333333336, -0.02777777777777778, 0.020833333333333336, -0.008333333333333333, 0.001388888888888889]], size: [7, 7] }, "7": { mathjs: "DenseMatrix", data: [[1984126984126984e-19, 0.023809523809523808, 0.2363095238095238, 0.4793650793650794, 0.2363095238095238, 0.023809523809523808, 1984126984126984e-19, 0], [-0.001388888888888889, -0.07777777777777778, -0.3402777777777778, 0, 0.3402777777777778, 0.07777777777777778, 0.001388888888888889, 0], [0.004166666666666667, 0.1, 0.0625, -0.3333333333333333, 0.0625, 0.1, 0.004166666666666667, 0], [-0.006944444444444444, -0.05555555555555555, 0.13194444444444445, 0, -0.13194444444444445, 0.05555555555555555, 0.006944444444444444, 0], [0.006944444444444444, 0, -0.0625, 0.1111111111111111, -0.0625, 0, 0.006944444444444444, 0], [-0.004166666666666667, 0.016666666666666666, -0.020833333333333332, 0, 0.020833333333333332, -0.016666666666666666, 0.004166666666666667, 0], [0.001388888888888889, -0.008333333333333333, 0.020833333333333336, -0.02777777777777778, 0.020833333333333336, -0.008333333333333333, 0.001388888888888889, 0], [-1984126984126984e-19, 0.001388888888888889, -0.004166666666666667, 0.006944444444444444, -0.006944444444444444, 0.004166666666666667, -0.001388888888888889, 1984126984126984e-19]], size: [8, 8] }, "8": { mathjs: "DenseMatrix", data: [[248015873015873e-19, 0.006125992063492063, 0.10647321428571428, 0.38737599206349205, 0.38737599206349205, 0.10647321428571428, 0.006125992063492063, 248015873015873e-19, 0], [-1984126984126984e-19, -0.02361111111111111, -0.2125, -0.24305555555555555, 0.24305555555555555, 0.2125, 0.02361111111111111, 1984126984126984e-19, 0], [6944444444444445e-19, 0.03819444444444445, 0.13125, -0.1701388888888889, -0.1701388888888889, 0.13125, 0.03819444444444445, 6944444444444445e-19, 0], [-0.001388888888888889, -0.03194444444444445, 0.0125, 0.13194444444444445, -0.13194444444444445, -0.0125, 0.03194444444444445, 0.001388888888888889, 0], [0.001736111111111111, 0.012152777777777776, -0.046875, 0.03298611111111111, 0.03298611111111111, -0.046875, 0.012152777777777776, 0.001736111111111111, 0], [-0.001388888888888889, 0.001388888888888889, 0.0125, -0.034722222222222224, 0.034722222222222224, -0.0125, -0.001388888888888889, 0.001388888888888889, 0], [6944444444444445e-19, -0.0034722222222222225, 625e-5, -0.0034722222222222225, -0.0034722222222222225, 625e-5, -0.0034722222222222225, 6944444444444445e-19, 0], [-1984126984126984e-19, 0.001388888888888889, -0.004166666666666667, 0.006944444444444444, -0.006944444444444444, 0.004166666666666667, -0.001388888888888889, 1984126984126984e-19, 0], [248015873015873e-19, -1984126984126984e-19, 6944444444444445e-19, -0.001388888888888889, 0.001736111111111111, -0.001388888888888889, 6944444444444445e-19, -1984126984126984e-19, 248015873015873e-19]], size: [9, 9] }, "9": { mathjs: "DenseMatrix", data: [[27557319223985893e-22, 0.0013833774250440918, 0.04025573192239859, 0.24314925044091712, 0.4304177689594357, 0.24314925044091712, 0.04025573192239859, 0.0013833774250440918, 27557319223985893e-22, 0], [-248015873015873e-19, -0.006101190476190476, -0.10034722222222223, -0.2809027777777778, 0, 0.2809027777777778, 0.10034722222222223, 0.006101190476190476, 248015873015873e-19, 0], [992063492063492e-19, 0.011706349206349206, 0.09444444444444444, 0.015277777777777777, -0.24305555555555555, 0.015277777777777777, 0.09444444444444444, 0.011706349206349206, 992063492063492e-19, 0], [-2314814814814815e-19, -0.0125, -0.031018518518518518, 0.10046296296296296, 0, -0.10046296296296296, 0.031018518518518518, 0.0125, 2314814814814815e-19, 0], [34722222222222224e-20, 0.0076388888888888895, -0.011111111111111112, -0.029861111111111113, 0.06597222222222222, -0.029861111111111113, -0.011111111111111112, 0.0076388888888888895, 34722222222222224e-20, 0], [-34722222222222224e-20, -0.0020833333333333333, 0.011805555555555555, -0.015972222222222224, 0, 0.015972222222222224, -0.011805555555555555, 0.0020833333333333333, 34722222222222224e-20, 0], [2314814814814815e-19, -462962962962963e-18, -0.001851851851851852, 0.007870370370370371, -0.011574074074074075, 0.007870370370370371, -0.001851851851851852, -462962962962963e-18, 2314814814814815e-19, 0], [-992063492063492e-19, 5952380952380953e-19, -0.001388888888888889, 0.001388888888888889, 0, -0.001388888888888889, 0.001388888888888889, -5952380952380953e-19, 992063492063492e-19, 0], [248015873015873e-19, -1984126984126984e-19, 6944444444444445e-19, -0.001388888888888889, 0.001736111111111111, -0.001388888888888889, 6944444444444445e-19, -1984126984126984e-19, 248015873015873e-19, 0], [-27557319223985893e-22, 248015873015873e-19, -992063492063492e-19, 2314814814814815e-19, -34722222222222224e-20, 34722222222222224e-20, -2314814814814815e-19, 992063492063492e-19, -248015873015873e-19, 27557319223985893e-22]], size: [10, 10] }, "10": { mathjs: "DenseMatrix", data: [[2755731922398589e-22, 27915564373897706e-20, 0.01318342151675485, 0.12543871252204583, 0.36109843474426806, 0.36109843474426806, 0.12543871252204583, 0.01318342151675485, 27915564373897706e-20, 2755731922398589e-22, 0], [-2755731922398589e-21, -0.001380621693121693, -0.038872354497354496, -0.2028935185185185, -0.1872685185185185, 0.1872685185185185, 0.2028935185185185, 0.038872354497354496, 0.001380621693121693, 2755731922398589e-21, 0], [12400793650793649e-21, 0.003038194444444444, 0.047123015873015865, 0.09027777777777776, -0.14045138888888886, -0.14045138888888886, 0.09027777777777776, 0.047123015873015865, 0.003038194444444444, 12400793650793649e-21, 0], [-33068783068783064e-21, -0.0038690476190476183, -0.027579365079365075, 0.026388888888888885, 0.0861111111111111, -0.0861111111111111, -0.026388888888888885, 0.027579365079365075, 0.0038690476190476183, 33068783068783064e-21, 0], [57870370370370366e-21, 0.0030671296296296293, 0.004629629629629629, -0.03287037037037037, 0.025115740740740737, 0.025115740740740737, -0.03287037037037037, 0.004629629629629629, 0.0030671296296296293, 57870370370370366e-21, 0], [-6944444444444444e-20, -0.0014583333333333334, 375e-5, 375e-5, -0.019166666666666665, 0.019166666666666665, -375e-5, -375e-5, 0.0014583333333333334, 6944444444444444e-20, 0], [57870370370370366e-21, 28935185185185184e-20, -0.0023148148148148147, 0.004629629629629629, -0.002662037037037037, -0.002662037037037037, 0.004629629629629629, -0.0023148148148148147, 28935185185185184e-20, 57870370370370366e-21, 0], [-33068783068783064e-21, 9920634920634919e-20, 19841269841269839e-20, -0.0013888888888888887, 0.0027777777777777775, -0.0027777777777777775, 0.0013888888888888887, -19841269841269839e-20, -9920634920634919e-20, 33068783068783064e-21, 0], [12400793650793649e-21, -8680555555555555e-20, 248015873015873e-18, -3472222222222222e-19, 1736111111111111e-19, 1736111111111111e-19, -3472222222222222e-19, 248015873015873e-18, -8680555555555555e-20, 12400793650793649e-21, 0], [-2755731922398589e-21, 24801587301587298e-21, -9920634920634919e-20, 23148148148148146e-20, -3472222222222222e-19, 3472222222222222e-19, -23148148148148146e-20, 9920634920634919e-20, -24801587301587298e-21, 2755731922398589e-21, 0], [2755731922398589e-22, -2755731922398589e-21, 12400793650793649e-21, -33068783068783064e-21, 57870370370370366e-21, -6944444444444444e-20, 57870370370370366e-21, -33068783068783064e-21, 12400793650793649e-21, -2755731922398589e-21, 2755731922398589e-22]], size: [11, 11] }, "11": { mathjs: "DenseMatrix", data: [[2505210838544172e-23, 51006092672759345e-21, 0.003823878667628668, 0.055202020202020204, 0.2439602873977874, 0.3939255651755652, 0.2439602873977874, 0.055202020202020204, 0.003823878667628668, 51006092672759345e-21, 2505210838544172e-23, 0], [-27557319223985894e-23, -27888007054673725e-20, -0.012904265873015875, -0.11225529100529101, -0.23565972222222226, 0, 0.23565972222222226, 0.11225529100529101, 0.012904265873015875, 27888007054673725e-20, 27557319223985894e-23, 0], [13778659611992946e-22, 6889329805996473e-19, 0.018745866402116403, 0.08201058201058202, -78125e-7, -0.18726851851851853, -78125e-7, 0.08201058201058202, 0.018745866402116403, 6889329805996473e-19, 13778659611992946e-22, 0], [-4133597883597884e-21, -0.0010085978835978836, -0.014694940476190478, -0.014384920634920636, 0.07690972222222223, 0, -0.07690972222222223, 0.014384920634920636, 0.014694940476190478, 0.0010085978835978836, 4133597883597884e-21, 0], [8267195767195768e-21, 9589947089947091e-19, 0.005927579365079366, -0.013492063492063493, -0.014930555555555556, 0.043055555555555555, -0.014930555555555556, -0.013492063492063493, 0.005927579365079366, 9589947089947091e-19, 8267195767195768e-21, 0], [-11574074074074075e-21, -6018518518518519e-19, -3125e-7, 0.007500000000000001, -0.011597222222222224, 0, 0.011597222222222224, -0.007500000000000001, 3125e-7, 6018518518518519e-19, 11574074074074075e-21, 0], [11574074074074075e-21, 2314814814814815e-19, -8680555555555556e-19, 0, 0.0038194444444444448, -0.006388888888888889, 0.0038194444444444448, 0, -8680555555555556e-19, 2314814814814815e-19, 11574074074074075e-21, 0], [-8267195767195768e-21, -3306878306878307e-20, 37202380952380956e-20, -9920634920634922e-19, 0.0010416666666666667, 0, -0.0010416666666666667, 9920634920634922e-19, -37202380952380956e-20, 3306878306878307e-20, 8267195767195768e-21, 0], [4133597883597884e-21, -16534391534391536e-21, -1240079365079365e-20, 1984126984126984e-19, -5208333333333333e-19, 6944444444444445e-19, -5208333333333333e-19, 1984126984126984e-19, -1240079365079365e-20, -16534391534391536e-21, 4133597883597884e-21, 0], [-13778659611992946e-22, 11022927689594357e-21, -37202380952380956e-21, 6613756613756614e-20, -5787037037037037e-20, 0, 5787037037037037e-20, -6613756613756614e-20, 37202380952380956e-21, -11022927689594357e-21, 13778659611992946e-22, 0], [27557319223985894e-23, -27557319223985893e-22, 12400793650793652e-21, -3306878306878307e-20, 5787037037037038e-20, -6944444444444446e-20, 5787037037037038e-20, -3306878306878307e-20, 12400793650793652e-21, -27557319223985893e-22, 27557319223985894e-23, 0], [-2505210838544172e-23, 27557319223985894e-23, -13778659611992946e-22, 4133597883597884e-21, -8267195767195768e-21, 11574074074074075e-21, -11574074074074075e-21, 8267195767195768e-21, -4133597883597884e-21, 13778659611992946e-22, -27557319223985894e-23, 2505210838544172e-23]], size: [12, 12] }, "12": { mathjs: "DenseMatrix", data: [[208767569878681e-23, 8523979878146545e-21, 9984747441344663e-19, 0.0212685824013949, 0.1384514665504249, 0.3392729502364919, 0.3392729502364919, 0.1384514665504249, 0.0212685824013949, 9984747441344663e-19, 8523979878146545e-21, 208767569878681e-23, 0], [-2505210838544172e-23, -509810405643739e-19, -0.0037728725749559084, -0.05137814153439154, -0.18875826719576722, -0.1499652777777778, 0.1499652777777778, 0.18875826719576722, 0.05137814153439154, 0.0037728725749559084, 509810405643739e-19, 2505210838544172e-23, 0], [13778659611992947e-23, 1393022486772487e-19, 0.006312692901234569, 0.04967551256613757, 0.061702215608465616, -0.11782986111111113, -0.11782986111111113, 0.061702215608465616, 0.04967551256613757, 0.006312692901234569, 1393022486772487e-19, 13778659611992947e-23, 0], [-4592886537330982e-22, -229185038212816e-18, -0.006018977807172252, -0.021088238536155202, 0.02994102733686067, 0.059818672839506176, -0.059818672839506176, -0.02994102733686067, 0.021088238536155202, 0.006018977807172252, 229185038212816e-18, 4592886537330982e-22, 0], [1033399470899471e-21, 25111607142857146e-20, 0.0034215856481481484, -7750496031746033e-20, -0.022823660714285716, 0.019227430555555557, 0.019227430555555557, -0.022823660714285716, -7750496031746033e-20, 0.0034215856481481484, 25111607142857146e-20, 1033399470899471e-21, 0], [-16534391534391535e-22, -19014550264550266e-20, -9937169312169312e-19, 0.0038839285714285716, 2876984126984127e-19, -0.011597222222222222, 0.011597222222222222, -2876984126984127e-19, -0.0038839285714285716, 9937169312169312e-19, 19014550264550266e-20, 16534391534391535e-22, 0], [19290123456790124e-22, 9837962962962963e-20, -4822530864197531e-20, -0.0013020833333333333, 0.0031828703703703706, -0.0019328703703703704, -0.0019328703703703704, 0.0031828703703703706, -0.0013020833333333333, -4822530864197531e-20, 9837962962962963e-20, 19290123456790124e-22, 0], [-16534391534391535e-22, -3141534391534392e-20, 15707671957671958e-20, -1240079365079365e-19, -5456349206349206e-19, 0.0014583333333333334, -0.0014583333333333334, 5456349206349206e-19, 1240079365079365e-19, -15707671957671958e-20, 3141534391534392e-20, 16534391534391535e-22, 0], [1033399470899471e-21, 31001984126984127e-22, -5063657407407408e-20, 17051091269841272e-20, -25421626984126986e-20, 13020833333333333e-20, 13020833333333333e-20, -25421626984126986e-20, 17051091269841272e-20, -5063657407407408e-20, 31001984126984127e-22, 1033399470899471e-21, 0], [-4592886537330982e-22, 2296443268665491e-21, -4592886537330982e-22, -23423721340388008e-21, 7991622574955909e-20, -13503086419753088e-20, 13503086419753088e-20, -7991622574955909e-20, 23423721340388008e-21, 4592886537330982e-22, -2296443268665491e-21, 4592886537330982e-22, 0], [13778659611992947e-23, -12400793650793653e-22, 4822530864197532e-21, -1033399470899471e-20, 12400793650793652e-21, -5787037037037038e-21, -5787037037037038e-21, 12400793650793652e-21, -1033399470899471e-20, 4822530864197532e-21, -12400793650793653e-22, 13778659611992947e-23, 0], [-2505210838544172e-23, 27557319223985894e-23, -13778659611992946e-22, 4133597883597884e-21, -8267195767195768e-21, 11574074074074075e-21, -11574074074074075e-21, 8267195767195768e-21, -4133597883597884e-21, 13778659611992946e-22, -27557319223985894e-23, 2505210838544172e-23, 0], [208767569878681e-23, -2505210838544172e-23, 13778659611992947e-23, -4592886537330982e-22, 1033399470899471e-21, -16534391534391535e-22, 19290123456790124e-22, -16534391534391535e-22, 1033399470899471e-21, -4592886537330982e-22, 13778659611992947e-23, -2505210838544172e-23, 208767569878681e-23]], size: [13, 13] } };

// src/lib/path.ts
var internalMats = [];
Object.keys(mat_default).forEach((k) => {
  const key = k;
  const data = mat_default[key].data;
  const mat = matrix(data);
  internalMats[Number.parseInt(key, 10)] = mat;
});
function bsplineMat(spline, t) {
  if (t >= 1)
    t = 1;
  const u = t * (spline.knots.length - spline.degree);
  const knotIndex = t === 1 ? u - 1 : Math.floor(u);
  const x = u - knotIndex;
  const sourcePoints = range(spline.degree + 1).map((d) => {
    return spline.controlPoints[spline.knots[knotIndex + d]];
  });
  return matsplineMult(spline.degree, x, sourcePoints);
}
function cubicBSplineToBezierSpline(spline) {
  if (spline.degree !== 3)
    throw new Error("spline is not degree 3");
  return range(spline.knots.length - 3).map((i) => {
    const pts = range(4).map((j) => spline.controlPoints[spline.knots[i + j]]);
    return bezierFromCubicBSplineSection(pts);
  });
}
function matsplineMult(degree, x, sourcePoints) {
  const inputMatrix = matrix(range(degree + 1).map((i) => x ** i));
  if (internalMats[degree] === void 0) {
    throw new Error(`no matrix for degree of ${degree}`);
  }
  const mat = internalMats[degree];
  const factors = multiply(inputMatrix, mat).toArray();
  const result = range(degree + 1).reduce((a, b) => {
    return a.add(sourcePoints[b].mul(factors[b]));
  }, new Vec(0, 0));
  return result;
}
function bezierFromCubicBSplineSection(pts) {
  if (pts.length < 4)
    throw new Error(`input is less then 4`);
  const a = matsplineMult(3, 0, pts);
  const d = matsplineMult(3, 1, pts);
  const b = Vec.lerp(pts[1], pts[2], 1 / 3);
  const c = Vec.lerp(pts[1], pts[2], 2 / 3);
  return [a, b, c, d];
}
function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  if (nums[left] === target)
    return 0;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] <= target && nums[mid + 1] > target)
      return mid;
    if (target < nums[mid])
      right = mid - 1;
    else
      left = mid + 1;
  }
  return -1;
}
var lutDepthEnum = {
  0: 256,
  1: 512,
  2: 1024,
  3: 2048
};
var BasisSpline = class {
  controlPoints;
  type;
  knots;
  degree;
  useLUT;
  lut;
  totalLength;
  interpolateLut;
  depth;
  constructor(cps, degree, type, useLUT = false, depth = 0, knots) {
    if (!(depth in lutDepthEnum)) {
      throw Error("depth is not 0,1,2,3");
    }
    this.type = type;
    this.useLUT = useLUT;
    this.depth = lutDepthEnum[depth];
    this.degree = degree;
    this.controlPoints = cps.map(([x, y]) => new Vec(x, y));
    const noPoints = this.controlPoints.length;
    if (type === "open") {
      this.knots = knots || [...range(noPoints)];
    } else if (type === "clamped") {
      const lastIndex = cps.length - 1;
      this.knots = knots || [
        ...Array.from({ length: degree - 1 }).fill(0),
        ...range(noPoints),
        ...Array.from({ length: degree - 1 }).fill(lastIndex)
      ];
    } else {
      this.knots = knots || [...range(noPoints), ...range(degree)];
    }
    if (this.useLUT) {
      this.lut = [];
      const distances = [];
      let dist = 0;
      let previous = bsplineMat(this, 0);
      for (let i = 1; i < this.depth; i++) {
        const t = i / (this.depth - 1);
        const next = bsplineMat(this, t);
        const sum = dist + next.sub(previous).len();
        distances[i] = sum;
        dist = sum;
        previous = next;
      }
      const max2 = distances[this.depth - 1];
      this.totalLength = max2;
      this.lut = distances.map((dist3) => dist3 / max2);
      this.lut[0] = 0;
      this.lut[this.depth - 1] = 1;
      const newLut = [];
      newLut[0] = 0;
      const maxValue = this.depth - 1;
      for (let i = 1; i < this.depth; i++) {
        const input = i / (this.depth - 1);
        let u = binarySearch(this.lut, input);
        if (u === -1) {
          u = this.depth - 1;
          newLut[i] = 1;
          continue;
        }
        const inputLower = u / maxValue;
        const inputUpper = (u + 1) / maxValue;
        const outputLower = this.lut[u];
        const outputUpper = this.lut[u + 1];
        const output = (input - inputLower) / (inputUpper - inputLower) * (outputUpper - outputLower) + outputLower;
        newLut[i] = output;
      }
      newLut[maxValue] = 1;
      this.lut = newLut;
      this.interpolateLut = (t) => {
        if (!this.lut)
          throw Error("no lut found");
        const lut = this.lut;
        if (t === 1)
          return 1;
        const u = t * (this.depth - 1);
        const a = Math.floor(u);
        const b = a + 1;
        const x = u - a;
        return lut[a] + x * (lut[b] - lut[a]);
      };
    }
  }
};
function bSpline(cps, degree, closed = "clamped", useLUT = false, depth = 2) {
  return new BasisSpline(cps, degree, closed, useLUT, depth);
}

// src/lib/maths.ts
function mod(diviend, divisor) {
  const quotiont = Math.floor(diviend / divisor);
  return diviend - divisor * quotiont;
}

// src/lib/draw.ts
var draw_exports = {};
__export(draw_exports, {
  PI: () => PI,
  TAU: () => TAU,
  drawBSpline: () => drawBSpline,
  drawBezierLoop: () => drawBezierLoop,
  drawBezierShape: () => drawBezierShape,
  drawDot: () => drawDot,
  drawFauxCubicLoop: () => drawFauxCubicLoop,
  drawFauxQuadLoop: () => drawFauxQuadLoop,
  drawLine: () => drawLine,
  drawLoop: () => drawLoop,
  drawShape: () => drawShape,
  equivilant: () => equivilant,
  flr: () => flr,
  length: () => length,
  rndm: () => rndm,
  sub: () => sub
});
import { path } from "d3";
var PI = Math.PI;
var TAU = 2 * Math.PI;
var sqrt = Math.sqrt;
var EPSILON = 1e-12;
function equivilant(a, b) {
  return Math.abs(a - b) < EPSILON;
}
function rndm(...args) {
  if (args[0] === void 0) {
    return Math.random();
  }
  if (args[1] === void 0) {
    return args[0] * Math.random();
  }
  return args[0] + Math.random() * (args[1] - args[0]);
}
function flr(value) {
  return Math.floor(value);
}
function lengthAr(a, b) {
  const xDist = (b[0] - a[0]) ** 2;
  const yDist = (b[1] - a[1]) ** 2;
  return sqrt(xDist + yDist);
}
function lenxy(a, b) {
  const xDist = (b.x - a.x) ** 2;
  const yDist = (b.y - a.y) ** 2;
  return sqrt(xDist + yDist);
}
function isXYPt(a) {
  return a.x !== void 0;
}
function length(a, b) {
  if (isXYPt(a) && isXYPt(b)) {
    return lenxy(a, b);
  }
  return lengthAr(a, b);
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1]];
}
function isCtx(ctx) {
  if (typeof window === "undefined")
    return false;
  return ctx instanceof CanvasRenderingContext2D;
}
function drawLine(line, ctx = typeof window !== "undefined" && "ctx" in window && window.ctx instanceof OffscreenCanvasRenderingContext2D ? window.ctx : path()) {
  ctx.moveTo(...line[0]);
  ctx.lineTo(...line[1]);
  if (!isCtx(ctx)) {
    return ctx.toString();
  }
}
function drawLoop(loop, close, ctx = typeof window !== "undefined" && "ctx" in window && window.ctx instanceof OffscreenCanvasRenderingContext2D ? window.ctx : path(), drawType) {
  let count = 0;
  for (const point of loop) {
    if (count < 1)
      ctx.moveTo(...point);
    else
      ctx.lineTo(...point);
    count++;
  }
  if (close)
    ctx.closePath();
  if (isCtx(ctx) && drawType === "fill")
    ctx.fill();
  if (isCtx(ctx) && drawType === "stroke")
    ctx.stroke();
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawBezierLoop(loop, close, ctx = typeof window !== "undefined" && "ctx" in window && window.ctx instanceof OffscreenCanvasRenderingContext2D ? window.ctx : path(), drawType) {
  for (let i = 0; i <= loop.length - 3; i += 4) {
    if (i === 0)
      ctx.moveTo(...loop[0]);
    else
      ctx.lineTo(...loop[i]);
    ctx.bezierCurveTo(
      loop[i + 1][0],
      loop[i + 1][1],
      loop[i + 2][0],
      loop[i + 2][1],
      loop[i + 3][0],
      loop[i + 3][1]
    );
  }
  if (close)
    ctx.closePath();
  if (isCtx(ctx) && drawType === "fill")
    ctx.fill();
  if (isCtx(ctx) && drawType === "stroke")
    ctx.stroke();
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawShape(shape, ctx = typeof window !== "undefined" && "ctx" in window && window.ctx instanceof OffscreenCanvasRenderingContext2D ? window.ctx : path(), drawType) {
  if (isCtx(ctx))
    ctx.beginPath();
  for (const loop of shape)
    drawLoop(loop, true, ctx);
  if (isCtx(ctx) && drawType === "fill")
    ctx.fill();
  if (isCtx(ctx) && drawType === "stroke")
    ctx.stroke();
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawBezierShape(shape, ctx = path(), drawType) {
  if (isCtx(ctx))
    ctx.beginPath();
  for (const loop of shape)
    drawBezierLoop(loop, true, ctx);
  if (isCtx(ctx) && drawType === "fill")
    ctx.fill();
  if (isCtx(ctx) && drawType === "stroke")
    ctx.stroke();
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawDot(point, radius, ctx = typeof window !== "undefined" && "ctx" in window && window.ctx instanceof OffscreenCanvasRenderingContext2D ? window.ctx : void 0, drawType) {
  const [x, y] = point;
  if (!ctx)
    throw Error("no context found");
  ctx.beginPath();
  ctx.ellipse(x, y, radius, radius, 0, 0, TAU);
  ctx.closePath();
  if (isCtx(ctx) && drawType === "fill")
    ctx.fill();
  if (isCtx(ctx) && drawType === "stroke")
    ctx.stroke();
}
function drawFauxQuadLoop(loop, close, ctx = path()) {
  const toDraw = loop.slice();
  const ptsNo = toDraw.length;
  if (close && ptsNo % 2)
    throw new Error(
      `in order to close a Faux quad loop, there needs to be an even number of input points. ${ptsNo} points where put in`
    );
  if (!close && !(ptsNo % 2))
    throw new Error(
      `in order to draw a open Faux quad loop, there needs to be an odd number of input points. ${ptsNo} points where put in`
    );
  const start = toDraw.shift();
  if (close)
    toDraw.push(start);
  ctx.moveTo(...start);
  for (let i = 0; i < toDraw.length; i += 2) {
    const [x1, y1, x2, y2] = [...toDraw[i], ...toDraw[i + 1]];
    ctx.quadraticCurveTo(x1, y1, x2, y2);
  }
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawFauxCubicLoop(loop, close, ctx = path()) {
  const toDraw = loop.slice();
  const inputLength = toDraw.length;
  const start = toDraw.shift();
  if (close)
    toDraw.push(start);
  ctx.moveTo(...start);
  let lasti = 0;
  for (let i = 0; i < inputLength - 2; i++) {
    const [x12, y12, x22, y22, x3, y3] = [
      ...toDraw[i],
      ...toDraw[i + 1],
      ...toDraw[i + 2]
    ];
    ctx.bezierCurveTo(x12, y12, x22, y22, x3, y3);
    lasti = i + 3;
  }
  let x1;
  let y1;
  let x2;
  let y2;
  switch (inputLength - lasti) {
    case 1:
      ctx.lineTo(...toDraw[lasti]);
      break;
    case 2:
      [x1, y1] = toDraw[lasti];
      [x2, y2] = toDraw[lasti + 1];
      ctx.quadraticCurveTo(x1, y1, x2, y2);
      break;
    default:
      break;
  }
  if (!isCtx(ctx))
    return ctx.toString();
}
function drawBSpline(spline, ctx, resolution = spline.controlPoints.length * 10) {
  const start = bsplineMat(spline, 0);
  ctx.moveTo(start.x, start.y);
  for (let i = 1; i <= resolution; i++) {
    const t = i / resolution;
    const pt = bsplineMat(spline, t);
    ctx.lineTo(pt.x, pt.y);
  }
  if (spline.type === "closed")
    ctx.closePath();
}

// src/lib/colour.ts
var colour_exports = {};
__export(colour_exports, {
  black: () => black,
  blue: () => blue,
  deepBlue: () => deepBlue,
  deepPurple: () => deepPurple,
  deepRed: () => deepRed,
  fullBlack: () => fullBlack,
  fullWhite: () => fullWhite,
  green: () => green,
  grey: () => grey,
  lightGrey: () => lightGrey,
  orange: () => orange,
  plastic: () => plastic,
  purple: () => purple,
  red: () => red,
  silver: () => silver,
  white: () => white,
  yellow: () => yellow
});
var red = "#ff6188";
var purple = "#ab9df2";
var blue = "#78dce8";
var orange = "#fc9867";
var yellow = "#ffd866";
var green = "#a9dc76";
var grey = "#939293";
var black = "#2d2a2e";
var white = "#fcfcfa";
var fullWhite = "#ffffff";
var fullBlack = "#000000";
var deepBlue = "#6796e6";
var deepRed = "#f44747";
var deepPurple = "#b267e6";
var lightGrey = "#727072";
var silver = "#c1c0c0";
var plastic = {
  black: "#181A1F",
  grey: "#5F6672",
  white: "#A9B2C3",
  red: "#E06C75",
  yellow: "#E5C07B",
  green: "#98C379",
  cyan: "#56B6C2",
  blue: "#61AFEF",
  purple: "#B57EDC"
};

// src/main.ts
import * as d3 from "d3";
var PI2 = Math.PI;
var TAU2 = Math.PI * 2;
var vec = (x, y) => new Vec(x, y);
var { random, floor, ceil, abs, atan2, sin, cos, tan, min, max, sqrt: sqrt2 } = Math;
var forExport = {
  random,
  floor,
  ceil,
  abs,
  range: range2,
  m: maths_exports,
  c: colour_exports,
  atan2,
  sin,
  cos,
  tan,
  min,
  max,
  PI: PI2,
  TAU: TAU2,
  sqrt: sqrt2,
  vec,
  lerp: Vec.lerp,
  r2d: Vec.rad2deg,
  d2r: Vec.deg2rad
};
Object.entries(forExport).forEach(([key, value]) => {
  globalThis[key] = value;
});

export {
  draw_exports,
  d3
};
//# sourceMappingURL=chunk-XN5PZ7IL.js.map