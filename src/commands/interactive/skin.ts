import { WAMessage } from "@whiskeysockets/baileys"
import { classes, Command, CommandExecuteOptions, prisma, shopItems } from "../../structures"
import constants from "../../utils/constants"

export default class SkinCommand extends Command {
  constructor() {
    super({
      name: 'skin',
      aliases: ['skin'],
      description: 'Use seus equipamentos e se prepare.',
      isRegisterRequired: true,
      args: true
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const skinChoosed = args.join(' ').toLowerCase().trim()

    const playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant },
      include: { items: true }
    })

    const skinsOnPlayerInventory = playerInfo.items.filter(item => item.type === "skin")
    const skinFound = skinsOnPlayerInventory.find(e => e.name.toLowerCase() === skinChoosed)

    if (!skinFound) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.notFoundItemOnInventory
      }, { quoted: messageObj as WAMessage })
      return
    }

    const playerClassRequired = shopItems.find(shopItem => shopItem.name === skinFound.name).requiredPlayerClass.toLowerCase()
    const playerClass = classes.find(c => c.typeName === playerInfo.class).title.toLowerCase()

    if (playerClassRequired !== playerClass) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.invalidPlayerClass
      }, { quoted: messageObj as WAMessage })
      return

    }

    await prisma.player.update({
      where: { id: messageObj.key.participant },
      data: { skin: skinFound.name }
    })

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.successSkinChanged(skinFound.name)
    }, { quoted: messageObj as WAMessage })

  }
};

