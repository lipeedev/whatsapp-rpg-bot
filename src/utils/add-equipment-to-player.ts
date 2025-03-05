import { prisma, ShopItem } from "../structures";

export async function addEquipmentToPlayer(playerId: string, item: ShopItem) {
  await prisma.equipment.create({
    data: {
      name: item.name,
      damage: item.damage ?? null,
      protection: item.protection ?? null,
      playerId
    }
  });
}
