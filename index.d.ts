/**
 * Comparison function type. It compares a value with some internal pivot value and returns a boolean.
 * Additional arguments are `index` (the pivot index) and `sortedArray`.
 */
export type LessFn<T = any> = (value: T, index: number, sortedArray: readonly T[]) => boolean;

/**
 * Binary ordering predicate: returns `true` if `a` is ordered before `b`.
 * This is the two-argument form used by the value-based functions below; `binarySearch` itself takes
 * the unary closure form ({@link LessFn}). Wherever it is optional it defaults to `(a, b) => a < b`.
 *
 * The array must be sorted by the same ordering the search uses — derive both from a single source.
 * `meta-toolkit/comparators` ships the adapters for either direction: sorting with a comparator?
 * `lessFromCompare(compareFn)` yields this predicate. Starting from this predicate?
 * `compareFromLess(less)` yields the comparator for `Array.prototype.sort()`.
 */
export type Less<T = any> = (a: T, b: T) => boolean;

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

/**
 * Lower bound: the index of the first element ≥ `value`. Equivalent to C++ `std::lower_bound` / Python `bisect.bisect_left`.
 *
 * The result is a valid `Array.prototype.splice()` index; inserting `value` there keeps the array sorted,
 * placing it before any equal elements.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns insertion index.
 */
export declare function lowerBound<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): number;

/**
 * Upper bound: the index of the first element > `value`. Equivalent to C++ `std::upper_bound` / Python `bisect.bisect_right`.
 *
 * The result is a valid `Array.prototype.splice()` index; inserting `value` there keeps the array sorted,
 * placing it after any equal elements.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns insertion index.
 */
export declare function upperBound<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): number;

/**
 * The index of the first element equal to `value`, or `-1` if there is none.
 *
 * Equality is derived from the ordering: `a` and `b` are equal when neither is less than the other.
 * Costs one `less` call on top of the search — the lower bound already guarantees one direction.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns index of the first equal element or `-1`.
 */
export declare function indexOf<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): number;

/**
 * The index of the last element equal to `value`, or `-1` if there is none.
 *
 * The mirror of {@link indexOf}: one `less` call on top of the upper bound.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns index of the last equal element or `-1`.
 */
export declare function lastIndexOf<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): number;

/**
 * Whether an element equal to `value` is present. Same single-check equality as {@link indexOf}.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns `true` if found.
 */
export declare function includes<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): boolean;

/**
 * The half-open span `[lo, hi)` of elements equal to `value`. Equivalent to C++ `std::equal_range`.
 *
 * An absent value yields an empty span (`lo === hi`) at its insertion point — no equality checks are needed.
 * `sortedArray.splice(lo, hi - lo)` removes all equal elements and keeps the array sorted.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns the `[lo, hi)` pair of splice-compatible indices.
 */
export declare function equalRange<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): [lo: number, hi: number];

/**
 * The number of elements equal to `value` — the size of {@link equalRange}.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the searched value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @param l left index (inclusive). Defaults to 0.
 * @param r right index (exclusive). Defaults to `sortedArray.length`.
 * @returns the count of equal elements.
 */
export declare function count<T>(sortedArray: readonly T[], value: T, less?: Less<T>, l?: number, r?: number): number;

/**
 * Inserts `value` keeping the array sorted. Mutates `sortedArray`.
 *
 * Inserts at the upper bound — after any equal elements — matching Python's `bisect.insort`.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the inserted value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @returns the index the value was inserted at.
 */
export declare function insert<T>(sortedArray: T[], value: T, less?: Less<T>): number;

/**
 * Removes the first element equal to `value`, if any. Mutates `sortedArray`.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the removed value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @returns `true` if an element was removed.
 */
export declare function remove<T>(sortedArray: T[], value: T, less?: Less<T>): boolean;

/**
 * Removes all elements equal to `value`. Mutates `sortedArray`.
 *
 * @param sortedArray sorted array. It should be sorted in a way compatible with `less`.
 * @param value the removed value. Must be comparable with the elements under `less`.
 * @param less ordering predicate. See {@link Less}. Defaults to `(a, b) => a < b`.
 * @returns the number of elements removed.
 */
export declare function removeAll<T>(sortedArray: T[], value: T, less?: Less<T>): number;

export default binarySearch;
