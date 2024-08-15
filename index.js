'use strict';

export const binarySearch = (sortedArray, lessFn, l = 0, r = sortedArray.length) => {
  while (l < r) {
    const m = l + Math.floor((r - l) / 2);
    if (lessFn(sortedArray[m], m, sortedArray)) l = m + 1;
    else r = m;
  }
  return r;
};

export default binarySearch;
