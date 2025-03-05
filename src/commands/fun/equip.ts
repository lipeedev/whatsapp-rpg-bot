import { Command, CommandExecuteOptions, prisma } from "../../structures"
import constants from "../../utils/constants"

export default class EquipCommand extends Command {
  constructor() {
    super({
      name: 'equip',
      aliases: ['equipar'],
      description: 'Use seus equipamentos e se prepare.',
      args: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const equipmentChoosed = args.join(' ').toLowerCase()

    const playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant },
      include: { equipments: true }
    })

    const equipmentsOnPlayerInventory = playerInfo.equipments
    const equipmentFound = equipmentsOnPlayerInventory.find(e => e.name.toLowerCase() === equipmentChoosed)

    if (!equipmentFound) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.notFoundItemOnInventory
      }, { quoted: messageObj })
      return
    }

    const dataUpdated = {
      equippedWeapon: equipmentFound.damage ? equipmentFound.name : playerInfo.equippedWeapon,
      equippedShield: equipmentFound.protection ? equipmentFound.name : playerInfo.equippedShield
    }

    await prisma.player.update({
      where: { id: messageObj.key.participant },
      data: dataUpdated
    })


    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.successEquipItem(equipmentFound.name)
    }, { quoted: messageObj })

  }
};

