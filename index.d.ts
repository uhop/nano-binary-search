/**
 * Comparison function type. It compares a value with some internal pivot value and returns a boolean.
 * Additional arguments are `index` (the pivot index) and `sortedArray`.
 */
export type LessFn<T = any> = (value: T, index: number, sortedArray: readonly T[]) => boolean;

/**
 * Binary search (lower bound). Equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.
 *
 * Returns an insertion index compatible with `Array.prototype.splice()`.
 * - With `<`: returns the index of the first element ≥ pivot (**lower bound**).
 * - With `<=`: returns the index of the first element > pivot (**upper bound**).
 *
 * @param sortedArray sorted array. It should be sorted in a compatible way with the comparison function.
 * @param lessFn comparison function that takes a value, compares it with the pivot value, and returns a boolean. See {@link LessFn}.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns index where the pivot value can be inserted without breaking the sorted-ness of the array.
 */
export declare function binarySearch<T>(sortedArray: readonly T[], lessFn: LessFn<T>, l?: number, r?: number): number;

export default binarySearch;
