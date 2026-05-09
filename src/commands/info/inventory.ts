import { WAMessage } from "@whiskeysockets/baileys";
import { Command, CommandExecuteOptions, items, prisma, shopItems, ShopItemType } from "../../structures";

export default class InventoryCommand extends Command {
  constructor() {
    super({
      name: "inventory",
      aliases: ["inventario, inv"],
      description: "inventário do jogador",
      isRegisterRequired: true
    });
  }

  async execute({ client, messageObj }: CommandExecuteOptions) {
    let playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant },
      include: { items: true, equipments: true }
    })

    const itemsInfoFromDefinedList = items.filter(
      definedItem => playerInfo.items.some(playerItem => playerItem.name === definedItem.name)
    ).map(
      item => ({ ...item, count: playerInfo.items.find(i => item.name === i.name).count })
    )

    const equipments = shopItems.filter(
      shopItem => shopItem.type !== ShopItemType.Ticket && playerInfo.equipments.some(playerItem => playerItem.name === shopItem.name)
    ).map(item => [playerInfo.equippedWeapon, playerInfo.equippedShield].includes(item.name) ? ({ ...item, name: `[equip.] ${item.name}` }) : item)

    const skins = shopItems.filter(shopItem => shopItem.type === ShopItemType.Skin && playerInfo.items.some(i => i.name === shopItem.name))

    const emptyMsg = '```𝐕𝐚𝐳𝐢𝐨...```'
    const itemsFormatted = itemsInfoFromDefinedList.map(item => `• *${item.name} ${item.emoji} x${item.count}*`)
    const equipamentsFormatted = equipments.map(item => `• *${item.name} ${item.emoji}*`)
    const skinsFormatted = skins.map(item => `• *${item.name} ${item.emoji}*`)

    const profileMessageOutput = `\`\`\`Inventário\`\`\`

{👤} 𝑵𝒐𝒎𝒆: *${messageObj.pushName}* 
{🌟} 𝑬𝒔𝒕𝒓𝒆𝒍𝒂𝒔: *${playerInfo.stars}* 

╭─━━━━━━━━━━━━─╮
{🏷️} 𝑰𝒕𝒆𝒏𝒔: 

${itemsFormatted.length ? itemsFormatted.join('\n') : emptyMsg}

{🪖} 𝑬𝒒𝒖𝒊𝒑𝒂𝒎𝒆𝒏𝒕𝒐𝒔: 

${equipamentsFormatted.length ? equipamentsFormatted.join('\n') : emptyMsg}

{🥻} 𝑺𝒌𝒊𝒏𝒔:

${skinsFormatted.length ? skinsFormatted.join('\n') : emptyMsg}

╰─━━━━━━━━━━━━─╯`

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: profileMessageOutput
    }, { quoted: messageObj as WAMessage })

  }
}
