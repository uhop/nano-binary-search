---
package: nano-binary-search
binds: ^1.1.0
export: 'binarySearch + the sorted-array family: lowerBound, upperBound, indexOf, lastIndexOf, includes, equalRange, count, insert, remove, removeAll'
---

# binarySearch and the sorted-array family

`binarySearch(sortedArray, lessFn, l, r)` finds the partition point: the
smallest index in `[l, r]` such that every earlier element satisfies
`lessFn` and no element from it on does (`std::partition_point`
semantics). The family is the convenience layer over it: bound finders,
membership and counting, and three mutators. Equality is derived, never
supplied — `x ~ v` means `!less(x, v) && !less(v, x)` under the family's
one ordering parameter (`std::` container semantics).

## Preconditions

- `sorted` (assumed, never checked at runtime; O(n) to verify): over
  `[l, r)`, `sortedArray` is sorted with respect to `less` — no element is
  `less` than a predecessor.

  ```js check pre:sorted
  (sortedArray, less, l, r) => {
    for (let i = l + 1; i < r; ++i) if (less(sortedArray[i], sortedArray[i - 1])) return false;
    return true;
  };
  ```

- `consistent-less`: `less` is a strict weak ordering (irreflexive,
  transitive, with transitive incomparability); `defaultLess` on numbers of
  one type satisfies this — mixed `NaN`/mixed-type arrays do not.
- `partitioned` (assumed, never checked at runtime; O(n) to verify):
  `binarySearch` only — over `[l, r)`, `lessFn` values form `true* false*`,
  no `true` after a `false`. A sorted array queried with a consistent
  `<`-style predicate satisfies this; `sorted` + `consistent-less` is the
  family's way of establishing it.

  ```js check pre:partitioned
  (sortedArray, lessFn, l, r) => {
    let seenFalse = false;
    for (let i = l; i < r; ++i) {
      if (lessFn(sortedArray[i], i, sortedArray)) {
        if (seenFalse) return false;
      } else seenFalse = true;
    }
    return true;
  };
  ```

- `range`: `l` and `r` are integers with `0 <= l <= r <= sortedArray.length`.

## Postconditions

- `result-range` (`binarySearch`): `l <= result && result <= r`. Note
  `result` may equal `sortedArray.length`: it is an insertion index, not a
  found index.
- `partition-point` (`binarySearch`):

  ```js check post:partition-point
  (result, sortedArray, lessFn, l, r) => {
    for (let i = l; i < result; ++i) if (!lessFn(sortedArray[i], i, sortedArray)) return false;
    for (let i = result; i < r; ++i) if (lessFn(sortedArray[i], i, sortedArray)) return false;
    return true;
  };
  ```

- `lowerBound-first-not-less`: `lowerBound` returns the first index whose
  element is not `less` than `value` — everything before is `less`,
  everything from it on is not.

  ```js check post:lowerBound-first-not-less
  (result, sortedArray, value, less, l, r) => {
    for (let i = l; i < result; ++i) if (!less(sortedArray[i], value)) return false;
    for (let i = result; i < r; ++i) if (less(sortedArray[i], value)) return false;
    return true;
  };
  ```

- `upperBound-first-greater`: `upperBound` returns the first index whose
  element is greater than `value` (`less(value, element)`).

  ```js check post:upperBound-first-greater
  (result, sortedArray, value, less, l, r) => {
    for (let i = l; i < result; ++i) if (less(value, sortedArray[i])) return false;
    for (let i = result; i < r; ++i) if (!less(value, sortedArray[i])) return false;
    return true;
  };
  ```

- `indexOf-first-equivalent`: when `value` occurs, `indexOf` is the first
  equivalent index (and equals `lowerBound`); otherwise `-1`.
- `lastIndexOf-last-equivalent`: when `value` occurs, `lastIndexOf` is the
  last equivalent index (and equals `upperBound - 1`); otherwise `-1`.

## Laws

- `bounds-ordered`: `l <= lowerBound <= upperBound <= r` — the equal run is
  a (possibly empty) contiguous window.

  ```js check law:bounds-ordered
  (lo, hi, l, r) => l <= lo && lo <= hi && hi <= r;
  ```

- `count-is-window-width`: `count === upperBound - lowerBound`, and
  `equalRange` returns exactly `[lowerBound, upperBound]`.
- `membership-trichotomy`: `includes ⟺ indexOf >= 0 ⟺ count > 0` — the
  three membership spellings agree.

  ```json axiom law:membership-trichotomy
  {
    "atoms": {
      "incl": "includes(sortedArray, value, less, l, r)",
      "idxFound": "indexOf(sortedArray, value, less, l, r) >= 0",
      "cntPos": "count(sortedArray, value, less, l, r) > 0"
    },
    "formulas": [
      ["iff", "incl", "idxFound"],
      ["iff", "incl", "cntPos"]
    ]
  }
  ```

- `window-is-equivalence`: inside `equalRange`'s window every element is
  equivalent to `value` (neither `less`); outside it none is.

  ```js check law:window-is-equivalence
  (range, sortedArray, value, less, l, r) => {
    const [lo, hi] = range;
    for (let i = l; i < r; ++i) {
      const equivalent = !less(sortedArray[i], value) && !less(value, sortedArray[i]);
      if (equivalent !== (lo <= i && i < hi)) return false;
    }
    return true;
  };
  ```

## Effects

- `pure-queries`: `binarySearch`, `lowerBound`, `upperBound`, `indexOf`,
  `lastIndexOf`, `includes`, `equalRange`, and `count` mutate nothing and
  call nothing but the ordering predicate; deterministic while it is; and
  never throw on inputs satisfying the preconditions (totality is
  conditional on them, like every claim here).

  ```json flags effects:pure-queries
  {
    "binarySearch": ["pure", "total"],
    "lowerBound": ["pure", "total"],
    "upperBound": ["pure", "total"],
    "indexOf": ["pure", "total"],
    "lastIndexOf": ["pure", "total"],
    "includes": ["pure", "total"],
    "equalRange": ["pure", "total"],
    "count": ["pure", "total"]
  }
  ```

- `insert-one-splice`: `insert` performs one `splice` at `upperBound` —
  the array grows by exactly one, stays sorted, and the new element lands
  **after** every existing equivalent (stable append); returns the index.
- `remove-first-occurrence`: `remove` deletes exactly the first equivalent
  element when present (length shrinks by one) and nothing otherwise;
  returns whether it removed.
- `removeAll-window`: `removeAll` deletes exactly the `equalRange` window
  and returns its width — `0` removed is a normal result, not an error.

## Complexity

- `log-calls`: `binarySearch` makes at most
  `Math.ceil(Math.log2(r - l)) + 1` invocations of `lessFn`; O(1) space.
  The family's queries delegate one or two `binarySearch` calls, so they
  inherit the bound up to that factor. Verify by counting calls with an
  instrumented predicate over generated inputs.

## Patterns

### sorted-insert

- Trigger: maintaining order via `push()` + `sort()` per insertion, or a
  linear scan for the insertion index into a known-sorted array.
- Replacement:

  ```js
  insert(arr, value); // stable: lands after existing equals
  ```

  or, choosing the bound by hand:

  ```js
  const i = binarySearch(arr, x => x < value);
  arr.splice(i, 0, value);
  ```

- Justification: `insert-one-splice`; `partition-point` implies the splice
  preserves sortedness.
- Obligation at the call site: `arr` is sorted by the same ordering the
  predicate assumes (the `sorted`/`partitioned` preconditions).

### membership

- Trigger: `indexOf()` / `findIndex()` / `includes()` on a known-sorted
  array.
- Replacement:

  ```js
  includes(arr, value); // or indexOf(arr, value) for the position
  ```

- Justification: `membership-trichotomy` over `result-range` +
  `partition-point`; equality is recovered as "neither less" under the
  same ordering.
- Obligation at the call site: the `sorted` precondition, and derived
  equivalence agreeing with what the caller means by membership (see
  `derived-equality`).

### counted-multiset

- Trigger: `filter(x => x === v).length` or a scan loop counting
  occurrences in a known-sorted array.
- Replacement:

  ```js
  const n = count(arr, value);
  ```

- Justification: `count-is-window-width` over the sorted precondition.
- Obligation at the call site: `arr` is sorted by the same ordering
  (`sorted` precondition), and `===`-equality agrees with derived
  equivalence under that ordering.

## Hazards

- `derived-equality`: membership is decided by `!less(a, b) && !less(b, a)`,
  not `===` — objects compared by a key function are "equal" whenever keys
  tie, and `indexOf` can return an element that is not `===` to `value`.
- `insert-is-stable-after`: `insert` places equals **after** existing ones
  (upperBound); code assuming prepend-among-equals is wrong silently.
- `remove-removes-first`: with duplicates, `remove` deletes the **first**
  equivalent, which under `derived-equality` may not be the instance the
  caller holds.
- `inconsistent-order`: a predicate inconsistent with the array's actual
  order violates `sorted`/`partitioned`; every function still returns —
  an index, a boolean, a window — silently meaningless. No error is
  thrown.
- `insertion-index-misread`: using a bound result directly as the position
  of a found element without the membership equality check.
- `mutating-predicate`: an ordering predicate that mutates the array
  mid-search voids all postconditions.
