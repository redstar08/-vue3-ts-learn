interface Horse {
  age: number
  run: () => void
}

type BooleanAndHorse = {
  [key: string]: boolean | Horse
}

const myhorse1: BooleanAndHorse = {
  alive: true,
  health: true,
}

console.log(myhorse1)

// mapped types

type OptionsFlag<T> = {
  [key in keyof T]: number
}

type HorseOptions = OptionsFlag<Horse>

const myhHrseOptions1: HorseOptions = {
  age: 5,
  run: 1,
}

console.log(myhHrseOptions1)

// You can remove or add these modifiers by prefixing with - or +.

type ReadonlyOptionsFlag<T> = {
  -readonly [key in keyof T]: number
}

type LockedAccount = {
  id: string
  readonly name: string
}

type ModifyAccount = ReadonlyOptionsFlag<LockedAccount>

type Concrete<Type> = {
  [key in keyof Type]-?: Type[key]
}

type MaybeUser = {
  id: string
  name: string
  age?: number
  gender?: string
}

type ConcreteUser = Concrete<MaybeUser>

// as clause
type Getters<Type> = {
  [key in keyof Type as `get${Capitalize<string & key>}`]: () => Type[key]
}

interface Person {
  name: string
  age: number
  location: string
}

type LazyPerson = Getters<Person>

type MyExclude<T, K> = T extends K ? never : T

// Remove the 'kind' property
type RemoveKindField<Type> = {
  // key is "kind" then as never (Remove the 'kind' property)
  [key in keyof Type as Exclude<key, 'kind'>]: Type[key]
}

interface Circle {
  kind: 'circle'
  radius: number
}

type KindlessCircle = RemoveKindField<Circle>

type EventConfig<Events extends { kind: string }> = {
  [E in Events as E['kind']]: (e: E) => void
}

type ClickEvent = { kind: 'click'; x: number; y: number }
type CircleEvent = { kind: 'circle'; radius: number }

// { click: (e: ClickEvent) => void } | { circle: (e: CircleEvent) => void }
type Config = EventConfig<ClickEvent | CircleEvent>

type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [key in K]: T[key]
} & {
  [key in Exclude<keyof T, K>]: T[key]
}
interface Todo {
  title: string
  description: string
  completed: boolean
}

type MyTodo = MyReadonly2<Todo, 'title' | 'description'>
type ExcludeTodo = Exclude<keyof Todo, 'title' | 'description'>

const excludeTodo1: ExcludeTodo = 'completed'

const todo: MyTodo = {
  title: 'Hey',
  description: 'foobar',
  completed: false,
}

// todo.title = 'Hello' // Error: cannot reassign a readonly property
// todo.description = 'barFoo' // Error: cannot reassign a readonly property
todo.completed = true // OK

console.log(excludeTodo1, todo)
