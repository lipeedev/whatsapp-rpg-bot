export interface Item {
  name: string;
  emoji: string;
  combinations: string[];
}

export const items: Item[] = [
  { name: 'Raiz de Mandrágora', emoji: '🌱', combinations: ['Lágrima de Sereia', 'Seiva Mística', 'Cinzas de Fênix', 'Erva Curativa', 'Espírito da Floresta', 'Casca de Titã'] },
  { name: 'Lágrima de Sereia', emoji: '💧', combinations: ['Raiz de Mandrágora', 'Essência de Estrela', 'Pólen Dourado', 'Olho de Tritão', 'Gema Aquática', 'Néctar Celestial'] },
  { name: 'Seiva Mística', emoji: '🌿', combinations: ['Raiz de Mandrágora', 'Cinzas de Fênix', 'Flor Lunar', 'Pólen Dourado', 'Néctar Celestial', 'Semente da Vida'] },
  { name: 'Cinzas de Fênix', emoji: '🪶', combinations: ['Seiva Mística', 'Fungo da Caverna', 'Pó de Lua', 'Lágrima de Dragão', 'Coração de Obsidiana', 'Fragmento de Aurora'] },
  { name: 'Essência de Estrela', emoji: '✨', combinations: ['Lágrima de Sereia', 'Fio de Cabelos de Ninfa', 'Pó de Estrelas', 'Névoa Etérea', 'Lótus Celestial', 'Fragmento de Aurora'] },
  { name: 'Fio de Cabelos de Ninfa', emoji: '🧝', combinations: ['Essência de Estrela', 'Chifre de Unicórnio', 'Pétala de Sonho', 'Flor Lunar', 'Orvalho Cristalino', 'Lótus Celestial'] },
  { name: 'Chifre de Unicórnio', emoji: '🦄', combinations: ['Fio de Cabelos de Ninfa', 'Pó de Cristal Solar', 'Flor Lunar', 'Pétala de Sonho', 'Espírito da Floresta', 'Lágrima de Dragão'] },
  { name: 'Pó de Cristal Solar', emoji: '☀️', combinations: ['Chifre de Unicórnio', 'Pólen Dourado', 'Areia do Tempo', 'Raio de Tempestade', 'Núcleo da Terra', 'Lótus Celestial'] },
  { name: 'Pólen Dourado', emoji: '🌼', combinations: ['Pó de Cristal Solar', 'Néctar Celestial', 'Lágrima de Sereia', 'Lótus Celestial', 'Sopro de Dragão', 'Semente da Vida'] },
  { name: 'Néctar Celestial', emoji: '🍯', combinations: ['Pólen Dourado', 'Sopro de Dragão', 'Seiva Mística', 'Areia do Tempo', 'Espírito da Floresta', 'Raiz de Mandrágora'] },
  { name: 'Sopro de Dragão', emoji: '🔥', combinations: ['Néctar Celestial', 'Pluma do Corvo Sombrio', 'Chama Azul', 'Raio de Tempestade', 'Lágrima de Dragão', 'Coração de Obsidiana'] },
  { name: 'Pluma do Corvo Sombrio', emoji: '🖤', combinations: ['Sopro de Dragão', 'Olho de Tritão', 'Essência Sombria', 'Luz Fantasma', 'Vento Congelado', 'Fio de Teia Sombria'] },
  { name: 'Olho de Tritão', emoji: '👁️', combinations: ['Pluma do Corvo Sombrio', 'Orvalho Cristalino', 'Gema Aquática', 'Lágrima de Sereia', 'Escama de Serpente', 'Névoa Etérea'] },
  { name: 'Orvalho Cristalino', emoji: '💧', combinations: ['Olho de Tritão', 'Fungo da Caverna', 'Vento Congelado', 'Fragmento de Aurora', 'Flor Lunar', 'Fio de Cabelos de Ninfa'] },
  { name: 'Fungo da Caverna', emoji: '🍄', combinations: ['Cinzas de Fênix', 'Orvalho Cristalino', 'Escama de Serpente', 'Veneno de Aranha', 'Fungos da Neblina', 'Sangue de Troll'] },
  { name: 'Pó de Lua', emoji: '🌙', combinations: ['Flor Lunar', 'Areia do Tempo', 'Cinzas de Fênix', 'Folha Noturna', 'Vento Congelado', 'Luz Fantasma'] },
  { name: 'Flor Lunar', emoji: '🌺', combinations: ['Pó de Lua', 'Erva Curativa', 'Fio de Cabelos de Ninfa', 'Pétala de Sonho', 'Lótus Celestial', 'Seiva Mística'] },
  { name: 'Erva Curativa', emoji: '🍀', combinations: ['Flor Lunar', 'Raiz de Mandrágora', 'Semente da Vida', 'Espírito da Floresta', 'Folha Noturna', 'Néctar Celestial'] },
  { name: 'Pedra Alquímica', emoji: '🔮', combinations: ['Gema Aquática', 'Líquido Flamejante', 'Núcleo da Terra', 'Chama Azul', 'Fragmento de Aurora', 'Coração de Obsidiana'] },
  { name: 'Gema Aquática', emoji: '💎', combinations: ['Pedra Alquímica', 'Lágrima de Sereia', 'Olho de Tritão', 'Orvalho Cristalino', 'Lágrima de Dragão', 'Vento Congelado'] },
  { name: 'Líquido Flamejante', emoji: '🔥', combinations: ['Pedra Alquímica', 'Chama Azul', 'Sopro de Dragão', 'Coração de Obsidiana', 'Raio de Tempestade', 'Núcleo da Terra'] },
  { name: 'Chama Azul', emoji: '🔥', combinations: ['Líquido Flamejante', 'Sopro de Dragão', 'Lâmina Etérea', 'Pó de Cristal Solar', 'Fragmento de Aurora', 'Fio de Teia Sombria'] },
  { name: 'Fio de Teia Sombria', emoji: '🕸️', combinations: ['Cinzas de Fênix', 'Essência de Estrela', 'Veneno de Aranha', 'Pluma do Corvo Sombrio', 'Lâmina Etérea', 'Essência Sombria'] },
  { name: 'Névoa Etérea', emoji: '🌫️', combinations: ['Orvalho Cristalino', 'Fungos da Neblina', 'Pétala de Sonho', 'Luz Fantasma', 'Vento Congelado', 'Olho de Tritão'] },
  { name: 'Fungos da Neblina', emoji: '🍄', combinations: ['Névoa Etérea', 'Pó de Lua', 'Fungo da Caverna', 'Sangue de Troll', 'Escama de Serpente', 'Folha Noturna'] },
  { name: 'Sangue de Troll', emoji: '🩸', combinations: ['Pele de Lobo', 'Veneno de Aranha', 'Fungos da Neblina', 'Essência Sombria', 'Casca de Titã', 'Raiz de Mandrágora'] },
  { name: 'Pele de Lobo', emoji: '🐺', combinations: ['Sangue de Troll', 'Pó de Cristal Solar', 'Espírito da Floresta', 'Folha Noturna', 'Vento Congelado', 'Fio de Teia Sombria'] },
  { name: 'Veneno de Aranha', emoji: '🕷️', combinations: ['Sangue de Troll', 'Fio de Teia Sombria', 'Escama de Serpente', 'Fungo da Caverna', 'Essência Sombria', 'Pluma do Corvo Sombrio'] },
  { name: 'Essência Sombria', emoji: '🌑', combinations: ['Veneno de Aranha', 'Cinzas de Fênix', 'Luz Fantasma', 'Pluma do Corvo Sombrio', 'Fio de Teia Sombria', 'Pó de Estrelas'] },
  { name: 'Pó de Estrelas', emoji: '⭐', combinations: ['Essência Sombria', 'Pó de Cristal Solar', 'Essência de Estrela', 'Fragmento de Aurora', 'Lótus Celestial', 'Névoa Etérea'] },
  { name: 'Areia do Tempo', emoji: '⏳', combinations: ['Pó de Lua', 'Néctar Celestial', 'Pó de Cristal Solar', 'Raio de Tempestade', 'Lágrima de Dragão', 'Núcleo da Terra'] },
  { name: 'Lágrima de Dragão', emoji: '🐉', combinations: ['Sopro de Dragão', 'Gema Aquática', 'Areia do Tempo', 'Coração de Obsidiana', 'Chifre de Unicórnio', 'Núcleo da Terra'] },
  { name: 'Coração de Obsidiana', emoji: '❤️🔥', combinations: ['Cinzas de Fênix', 'Líquido Flamejante', 'Lágrima de Dragão', 'Pedra Alquímica', 'Sopro de Dragão', 'Fragmento de Aurora'] },
  { name: 'Folha Noturna', emoji: '🍁', combinations: ['Pó de Lua', 'Erva Curativa', 'Fungos da Neblina', 'Espírito da Floresta', 'Vento Congelado', 'Pele de Lobo'] },
  { name: 'Pétala de Sonho', emoji: '🌸', combinations: ['Flor Lunar', 'Névoa Etérea', 'Fio de Cabelos de Ninfa', 'Chifre de Unicórnio', 'Lótus Celestial', 'Luz Fantasma'] },
  { name: 'Escama de Serpente', emoji: '🐍', combinations: ['Veneno de Aranha', 'Fungo da Caverna', 'Olho de Tritão', 'Fungos da Neblina', 'Sangue de Troll', 'Essência Sombria'] },
  { name: 'Raio de Tempestade', emoji: '⚡', combinations: ['Areia do Tempo', 'Sopro de Dragão', 'Pó de Cristal Solar', 'Líquido Flamejante', 'Núcleo da Terra', 'Chama Azul'] },
  { name: 'Semente da Vida', emoji: '🌰', combinations: ['Erva Curativa', 'Néctar Celestial', 'Seiva Mística', 'Espírito da Floresta', 'Flor Lunar', 'Pólen Dourado'] },
  { name: 'Núcleo da Terra', emoji: '🌍', combinations: ['Pedra Alquímica', 'Cinzas de Fênix', 'Raio de Tempestade', 'Areia do Tempo', 'Lágrima de Dragão', 'Líquido Flamejante'] },
  { name: 'Fragmento de Aurora', emoji: '🌈', combinations: ['Essência de Estrela', 'Orvalho Cristalino', 'Pedra Alquímica', 'Coração de Obsidiana', 'Pó de Estrelas', 'Chama Azul'] },
  { name: 'Lótus Celestial', emoji: '🪷', combinations: ['Flor Lunar', 'Pólen Dourado', 'Essência de Estrela', 'Pétala de Sonho', 'Pó de Estrelas', 'Néctar Celestial'] },
  { name: 'Casca de Titã', emoji: '🛡️', combinations: ['Coração de Obsidiana', 'Raiz de Mandrágora', 'Sangue de Troll', 'Espírito da Floresta', 'Pele de Lobo', 'Fungos da Neblina'] },
  { name: 'Vento Congelado', emoji: '❄️', combinations: ['Orvalho Cristalino', 'Névoa Etérea', 'Pó de Lua', 'Folha Noturna', 'Pluma do Corvo Sombrio', 'Gema Aquática'] },
  { name: 'Luz Fantasma', emoji: '👻', combinations: ['Essência Sombria', 'Pluma do Corvo Sombrio', 'Névoa Etérea', 'Pétala de Sonho', 'Vento Congelado', 'Fragmento de Aurora'] },
  { name: 'Espírito da Floresta', emoji: '🌳', combinations: ['Seiva Mística', 'Erva Curativa', 'Raiz de Mandrágora', 'Pele de Lobo', 'Folha Noturna', 'Semente da Vida'] },
  { name: 'Lâmina Etérea', emoji: '🗡️', combinations: ['Fio de Teia Sombria', 'Chama Azul', 'Pluma do Corvo Sombrio', 'Essência Sombria', 'Fragmento de Aurora', 'Lágrima de Dragão'] }
];
