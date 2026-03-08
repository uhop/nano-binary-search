# AGENTS.md — nano-binary-search

> `nano-binary-search` is a single-function binary search (lower bound) for JavaScript. Zero dependencies, single file. Equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.

## Commands

- **Install:** `npm install`
- **Test:** `npm test`
- **Test (Bun):** `npm run test:bun`
- **Test (Deno):** `npm run test:deno`
- **TypeScript check:** `npm run ts-check`
- **Lint:** `npm run lint` (Prettier check)
- **Lint fix:** `npm run lint:fix`

## Project structure

```
nano-binary-search/
├── index.js        # Single source file — the entire implementation
├── index.d.ts      # TypeScript type definitions
├── package.json    # Package config; "tape6" section configures test discovery
├── llms.txt        # AI/LLM-readable API reference
├── tests/          # Test files using tape-six
│   └── test-binary-search.js
└── README.md       # Documentation
```

## Code style

- **ESM-only.** The project is `"type": "module"`. Use `import`/`export` syntax.
- **Prettier** for formatting (see `.prettierrc`): 160 char width, single quotes, no bracket spacing, no trailing commas, arrow parens "avoid".
- **Do not add comments or remove comments** unless explicitly asked.
- **Keep `index.js` and `index.d.ts` in sync.** The public API is a single function exported as both named and default export.

## Key conventions

- Zero runtime dependencies — never add packages to `dependencies`.
- Tests use `tape-six`. Test files match `tests/test-*.*js`.
- The function signature is `binarySearch(sortedArray, lessFn, l?, r?)` returning a number.
- `lessFn(value, index, array)` follows the array callback convention.
