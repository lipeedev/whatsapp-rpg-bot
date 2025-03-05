import { prisma } from "../structures"

export async function removeAllPlayerStars(stars: number, notIncludedPlayerId?: string) {
  await prisma.player.updateMany({
    where: { id: { not: notIncludedPlayerId ?? '' } },
    data: {
      stars: { decrement: stars },
    }
  })

  await prisma.player.updateMany({
    where: {
      id: { not: notIncludedPlayerId ?? '' },
      stars: { lt: 0 }
    },
    data: {
      stars: 0,
    }
  })

}
