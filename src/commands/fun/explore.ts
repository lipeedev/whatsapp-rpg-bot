import { Command, CommandExecuteOptions } from "../../structures"
import { addPlayerStars, addPlayerXP, collectAnswer, ExplorationLocation, explore, removePlayerStars } from "../../utils"
import constants from "../../utils/constants"

export default class ExploreCommand extends Command {
  constructor() {
    super({
      name: 'explore',
      aliases: ['explorar'],
      description: 'Explore um local e encontre itens ou recompensas.',
      dev: false,
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {
    const locations: ExplorationLocation[] = [
      'caverna',
      'floresta',
      'montanha'
    ]

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: `🌲 *Escolha um local para explorar:*\n${locations.map(location => `> ✓ ${location}`).join('\n')}\n\n> Escolha em até \`3 minutos\``
    }, { quoted: messageObj })

    const answer = await collectAnswer({
      client,
      groupId: messageObj.key.remoteJid,
      targetUserId: messageObj.key.participant,
      minutesToAnswer: 3,
      filter: m => m.key.participant === messageObj.key.participant && locations.includes(m.message.conversation?.toLowerCase()?.trim() as ExplorationLocation)
    }).catch((e: Error) => e)

    if (answer instanceof Error) {
      await client.sendMessage(messageObj.key.remoteJid, {
        text: constants.noResponseErrorMessage
      })
      return
    }

    const answerAsLocation = answer.message.conversation as ExplorationLocation
    const result = explore(answerAsLocation)

    const starsEarned = Math.floor(Math.random() * 50) + 1
    const xpEarned = 1

    if (result.found) {
      await addPlayerStars(messageObj.key.participant, starsEarned)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.explorationSuccess(starsEarned, xpEarned)
      }, { quoted: answer })
    }
    else {
      await removePlayerStars(messageObj.key.participant, starsEarned)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.explorationFailure(starsEarned, xpEarned)
      }, { quoted: answer })
    }

    const { levelUp } = await addPlayerXP(messageObj.key.participant, xpEarned)

    if (levelUp) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.playerLevelUp
      }, { quoted: answer })
    }

  }
};
