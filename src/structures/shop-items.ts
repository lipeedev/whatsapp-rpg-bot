import { PlayerClassType } from "./classes"

export enum ShopItemType {
  Sword,
  Shield,
  Ticket,
  Skin
}

export type ShopItem = {
  name: string,
  emoji: string,
  type: ShopItemType,
  price: number,
  damage?: number,
  protection?: number
  requiredPlayerClass?: PlayerClassType
}

export const shopItems: ShopItem[] = [
  {
    name: 'Espadas Gêmeas',
    emoji: '⚔️',
    type: ShopItemType.Sword,
    price: 250,
    damage: 10
  },
  {
    name: 'Machado Grande',
    emoji: '🪓',
    type: ShopItemType.Sword,
    price: 350,
    damage: 20
  },
  {
    name: 'Espada Flamejante',
    emoji: '🗡️🔥',
    type: ShopItemType.Sword,
    price: 500,
    damage: 40
  },
  {
    name: 'Espada de Gelo',
    emoji: '❄️🗡️',
    type: ShopItemType.Sword,
    price: 450,
    damage: 30
  },
  {
    name: 'Lâmina Sombria',
    emoji: '🌑🗡️',
    type: ShopItemType.Sword,
    price: 600,
    damage: 50
  },
  {
    name: 'Martelo do Trovão',
    emoji: '⚡🔨',
    type: ShopItemType.Sword,
    price: 700,
    damage: 60
  },
  {
    name: 'Escudo de Ferro',
    emoji: '🛡️',
    type: ShopItemType.Shield,
    price: 200,
    protection: 10
  },
  {
    name: 'Barreira do Herói',
    emoji: '🔰',
    type: ShopItemType.Shield,
    price: 370,
    protection: 20
  },
  {
    name: 'Escudo do Dragão',
    emoji: '🐉🛡️',
    type: ShopItemType.Shield,
    price: 600,
    protection: 40
  },
  {
    name: 'Escudo de Ébano',
    emoji: '🖤🛡️',
    type: ShopItemType.Shield,
    price: 500,
    protection: 35
  },
  {
    name: 'Escudo Sagrado',
    emoji: '✨🛡️',
    type: ShopItemType.Shield,
    price: 800,
    protection: 50
  },
  {
    name: 'Ticket de Guilda',
    emoji: '🎫',
    type: ShopItemType.Ticket,
    price: 1000,
  },
  {
    name: 'Ranger',
    emoji: '🐊⛓️‍💥',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Knight
  },
  {
    name: 'Cinder',
    emoji: '👁️‍🗨️⛓️‍💥',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Knight
  },
  {
    name: 'Scar',
    emoji: '🌀⛓️‍💥',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Knight
  },
  {
    name: 'Orion',
    emoji: '🪐⛓️‍💥',
    type: ShopItemType.Skin,
    price: 700,
    requiredPlayerClass: PlayerClassType.Knight
  },
  {
    name: 'Artorian',
    emoji: '🦁⛓️‍💥',
    type: ShopItemType.Skin,
    price: 700,
    requiredPlayerClass: PlayerClassType.Knight
  },
  {
    name: 'Aether',
    emoji: '❄️✨',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Wizard
  },
  {
    name: 'Ignis',
    emoji: '🔥✨',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Wizard
  },
  {
    name: 'Sage',
    emoji: '🌲✨',
    type: ShopItemType.Skin,
    price: 500,
    requiredPlayerClass: PlayerClassType.Wizard
  },
  {
    name: 'Royal',
    emoji: '👑✨',
    type: ShopItemType.Skin,
    price: 700,
    requiredPlayerClass: PlayerClassType.Wizard
  },
  {
    name: 'Pegasus',
    emoji: '🦄✨',
    type: ShopItemType.Skin,
    price: 700,
    requiredPlayerClass: PlayerClassType.Wizard
  },
]
