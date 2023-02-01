/**
 * @param {{
 * type: String, 
 * category: 'armor' | 'resource', 
 * isSingle: Boolean, 
 * value: String, 
 * coast: Number 
 * }[]} items 
 */
module.exports = (items) => {
    const titleTextMessage = '```- LOJA - ```';
    const armorTitleTextMessage = '*[ Armamentos ]*';
    const armorItemsMessage = items.filter(item => item.category === 'armor').map(item => `${item.value} *(${item.coast} 💰)*`).join('\n');
    const resourceTitleTextMessage = '*[ Recursos ]*';
    const resourceItemsMessage = items.filter(item => item.category === 'resource').map(item => `${item.value} *(${item.coast} 💰)*`).join('\n');

    return `${titleTextMessage}\n\n${armorTitleTextMessage}\n${armorItemsMessage.length ? armorItemsMessage : 'vazio...'}\n\n${resourceTitleTextMessage}\n${resourceItemsMessage.length ? resourceItemsMessage : 'vazio...'}\n`;
}