export enum PlayerClassType {
  Knight = "Cavaleiro",
  Wizard = "Mago"
}

export type PlayerStats = {
  strength: number,
  dexterity: number,
  intelligence: number,
  lucky: number
}

type EmojiClass = {
  male: string,
  female: string
}

export type PlayerClass = {
  title: string,
  type: PlayerClassType,
  typeName: string,
  stats: PlayerStats,
  emoji: EmojiClass
}

export const classes: PlayerClass[] = [
  {
    title: 'Cavaleiro',
    emoji: {
      male: '💂🏻‍♂️',
      female: '💂🏻‍♀️'
    },
    typeName: 'knight',
    type: PlayerClassType.Knight,
    stats: {
      strength: 10,
      dexterity: 8,
      intelligence: 6,
      lucky: 4
    }
  },
  {
    title: 'Mago',
    emoji: {
      male: '🧙🏻‍♂️',
      female: '🧙🏼‍♀️'
    },
    typeName: 'wizard',
    type: PlayerClassType.Wizard,
    stats: {
      strength: 7,
      dexterity: 5,
      intelligence: 10,
      lucky: 6
    }
  }
]
