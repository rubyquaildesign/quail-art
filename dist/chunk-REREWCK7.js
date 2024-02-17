var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/lib/matrices.ts
import { range } from "d3";
var Matrix = class _Matrix extends Array {
  static fromDomMatrix(input) {
    if (!input.is2D)
      throw new Error(`3D matrices are not supported`);
    return new this([
      [input.a, input.c, input.e],
      [input.b, input.d, input.f]
    ]);
  }
  numRows;
  numCols;
  constructor(data) {
    super(0);
    this.numCols = data[0].length;
    this.numRows = data.length;
    if (data.some((row) => row.length !== this.numCols)) {
      console.error(data);
      throw new Error(`import misssized`);
    }
    for (let i = 0; i < this.numRows; i++) {
      this[i] = [];
      for (let j = 0; j < this.numCols; j++) {
        this[i][j] = data[i][j];
      }
    }
  }
  mapMatrix(func) {
    const output = [];
    for (let r = 0; r < this.numRows; r++) {
      output[r] = [];
      for (let c = 0; c < this.numCols; c++) {
        output[r][c] = func(this[r][c], c, r);
      }
    }
    return new _Matrix(output);
  }
  setPos(newValue, col, row) {
    if (col >= this.numCols)
      throw new Error(
        `col ${col} is larger then matrix size of ${this.numCols}`
      );
    if (row >= this.numRows)
      throw new Error(
        `col ${row} is larger then matrix size of ${this.numRows}`
      );
    const op = new _Matrix(this);
    op[row][col] = newValue;
    return op;
  }
  mul(other) {
    if (other.numRows !== this.numCols)
      throw new Error(`number of columns in the first matrix (${this.numCols}) should be
    the same as the number of rows in the second${other.numRows}`);
    const productRow = range(other.numCols).fill(0);
    const product = [];
    for (let p = 0; p < this.numRows; p++) {
      product[p] = productRow.slice();
    }
    for (let i = 0; i < this.numRows; i++)
      for (let j = 0; j < other.numCols; j++)
        for (let k = 0; k < this.numCols; k++) {
          product[i][j] += this[i][k] * other[k][j];
        }
    return new _Matrix(product);
  }
};

// src/lib/vec.ts
var PI = Math.PI;
var TAU = PI * 2;
var DEG = 180 / PI;
var { sin, cos, atan2, round, abs } = Math;
var EPSILON = 1e-6;
var pointConstructor = Array;
var Vec = class _Vec extends pointConstructor {
  static fromObject(input) {
    return new _Vec([input.x, input.y]);
  }
  static rad2deg(r) {
    return r * DEG;
  }
  static deg2rad(d) {
    return d / DEG;
  }
  static determinate(i, j) {
    return i.x * j.y - j.x * i.y;
  }
  static direction(i, j, k) {
    return Math.sign(_Vec.determinate(k.sub(i), j.sub(i)));
  }
  static lerp(p0, p1, t) {
    return new _Vec(p0).add(new _Vec(p1).sub(p0).mul(t));
  }
  static distance(a, b) {
    return a.dist(b);
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  constructor(a, b) {
    if (typeof a === "number" && typeof b === "number") {
      super(a, b);
    } else if (Array.isArray(a)) {
      super(a[0] ?? 0, a[1] ?? 0);
    } else {
      super(0, 0);
    }
  }
  *[Symbol.iterator]() {
    yield this[0];
    yield this[1];
    return void 0;
  }
  magnitude() {
    return this.len();
  }
  updateX(nx) {
    return new _Vec(nx, this.y);
  }
  updateY(ny) {
    return new _Vec(this.x, ny);
  }
  get tup() {
    return new _Vec(this.x, this.y);
  }
  add(inp) {
    if (typeof inp === "number")
      return new _Vec(this.x + inp, this.y + inp);
    return new _Vec(this.x + inp[0], this.y + inp[1]);
  }
  sub(inp) {
    if (typeof inp === "number")
      return new _Vec(this.x - inp, this.y - inp);
    return new _Vec(this.x - inp[0], this.y - inp[1]);
  }
  mul(inp) {
    if (typeof inp === "number")
      return new _Vec(this.x * inp, this.y * inp);
    return new _Vec(this.x * inp[0], this.y * inp[1]);
  }
  transformMatrix(mat) {
    if (mat.numCols !== 2 || mat.numRows > 2 || mat.numRows === 1) {
      throw new Error(`matrix misssized`);
    }
    const is3 = mat.numRows === 3;
    const vecMatForm = is3 ? new Matrix([[this.x], [this.y], [1]]) : new Matrix([[this.x], [this.y]]);
    const result = mat.mul(vecMatForm);
    return new _Vec(result[0][0], result[0][1]);
  }
  div(inp) {
    if (typeof inp === "number") {
      if (inp === 0)
        return new _Vec(0, 0);
      return new _Vec(this.x / inp, this.y / inp);
    }
    const nx = inp[0] === 0 ? 0 : this.x / inp[0];
    const ny = inp[1] === 0 ? 0 : this.y / inp[1];
    return new _Vec(nx, ny);
  }
  perpendicular(useX = false) {
    if (useX) {
      return this.invertX();
    }
    return this.invertY();
  }
  setLength(length) {
    const ang = this.angle();
    return this._update(cos(ang), sin(ang)).mul(length);
  }
  clampLength(length) {
    if (this.magnitude() > length)
      return this.setLength(length);
    return this;
  }
  invertX() {
    return this.mul([-1, 1]);
  }
  invertY() {
    return this.mul([1, -1]);
  }
  invert() {
    return this.mul(-1);
  }
  round() {
    return this._update(round(this.x), round(this.y));
  }
  mixX(inp, amnt = 0.5) {
    const nx = (1 - amnt) * this.x + amnt * inp[0];
    return this.updateX(nx);
  }
  mixY(inp, amnt = 0.5) {
    const ny = (1 - amnt) * this.y + amnt * inp[1];
    return this.updateY(ny);
  }
  mix(inp, amnt = 0.5) {
    const nx = (1 - amnt) * this.x + amnt * inp[0];
    const ny = (1 - amnt) * this.y + amnt * inp[1];
    return this._update(nx, ny);
  }
  /**
  * @description Clones vec
  * @returns  vec
     @deprecated
  */
  clone() {
    return new _Vec(this);
  }
  call(functor, b) {
    if (b) {
      return this._update(functor(this.x), b(this.y));
    }
    return this._update(functor(this.x), functor(this.y));
  }
  dot(inp) {
    return this.x * inp[0] + this.y * inp[1];
  }
  cross(inp) {
    return _Vec.determinate(this, new _Vec(inp[0], inp[1]));
  }
  angle() {
    const a = atan2(this.y, this.x);
    return (TAU + a) % TAU;
  }
  rotate(amt) {
    const { x, y } = this;
    const nx = x * cos(amt) - y * sin(amt);
    const ny = x * sin(amt) + y * cos(amt);
    return this._update(nx, ny);
  }
  rotateTo(ang) {
    return this.rotate(ang - this.angle());
  }
  distSq(inp) {
    const dx = this._distX(inp);
    const dy = this._distY(inp);
    return dx ** 2 + dy ** 2;
  }
  dist(inp) {
    return Math.sqrt(this.distSq(inp));
  }
  manhattenDist(inp) {
    return abs(inp[0] - this.x) + abs(inp[1] - this.y);
  }
  isEqualTo(inp) {
    return abs(inp[0] - this.x) < EPSILON && abs(inp[1] - this.y) < EPSILON;
  }
  angleBetween(inp) {
    const [x2, y2] = inp;
    const ang = Math.acos(
      (this.x * x2 + this.y * y2) / (this.len() * new _Vec(x2, y2).len())
    );
    return ang;
  }
  lenSq() {
    const { x, y } = this;
    return x ** 2 + y ** 2;
  }
  len() {
    return Math.sqrt(this.lenSq());
  }
  limitSq(max, value) {
    value = value ?? max;
    if (this.lenSq() > max) {
      return this.setLength(value);
    }
    return this;
  }
  limit(max, value) {
    value = value ?? max;
    if (this.len() > max) {
      return this.setLength(value);
    }
    return this;
  }
  norm() {
    const length = this.len();
    if (length === 0) {
      return this._update(1, 0);
    }
    return this.div(length);
  }
  toString() {
    return `x:${this.x}, y:${this.y}`;
  }
  inspect() {
    return this.toString();
  }
  projectOn(inp) {
    const [ix, iy] = inp;
    const { x, y } = this;
    const coeff = (x * ix + y * iy) / (ix * ix + iy * iy);
    return new _Vec(inp).mul(coeff);
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  equals([ix, iy]) {
    return this.x === ix && this.y === iy;
  }
  matTransform(...args) {
    if (args[0].length !== void 0) {
      return this._matTransform(args[0]);
    }
    const a = args;
    const tm = [
      [a[0], a[1], a[2]],
      [a[3], a[4], a[5]]
    ];
    return this._matTransform(tm);
  }
  _update(x, y) {
    return new _Vec(x, y);
  }
  _matTransform(mat) {
    const x = mat[0][0] * this.x + mat[0][1] * this.y + mat[0][2];
    const y = mat[1][0] * this.x + mat[1][1] * this.y + mat[1][2];
    return new _Vec(x, y);
  }
  _distX(inp) {
    return this.x - inp[0];
  }
  _distY(inp) {
    return this.y - inp[1];
  }
};

// src/lib/xy-point-helpers.ts
function toXyFactory(factor = 1e5) {
  const ft = factor;
  const converter = (pt) => {
    return { x: Math.round(pt[0] * ft), y: Math.round(pt[1] * ft) };
  };
  return converter;
}
function toVecFactory(factor = 1e5) {
  const ft = factor;
  const converter = (pt) => new Vec(pt.x / ft, pt.y / ft);
  return converter;
}
function toXy(pt, factor = 1e5) {
  return { x: Math.round(pt[0] * factor), y: Math.round(pt[1] * factor) };
}
function toVec(pt, factor = 1e5) {
  return new Vec(pt.x / factor, pt.y / factor);
}
function toXyLoop(loop, factor = 1e5) {
  const converter = toXyFactory(factor);
  return loop.map((p) => converter(p));
}
function toVecLoop(loop, factor = 1e5) {
  const converter = toVecFactory(factor);
  return loop.map((p) => converter(p));
}
function toXyShape(shape, factor = 1e5) {
  const converter = toXyFactory(factor);
  return shape.map((lp) => lp.map((pt) => converter(pt)));
}
function toVecShape(shape, factor = 1e5) {
  const converter = toVecFactory(factor);
  return shape.map((lp) => lp.map((pt) => converter(pt)));
}

export {
  __export,
  Matrix,
  Vec,
  toXyFactory,
  toVecFactory,
  toXy,
  toVec,
  toXyLoop,
  toVecLoop,
  toXyShape,
  toVecShape
};
//# sourceMappingURL=chunk-REREWCK7.js.map