# nano-binary-search [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/nano-binary-search.svg
[npm-url]: https://npmjs.org/package/nano-binary-search

A tiny, single-file binary search with no dependencies — plus the familiar sorted-array operations built on it: `indexOf()`, `includes()`, `insert()`, `remove()`, and friends. TypeScript typings are included.

After writing it countless times, I believe this version is done right and fits JavaScript &mdash; a perfect companion for sorted arrays.

What "done right" means here: **every result is a valid `Array.prototype.splice()` index, unconditionally.** Empty arrays, out-of-range values, duplicates, sub-ranges &mdash; all return an index you can pass straight to `splice()` without any check, and the array stays sorted afterwards. No ifs or buts.

This is equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.

## Installation

```bash
npm install nano-binary-search
```

## Quick reference

```js
import binarySearch from 'nano-binary-search';

// Lower bound (first element >= value):
binarySearch([1, 2, 4, 5], x => x < 3); // → 2

// Upper bound (first element > value):
binarySearch([1, 2, 4, 5], x => x <= 2); // → 2

// Insert keeping sorted order:
const idx = binarySearch(sortedArray, x => x < value);
sortedArray.splice(idx, 0, value);

// Remove all elements equal to value:
const lo = binarySearch(sortedArray, x => x < value);
const hi = binarySearch(sortedArray, x => x <= value, lo);
sortedArray.splice(lo, hi - lo);

// Edge cases — just work:
binarySearch([], x => x < 5); // → 0 (empty array)
binarySearch([1, 2, 3], x => x < 1); // → 0 (before all)
binarySearch([1, 2, 3], x => x < 4); // → 3 (after all)
```

The same operations — and more — are available as ready-made functions:

```js
import {indexOf, lastIndexOf, includes, count, insert, remove, removeAll} from 'nano-binary-search';

const a = [1, 3, 3, 5];

indexOf(a, 3); // → 1 (first of the run)
lastIndexOf(a, 3); // → 2
includes(a, 4); // → false
count(a, 3); // → 2

insert(a, 4); // → 3; a is now [1, 3, 3, 4, 5]
remove(a, 4); // → true; a is now [1, 3, 3, 5]
removeAll(a, 3); // → 2; a is now [1, 5]
```

## Why?

Why do I think it is done right? Because it supports important invariants with
[splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice).

### No need to worry about inserting values

```js
import binarySearch from 'nano-binary-search';

const sortedArray = [];

for (let i = 0; i < 100; ++i) {
  const value = Math.floor(Math.random() * 1000);

  // THIS IS THE IMPORTANT INVARIANT:
  // - works with `splice()` seamlessly to add values
  const index = binarySearch(sortedArray, x => x < value);
  sortedArray.splice(index, 0, value);
  // `sortedArray` is always sorted
}
```

What if the array is empty? That's fine. What if the value is outside the range of the array?
That's fine too.

This idiom ships ready-made as `insert(sortedArray, value)`.

### No need to worry about removing values

```js
import binarySearch from 'nano-binary-search';

const sortedArray = [1, 3, 3, 4];

// THIS IS THE IMPORTANT INVARIANT:
// - works with `splice()` seamlessly to remove equal values
const lowerIndex = binarySearch(sortedArray, x => x < 3),
  upperIndex = binarySearch(sortedArray, x => x <= 3, lowerIndex);
sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
// again, `sortedArray` is always sorted
```

What if there is no such value in the array? That's fine. It still works.

Packaged as `removeAll(sortedArray, value)`; `remove()` drops just the first match.

### API that makes sense

There is no need to pass in a function and a comparison value every time.
In modern JavaScript/TypeScript it is easier to capture the comparison value in a closure,
as shown in the examples above.

Do you want to search a sub-array? Just pass in indices.

## API

TypeScript-like API:

```ts
const index: number = binarySearch<T>(
  sortedArray: readonly T[],
  lessFn: (value: T, index: number, array: readonly T[]) => boolean,
  l: number = 0,
  r: number = sortedArray.length
): number;
```

- Inputs:
  - `sortedArray` &mdash; sorted array of values. The array must be sorted in a way compatible with `lessFn`.
  - `lessFn` &mdash; function that takes three arguments and returns `true` if the element
    (first argument) is less than the target value. The second argument is the index,
    the third is `sortedArray`. The signature mirrors the standard array callback convention.
  - `l` &mdash; left index. This index is inclusive. Defaults to 0.
  - `r` &mdash; right index. This index is exclusive. Defaults to `sortedArray.length`.

The function returns an index where the target value can be inserted with `splice()`:

- With `<`: the index of the first element greater than or equal to the target (**lower bound**, C++ `std::lower_bound` / Python `bisect_left`).
- With `<=`: the index of the first element greater than the target (**upper bound**, C++ `std::upper_bound` / Python `bisect_right`).

### Sorted-array functions

All of them are thin wrappers around `binarySearch()`. Instead of a closure they take the value directly plus an optional binary predicate `less(a, b)`,
which defaults to `(a, b) => a < b`. The array must be sorted compatibly with `less`, and the value must be comparable under it. Where equality is
needed, it is derived from the ordering — two values are equal when neither is less than the other — and costs a single extra `less()` call after the
search.

Queries (`l`/`r` are optional sub-range bounds, as in `binarySearch()`):

- `lowerBound(sortedArray, value, less?, l?, r?)` — the index of the first element ≥ `value`.
- `upperBound(sortedArray, value, less?, l?, r?)` — the index of the first element > `value`.
- `indexOf(sortedArray, value, less?, l?, r?)` — the index of the first equal element, or `-1`.
- `lastIndexOf(sortedArray, value, less?, l?, r?)` — the index of the last equal element, or `-1`.
- `includes(sortedArray, value, less?, l?, r?)` — whether an equal element is present.
- `equalRange(sortedArray, value, less?, l?, r?)` — the `[lo, hi)` span of equal elements; `splice(lo, hi - lo)` removes them all.
- `count(sortedArray, value, less?, l?, r?)` — the number of equal elements.

Mutators:

- `insert(sortedArray, value, less?)` — inserts keeping the sort order, after any equal elements (like Python's `bisect.insort`); returns the insertion index.
- `remove(sortedArray, value, less?)` — removes the first equal element; returns `true` if something was removed.
- `removeAll(sortedArray, value, less?)` — removes all equal elements; returns their number.

That's all Folks!

## Q & A

**Is it fast?**

Yes.

The only way to make it meaningfully faster is to inline the entire search in your code, eliminating the function-call overhead of `lessFn()`.

**What if I want to take into account the index of the searched value?**

That's why `lessFn(value, index, array)` has extra arguments.

**What if the array uses a custom comparator for sorting, while this binary search uses a `less` function?**

Either convert it inline:

```js
let compareFn; // some complex function defined elsewhere
sortedArray.sort(compareFn);

let value; // some search value defined elsewhere

const lessFn = x => compareFn(x, value) < 0,
  index = binarySearch(sortedArray, lessFn);
```

&mdash; or derive it with [`meta-toolkit`](https://github.com/uhop/meta-toolkit)'s comparator adapters, so sort and search stay in sync from a single source. The derived predicate plugs straight into every value-based function:

```js
import {lessFromCompare} from 'meta-toolkit/comparators';

const less = lessFromCompare(compareFn); // (a, b) => boolean, built once
sortedArray.sort(compareFn);
const index = indexOf(sortedArray, value, less);
```

The adapter approach pays off when one comparator drives multiple searches, when you need the inverse direction (`compareFromLess` &mdash; e.g., you started with a `less` function and need a `sort()` comparator), descending order (`reverseLess` / `reverseCompare`), or derived equality (`equalFromLess`). All five adapters live in [`meta-toolkit/comparators`](https://github.com/uhop/meta-toolkit).

**Why doesn't it use a comparator function for searching?**

Binary search does not need equality comparison &mdash; a simple `less` function is sufficient
and often easier to implement.

For example (two argument version for simplicity):

```js
const stringLessFn = (a, b) => a < b;

// comparator #1 (two comparisons)
const stringCompareFn1 = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// comparator #2: smarter (a method call)
const stringCompareFn2 = (a, b) => a.localeCompare(b);
```

**I still have questions!**

Look at the code of `index.js` and `tests/` for more details. Go to the GitHub repository and ask.

## License

This project is licensed under the BSD-3-Clause license.

## Release history

- 1.0.14 _Minor housekeeping. Updated dev deps_
- 1.0.13 _Updated dev deps_
- 1.0.12 _Exported `LessFn` type, added TS typing tests and CJS tests, improved docs and d.ts JSDoc_
- 1.0.11 _Technical release: more tests to increase coverage, more AI-friendly changes_
- 1.0.10 _Updated dev deps_
- 1.0.9 _Updated dev deps_
- 1.0.8 _Updated dev deps_
- 1.0.7 _Updated dev deps_
- 1.0.6 _Updated dev deps_
- 1.0.5 _Updated dev deps_
- 1.0.4 _Updated dev deps_
- 1.0.3 _Added a reference to the TS types_
- 1.0.2 _Improved docs_
- 1.0.1 _Added TS typings_
- 1.0.0 _Initial release_
