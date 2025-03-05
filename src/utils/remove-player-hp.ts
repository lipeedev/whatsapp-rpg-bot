import { prisma } from "../structures"

export async function removePlayerHP(id: string, hp: number) {
  const playerInfoUpdated = await prisma.player.update({
    where: { id },
    data: {
      hp: { decrement: hp },
    }
  })

  if (playerInfoUpdated.hp < 0) {
    await prisma.player.update({
      where: { id },
      data: {
        hp: 10,
        stars: 0,
        effect: 'Nenhum',
        equippedShield: null,
        equippedWeapon: null,
      }
    })

    await prisma.item.deleteMany({
      where: { playerId: id }
    })

    await prisma.potion.deleteMany({
      where: { playerId: id }
    })

    await prisma.equipment.deleteMany({
      where: { playerId: id }
    })

    return { isDead: true }
  }

  return { isDead: false }

}
