export type ExplorationLocation =
  "floresta" | "caverna" | "montanha" | "selva" | "oceano";

export function explore(chosenLocation: ExplorationLocation): { found: boolean, location: string } {

  const locations: ExplorationLocation[] = ["floresta", "caverna"];
  const hiddenTreasureLocation = locations[Math.floor(Math.random() * locations.length)];

  const foundTreasure = chosenLocation === hiddenTreasureLocation;

  return {
    found: foundTreasure,
    location: chosenLocation,
  };
}
