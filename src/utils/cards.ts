export enum CardType {
  Cancel,
  BasicTaiCorporal,
  BasicTaiDistance
}

export type Card = {
  title: string,
  ck: number,
  damage: number,
  type: CardType,
  cardTypesCancellableInFirst: CardType[]
}

export const cards: Card[] = [
  {
    title: 'Yanagi no Mai',
    ck: 50,
    damage: 0,
    type: CardType.Cancel,
    cardTypesCancellableInFirst: [
      CardType.Cancel,
      CardType.BasicTaiCorporal,
      CardType.BasicTaiDistance
    ]
  },
  {
    title: 'Surippukikku',
    ck: 0,
    damage: 130,
    type: CardType.BasicTaiCorporal,
    cardTypesCancellableInFirst: [
      CardType.BasicTaiDistance,
      CardType.Cancel,
    ]
  }

]
