import { proto, WAMessage, WASocket } from "@whiskeysockets/baileys"
import { collectReaction } from "./collect-reaction"
import { maps } from "../structures"
import { getMapAsString } from "./get-map-as-string"
import { formatMapDraw } from "./format-map-draw"

type InteractWithLocationOptions = {
  client: WASocket
  messageObj: proto.IWebMessageInfo
  msgMap: WAMessage
  locationTag: string
}

export async function interactWithLocation({ client, locationTag, messageObj, msgMap }: InteractWithLocationOptions) {

  const mapInfo = maps.list.find(m => m.name === locationTag)
  const mapDraw = getMapAsString(mapInfo.mapAsArray)
  const drawFormatted = formatMapDraw(mapInfo.name, mapDraw)

  await client.sendMessage(messageObj.key.remoteJid, {
    text: `${drawFormatted}\n> Reaja com \'↩️\' para deixar o local.`,
    edit: msgMap.key
  })

  const reactionAnswer = await collectReaction({
    client,
    groupId: messageObj.key!.remoteJid!,
    targetUserId: messageObj.key!.participant!,
    minutesToAnswer: 3,
    filter: r => r.key!.participant! === messageObj.key!.participant! && r?.text === '↩️'
  }).catch((e: Error) => null)

  if (reactionAnswer) {
    return
  }

}
