interface Card {
  suit: string
  icon: string
  card: string
}

interface Deck {
  suits: string[]
  icons: string[]
  cards: string[]
  createCardPicker(this: Deck): () => Card
  displayCard: (card: Card) => void
}

let deck: Deck = {
  suits: ['spades', 'hearts', 'clubs', 'diamonds'],
  icons: ['♠', '♥', '♣', '◆'],
  cards: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function (this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)

      return { suit: this.suits[pickedSuit], icon: this.icons[pickedSuit], card: this.cards[pickedCard % 13] }
    }
  },
  displayCard: function (card: Card) {
    console.log(card.suit, 'card:', card.icon, card.card)
  },
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()
deck.displayCard(pickedCard)

// 函数类型
interface SearchFunc {
  (source: string, subString: string): boolean
}

let mySearch: SearchFunc
mySearch = function (src: string, sub: string): boolean {
  const result = src.search(sub)
  return result > -1
}

interface StringArray {
  [index: number]: string
}

let myArray: StringArray
myArray = ['Bob', 'Fred']

let myStr: string = myArray[0]
let demo: any = 123
let demo1: string = demo as string

function disp(s1: string): string
function disp(x: number, y: string): number

function disp(x: any, y?: any): any {
  console.log(x, y)
}

disp('abc')
disp(1, 'xyz')

interface Person {
  readonly id: string
  name: string
  age: number
  gender?: number
  [propName: string]: any
}

interface CreatePerson {
  (person: Person): { id: string; name: string }
}

const createPerson: CreatePerson = (person: Person) => {
  const { id, name } = person
  return { id, name }
}

// const p11: Person = { id: `${Math.random()}`, name: 'hongxin', age: 23, nouse: 'nouse' }
// console.log(p11)
// console.log(createPerson(p11))

// 接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。
// interface ClockInterface {
//   currentTime: Date;
//   setTime(d: Date): void;
// }

// class Clock implements ClockInterface {
//   currentTime: Date;
//   setTime(d: Date) {
//       this.currentTime = d;
//   }
//   constructor(h: number, m: number) { }
// }

interface ClockConstructor {
  new (hour: number, minute: number): any
}

interface ClockInterface {
  currentTime: Date
  tick(): void
}

class Clock implements ClockInterface {
  currentTime = new Date()
  tick = () => {
    console.log('tick tock', this.currentTime.toString())
  }
  constructor(h: number, m: number) {
    const currentTime = new Date()
    currentTime.setHours(h)
    currentTime.setMinutes(m)
    this.currentTime = currentTime
  }
}

new Clock(17, 29).tick()

interface Shape {
  shape: string
}

interface Color {
  color: string
}

interface Blocks extends Shape, Color {
  size: string
}

const block = <Blocks>{}
block.shape = 'square'
block.color = 'pink'
block.size = 'big'
console.log('block', block)
