import { prisma } from "../structures"

export async function removePlayerStars(id: string, stars: number) {
  const playerInfoUpdated = await prisma.player.update({
    where: { id },
    data: {
      stars: { decrement: stars },
    }
  })

  if (playerInfoUpdated.stars < 0) {
    await prisma.player.update({
      where: { id },
      data: {
        stars: 0,
      }
    })
  }

}
