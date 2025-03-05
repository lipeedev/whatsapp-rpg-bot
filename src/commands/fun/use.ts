import { badEffects, BadEffectType, Command, CommandExecuteOptions, potionEffects, PotionEffectType, prisma } from "../../structures"
import { addPlayerHP, addPlayerStars, changePlayerEffect, removePlayerStars, removePotionFromPlayer } from "../../utils";
import constants from "../../utils/constants";
import { removeAllPlayerStars } from "../../utils/remove-all-players-stars";

export default class UseCommand extends Command {
  constructor() {
    super({
      name: 'use',
      aliases: ['usar'],
      usage: 'poção (exemplo: Elixir Sombrio do Crepusculo)',
      description: 'utilize uma poção e veja seu efeito em ação',
      args: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const potionChoosed = args.join(' ');
    const playerInfoFromDatabase = await prisma.player.findUnique({ where: { id: messageObj.key.participant } })

    const playerPotionsOnDatabase = await prisma.potion.findMany({
      where: { playerId: messageObj.key.participant }
    })

    const potionOnPlayerInventory = playerPotionsOnDatabase.find(p => p.name.toLowerCase() === potionChoosed.toLowerCase())

    if (!potionOnPlayerInventory) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.notFoundItemOnInventory
      }, { quoted: messageObj })
      return
    }

    const potionEffectFound = potionEffects.find(e => e.description.toLowerCase() === potionOnPlayerInventory.effect.toLowerCase())

    if (playerInfoFromDatabase.effect !== 'Nenhum' && potionEffectFound.type !== PotionEffectType.UndoCurrentEffect) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.alreadyHasEffectActivated
      }, { quoted: messageObj })
      return
    }

    else if (potionEffectFound.type === PotionEffectType.MultiplyShopPrice) {
      const allPlayers = await prisma.player.findMany({
        where: { id: { not: messageObj.key.participant } }
      })

      const targetRandomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)]
      const shopMoreExpensiveEffect = badEffects.find(e => e.type === BadEffectType.MoreExpensiveShop)
      await changePlayerEffect(targetRandomPlayer.id, shopMoreExpensiveEffect)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.potionUsedInPlayer(targetRandomPlayer.id),
        mentions: [targetRandomPlayer.id]
      }, { quoted: messageObj })
    }

    else if (potionEffectFound.type === PotionEffectType.EveryoneLoseStars) {
      const randomStarsCountToLose = Math.floor(Math.random() * 150) + 1;
      await removeAllPlayerStars(randomStarsCountToLose, messageObj.key.participant)
      await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.everyoneLosesStars(messageObj.pushName, randomStarsCountToLose),
      }, { quoted: messageObj })
    }

    else if (potionEffectFound.type === PotionEffectType.UndoCurrentEffect) {
      await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
      await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.removeAllEffects,
      }, { quoted: messageObj })
    }

    else if (potionEffectFound.type === PotionEffectType.GetStarsFromSomeone) {
      let randomStarsCount = Math.floor(Math.random() * 150) + 1;
      const allPlayersWithSufficientStars = await prisma.player.findMany({
        where: { stars: { gt: 0 }, id: { not: messageObj.key.participant } }
      })

      const targetRandomPlayer = allPlayersWithSufficientStars[Math.floor(Math.random() * allPlayersWithSufficientStars.length)]
      const activeEffectOnTargetPlayer = potionEffects.find(e => e.description === targetRandomPlayer.effect)

      if (activeEffectOnTargetPlayer?.type === PotionEffectType.ProtectYourStars) {
        await changePlayerEffect(targetRandomPlayer.id, { description: 'Nenhum' })
        await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)

        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.failRobbery(targetRandomPlayer.id),
          mentions: [targetRandomPlayer.id]
        }, { quoted: messageObj })
        return
      }

      if (randomStarsCount > targetRandomPlayer.stars)
        randomStarsCount = targetRandomPlayer.stars

      await removePlayerStars(targetRandomPlayer.id, randomStarsCount)
      await addPlayerStars(messageObj.key.participant, randomStarsCount)
      await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.successRobbery(targetRandomPlayer.id, randomStarsCount),
        mentions: [targetRandomPlayer.id]
      }, { quoted: messageObj })
    }

    else if (potionEffectFound.type === PotionEffectType.RecoverHP) {
      if (playerInfoFromDatabase.hp === playerInfoFromDatabase.maxHP) {
        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.alreadyHasFullHp,
        }, { quoted: messageObj })
        return
      }

      const hpToBeRecovered = 50
      await addPlayerHP(playerInfoFromDatabase.id, hpToBeRecovered)
      await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.successHpRecover(hpToBeRecovered),
      }, { quoted: messageObj })
    }

    else {
      await changePlayerEffect(messageObj.key.participant, potionEffectFound)
      await removePotionFromPlayer(messageObj.key.participant, potionOnPlayerInventory.name)
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.addEffect(messageObj.pushName),
      }, { quoted: messageObj })
    }

  }
};
