import { BadEffect, PotionEffect, prisma } from "../structures";

type AnyEffect = PotionEffect | BadEffect | { description: 'Nenhum' }

export async function changePlayerEffect(playerId: string, effect: AnyEffect) {
  await prisma.player.update({
    where: { id: playerId },
    data: { effect: effect.description }
  })
}
