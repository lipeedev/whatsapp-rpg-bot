import { prisma } from "../structures";

export async function removeEquipmentFromPlayer(playerId: string, itemName: string) {
  const item = await prisma.equipment.findFirst({
    where: { playerId, name: itemName },
  });

  await prisma.equipment.delete({
    where: { id: item?.id, playerId },
  });
}
