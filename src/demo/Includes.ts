type Includes<T extends readonly any[], U> = U extends T[number] ? true : false

type A1 = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>
type A2 = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>
type A3 = Includes<[1, 2, 3, 5, 6, 7], 7>
type A4 = Includes<[1, 2, 3, 5, 6, 7], 4>
type A5 = Includes<[1, 2, 3], 2>
type A6 = Includes<[1, 2, 3], 1>
type A7 = Includes<[{}], { a: 'A' }>
type A8 = Includes<[boolean, 2, 3, 5, 6, 7], false>
type A9 = Includes<[true, 2, 3, 5, 6, 7], boolean>
type A10 = Includes<[false, 2, 3, 5, 6, 7], false>
type A11 = Includes<[{ a: 'A' }], { readonly a: 'A' }>
type A12 = Includes<[{ readonly a: 'A' }], { a: 'A' }>
type A13 = Includes<[1], 1 | 2>
type A14 = Includes<[1 | 2], 1>
type A15 = Includes<[null], undefined>
type A16 = Includes<[undefined], null>

export const a = 'a'

export const b = 'b'

export default 'default export string!'

type MyExclude<T, U> = T extends U ? never : T

type OmitA = 'description' | 'completed'

type OmitAI<T, K extends keyof T> = {
  [P in MyExclude<keyof T, K>]: T[P]
}

type OmitAI1 = OmitAI<
  {
    age: number
    name: string
    description: string
    completed: number
  },
  OmitA
>

type Last<T extends any[]> = T extends [...Array<any>, infer R] ? R : never

type X2 = [1, 2, 3, 4, 5]

type demo2 = Last<X2>
