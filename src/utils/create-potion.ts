import { Item, PotionEffect, potionEffects } from "../structures";

export interface Potion {
  name: string;
  effect: PotionEffect;
}

const potionPrefixes: string[] = [
  'Elixir', 'Poção', 'Brebagem', 'Essência', 'Soro', 'Pocção', 'Tônico', 'Extrato',
  'Infusão', 'Bálsamo', 'Néctar', 'Pó', 'Líquido', 'Cápsula', 'Emulsão', 'Filtrado',
  'Destilado', 'Pomada', 'Xarope', 'Veneno', 'Frasco', 'Gota', 'Cálice', 'Pergaminho',
  'Orvalho', 'Lágrima', 'Raiz', 'Semente', 'Vapor', 'Lama', 'Resina', 'Geleia', 'Azeite',
  'Pétala', 'Cristal', 'Fragmento', 'Essência', 'Neblina', 'Cinza', 'Lodo', 'Fluido',
  'Gás', 'Luz', 'Sombra', 'Chama', 'Gelo', 'Vento', 'Terra', 'Água', 'Fogo', 'Relâmpago'
];

const potionAdjectives: string[] = [
  'Arcano', 'Místico', 'Enigmático', 'Espectral', 'Sagrado', 'Sombrio', 'Luminoso', 'Obscuro',
  'Cósmico', 'Elemental', 'Celestial', 'Infernal', 'Primordial', 'Arcaico', 'Misterioso',
  'Encantado', 'Divino', 'Profano', 'Alquímico', 'Dracônico', 'Feral', 'Ethereal', 'Vibrante',
  'Gélido', 'Ígneo', 'Tempestuoso', 'Venenoso', 'Radiante', 'Cintilante', 'Sussurrante',
  'Flamejante', 'Gélido', 'Relampejante', 'Trovejante', 'Vaporoso', 'Lodoso', 'Cristalino',
  'Nebuloso', 'Sombrio', 'Brilhante', 'Fumegante', 'Fulgurante', 'Sibilante', 'Crepitante',
  'Pulsante', 'Viscoso', 'Incandescente', 'Fosforescente', 'Gélido', 'Abissal', 'Aetherial'
];

const potionSuffixes: string[] = [
  'do Caos', 'da Lua', 'do Abismo', 'dos Deuses', 'da Aurora', 'do Véu', 'do Tempo',
  'do Dragão', 'das Sombras', 'do Fogo', 'do Gelo', 'do Vento', 'do Sol', 'da Noite',
  'das Chamas', 'do Eclipse', 'da Serpente', 'do Trovão', 'da Alma', 'do Sonho',
  'do Pólen', 'da Névoa', 'do Raio', 'da Terra', 'do Mar', 'da Floresta', 'do Céu',
  'do Inferno', 'do Vácuo', 'da Vida', 'da Morte', 'do Sangue', 'das Ervas', 'do Ouro',
  'da Prata', 'do Bronze', 'do Cristal', 'da Estrela', 'do Cometa', 'da Galáxia',
  'do Portal', 'do Ritual', 'da Magia', 'do Alquimista', 'do Feiticeiro', 'da Bruxa',
  'do Guardião', 'do Anjo', 'do Demônio', 'do Faraó', 'do Viking', 'do Samurai'
];

function generateUniquePotionName(itemA: Item, itemB: Item): string {
  const sortedNames = [itemA.name, itemB.name].sort();
  const key = sortedNames.join('|');
  const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prefix = potionPrefixes[hash % potionPrefixes.length];
  const adjective = potionAdjectives[hash % potionAdjectives.length];
  const suffix = potionSuffixes[hash % potionSuffixes.length];
  return `${prefix} ${adjective} ${suffix}`;
}

export function createPotion(itemA: Item, itemB: Item): Potion | null {
  const isValid = itemA.combinations.includes(itemB.name) || itemB.combinations.includes(itemA.name);
  if (!isValid) return null;

  const name = generateUniquePotionName(itemA, itemB);
  const effect = potionEffects[Math.floor(Math.random() * potionEffects.length)];

  return { name, effect };
}
