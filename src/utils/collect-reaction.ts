import { proto, WASocket } from "@whiskeysockets/baileys"
import { ReactionCollector } from "../structures/ReactionCollector"
import constants from "./constants"

type CollectReactionParams = {
  client: WASocket,
  minutesToAnswer: number,
  targetUserId: string,
  groupId: string,
  filter?: (r: proto.IReaction) => boolean
  max?: number
}

export async function collectReaction({ filter, groupId, minutesToAnswer, client, targetUserId, max }: CollectReactionParams): Promise<proto.IReaction> {
  return new Promise((resolve, reject) => {

    const collector = new ReactionCollector({
      client,
      groupId,
      max,
      filter: filter ?? (r => r.key.remoteJid === targetUserId || targetUserId === 'anyone'),
      time: minutesToAnswer * 1000 * 60
    })

    collector.on('collect', r => resolve(r))

    collector.on('end', r => {
      if (!r.length)
        reject(new Error(constants.noResponseErrorMessage))
    })

    collector.start()

  })

}
