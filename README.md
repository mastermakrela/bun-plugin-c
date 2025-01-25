# Bun C Plugin

As the name implies this [plugin](https://bun.sh/docs/runtime/plugins) allows you to import C files into typescript when using Bun.

This is mostly a proof of concept so no t all C code is supported — use at your own risk.

## Usage

1. install `bunx jsr add @mastermakrela/bun-plugin-c`

2. add `bun-plugin-c` to your `bunfig.toml`

   ```toml
   preload = ["@mastermakrela/bun-plugin-c"]
   ```

3. now in your typescript code you can import C files

   ```ts
   import _lib from "./lib.c";

   interface lib {
   	// this interface will be printed in console when the import is resolved
   }

   const lib = _lib as lib;

   lib.hello();
   ```

## How it works

The plugin analyzes the C to find all function declarations,
then compiles the file and returns a module with all the functions.

It also generates interface based on the C\* functions signatures.
They are printed in the console (for easy copy-pasting),
and are also available in the `lib.__types` variable.

All functions from the C file are available both as direct imports and as default exports:

```ts
import { hello } from "./lib.c";
import lib from "./lib.c";

// both are the same
hello();
lib.hello();
```

## Simple Example

```C
// lib.c
int add(int a, float b) {
    return a + (int)b; // Add the integer and truncated float
}

void double_number(int *x) {
    *x = 2 * *x;
}
```

```ts
import lib, { double_number } from "./lib.c";

const sum = lib.add(1, 2.5); // sum is 3

const x = new Uint32Array(1);
x[0] = sum;
double_number(x); // sum is 6
```

---

## TODOs

- replace parser with native one using [`onBeforeParse`](https://bun.sh/docs/bundler/plugins#onbeforeparse)
- figure out better way to handle ts types
