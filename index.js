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

export default binarySearch;
