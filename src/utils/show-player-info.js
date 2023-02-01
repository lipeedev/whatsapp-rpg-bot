/**
 * 
 * @param {{
 * hp: String
 * name: String
 * stamina: Number
 * category: String
 * inventory: { type: String, category: String, value: String, amount: Number, money: Number }[]
 * }} 
 * 
 * @returns { String }
 */

module.exports = ({ hp, name, stamina, category, inventory, money }) => {
    const resourceItemsInventory = inventory.filter(item => item.category === 'resource').map(item => `_${item.amount}x_ ${item.value}`).join('\n');
    const armorItemsInventory = inventory.filter(item => item.category === 'armor').map(item => `_${item.amount}x_ ${item.value}`).join('\n');
  
    return `*Nome:* \`\`\`${name}\`\`\`\n*Categoria:* [ ${category} ]\n*❤ ${hp}*  |  *🩸 ${stamina}*\n\n\`\`\`- INVENTÁRIO -\`\`\`\n*[💰] Moedas: ${money}*\n\n*[Recursos]*\n${resourceItemsInventory.length ? resourceItemsInventory : '_vazio..._'}\n\n*[Armamento]*\n${armorItemsInventory.length ? armorItemsInventory : '_vazio..._'}`;
}