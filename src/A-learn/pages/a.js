import { b } from './b.js'

console.log('a.js -> loaded -> b', b)

export const a = { __esModule: true, value: 'a' }
