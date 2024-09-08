import binarySearch from 'nano-binary-search';

const a = binarySearch([1, 2, 3, 4, 5], x => x < 3);
const b = binarySearch([1, 2, 3, 4, 5], x => x < 3, 1, 3);
const c = binarySearch([...'12345'], x => x < '3');
const d = binarySearch([...'12345'], x => +x < 3);
const e = binarySearch([1, '2', 3], x => +x < 3);
const f = binarySearch([1, '2', 3], x => String(x) < '3');
