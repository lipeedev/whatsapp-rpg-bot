import { WAMessage } from "@whiskeysockets/baileys"
import { botConfig, Command, CommandExecuteOptions, shopItems, ShopItemType } from "../../structures"

export default class ShopCommand extends Command {
  constructor() {
    super({
      name: 'shop',
      aliases: ['loja'],
      description: 'Exibe os itens disponíveis da Loja Mística.',
      args: false,
      isRegisterRequired: true
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {
    const swords = shopItems.filter(item => item.type === ShopItemType.Sword)
    const shields = shopItems.filter(item => item.type === ShopItemType.Shield)
    const tickets = shopItems.filter(item => item.type === ShopItemType.Ticket)
    const skins = shopItems.filter(item => item.type === ShopItemType.Skin)

    const outputMsg = `
\`\`\`🏰 Loja Mística 🏰 \`\`\` 

╭─━━━━━━━━━━━━━━─╮

\`\`\`》━ {⚔️} 𝑨𝒓𝒎𝒂𝒔: \`\`\`

${swords.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price}\n> 🔺 Dano: ${item.damage}`).join('\n\n')}

\`\`\`》━ {🛡️} 𝑬𝒔𝒄𝒖𝒅𝒐𝒔: \`\`\`

${shields.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price}\n> 🛡️ Defesa: ${item.protection}`).join('\n\n')}

\`\`\`》━ {🎟️} 𝑻𝒊𝒄𝒌𝒆𝒕𝒔: \`\`\`

${tickets.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price}`).join('\n\n')}

\`\`\`》━ {🥻} 𝑺𝒌𝒊𝒏𝒔: \`\`\`

${skins.map(item => `*◈  ${item.name} ${item.emoji}*\n> 🌟 Custo: ${item.price}\n> ⚜️ Classe: ${item.requiredPlayerClass}`).join('\n\n')}

╰─━━━━━━━━━━━━━━─╯

{💡} 𝑫𝒊𝒄𝒂:  
> Use \`${botConfig.prefix}comprar [item]\`
`.trim()

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: outputMsg
    }, { quoted: messageObj as WAMessage })

  }
};
