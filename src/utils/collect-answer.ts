import { proto, WASocket } from "@whiskeysockets/baileys"
import { MessageCollector } from "../structures/MessageCollector"
import constants from "./constants"

type CollectAnswerParams = {
  client: WASocket,
  minutesToAnswer: number,
  targetUserId: string,
  groupId: string,
  filter?: (m: proto.IWebMessageInfo) => boolean
}

export async function collectAnswer({ filter, groupId, minutesToAnswer, client, targetUserId }: CollectAnswerParams): Promise<proto.IWebMessageInfo> {
  return new Promise((resolve, reject) => {

    const collector = new MessageCollector({
      client,
      groupId,
      filter: filter ?? (m => m.key.remoteJid === targetUserId || targetUserId === 'anyone'),
      time: minutesToAnswer * 1000 * 60
    })

    collector.on('collect', m => resolve(m))

    collector.on('end', m => {
      if (!m.length)
        reject(new Error(constants.noResponseReceived))
    })

    collector.start()

  })

}
