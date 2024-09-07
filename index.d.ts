/**
 * Comparison function type. It compares a value with some internal pivot value and returns a boolean.
 */
type LessFn<T = any> = (x: T, index: number, array: readonly T[]) => boolean;

/**
 * Binary search.
 *
 * @param sortedArray sorted array. It should be sorted in a compatible way with the comparison function.
 * @param lessFn comparison function that takes a value, compares it with the pivot value, and returns a boolean. See {@link LessFn}.
 * @param l left index. Defaults to 0.
 * @param r right index. Defaults to `sortedArray.length`.
 * @returns index where the pivot value can be inserted without breaking the sorted-ness of the array.
 */
export declare function binarySearch<T>(sortedArray: readonly T[], lessFn: LessFn<T>, l?: number, r?: number): number;

export default binarySearch;
//# sourceMappingURL=index.d.ts.map
