import { Command, CommandExecuteOptions, items, prisma } from "../../structures";
import { addPotionToPlayer, createPotion, removeItemFromPlayer } from "../../utils";
import constants from "../../utils/constants";

export default class PotionCommand extends Command {
  constructor() {
    super({
      name: "potion",
      usage: "item1 + item2",
      aliases: ["poção", "pocao"],
      description: "combine dois itens para criar uma poção",
      args: true
    });
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const itemsChoosedByPlayer = args.join(' ').trim().split(' + ')

    if (itemsChoosedByPlayer.length < 2) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.invalidArgumentsErrorMessage
      }, { quoted: messageObj })
      return
    }

    const playerItemsOnDatabase = await prisma.item.findMany({
      where: { playerId: messageObj.key.participant }
    })

    const itemOnPlayerInventory = (itemName: string) => playerItemsOnDatabase.find(i => i.name.toLowerCase() === itemName.toLowerCase())

    const itemA = itemOnPlayerInventory(itemsChoosedByPlayer[0])
    const itemB = itemOnPlayerInventory(itemsChoosedByPlayer[1])

    if (!itemA || !itemB) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.notFoundItemOnInventory
      }, { quoted: messageObj })
      return
    }

    const itemOnDefinedItemsList = (itemName: string) => items.find(i => i.name.toLowerCase() === itemName.toLowerCase())

    const generatedPotion = createPotion(
      {
        name: itemA.name,
        emoji: itemOnDefinedItemsList(itemA.name).emoji,
        combinations: itemOnDefinedItemsList(itemA.name).combinations,
      },
      {
        name: itemB.name,
        emoji: itemOnDefinedItemsList(itemB.name).emoji,
        combinations: itemOnDefinedItemsList(itemB.name).combinations,
      },
    )

    if (!generatedPotion) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.invalidPotionCombination
      }, { quoted: messageObj })
      return
    }

    await removeItemFromPlayer(messageObj.key.participant, itemA.name)
    await removeItemFromPlayer(messageObj.key.participant, itemB.name)

    await addPotionToPlayer(messageObj.key.participant, generatedPotion.name, generatedPotion.effect.description)

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.successGeneratePotion(generatedPotion.name)
    }, { quoted: messageObj })

  }
}
