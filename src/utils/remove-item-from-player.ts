import { prisma } from "../structures";

export async function removeItemFromPlayer(playerId: string, itemName: string) {
  const item = await prisma.item.findFirst({
    where: { playerId, name: itemName },
  });

  if (item?.count > 1) {
    await prisma.item.update({
      where: { id: item.id, playerId },
      data: { count: { decrement: 1 } },
    });
  }
  else {
    await prisma.item.delete({
      where: { id: item?.id, playerId },
    });
  }
}
