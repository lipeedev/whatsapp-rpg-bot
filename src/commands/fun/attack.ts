import { WAMessage } from '@whiskeysockets/baileys'
import { Command, CommandExecuteOptions, prisma } from '../../structures'
import { collectAnswer, removePlayerHP } from '../../utils'
import constants from '../../utils/constants'

export default class AttackCommand extends Command {
  constructor() {
    super({
      name: 'attack',
      aliases: ['atacar'],
      description: 'Ataque um jogador de forma brutal.',
      args: false,
      requiredMinimumLevel: 2
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {
    await client.sendMessage(messageObj.key!.remoteJid!, {
      text: '🗡️ *Marque o jogador desejado para o ataque!*\n> Responsa em até \`3 minutos\`'
    }, { quoted: messageObj as WAMessage })

    const answer = await collectAnswer({
      client,
      groupId: messageObj.key!.remoteJid!,
      targetUserId: messageObj.key!.participant!,
      minutesToAnswer: 3_000,
      filter: m => m.message?.extendedTextMessage! && m.key!.participant! === messageObj.key!.participant!
    }).catch((e: Error) => e)

    if (answer instanceof Error || !answer) {
      await client.sendMessage(messageObj.key!.remoteJid!, {
        text: constants.noResponseErrorMessage
      }, { quoted: messageObj as WAMessage })
      return
    }

    const targetPlayerId = answer.message!.extendedTextMessage!.text!.replace('@', '') + '@lid'

    const targetPlayerOnDatabase = await prisma.player.findUnique({
      where: { id: targetPlayerId },
      include: { equipments: true }
    })

    if (!targetPlayerOnDatabase) {
      await client.sendMessage(messageObj.key!.remoteJid!, {
        text: constants.playerNotFound
      }, { quoted: messageObj as WAMessage })
      return
    }

    const mainPlayerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key!.participant! },
      include: { equipments: true }
    })

    if (mainPlayerInfo!.level < this.requiredMinimumLevel!) {
      await client.sendMessage(messageObj.key!.remoteJid!, {
        text: constants.requiredMinimumLevel(this.requiredMinimumLevel!)
      }, { quoted: messageObj as WAMessage })
      return
    }

    if (!mainPlayerInfo!.equippedWeapon) {
      await client.sendMessage(messageObj.key!.remoteJid!, {
        text: constants.requiredWeaponEquipped
      }, { quoted: messageObj as WAMessage })
      return
    }

    const mainPlayerDamage = mainPlayerInfo!.equipments.find(e => e.name === mainPlayerInfo!.equippedWeapon)!.damage
    let targetPlayerProtection = 0

    if (targetPlayerOnDatabase.equippedShield) {
      targetPlayerProtection = targetPlayerOnDatabase.equipments.find(e => e.name === targetPlayerOnDatabase.equippedShield)?.protection ?? 0
    }

    let causedDamage = mainPlayerDamage ?? 0 - targetPlayerProtection
    if (causedDamage < 0) causedDamage = 0

    const { isDead } = await removePlayerHP(targetPlayerOnDatabase.id, causedDamage)

    await client.sendMessage(messageObj.key!.remoteJid!, {
      text: constants.attackedPlayer(targetPlayerOnDatabase.id, causedDamage),
      mentions: [targetPlayerOnDatabase.id]
    }, { quoted: messageObj as WAMessage })

    if (isDead) {
      await client.sendMessage(messageObj.key!.remoteJid!, {
        text: constants.playerDead(targetPlayerOnDatabase.id),
        mentions: [targetPlayerOnDatabase.id]
      }, { quoted: messageObj as WAMessage })
    }

  }
};
