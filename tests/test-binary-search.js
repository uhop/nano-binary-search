'use strict';

import test from 'tape-six';

import binarySearch from '../index.js';

test('binarySearch: sorted array', t => {
  const array = [],
    sortedArray = [];

  for (let i = 0; i < 100; i++) {
    const value = Math.floor(Math.random() * 1000);
    array.push(value);

    const index = binarySearch(sortedArray, x => x < value);
    sortedArray.splice(index, 0, value);
  }
  array.sort((a, b) => a - b);

  t.deepEqual(array, sortedArray);
});

test('binarySearch: remove equal values', t => {
  {
    const sortedArray = [1, 3, 3, 4];

    const lowerIndex = binarySearch(sortedArray, x => x < 3),
      upperIndex = binarySearch(sortedArray, x => x <= 3, lowerIndex);
    sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
    t.deepEqual(sortedArray, [1, 4]);
  }

  {
    const sortedArray = [3, 3, 3, 4];

    const lowerIndex = binarySearch(sortedArray, x => x < 3),
      upperIndex = binarySearch(sortedArray, x => x <= 3, lowerIndex);
    sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
    t.deepEqual(sortedArray, [4]);
  }

  {
    const sortedArray = [1, 3, 3, 3];

    const lowerIndex = binarySearch(sortedArray, x => x < 3),
      upperIndex = binarySearch(sortedArray, x => x <= 3, lowerIndex);
    sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
    t.deepEqual(sortedArray, [1]);
  }

  {
    const sortedArray = [3, 3, 3, 3];

    const lowerIndex = binarySearch(sortedArray, x => x < 3),
      upperIndex = binarySearch(sortedArray, x => x <= 3, lowerIndex);
    sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
    t.deepEqual(sortedArray, []);
  }

  {
    const sortedArray = [1, 3, 3, 4];

    const lowerIndex = binarySearch(sortedArray, x => x < 2),
      upperIndex = binarySearch(sortedArray, x => x <= 2, lowerIndex);
    sortedArray.splice(lowerIndex, upperIndex - lowerIndex);
    t.deepEqual(sortedArray, [1, 3, 3, 4]);
  }
});
