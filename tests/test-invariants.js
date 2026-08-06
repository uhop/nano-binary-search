import {readFileSync} from 'node:fs';
import test from 'tape-six';
import fc from 'fast-check';
import 'tape-six-fast-check';

import {binarySearch, lowerBound, upperBound, indexOf, lastIndexOf, includes, equalRange, count, insert, remove, removeAll} from '../index.js';

// INVARIANTS.md is the package's claims as data; this suite keeps them true.
// The minimal extractor below stands in for the invariants-sidecar parser
// until that package is published — same fence grammar, checks only.
const extractChecks = text => {
  const checks = {};
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; ++i) {
    const open = /^(\s*)```js check (\w+):(\S+)$/.exec(lines[i]);
    if (!open) continue;
    const [, indent, kind, name] = open;
    const body = [];
    for (++i; i < lines.length && lines[i].trim() !== '```'; ++i) body.push(lines[i].slice(indent.length));
    const source = body.join('\n').trim().replace(/;$/, '');
    checks[kind + ':' + name] = new Function(`'use strict'; return (${source});`)();
  }
  return checks;
};

const checks = extractChecks(readFileSync(new URL('../INVARIANTS.md', import.meta.url), 'utf8'));
const less = (a, b) => a < b;

const arbCase = fc
  .record({
    values: fc.array(fc.integer({min: -8, max: 8}), {maxLength: 30}),
    value: fc.integer({min: -9, max: 9})
  })
  .map(({values, value}) => ({sorted: [...values].sort((x, y) => x - y), value}));

test('INVARIANTS.md carries the seven executable checks', t => {
  t.deepEqual(Object.keys(checks), [
    'pre:sorted',
    'pre:partitioned',
    'post:partition-point',
    'post:lowerBound-first-not-less',
    'post:upperBound-first-greater',
    'law:bounds-ordered',
    'law:window-is-equivalence'
  ]);
});

test('invariants: binarySearch pre → result-range + partition-point', async t => {
  await t.prop(
    [arbCase],
    ({sorted, value}) => {
      const lessFn = x => x < value;
      const l = 0,
        r = sorted.length;
      if (!checks['pre:partitioned'](sorted, lessFn, l, r)) return false;
      const result = binarySearch(sorted, lessFn, l, r);
      if (!(l <= result && result <= r)) return false;
      return checks['post:partition-point'](result, sorted, lessFn, l, r);
    },
    'pre:partitioned → result-range ∧ post:partition-point'
  );
});

test('invariants: the log-calls complexity bound', async t => {
  await t.prop(
    [arbCase],
    ({sorted, value}) => {
      let calls = 0;
      const counted = x => (++calls, x < value);
      binarySearch(sorted, counted, 0, sorted.length);
      const bound = sorted.length ? Math.ceil(Math.log2(sorted.length)) + 1 : 1;
      return calls <= bound;
    },
    'complexity:log-calls'
  );
});

test('invariants: a violated precondition yields a meaningless in-range index', t => {
  const unsorted = [3, 1, 2];
  const lessFn = x => x < 2;
  t.notOk(checks['pre:partitioned'](unsorted, lessFn, 0, 3));
  const result = binarySearch(unsorted, lessFn, 0, 3);
  t.ok(result >= 0 && result <= 3);
  t.notOk(checks['post:partition-point'](result, unsorted, lessFn, 0, 3));
});

test('invariants: bound postconditions', async t => {
  await t.prop(
    [arbCase],
    ({sorted, value}) => {
      const l = 0,
        r = sorted.length;
      if (!checks['pre:sorted'](sorted, less, l, r)) return false;
      const lo = lowerBound(sorted, value);
      const hi = upperBound(sorted, value);
      return (
        checks['post:lowerBound-first-not-less'](lo, sorted, value, less, l, r) &&
        checks['post:upperBound-first-greater'](hi, sorted, value, less, l, r) &&
        checks['law:bounds-ordered'](lo, hi, l, r)
      );
    },
    'lowerBound/upperBound definitions + bounds-ordered'
  );
});

test('invariants: counting and membership laws', async t => {
  await t.prop(
    [arbCase],
    ({sorted, value}) => {
      const l = 0,
        r = sorted.length;
      const lo = lowerBound(sorted, value);
      const hi = upperBound(sorted, value);
      const range = equalRange(sorted, value);
      if (count(sorted, value) !== hi - lo) return false;
      if (range[0] !== lo || range[1] !== hi) return false;
      const inc = includes(sorted, value);
      const idx = indexOf(sorted, value);
      const last = lastIndexOf(sorted, value);
      if (inc !== idx >= 0 || inc !== count(sorted, value) > 0) return false;
      if (idx >= 0 && (idx !== lo || last !== hi - 1)) return false;
      if (idx < 0 && last !== -1) return false;
      return checks['law:window-is-equivalence'](range, sorted, value, less, l, r);
    },
    'count/equalRange/membership trichotomy + window equivalence'
  );
});

test('invariants: mutator effects', async t => {
  await t.prop(
    [arbCase],
    ({sorted, value}) => {
      const grown = [...sorted];
      const hiBefore = upperBound(grown, value);
      const at = insert(grown, value);
      if (at !== hiBefore || grown.length !== sorted.length + 1 || grown[at] !== value) return false;
      if (!checks['pre:sorted'](grown, less, 0, grown.length)) return false;

      const one = [...sorted];
      const had = includes(one, value);
      if (remove(one, value) !== had) return false;
      if (one.length !== sorted.length - (had ? 1 : 0)) return false;

      const all = [...sorted];
      const n = count(all, value);
      if (removeAll(all, value) !== n) return false;
      return all.length === sorted.length - n && !includes(all, value);
    },
    'insert-one-splice + remove-first-occurrence + removeAll-window'
  );
});

test('invariants: hazard witnesses', t => {
  const byKey = (a, b) => a.k < b.k;
  const arr = [{k: 1, tag: 'x'}];
  const probe = {k: 1, tag: 'y'};
  t.ok(includes(arr, probe, byKey));
  t.notOk(arr[0] === probe);

  const dupes = [
    {k: 1, tag: 'a'},
    {k: 1, tag: 'b'}
  ];
  t.equal(insert(dupes, {k: 1, tag: 'c'}, byKey), 2);

  const held = dupes[1];
  remove(dupes, held, byKey);
  t.equal(dupes[0].tag, 'b');
});
