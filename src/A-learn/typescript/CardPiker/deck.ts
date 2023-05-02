interface Cards {
  suit: string
  card: string
}

class Decks {
  constructor() {
    if (!Decks.instence) {
      Decks.instence = this
    }
    return Decks.instence
  }

  static instence: Decks = null

  static getInstence() {
    if (!Decks.instence) {
      return (Decks.instence = new Decks())
    }
    return Decks.instence
  }

  suits = ['spades', 'hearts', 'clubs', 'diamonds']
  cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

  pickCard(): Cards {
    const pickedCard = Math.floor(Math.random() * 52)
    const pickedSuit = Math.floor(pickedCard / 13)
    const suit: string = this.suits[pickedSuit]
    const card: string = this.cards[pickedCard % 13]
    return { suit, card }
  }
}

const printCard = function (Card: Cards) {
  console.log('card:', Card.card, 'of', Card.suit)
}

const decks = Decks.getInstence()
const decks1 = new Decks()
const decks2 = new Decks()
console.log(decks === decks1, decks === decks2, decks1 === decks2)
printCard(decks.pickCard())
