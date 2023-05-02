function map<Output, Input>(array: Input[], fn: (i: Input) => Output): Output[] {
  return array.map(fn)
}

console.log(
  map([1, 2, 3], (i) => {
    return i > 2 ? i : i + ''
  }),
)

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(['1', '2', '3'], (n) => parseInt(n))

console.log(parsed)

function myToFixed(n = 2) {
  console.log(arguments)
  return n
}

console.log(myToFixed(), myToFixed(undefined))
type Point123 = { x: number; y: number }
type P123 = keyof Point123
const p11123: P123 = 'x'
type Arrayish = { [n: number]: unknown }

const demostr = 'string'

type HX1 = typeof demostr

const mhx1: HX1 = '123'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type tupleT = typeof tuple
type tupleTO = keyof tupleT

type TupleToObject<T extends readonly any[]> = {
  [key in T[number]]: key
}

type First<T extends any[]> = T[0]

type array1 = [1, 2, 3]

type result = First<array1>

type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
type Length<T extends readonly any[]> = T['length']

type GAAA = 'A' | 'B' | 'C'

type GAAB = 'C' | 'D' | 'E'

type GAAC = GAAA extends GAAB ? never : GAAA

// type GAAD = GAAA & GAAB

// type GAAR = GAAC | GAAD

type MyExclude<T, U> = T extends U ? never : T

type Result = MyExclude<'a' | 'b' | 'c', 'a' | 'b'> // 'b' | 'c'

type IdentityFunc = <Type>(arg: Type) => Type

function identity<Type>(arg: Type): Type {
  return arg
}

// We can also write the generic type as a call signature of an object literal type:
// { <Type>(arg: Type): Type } is same as InterfaceIdentity
interface InterfaceIdentity<Type> {
  (arg: Type): Type
}

const myIdentity: { <Type>(arg: Type): Type } = identity

const myIdentity1: InterfaceIdentity<string> = identity
