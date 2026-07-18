// @ts-self-types="./index.d.ts"

/**
 * Binary search (lower bound). Equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.
 *
 * Returns an insertion index compatible with `Array.prototype.splice()`.
 * - With `<`: returns the index of the first element ≥ pivot (lower bound).
 * - With `<=`: returns the index of the first element > pivot (upper bound).
 *
 * @template T
 * @param {readonly T[]} sortedArray - sorted array of values.
 * @param {(value: T, index: number, array: readonly T[]) => boolean} lessFn - returns true if value < pivot.
 * @param {number} [l=0] - left index (inclusive).
 * @param {number} [r=sortedArray.length] - right index (exclusive).
 * @returns {number} insertion index.
 */
export const binarySearch = (sortedArray, lessFn, l = 0, r = sortedArray.length) => {
  while (l < r) {
    const m = l + Math.floor((r - l) / 2);
    if (lessFn(sortedArray[m], m, sortedArray)) l = m + 1;
    else r = m;
  }
  return r;
};

const defaultLess = (a, b) => a < b;

/** Lower bound: index of the first element ≥ `value` — a valid `splice()` index placing `value` before any equal elements. */
export const lowerBound = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => binarySearch(sortedArray, x => less(x, value), l, r);

/** Upper bound: index of the first element > `value` — a valid `splice()` index placing `value` after any equal elements. */
export const upperBound = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => binarySearch(sortedArray, x => !less(value, x), l, r);

/** Index of the first element equal to `value`, or -1. Ordering-derived equality: one `less` call on top of the lower bound. */
export const indexOf = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = lowerBound(sortedArray, value, less, l, r);
  return i < r && !less(value, sortedArray[i]) ? i : -1;
};

/** Index of the last element equal to `value`, or -1. The mirror of `indexOf` built on the upper bound. */
export const lastIndexOf = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = upperBound(sortedArray, value, less, l, r) - 1;
  return i >= l && !less(sortedArray[i], value) ? i : -1;
};

/** Whether an element equal to `value` is present. */
export const includes = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = lowerBound(sortedArray, value, less, l, r);
  return i < r && !less(value, sortedArray[i]);
};

/** The half-open `[lo, hi)` span of elements equal to `value` (`std::equal_range`); an empty span at the insertion point when absent. */
export const equalRange = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const lo = lowerBound(sortedArray, value, less, l, r);
  return [lo, upperBound(sortedArray, value, less, lo, r)];
};

/** Number of elements equal to `value`. */
export const count = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const lo = lowerBound(sortedArray, value, less, l, r);
  return upperBound(sortedArray, value, less, lo, r) - lo;
};

/** Inserts `value` keeping the array sorted — at the upper bound, after equal elements (like Python's `bisect.insort`). Returns the insertion index. */
export const insert = (sortedArray, value, less = defaultLess) => {
  const i = upperBound(sortedArray, value, less);
  sortedArray.splice(i, 0, value);
  return i;
};

/** Removes the first element equal to `value`. Returns `true` if an element was removed. */
export const remove = (sortedArray, value, less = defaultLess) => {
  const i = indexOf(sortedArray, value, less);
  if (i < 0) return false;
  sortedArray.splice(i, 1);
  return true;
};

/** Removes all elements equal to `value`. Returns the number of elements removed. */
export const removeAll = (sortedArray, value, less = defaultLess) => {
  const [lo, hi] = equalRange(sortedArray, value, less);
  sortedArray.splice(lo, hi - lo);
  return hi - lo;
};

export default binarySearch;
