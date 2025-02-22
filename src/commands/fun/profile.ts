import { Command, CommandExecuteOptions, prisma } from "../../structures";
import { createXPBar } from "../../utils";

export default class ProfileCommand extends Command {
  constructor() {
    super({
      name: "profile",
      aliases: ["perfil"],
      description: "informações sobre o jogador",
    });
  }

  async execute({ client, messageObj }: CommandExecuteOptions) {
    const playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant }
    })

    const xpBar = createXPBar({ currentXP: playerInfo.xp, nextLevelXP: 200 })

    const profileMessageOutput = `\`\`\`Perfil do Jogador\`\`\`

{👤} 𝑵𝒐𝒎𝒆: *${messageObj.pushName}* 
{🌟} 𝑬𝒔𝒕𝒓𝒆𝒍𝒂𝒔: *${playerInfo.stars}* 
{🌀} 𝑵í𝒗𝒆𝒍: *${playerInfo.level}* ⌗
◈   ${xpBar}  (${playerInfo.xp} / 200)

╭─━━━━━━━━━━━━─╮
{🎖️} 𝑪𝒐𝒏𝒒𝒖𝒊𝒔𝒕𝒂𝒔: 

╰─━━━━━━━━━━━━─╯`

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: profileMessageOutput
    }, { quoted: messageObj })

  }
}
