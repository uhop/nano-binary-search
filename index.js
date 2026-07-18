// @ts-self-types="./index.d.ts"

export const binarySearch = (sortedArray, lessFn, l = 0, r = sortedArray.length) => {
  while (l < r) {
    const m = l + Math.floor((r - l) / 2);
    if (lessFn(sortedArray[m], m, sortedArray)) l = m + 1;
    else r = m;
  }
  return r;
};

const defaultLess = (a, b) => a < b;

export const lowerBound = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => binarySearch(sortedArray, x => less(x, value), l, r);

export const upperBound = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => binarySearch(sortedArray, x => !less(value, x), l, r);

export const indexOf = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = lowerBound(sortedArray, value, less, l, r);
  return i < r && !less(value, sortedArray[i]) ? i : -1;
};

export const lastIndexOf = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = upperBound(sortedArray, value, less, l, r) - 1;
  return i >= l && !less(sortedArray[i], value) ? i : -1;
};

export const includes = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const i = lowerBound(sortedArray, value, less, l, r);
  return i < r && !less(value, sortedArray[i]);
};

export const equalRange = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const lo = lowerBound(sortedArray, value, less, l, r);
  return [lo, upperBound(sortedArray, value, less, lo, r)];
};

export const count = (sortedArray, value, less = defaultLess, l = 0, r = sortedArray.length) => {
  const lo = lowerBound(sortedArray, value, less, l, r);
  return upperBound(sortedArray, value, less, lo, r) - lo;
};

export const insert = (sortedArray, value, less = defaultLess) => {
  const i = upperBound(sortedArray, value, less);
  sortedArray.splice(i, 0, value);
  return i;
};

export const remove = (sortedArray, value, less = defaultLess) => {
  const i = indexOf(sortedArray, value, less);
  if (i < 0) return false;
  sortedArray.splice(i, 1);
  return true;
};

export const removeAll = (sortedArray, value, less = defaultLess) => {
  const [lo, hi] = equalRange(sortedArray, value, less);
  sortedArray.splice(lo, hi - lo);
  return hi - lo;
};

export default binarySearch;
