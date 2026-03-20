import { proto, WAMessage, WASocket } from "@whiskeysockets/baileys"

type InteractWithLocationOptions = {
  client: WASocket
  messageObj: proto.IWebMessageInfo
  msgMap: WAMessage
  locationTag: string
}

export async function interactWithLocation({ client, locationTag, messageObj, msgMap }: InteractWithLocationOptions) {

}
