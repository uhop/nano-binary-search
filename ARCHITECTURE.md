# Architecture

`nano-binary-search` is a single-function, zero-dependency ESM library: a binary search (lower bound) whose every result is a valid
`Array.prototype.splice()` index. It runs on Node.js (every non-EOL release), Bun, and Deno. No build step, no transpilation — the published tarball is
the source.

## Project layout

```
index.js       # The entire implementation — one exported arrow function
index.d.ts     # Hand-written type declarations — the authoritative type contract
tests/
├── test-binary-search.js   # Functional tests (ESM)
├── test-types.ts           # TypeScript typing tests
└── test-cjs.cjs            # CommonJS usage tests
```

## Design

- **Splice-native invariant.** For any input — empty arrays, out-of-range pivots, duplicates, sub-ranges — the returned index can be passed straight to
  `splice()` and the array stays sorted. This structural guarantee, not the algorithm, is the library's differentiator.
- **`less` function, not a comparator.** Binary search needs no equality test; `lessFn(value, index, array)` follows the standard array-callback
  convention and is simpler to supply than a three-way comparator. Adapters between the two styles live in `meta-toolkit/comparators` (a documented
  companion, not a dependency).
- **Bounds as parameters.** `l` (inclusive) / `r` (exclusive) default to the whole array and enable sub-range searches — e.g. the remove-equal-run
  idiom passes the lower bound as `l` of the upper-bound search.

## Type resolution

Three `package.json` fields, three roles, no duplication:

- `exports["."]` (string form) — modern resolvers; types route via the `// @ts-self-types="./index.d.ts"` directive in `index.js`.
- `types` — legacy TS resolvers.
- `main` — legacy CJS resolvers.

`index.js` exports `binarySearch` both as default and by name, so ESM default import and CJS destructure both work.

## Tests

Tests use `tape-six`; `package.json#tape6` declares the test glob and the importmap for the in-browser runner. The three files cover the functional
surface (ESM), the typings (TS), and CJS interop. CI runs the matrix of non-EOL Node versions on ubuntu-latest.
