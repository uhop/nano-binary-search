# Architecture

`nano-binary-search` is a single-file, zero-dependency ESM library: a binary search (lower bound) whose every result is a valid
`Array.prototype.splice()` index, plus a family of sorted-array operations built on it. It runs on Node.js (every non-EOL release), Bun, and Deno. No
build step, no transpilation — the published tarball is the source.

## Project layout

```
index.js       # The entire implementation — the core primitive and the derived family
index.d.ts     # Hand-written type declarations — the authoritative type contract
tests/
├── test-binary-search.js   # Core primitive tests (ESM)
├── test-sorted-ops.js      # Sorted-array functions tests (ESM)
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
- **Derived family, one-check equality.** The value-based functions (`lowerBound` … `removeAll`) are thin wrappers over the primitive taking a binary
  predicate `less(a, b)`. Equality is derived from the ordering, and the search postcondition already guarantees one direction, so each equality test
  adds a single `less` call. `insert` lands at the upper bound — after equal elements, `bisect.insort` semantics; `equalRange`/`count` need no equality
  checks at all.

## Type resolution

Three `package.json` fields, three roles, no duplication:

- `exports["."]` (string form) — modern resolvers; types route via the `// @ts-self-types="./index.d.ts"` directive in `index.js`.
- `types` — legacy TS resolvers.
- `main` — legacy CJS resolvers.

`index.js` exports `binarySearch` both as default and by name, so ESM default import and CJS destructure both work; the sorted-array functions are
named-only.

## Tests

Tests use `tape-six`; `package.json#tape6` declares the test glob and the importmap for the in-browser runner. The four files cover the core primitive
(ESM), the sorted-array family (ESM), the typings (TS), and CJS interop. CI runs the matrix of non-EOL Node versions on ubuntu-latest.
