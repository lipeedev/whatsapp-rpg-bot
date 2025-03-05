import { prisma } from "../structures";

export async function addPotionToPlayer(playerId: string, potionName: string, effect: string) {
  const potion = await prisma.potion.findFirst({
    where: { playerId, name: potionName },
  });

  if (potion) {
    await prisma.potion.update({
      where: { id: potion.id, playerId },
      data: { count: { increment: 1 } },
    });
  }
  else {
    await prisma.potion.create({
      data: {
        name: potionName,
        effect,
        count: 1,
        playerId
      }
    });
  }
}
