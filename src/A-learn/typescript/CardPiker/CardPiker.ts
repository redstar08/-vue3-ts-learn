const suits: string[] = ['spades', 'hearts', 'clubs', 'diamonds']
const icons: string[] = ['♠', '♥', '♣', '◆']
const cards: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

interface Card {
  suit: string
  icon: string
  card: string
}

const usedCardIds: number[] = []
const usedCards: Card[] = []

let count = 0

const randomCard: Function = (): Card => {
  const random = Math.random() * 52
  console.log('count: ', count++, random)
  const cardId = Math.floor(random)
  if (!usedCardIds.includes(cardId)) {
    usedCardIds.push(cardId)
    const suit = Math.floor(cardId / 13)
    const card = cardId % 13
    usedCards[cardId] = { suit: suits[suit], icon: icons[suit], card: cards[card] }
  }
  return usedCards[cardId]
}

const displayCard: Function = (card: Card): void => {
  console.log(card.suit, 'card:', card.icon, card.card)
}

// displayCard(randomCard())

while (usedCardIds.length !== 52) {
  randomCard()
}
console.log(usedCardIds, usedCards)
