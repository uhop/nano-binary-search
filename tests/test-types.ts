import test from 'tape-six';

import binarySearch, {binarySearch as namedBinarySearch} from '../index.js';
import type {LessFn} from '../index.js';

test('types: default and named imports', t => {
  const a: number = binarySearch([1, 2, 3], x => x < 2);
  const b: number = namedBinarySearch([1, 2, 3], x => x < 2);
  t.equal(a, b);
});

test('types: number array inference', t => {
  const nums: readonly number[] = [1, 2, 3, 4, 5];
  const idx: number = binarySearch(nums, (value: number) => value < 3);
  t.equal(idx, 2);
});

test('types: string array inference', t => {
  const strs: readonly string[] = ['a', 'b', 'c', 'd'];
  const idx: number = binarySearch(strs, (value: string) => value < 'c');
  t.equal(idx, 2);
});

test('types: object array inference', t => {
  interface Item {
    id: number;
    name: string;
  }
  const items: readonly Item[] = [{id: 1, name: 'a'}, {id: 2, name: 'b'}, {id: 3, name: 'c'}];
  const idx: number = binarySearch(items, (value: Item) => value.id < 2);
  t.equal(idx, 1);
});

test('types: explicit generic parameter', t => {
  const idx: number = binarySearch<number>([10, 20, 30], x => x < 20);
  t.equal(idx, 1);
});

test('types: lessFn receives index and array with correct types', t => {
  const nums = [10, 20, 30] as const;
  binarySearch(nums, (value: 10 | 20 | 30, index: number, array: readonly (10 | 20 | 30)[]) => {
    const _v: 10 | 20 | 30 = value;
    const _i: number = index;
    const _a: readonly (10 | 20 | 30)[] = array;
    return value < 20;
  });
  t.pass();
});

test('types: optional l and r parameters', t => {
  const arr = [1, 2, 3, 4, 5];
  const a: number = binarySearch(arr, x => x < 3);
  const b: number = binarySearch(arr, x => x < 3, 1);
  const c: number = binarySearch(arr, x => x < 3, 1, 4);
  t.equal(typeof a, 'number');
  t.equal(typeof b, 'number');
  t.equal(typeof c, 'number');
});

test('types: readonly array accepted', t => {
  const frozen: readonly number[] = Object.freeze([1, 2, 3]);
  const idx: number = binarySearch(frozen, x => x < 2);
  t.equal(idx, 1);
});

test('types: mutable array accepted', t => {
  const mutable: number[] = [1, 2, 3];
  const idx: number = binarySearch(mutable, x => x < 2);
  t.equal(idx, 1);
});

test('types: tuple array accepted', t => {
  const tuple = [1, 2, 3] as const;
  const idx: number = binarySearch(tuple, x => x < 2);
  t.equal(idx, 1);
});

test('types: exported LessFn type', t => {
  const lessFn: LessFn<number> = (value, index, array) => value < 3;
  const idx: number = binarySearch([1, 2, 3, 4, 5], lessFn);
  t.equal(idx, 2);

  const strLessFn: LessFn<string> = (value, _index, _array) => value < 'c';
  const idx2: number = binarySearch(['a', 'b', 'c', 'd'], strLessFn);
  t.equal(idx2, 2);
});
