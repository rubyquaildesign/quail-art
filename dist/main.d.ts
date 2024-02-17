import * as d3 from 'd3';
export { d3 };
import { V as Vec } from './vec-qmCeDHMU.js';

declare const red = "#ff6188";
declare const purple = "#ab9df2";
declare const blue = "#78dce8";
declare const orange = "#fc9867";
declare const yellow = "#ffd866";
declare const green = "#a9dc76";
declare const grey = "#939293";
declare const black = "#2d2a2e";
declare const white = "#fcfcfa";
declare const fullWhite = "#ffffff";
declare const fullBlack = "#000000";
declare const deepBlue = "#6796e6";
declare const deepRed = "#f44747";
declare const deepPurple = "#b267e6";
declare const lightGrey = "#727072";
declare const silver = "#c1c0c0";
declare const plastic: {
    black: string;
    grey: string;
    white: string;
    red: string;
    yellow: string;
    green: string;
    cyan: string;
    blue: string;
    purple: string;
};

declare const __lib_colour_black: typeof black;
declare const __lib_colour_blue: typeof blue;
declare const __lib_colour_deepBlue: typeof deepBlue;
declare const __lib_colour_deepPurple: typeof deepPurple;
declare const __lib_colour_deepRed: typeof deepRed;
declare const __lib_colour_fullBlack: typeof fullBlack;
declare const __lib_colour_fullWhite: typeof fullWhite;
declare const __lib_colour_green: typeof green;
declare const __lib_colour_grey: typeof grey;
declare const __lib_colour_lightGrey: typeof lightGrey;
declare const __lib_colour_orange: typeof orange;
declare const __lib_colour_plastic: typeof plastic;
declare const __lib_colour_purple: typeof purple;
declare const __lib_colour_red: typeof red;
declare const __lib_colour_silver: typeof silver;
declare const __lib_colour_white: typeof white;
declare const __lib_colour_yellow: typeof yellow;
declare namespace __lib_colour {
  export { __lib_colour_black as black, __lib_colour_blue as blue, __lib_colour_deepBlue as deepBlue, __lib_colour_deepPurple as deepPurple, __lib_colour_deepRed as deepRed, __lib_colour_fullBlack as fullBlack, __lib_colour_fullWhite as fullWhite, __lib_colour_green as green, __lib_colour_grey as grey, __lib_colour_lightGrey as lightGrey, __lib_colour_orange as orange, __lib_colour_plastic as plastic, __lib_colour_purple as purple, __lib_colour_red as red, __lib_colour_silver as silver, __lib_colour_white as white, __lib_colour_yellow as yellow };
}

declare global {
    const random: () => number, floor: (x: number) => number, ceil: (x: number) => number, range: typeof d3.range, abs: (x: number) => number, c: typeof __lib_colour, atan2: (y: number, x: number) => number, sin: (x: number) => number, cos: (x: number) => number, tan: (x: number) => number, min: (...values: number[]) => number, max: (...values: number[]) => number, PI: number, TAU: number, sqrt: (x: number) => number, vec: (x: number, y: number) => Vec, lerp: typeof Vec.lerp, r2d: typeof Vec.rad2deg, d2r: typeof Vec.deg2rad;
}
