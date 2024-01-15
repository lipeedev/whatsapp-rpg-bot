import { PlayerSchema } from "../../database/schemas";
import { Command, CommandExecuteOptions } from "../../structures";
import constants from "../../utils/constants";
import levels from "../../utils/levels";

export default class PickCommand extends Command {
  constructor() {
    super({
      name: 'profile',
      args: false,
      usage: 'set',
      optionalArgs: true,
      examples: ['set level'],
      description: 'Informações sobre o jogador',
      isRegisterRequired: true,
    })
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const player = await PlayerSchema.findById(messageObj.key.participant);

    if (args.length) {
      if (args[0] === 'set') {
        if (!args[2]) {
          await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj })
          return;
        }

        if (args[1] === 'level') {
          const choosedLevel = Number(args[2])
          if (isNaN(choosedLevel) || choosedLevel > 5) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj })
            return;
          }

          player.level = choosedLevel;
          await player.save()
          await client.sendMessage(messageObj.key.remoteJid!, { text: constants.successIncreasePlayerValuesMessage }, { quoted: messageObj })
        }
      }

      return;
    }

    const allResourcesAmount = player.inventory.filter(item => item.category === "resource").reduce((accumulator, resource) => accumulator + (resource.amount as number), 0);

    const outputMessage = `
【♚】 ▌⇢ Personagem: ${player.name}

【♚】 ▌⇢Nivel: ${player.level}


*Equipamentos*
${player.inventory.filter(item => item.category === "armor").map(armor => `${armor.value} x${armor.amount}`).join('\n⇢ ')}

*Recursos* (x${levels.find(currentLevel => currentLevel.level === player.level).limit - allResourcesAmount})
${player.inventory.filter(item => item.category === "resource").map(resource => `⇢ _${resource.value} x${resource.amount}_`).join('\n')}
`

    await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage }, { quoted: messageObj })

  }

}
