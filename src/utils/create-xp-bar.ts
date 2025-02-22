type CreateXpBarParams = {
  currentXP: number,
  nextLevelXP: number,
  barSize?: number
}

export function createXPBar({ currentXP, nextLevelXP, barSize = 5 }: CreateXpBarParams) {
  const percentageXP = (currentXP / nextLevelXP) * 100;
  const filledBlocks = Math.floor((percentageXP / 100) * barSize);
  const emptyBlocks = barSize - filledBlocks;

  return '▰'.repeat(filledBlocks) + '▱'.repeat(emptyBlocks);
}
