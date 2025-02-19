import { Board, Command, CommandExecuteOptions, Player } from "../../structures"
import constants from "../../utils/constants"
import { setTimeout as delay } from 'node:timers/promises'
import { collectAnswer } from "../../utils"

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'teste',
      aliases: ['t'],
      description: 'teste sem descrição...',
      args: false,
      dev: true,
    })
  }

  async execute({ client, messageObj, args, store }: CommandExecuteOptions) {
    const minutesToAnswer = 1

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.questionNicknameForBoard(minutesToAnswer)
    })

    await delay(300)

    const msgObjFromPlayer = await collectAnswer({
      client,
      minutesToAnswer,
      groupId: messageObj.key.remoteJid,
      targetUserId: messageObj.key.remoteJid!
    }).catch((err: Error) => err)

    if (msgObjFromPlayer instanceof Error) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: msgObjFromPlayer.message
      })
      return;
    }

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: constants.questionEnemyNicknameForBoard(minutesToAnswer)
    })

    await delay(300)

    const msgObjFromEnemy = await collectAnswer({
      client,
      groupId: messageObj.key.remoteJid,
      minutesToAnswer,
      targetUserId: 'anyone'
    }).catch((err: Error) => err)

    if (msgObjFromEnemy instanceof Error) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: msgObjFromEnemy.message
      })
      return;
    }

    const board = new Board({
      groupId: messageObj.key.remoteJid!,
      client,
      players: [
        new Player({ id: msgObjFromPlayer.key.remoteJid!, nickname: msgObjFromPlayer.message.conversation!, hp: 200, ck: 400 }),
        new Player({ id: msgObjFromEnemy.key.remoteJid!, nickname: msgObjFromEnemy.message.conversation!, hp: 200, ck: 400 })
      ]
    })

    await board.startFight();
  }
};

