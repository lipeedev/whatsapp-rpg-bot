import { BadEffect, badEffects, BadEffectType, botConfig, Command, CommandExecuteOptions, PotionEffect, potionEffects, PotionEffectType, prisma, shopItems, ShopItemType } from "../../structures"

export default class ShopCommand extends Command {
  constructor() {
    super({
      name: 'shop',
      aliases: ['loja'],
      description: 'Exibe os itens disponíveis da Loja Mística.',
      args: false,
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {
    const swords = shopItems.filter(item => item.type === ShopItemType.Sword)
    const shields = shopItems.filter(item => item.type === ShopItemType.Shield)
    const tickets = shopItems.filter(item => item.type === ShopItemType.Ticket)
    const potions = shopItems.filter(item => item.type === ShopItemType.Potion)

    let priceToBeAdded = 0;

    const playerInfo = await prisma.player.findUnique({ where: { id: messageObj.key.participant } })
    const activeEffectOnPlayer: PotionEffect | BadEffect = potionEffects.find(e => e.description === playerInfo.effect)
      ?? badEffects.find(e => e.description === playerInfo.effect)

    if (activeEffectOnPlayer?.type === BadEffectType.MoreExpensiveShop) {
      priceToBeAdded = 100
    }

    if (activeEffectOnPlayer?.type === PotionEffectType.ReduceShopPrice) {
      priceToBeAdded = -100
    }

    const outputMsg = `
\`\`\`🏰 Loja Mística 🏰 \`\`\` 

╭─━━━━━━━━━━━━━━─╮

\`\`\`》━ {⚔️} 𝑨𝒓𝒎𝒂𝒔: \`\`\`

${swords.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price + priceToBeAdded}\n> 🔺 Dano: ${item.damage}`).join('\n\n')}

\`\`\`》━ {🛡️} 𝑬𝒔𝒄𝒖𝒅𝒐𝒔: \`\`\`

${shields.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price + priceToBeAdded}\n> 🛡️ Defesa: ${item.protection}`).join('\n\n')}

\`\`\`》━ {🎟️} 𝑻𝒊𝒄𝒌𝒆𝒕𝒔: \`\`\`

${tickets.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price + priceToBeAdded}`).join('\n\n')}

\`\`\`》━ {🧪} 𝑷𝒐𝒄̧𝒐̃𝒆𝒔: \`\`\`

${potions.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price + priceToBeAdded}`).join('\n\n')}

╰─━━━━━━━━━━━━━━─╯

{💡} 𝑫𝒊𝒄𝒂:  
> Use \`${botConfig.prefix}comprar [item]\`
`.trim()

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: outputMsg
    }, { quoted: messageObj })

  }
};
