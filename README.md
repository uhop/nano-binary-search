# nano-binary-search [![NPM version][npm-img]][npm-url]

[npm-img]:      https://img.shields.io/npm/v/nano-binary-search.svg
[npm-url]:      https://npmjs.org/package/nano-binary-search

This is a nano binary search implementation. It is a tiny single file with no dependencies.
The only reason I wrote it because I wrote it countless times before, I think it is perfect now
because it is done right and fits JavaScript &mdash; it is ripe for code reuse.

For TypeScript users the typings are included.

## Why?

Why do I think it is done right? Because it supports important invariants with
[splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice).

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
In the modern JavaScript/TypeScript, it is easier to get the comparison value straight from the closure
like in the examples.

Do you want to search a sub-array? Just pass in indices.

## API

The TypeScript-like API is as follows:

```ts
binarySearch<T>(
  sortedArray: readonly T[],
  lessFn: (value: T, index: number, array: readonly T[]) => boolean,
  l: number = 0,
  r: number = sortedArray.length
): boolean;
```

* Inputs:
  * `sortedArray` &mdash; sorted array of some values. We don't care about values in this array.
    It is up to `lessFn` to compare them. The array should be sorted in a compatible way with `lessFn`.
  * `lessFn` &mdash; function that takes three argument and returns a truthy value if the first argument
    (a value from array) is less than our value, whatever it is. The second value is its index,
    and the third is the `sortedArray`.
    * The function interface is modeled on the callback function of array methods.
  * `l` &mdash; left index. This index is inclusive. Defaults to 0.
  * `r` &mdash; right index. This index is exclusive. Defaults to `sortedArray.length`.

The function return an index, where we can safely insert the searched value with `splice()`:

* if we used `<` operator as the comparison function, the index will point to the first value that is greater or equal than the searched value.
* if we used `<=` operator as the comparison function, the index will point to the first value that is greater than the searched value.

That's all Folks!

## Q & A

**Is it fast?**

Yes.

The only reasonable way to make it faster is to take its code and inline `lessFn()`. The other idea is
to inline `binarySearch()` itself in your code. That's about all.

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

We don't need to compare values in the array for equality. A simple `less` function is enough.
In many cases it is easier to implement just a `less` function.

For example (two argument version for simplicity):

```js
const stringLessFn = (a, b) => a < b;

// comparator #1 (two comparisons)
const stringCompareFn1 = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// comparator #2: smarter (a method call)
const stringCompareFn2 = (a, b) => a.localeCompare(b);
```

**I still have questions!**

Look at the code of `index.js` and `tests/` for more details. Go to the GitHub repository and ask.

## License

This project is licensed under the BSD-3-Clause license.

## Release history

- 1.0.1 *Added TS typings*
- 1.0.0 *Initial release*
