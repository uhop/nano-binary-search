# nano-binary-search [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/nano-binary-search.svg
[npm-url]: https://npmjs.org/package/nano-binary-search

A tiny, single-file binary search with no dependencies.
After writing it countless times, I believe this version is done right and fits JavaScript &mdash; ripe for reuse.

TypeScript typings are included.

This is equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.

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

That's all Folks!

## Q & A

**Is it fast?**

Yes.

The only way to make it meaningfully faster is to inline the entire search in your code, eliminating the function-call overhead of `lessFn()`.

**What if I want to take into account the index of the searched value?**

That's why `lessFn(value, index, array)` has extra arguments.

**What if the array uses a custom comparator for sorting, while this binary search uses a `less` function?**

Simple:

```js
let compareFn; // some complex function defined elsewhere
sortedArray.sort(compareFn);

let value; // some search value defined elsewhere

const lessFn = x => compareFn(x, value) < 0,
  index = binarySearch(sortedArray, lessFn);
```

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
