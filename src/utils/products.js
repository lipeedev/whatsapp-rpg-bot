module.exports =  [
    { type: 'madeira', category: 'resource', isSingle: true, value: 'Madeira' },
    { type: 'pedra', category: 'resource', isSingle: true, value: 'Pedra' },
    { type: 'carne', category: 'resource', isSingle: true, value: 'Carne' },
    { type: 'mineração', category: 'resource', isSingle: false, values: ['Gemas', 'Ouro', 'Ferro', 'Cobre', 'Estanho'] },
    { type: 'grãos', category: 'resource', isSingle: false, values: ['Trigo', 'Milho', 'Cevada', 'Arroz', 'Centeio', 'Aveia', 'Linhaça'] },
    { type: 'frutas', category: 'resource', isSingle: false, values: ['Melão', 'Pêssego', 'Maçã', 'Uva', 'Ameixa', 'Laranja', 'Romã'] },
];