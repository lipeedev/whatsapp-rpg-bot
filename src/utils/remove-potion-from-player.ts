import { prisma } from "../structures";

export async function removePotionFromPlayer(playerId: string, potionName: string) {
  const potion = await prisma.potion.findFirst({
    where: { playerId, name: potionName },
  });

  if (potion?.count > 1) {
    await prisma.potion.update({
      where: { id: potion.id, playerId },
      data: { count: { decrement: 1 } },
    });
  }
  else {
    await prisma.potion.delete({
      where: { id: potion.id, playerId },
    });
  }
}
