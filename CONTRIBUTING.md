# Contributing to nano-binary-search

## Prerequisites

- Node.js (any non-EOL release)
- npm

## Setup

```bash
git clone https://github.com/uhop/nano-binary-search.git
cd nano-binary-search
npm install
```

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the layout and design notes.

- `index.js` — the entire implementation
- `index.d.ts` — hand-written type declarations
- `tests/` — automated tests (tape-six)

## Development workflow

### Running tests

```bash
npm test               # all tests on Node
npm run test:bun       # run with Bun
npm run test:deno      # run with Deno
npm run ts-test        # TypeScript typing tests
npm run ts-check       # type-check with tsc --noEmit
```

### Linting

```bash
npm run lint           # check formatting with Prettier
npm run lint:fix       # fix formatting with Prettier
```

## Coding conventions

- **ESM-only**: use `import`/`export`; the package is `"type": "module"`.
- **Zero runtime dependencies** — never add packages to `dependencies`.
- **Keep `index.js` and `index.d.ts` in sync** — the `.d.ts` sidecar is the authoritative type contract.
- **Formatting**: Prettier — 160 char width, single quotes, no bracket spacing, no trailing commas, arrow parens "avoid".

## License

This project is distributed under the [BSD-3-Clause license](./LICENSE).
External contributions are accepted only under licenses compatible with
BSD-3-Clause; submissions under fundamentally incompatible licenses cannot
be merged.
