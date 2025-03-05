import { Command, CommandExecuteOptions, items, prisma, shopItems, ShopItemType } from "../../structures";
import { createXPBar, getMaxHpUpdated, getXpToNextLevel, truncateString } from "../../utils";

export default class ProfileCommand extends Command {
  constructor() {
    super({
      name: "profile",
      aliases: ["perfil"],
      description: "informações sobre o jogador",
    });
  }

  async execute({ client, messageObj }: CommandExecuteOptions) {
    let playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant },
      include: { items: true, potions: true, equipments: true }
    })

    const maxHpUpdated = getMaxHpUpdated(playerInfo.level)

    if (maxHpUpdated !== playerInfo.maxHP) {
      playerInfo = await prisma.player.update({
        where: { id: playerInfo.id },
        data: { maxHP: maxHpUpdated },
        include: { potions: true, items: true, equipments: true }
      })
    }

    const itemsInfoFromDefinedList = items.filter(
      definedItem => playerInfo.items.some(playerItem => playerItem.name === definedItem.name)
    ).map(
      item => ({ ...item, count: playerInfo.items.find(i => item.name === i.name).count })
    )

    const equipments = shopItems.filter(
      shopItem => shopItem.type !== ShopItemType.Ticket && playerInfo.equipments.some(playerItem => playerItem.name === shopItem.name)
    ).map(item => [playerInfo.equippedWeapon, playerInfo.equippedShield].includes(item.name) ? ({ ...item, name: `[equip.] ${item.name}` }) : item)

    const xpRequiredToNextLevel = getXpToNextLevel({ currentLevel: playerInfo.level })
    const xpBar = createXPBar({ currentXP: playerInfo.xp, nextLevelXP: xpRequiredToNextLevel })

    const profileMessageOutput = `\`\`\`Perfil do Jogador\`\`\`

{👤} 𝑵𝒐𝒎𝒆: *${messageObj.pushName}* 
{❤️} 𝑽𝒊𝒅𝒂: *${playerInfo.hp} / ${playerInfo.maxHP}*
{🌟} 𝑬𝒔𝒕𝒓𝒆𝒍𝒂𝒔: *${playerInfo.stars}* 
{🌀} 𝑵í𝒗𝒆𝒍: *${playerInfo.level}* ⌗
◈   ${xpBar}  (${playerInfo.xp} / ${xpRequiredToNextLevel})

{🧬} 𝑬𝒇𝒆𝒊𝒕𝒐: 
\`${truncateString(playerInfo.effect, 20)}\`

╭─━━━━━━━━━━━━─╮
{🏷️} 𝑰𝒕𝒆𝒏𝒔: 

${itemsInfoFromDefinedList.map(item => `• *${item.name} ${item.emoji} x${item.count}*`).join('\n')}

{🪖} 𝑬𝒒𝒖𝒊𝒑𝒂𝒎𝒆𝒏𝒕𝒐𝒔: 

${equipments.map(item => `• *${item.name} ${item.emoji}*`).join('\n')}

{🧪} 𝑷𝒐𝒄̧𝒐̃𝒆𝒔: 

${playerInfo.potions.map(potion => `• *${potion.name} 🧪 x${potion.count}*\n> _${potion.effect}_`).join('\n\n')}

╰─━━━━━━━━━━━━─╯`

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: profileMessageOutput
    }, { quoted: messageObj })

  }
}
