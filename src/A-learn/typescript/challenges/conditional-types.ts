interface Animal {
  alive(): void
}

interface Dog extends Animal {
  wolf(): void
}

type Example1 = Dog extends Animal ? number : string

type Example2 = Object extends Animal ? number : string

type NumberOrString = Example1 | Example2

interface IdLabel {
  id: number
}

interface NameLabel {
  name: string
}

type NameOrId<T extends NumberOrString> = T extends number ? IdLabel : NameLabel

function createLabel<T extends NumberOrString>(idOrName: T): NameOrId<T> {
  // throw 'unimplemented'
  return idOrName as any
}

const Example11 = createLabel('1231231')
const Example22 = createLabel(1231231)
const Example33 = createLabel(123)

console.log(Example11, Example22, Example33)
