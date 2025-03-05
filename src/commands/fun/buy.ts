import { BadEffect, badEffects, BadEffectType, Command, CommandExecuteOptions, PotionEffect, potionEffects, PotionEffectType, prisma, shopItems, ShopItemType } from "../../structures"
import { addEquipmentToPlayer, addItemToPlayer, addPotionToPlayer, changePlayerEffect, removePlayerStars } from "../../utils"
import constants from "../../utils/constants"

export default class BuyCommand extends Command {
  constructor() {
    super({
      name: 'buy',
      aliases: ['comprar'],
      usage: 'item (exemplo: Espada Grande)',
      description: 'Compra um item da Loja Mística.',
      args: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const itemChoosedByPlayer = args.join(' ').toLowerCase()?.trim()
    const itemFoundOnShop = shopItems.find(item => item.name.toLowerCase() === itemChoosedByPlayer)

    if (!itemFoundOnShop) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.shopItemNotFound
      }, { quoted: messageObj })
      return
    }

    const playerInfo = await prisma.player.findUnique({ where: { id: messageObj.key.participant } })
    let priceToBeAdded = 0

    const activeEffectOnPlayer: PotionEffect | BadEffect = potionEffects.find(e => e.description === playerInfo.effect)
      ?? badEffects.find(e => e.description === playerInfo.effect)

    if (activeEffectOnPlayer?.type === BadEffectType.MoreExpensiveShop) {
      priceToBeAdded = 100
      await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
    }

    if (activeEffectOnPlayer?.type === PotionEffectType.ReduceShopPrice) {
      priceToBeAdded = -100
      await changePlayerEffect(messageObj.key.participant, { description: 'Nenhum' })
    }

    const priceToPay = itemFoundOnShop.price + priceToBeAdded

    const alreadyHasThisEquipament = await prisma.equipment.findFirst({
      where: { playerId: messageObj.key.participant, name: itemFoundOnShop.name }
    })

    const alreadyHasThisItem = await prisma.item.findFirst({
      where: { playerId: messageObj.key.participant, name: itemFoundOnShop.name }
    })

    if (alreadyHasThisEquipament || alreadyHasThisItem) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.alreadyHasItem
      }, { quoted: messageObj })
      return
    }

    if (playerInfo.stars < priceToPay) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.insufficientMoney
      }, { quoted: messageObj })
      return
    }

    await removePlayerStars(messageObj.key.participant, priceToPay)

    if (itemFoundOnShop.type === ShopItemType.Ticket) {
      await addItemToPlayer(messageObj.key.participant, itemFoundOnShop.name)
    }
    else if (itemFoundOnShop.type === ShopItemType.Potion) {
      const recoverHpEffect = potionEffects.find(e => e.type === PotionEffectType.RecoverHP)
      await addPotionToPlayer(messageObj.key.participant, itemFoundOnShop.name, recoverHpEffect.description)
    }
    else {
      await addEquipmentToPlayer(messageObj.key.participant, itemFoundOnShop)
    }

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.successBuyItem(itemFoundOnShop.name)
    }, { quoted: messageObj })

  }
};
