export type PotionEffectDescription =
  'Nenhum'
  | 'Não desconta estrelas em derrotas'
  | 'Todos perdem estrelas'
  | 'Ganha estrelas extras uma vez'
  | 'Rouba estrelas de alguém'
  | 'Protege suas estrelas uma vez'
  | 'Dobra o valor dos ganhos uma vez'
  | 'Anula o efeito atual'
  | 'Aumenta o preço da loja para alguem'
  | 'Reduz o preço da loja'
  | 'Recupera Vida'

export enum PotionEffectType {
  None,
  DontLoseStars,
  EveryoneLoseStars,
  WinExtraStars,
  GetStarsFromSomeone,
  ProtectYourStars,
  MultiplyRewards,
  UndoCurrentEffect,
  MultiplyShopPrice,
  ReduceShopPrice,
  RecoverHP
}

export type PotionEffect = {
  type: PotionEffectType,
  description: PotionEffectDescription
}
