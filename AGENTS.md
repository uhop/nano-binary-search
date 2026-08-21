# AGENTS.md — nano-binary-search

> `nano-binary-search` is a binary search (lower bound) plus sorted-array operations built on it (`indexOf`, `includes`, `insert`, `remove`, …) for JavaScript. Zero dependencies, single file. Equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.

## Commands

- **Install:** `npm install`
- **Test:** `npm test`
- **Test (Bun):** `npm run test:bun`
- **Test (Deno):** `npm run test:deno`
- **TS test:** `npm run ts-test`
- **TS test (Bun):** `npm run ts-test:bun`
- **TS test (Deno):** `npm run ts-test:deno`
- **TypeScript check:** `npm run ts-check`
- **Lint:** `npm run lint` (Prettier check)
- **Lint fix:** `npm run lint:fix`

## Project structure

```
nano-binary-search/
├── index.js        # Single source file — the entire implementation
├── index.d.ts      # TypeScript type definitions
├── package.json    # Package config; "tape6" section configures test discovery
├── INVARIANTS.md   # Machine-checkable contract (ships in the npm tarball)
├── llms.txt        # AI/LLM-readable API summary (ships in the npm tarball)
├── llms-full.txt   # AI/LLM-readable full API reference (ships in the npm tarball)
├── ARCHITECTURE.md # Internal layout and design notes
├── CONTRIBUTING.md # Contribution guide
├── tests/          # Test files using tape-six
│   ├── test-binary-search.js   # Core primitive tests (ESM)
│   ├── test-sorted-ops.js      # Sorted-array functions tests (ESM)
│   ├── test-invariants.js      # INVARIANTS.md claims as property tests
│   ├── test-types.ts           # TypeScript typing tests
│   └── test-cjs.cjs            # CommonJS usage tests
└── README.md       # Documentation
```

## Code style

- **ESM-only.** The project is `"type": "module"`. Use `import`/`export` syntax.
- **Prettier** for formatting (see `.prettierrc`): 160 char width, single quotes, no bracket spacing, no trailing commas, arrow parens "avoid".
- **No comments that narrate the code.** Don't write a comment that restates _what_ the code does. Allowed, each as the shortest possible marker: JSDoc when requested or required; a reference for a non-trivial algorithm; a non-trivial _decision_ or constraint — _why_ it's this way, including footgun/ordering caveats that have a real reason. The bar is _why_, never _what_. Strip narrating comments opportunistically in files you're already editing.
- **Keep `index.js` and `index.d.ts` in sync.** `binarySearch` is exported both named and default; the sorted-array functions are named-only. All JSDoc lives in `index.d.ts` — none in `index.js`; the `@ts-self-types` directive routes editors to the `.d.ts`.

## Writing tests

**Before writing or updating tests**, read the tape-six skill at `node_modules/tape-six/skills/write-tests/SKILL.md` and the testing guide at `node_modules/tape-six/TESTING.md`.

- Tests use `tape-six`. Test files match `tests/test-*.*js` (ESM + CJS) and `tests/test-*.*ts` (TypeScript).
- **ESM** (`.js`): `import test from 'tape-six'` and `import binarySearch from '../index.js'`.
- **CJS** (`.cjs`): `const {test} = require('tape-six')` and `const {binarySearch} = require('../index.js')`. Only use `await import()` if the module under test has top-level `await` (this one does not).
- **TypeScript** (`.ts`): same as ESM but with type annotations. TS tests exercise typings, not functionality.

## Key conventions

- Zero runtime dependencies — never add packages to `dependencies`.
- The core signature is `binarySearch(sortedArray, lessFn, l?, r?)` returning a number; `lessFn(value, index, array)` follows the array callback convention.
- The value-based functions take `(sortedArray, value, less?, l?, r?)` — mutators drop `l`/`r` — with a binary predicate `less(a, b)` defaulting to `(a, b) => a < b`.
- Equality is ordering-derived (equal ⇔ neither is less): one extra `less` call after the search. Never introduce a separate equality function.
