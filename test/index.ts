// Doesn't work shows what C stuff isn't parsed correctly
// import definitions from "./definitions.c";
// console.log(`🦔 ~ file: index.ts:2 ~ definitions:`, definitions);

import type { FFIType } from "bun:ffi";
import _lib from "./lib.c";
console.log(`🦔 ~ file: index.ts:3 ~ _lib:`, _lib);

interface lib {
	hello(): FFIType.int32_t;
	func2(_0: FFIType.int32_t, _1: FFIType.float): FFIType.int32_t;
	func1(): FFIType.void;
	double_number(_0: FFIType.ptr): FFIType.void;
}
const lib = _lib as lib;

const number = lib.hello();
console.log(`🦔 ~ file: index.ts:14 ~ number:`, number);

const sum = lib.func2(3, 4.5);
console.log(`🦔 ~ file: index.ts:16 ~ sum:`, sum);

// this should print something
lib.func1();

const x = new Uint32Array(1);
x[0] = 42;
lib.double_number(x);
console.log(`🦔 ~ file: index.ts:20 ~ x:`, x);
