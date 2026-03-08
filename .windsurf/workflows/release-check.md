---
description: Pre-release verification checklist for nano-binary-search
---

# Release Check

Run through this checklist before publishing a new version.

## Steps

1. Check that `AGENTS.md` is up to date with any rule or workflow changes.
2. Check that `.windsurfrules`, `.clinerules`, `.cursorrules` are in sync with `AGENTS.md`.
3. Check that `llms.txt` is up to date with any API changes.
4. Check that `index.js` and `index.d.ts` are in sync (exports, types, JSDoc).
5. Check that `README.md` documents the current API accurately.
6. Verify `package.json`:
   - `files` array includes all necessary entries (`index.*`, `LICENSE`, `README.md`, `llms.txt`).
   - `exports` map is correct.
7. Bump `version` in `package.json`.
8. Update release history in `README.md`.
9. Run `npm install` to regenerate `package-lock.json`.
   // turbo
10. Run the full test suite with Node: `npm test`
    // turbo
11. Run tests with Bun: `npm run test:bun`
    // turbo
12. Run tests with Deno: `npm run test:deno`
    // turbo
13. Run TS tests with Bun: `npm run ts-test:bun`
    // turbo
14. Run TS tests with Deno: `npm run ts-test:deno`
    // turbo
15. Run TypeScript check: `npm run ts-check`
    // turbo
16. Run lint: `npm run lint`
    // turbo
17. Dry-run publish to verify package contents: `npm pack --dry-run`
