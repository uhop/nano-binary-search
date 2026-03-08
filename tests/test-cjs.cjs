const {test} = require('tape-six');
const {binarySearch} = require('../index.js');

test('CJS: named export', t => {
  const idx = binarySearch([1, 2, 3, 4, 5], x => x < 3);
  t.equal(idx, 2);
});

test('CJS: default export', t => {
  const {default: bs} = require('../index.js');
  const idx = bs([1, 2, 3, 4, 5], x => x < 3);
  t.equal(idx, 2);
});

test('CJS: insert into sorted array', t => {
  const sortedArray = [1, 3, 5, 7, 9];
  const value = 4;
  const idx = binarySearch(sortedArray, x => x < value);
  sortedArray.splice(idx, 0, value);
  t.deepEqual(sortedArray, [1, 3, 4, 5, 7, 9]);
});

test('CJS: remove equal values', t => {
  const sortedArray = [1, 3, 3, 4];
  const lo = binarySearch(sortedArray, x => x < 3);
  const hi = binarySearch(sortedArray, x => x <= 3, lo);
  sortedArray.splice(lo, hi - lo);
  t.deepEqual(sortedArray, [1, 4]);
});
