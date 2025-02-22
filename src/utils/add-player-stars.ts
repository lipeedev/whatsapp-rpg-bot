import { prisma } from "../structures";

export async function addPlayerStars(id: string, stars: number) {
  await prisma.player.update({
    where: { id },
    data: {
      stars: { increment: stars },
    }
  })
}
