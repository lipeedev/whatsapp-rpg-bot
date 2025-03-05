import { prisma } from "../structures";
import { getMaxHpUpdated } from "./get-max-hp-updated";
import { getXpToNextLevel } from "./get-xp-to-next-level";

export async function addPlayerXP(id: string, xp: number) {
  const playerInfoUpdated = await prisma.player.update({
    where: { id },
    data: {
      xp: { increment: xp }
    }
  })

  const requiredXpToNextLevel = getXpToNextLevel({ currentLevel: playerInfoUpdated.level })

  if (playerInfoUpdated.xp >= requiredXpToNextLevel) {
    await prisma.player.update({
      where: { id },
      data: {
        level: { increment: 1 },
        maxHP: getMaxHpUpdated(playerInfoUpdated.level + 1)
      }
    })

    return { levelUp: true }
  }

  return { levelUp: false }

}
