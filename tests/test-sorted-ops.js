import test from 'tape-six';

import {lowerBound, upperBound, indexOf, lastIndexOf, includes, equalRange, count, insert, remove, removeAll} from '../index.js';

test('lowerBound/upperBound: basics and duplicates', t => {
  const a = [1, 3, 3, 3, 5];
  t.equal(lowerBound(a, 3), 1);
  t.equal(upperBound(a, 3), 4);
  t.equal(lowerBound(a, 0), 0, 'before all');
  t.equal(upperBound(a, 0), 0, 'before all');
  t.equal(lowerBound(a, 9), 5, 'after all');
  t.equal(upperBound(a, 9), 5, 'after all');
  t.equal(lowerBound(a, 4), 4, 'absent value lands at its insertion point');
  t.equal(upperBound(a, 4), 4, 'absent value lands at its insertion point');
  t.equal(lowerBound([], 5), 0, 'empty array');
  t.equal(upperBound([], 5), 0, 'empty array');
});

test('lowerBound/upperBound: custom less and sub-ranges', t => {
  const desc = [9, 7, 5, 3, 1],
    greater = (a, b) => a > b;
  t.equal(lowerBound(desc, 5, greater), 2, 'descending order');
  t.equal(upperBound(desc, 5, greater), 3, 'descending order');

  const a = [1, 2, 3, 4, 5, 6, 7, 8];
  t.equal(lowerBound(a, 4, undefined, 2, 5), 3, 'sub-range');
  t.equal(lowerBound(a, 100, undefined, 0, 4), 4, 'result clamped to r');
});

test('indexOf/lastIndexOf: found and not found', t => {
  const a = [1, 3, 3, 3, 5];
  t.equal(indexOf(a, 3), 1, 'first of the run');
  t.equal(lastIndexOf(a, 3), 3, 'last of the run');
  t.equal(indexOf(a, 1), 0);
  t.equal(lastIndexOf(a, 5), 4);
  t.equal(indexOf(a, 4), -1);
  t.equal(lastIndexOf(a, 4), -1);
  t.equal(indexOf(a, 0), -1);
  t.equal(lastIndexOf(a, 0), -1);
  t.equal(indexOf(a, 9), -1);
  t.equal(lastIndexOf(a, 9), -1);
  t.equal(indexOf([], 1), -1);
  t.equal(lastIndexOf([], 1), -1);
});

test('indexOf/lastIndexOf: sub-ranges', t => {
  const a = [1, 3, 3, 3, 5];
  t.equal(indexOf(a, 3, undefined, 2, 5), 2);
  t.equal(lastIndexOf(a, 3, undefined, 0, 2), 1);
  t.equal(indexOf(a, 5, undefined, 0, 4), -1, 'value outside the range');
  t.equal(lastIndexOf(a, 1, undefined, 1, 5), -1, 'value outside the range');
});

test('indexOf/lastIndexOf: objects with custom less', t => {
  const byKey = (a, b) => a.k < b.k;
  const a = [
    {k: 1, tag: 'x'},
    {k: 2, tag: 'a'},
    {k: 2, tag: 'b'},
    {k: 3, tag: 'y'}
  ];
  const first = indexOf(a, {k: 2}, byKey);
  t.equal(first, 1);
  t.equal(a[first].tag, 'a', 'first occurrence');
  const last = lastIndexOf(a, {k: 2}, byKey);
  t.equal(last, 2);
  t.equal(a[last].tag, 'b', 'last occurrence');
  t.equal(indexOf(a, {k: 4}, byKey), -1);
});

test('includes', t => {
  const a = [1, 3, 3, 5];
  t.ok(includes(a, 3));
  t.ok(includes(a, 1));
  t.ok(includes(a, 5));
  t.notOk(includes(a, 2));
  t.notOk(includes(a, 0));
  t.notOk(includes(a, 9));
  t.notOk(includes([], 1));
});

test('equalRange/count', t => {
  const a = [1, 3, 3, 3, 5];
  t.deepEqual(equalRange(a, 3), [1, 4]);
  t.equal(count(a, 3), 3);
  t.deepEqual(equalRange(a, 4), [4, 4], 'absent: empty span at insertion point');
  t.equal(count(a, 4), 0);
  t.deepEqual(equalRange(a, 0), [0, 0]);
  t.deepEqual(equalRange(a, 9), [5, 5]);
  t.deepEqual(equalRange([], 1), [0, 0]);

  const b = [1, 3, 3, 3, 5];
  const [lo, hi] = equalRange(b, 3);
  b.splice(lo, hi - lo);
  t.deepEqual(b, [1, 5], 'splicing the span removes exactly the equal run');
});

test('insert: keeps order, returns index, lands after equals', t => {
  const a = [];
  t.equal(insert(a, 5), 0);
  t.equal(insert(a, 1), 0);
  t.equal(insert(a, 9), 2);
  t.equal(insert(a, 5), 2);
  t.deepEqual(a, [1, 5, 5, 9]);

  const byKey = (a, b) => a.k < b.k;
  const objs = [
    {k: 1, tag: 'a'},
    {k: 2, tag: 'b'}
  ];
  const inserted = {k: 2, tag: 'new'};
  t.equal(insert(objs, inserted, byKey), 2, 'after the existing equal element');
  t.equal(objs[2], inserted);
});

test('insert: random round-trip matches sort', t => {
  const array = [],
    sortedArray = [];

  for (let i = 0; i < 100; ++i) {
    const value = Math.floor(Math.random() * 1000);
    array.push(value);
    insert(sortedArray, value);
  }
  array.sort((a, b) => a - b);

  t.deepEqual(array, sortedArray);
});

test('remove', t => {
  const a = [1, 3, 3, 4];
  t.ok(remove(a, 3));
  t.deepEqual(a, [1, 3, 4]);
  t.ok(remove(a, 3));
  t.deepEqual(a, [1, 4]);
  t.notOk(remove(a, 3), 'nothing left to remove');
  t.deepEqual(a, [1, 4]);
  t.notOk(remove([], 1));

  const byKey = (a, b) => a.k < b.k;
  const objs = [
    {k: 2, tag: 'a'},
    {k: 2, tag: 'b'}
  ];
  t.ok(remove(objs, {k: 2}, byKey));
  t.equal(objs.length, 1);
  t.equal(objs[0].tag, 'b', 'removes the first equal element');
});

test('removeAll', t => {
  const a = [1, 3, 3, 3, 5];
  t.equal(removeAll(a, 3), 3);
  t.deepEqual(a, [1, 5]);
  t.equal(removeAll(a, 3), 0);
  t.deepEqual(a, [1, 5]);
  t.equal(removeAll([], 1), 0);

  const all = [7, 7, 7];
  t.equal(removeAll(all, 7), 3);
  t.deepEqual(all, []);
});

test('default less works with strings', t => {
  const a = ['ant', 'bee', 'bee', 'cat'];
  t.equal(indexOf(a, 'bee'), 1);
  t.equal(lastIndexOf(a, 'bee'), 2);
  t.ok(includes(a, 'cat'));
  t.notOk(includes(a, 'dog'));
  t.equal(insert(a, 'cow'), 4);
  t.deepEqual(a, ['ant', 'bee', 'bee', 'cat', 'cow']);
});

test('comparator-derived less', t => {
  const cmp = (a, b) => a - b;
  const less = (a, b) => cmp(a, b) < 0;
  const a = [1, 3, 5];
  t.equal(indexOf(a, 3, less), 1);
  t.equal(insert(a, 4, less), 2);
  t.deepEqual(a, [1, 3, 4, 5]);
});
