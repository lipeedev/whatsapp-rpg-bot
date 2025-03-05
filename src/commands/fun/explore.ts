import { Command, CommandExecuteOptions, items, potionEffects, PotionEffectType, prisma } from "../../structures"
import { addItemToPlayer, addPlayerStars, addPlayerXP, changePlayerEffect, collectAnswer, ExplorationLocation, explore, removePlayerStars } from "../../utils"
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
      'montanha',
      'selva',
      'oceano'
    ]

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: `🌲 *Escolha um local para explorar:*\n${locations.map(location => `> ✓ ${location}`).join('\n')}\n\n> Escolha em até \`3 minutos\``
    }, { quoted: messageObj })

    const answer = await collectAnswer({
      client,
      groupId: messageObj.key.remoteJid,
      targetUserId: messageObj.key.participant,
      minutesToAnswer: 3,
      filter: m => m.key.participant === messageObj.key.participant && locations.includes(m.message?.conversation?.toLowerCase()?.trim() as ExplorationLocation)
    }).catch((e: Error) => e)

    if (answer instanceof Error) {
      await client.sendMessage(messageObj.key.remoteJid, {
        text: constants.noResponseErrorMessage
      })
      return
    }

    const answerAsLocation = answer?.message?.conversation?.toLowerCase()?.trim() as ExplorationLocation
    const result = explore(answerAsLocation)

    let starsEarned = Math.floor(Math.random() * 50) + 1
    const xpEarned = 1

    const playerInfo = await prisma.player.findUnique({ where: { id: messageObj.key.participant } })
    const activePlayerEffect = potionEffects.find(p => p.description === playerInfo.effect)

    if (result.found) {
      if (activePlayerEffect?.type === PotionEffectType.WinExtraStars) {
        const starBonusFromEffect = Math.floor(Math.random() * 100) + 1
        starsEarned += starBonusFromEffect
        await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
      }

      if (activePlayerEffect?.type === PotionEffectType.MultiplyRewards) {
        starsEarned *= 2
        await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
      }

      await addPlayerStars(messageObj.key.participant, starsEarned)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.explorationSuccess(starsEarned, xpEarned)
      }, { quoted: answer })

      const chanceToGetAnItem = Math.floor(Math.random() * 10) + 1;

      if (chanceToGetAnItem > 7) {
        const item = items[Math.floor(Math.random() * items.length)]
        await addItemToPlayer(messageObj.key.participant, item.name)

        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.foundItem(item.name)
        }, { quoted: answer })
      }

    }
    else {
      if (activePlayerEffect?.type === PotionEffectType.DontLoseStars) {
        starsEarned = 0;
        await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
      }

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
