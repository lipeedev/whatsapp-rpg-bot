export function getMapAsString(map: string[][]) {
  return map.flatMap(m => m + '\n').join('').replaceAll(',', '')
}
