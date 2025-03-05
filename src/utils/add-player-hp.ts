import { prisma } from "../structures";

export async function addPlayerHP(id: string, hp: number) {
  const playerInfoUpdated = await prisma.player.update({
    where: { id },
    data: {
      hp: { increment: hp }
    }
  })

  if (playerInfoUpdated.hp > playerInfoUpdated.maxHP) {
    await prisma.player.update({
      where: { id },
      data: {
        hp: playerInfoUpdated.maxHP
      }
    })
  }
}
