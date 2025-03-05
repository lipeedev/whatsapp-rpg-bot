export type BadEffectDescription =
  'Loja mais cara'


export enum BadEffectType {
  MoreExpensiveShop
}

export type BadEffect = {
  type: BadEffectType,
  description: BadEffectDescription
}

