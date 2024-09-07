import binarySearch from 'nano-binary-search';

const a: number = binarySearch([1, 2, 3, 4, 5], x => x < 3);
const b: number = binarySearch([1, 2, 3, 4, 5], x => x < 3, 1, 3);
const c: number = binarySearch([...'12345'], x => x < '3');
const d: number = binarySearch<number | string>([...'12345'], x => +x < 3);
const e: number = binarySearch<number | string>([...'12345'], x => String(x) < '3');
