import { PotionEffect, PotionEffectType } from "./PotionEffect";

export const potionEffects: PotionEffect[] = [
  { type: PotionEffectType.DontLoseStars, description: 'Não desconta estrelas em derrotas' },
  { type: PotionEffectType.EveryoneLoseStars, description: 'Todos perdem estrelas' },
  { type: PotionEffectType.WinExtraStars, description: 'Ganha estrelas extras uma vez' },
  { type: PotionEffectType.GetStarsFromSomeone, description: 'Rouba estrelas de alguém' },
  { type: PotionEffectType.ProtectYourStars, description: 'Protege suas estrelas uma vez' },
  { type: PotionEffectType.MultiplyRewards, description: 'Dobra o valor dos ganhos uma vez' },
  { type: PotionEffectType.UndoCurrentEffect, description: 'Anula o efeito atual' },
  { type: PotionEffectType.MultiplyShopPrice, description: 'Aumenta o preço da loja para alguem' },
  { type: PotionEffectType.ReduceShopPrice, description: 'Reduz o preço da loja' },
  { type: PotionEffectType.RecoverHP, description: 'Recupera Vida' }
]
