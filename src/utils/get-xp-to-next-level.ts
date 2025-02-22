type GetXpToNextLevelParams = {
  currentLevel: number,
}

export function getXpToNextLevel({ currentLevel }: GetXpToNextLevelParams) {
  return currentLevel * 200

}
