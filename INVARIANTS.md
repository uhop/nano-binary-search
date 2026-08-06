---
package: nano-binary-search
binds: ^1.1.0
export: 'sorted-array family: lowerBound, upperBound, indexOf, lastIndexOf, includes, equalRange, count, insert, remove, removeAll'
---

# sorted-array family

The convenience layer over `binarySearch`: bound finders, membership and
counting, and three mutators. Equality is derived, never supplied —
`x ~ v` means `!less(x, v) && !less(v, x)` under the family's one ordering
parameter (`std::` container semantics).

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

## Postconditions

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

- `pure-queries`: `lowerBound`, `upperBound`, `indexOf`, `lastIndexOf`,
  `includes`, `equalRange`, and `count` mutate nothing and call nothing but
  `less`; deterministic while `less` is; and never throw on inputs
  satisfying `sorted` + `consistent-less` (totality is conditional on the
  preconditions, like every claim here).

  ```json flags effects:pure-queries
  {
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

## Patterns

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
