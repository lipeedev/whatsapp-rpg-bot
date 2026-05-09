import { WAMessage } from "@whiskeysockets/baileys"
import { Command, CommandExecuteOptions, prisma, shopItems, ShopItemType } from "../../structures"
import { addEquipmentToPlayer, addItemToPlayer, removePlayerStars } from "../../utils"
import constants from "../../utils/constants"

export default class BuyCommand extends Command {
  constructor() {
    super({
      name: 'buy',
      aliases: ['comprar'],
      usage: 'item (exemplo: Espada Grande)',
      description: 'Compra um item da Loja Mística.',
      args: true,
      isRegisterRequired: true
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const itemChoosedByPlayer = args.join(' ').toLowerCase()?.trim()
    const itemFoundOnShop = shopItems.find(item => item.name.toLowerCase() === itemChoosedByPlayer)

    if (!itemFoundOnShop) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.shopItemNotFound
      }, { quoted: messageObj as WAMessage })
      return
    }

    const playerInfo = await prisma.player.findUnique({ where: { id: messageObj.key.participant } })
    const priceToPay = itemFoundOnShop.price

    const alreadyHasThisEquipament = await prisma.equipment.findFirst({
      where: { playerId: messageObj.key.participant, name: itemFoundOnShop.name }
    })

    const alreadyHasThisItem = await prisma.item.findFirst({
      where: { playerId: messageObj.key.participant, name: itemFoundOnShop.name }
    })

    if (alreadyHasThisEquipament || alreadyHasThisItem) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.alreadyHasItem
      }, { quoted: messageObj as WAMessage })
      return
    }

    if (playerInfo.stars < priceToPay) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.insufficientMoney
      }, { quoted: messageObj as WAMessage })
      return
    }

    await removePlayerStars(messageObj.key.participant, priceToPay)

    if (itemFoundOnShop.type === ShopItemType.Skin) {
      await addItemToPlayer(messageObj.key.participant, itemFoundOnShop.name, "skin")
    }
    else if (![ShopItemType.Sword, ShopItemType.Shield].includes(itemFoundOnShop.type)) {
      await addItemToPlayer(messageObj.key.participant, itemFoundOnShop.name)
    }
    else {
      await addEquipmentToPlayer(messageObj.key.participant, itemFoundOnShop)
    }

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.successBuyItem(itemFoundOnShop.name)
    }, { quoted: messageObj as WAMessage })

  }
};
