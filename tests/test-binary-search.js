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

test('binarySearch: backward sorted array', t => {
  const array = [],
    sortedArray = [];

  for (let i = 0; i < 100; i++) {
    const value = Math.floor(Math.random() * 1000);
    array.push(value);

    const index = binarySearch(sortedArray, x => x > value);
    sortedArray.splice(index, 0, value);
  }
  array.sort((a, b) => b - a);

  t.deepEqual(array, sortedArray);
});

test('binarySearch: empty array', t => {
  const result = binarySearch([], x => x < 5);
  t.equal(result, 0);
});

test('binarySearch: single element array', t => {
  t.equal(
    binarySearch([5], x => x < 5),
    0
  );
  t.equal(
    binarySearch([5], x => x < 6),
    1
  );
  t.equal(
    binarySearch([5], x => x < 4),
    0
  );
});

test('binarySearch: custom r parameter', t => {
  const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8];

  // search only in sub-range [2, 5) i.e. elements [3, 4, 5]
  const index = binarySearch(sortedArray, x => x < 4, 2, 5);
  t.equal(index, 3);

  // r smaller than array length — should not find elements beyond r
  const index2 = binarySearch(sortedArray, x => x < 100, 0, 4);
  t.equal(index2, 4);
});

test('binarySearch: lessFn receives index and array', t => {
  const sortedArray = [10, 20, 30, 40, 50];
  const receivedArgs = [];

  binarySearch(sortedArray, (value, index, array) => {
    receivedArgs.push({value, index, array});
    return value < 30;
  });

  t.ok(receivedArgs.length > 0);
  for (const args of receivedArgs) {
    t.equal(args.array, sortedArray);
    t.equal(args.value, sortedArray[args.index]);
  }
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
