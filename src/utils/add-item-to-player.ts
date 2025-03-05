import { prisma } from "../structures";

export async function addItemToPlayer(playerId: string, itemName: string) {
  const item = await prisma.item.findFirst({
    where: { playerId, name: itemName },
  });

  if (item) {
    await prisma.item.update({
      where: { id: item.id, playerId },
      data: { count: { increment: 1 } },
    });
  }
  else {
    await prisma.item.create({
      data: {
        name: itemName,
        count: 1,
        playerId
      }
    });
  }
}
