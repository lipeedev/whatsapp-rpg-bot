import { WAMessage } from "@whiskeysockets/baileys";
import { Command, CommandExecuteOptions, maps } from "../../structures";
import { collectReaction, interactWithLocation, getMapAsString, formatMapDraw } from "../../utils";

export default class TesteCommand extends Command {
  constructor() {
    super({
      name: 'teste',
      aliases: ['teste'],
      description: 'comando de testes para desenvolvimento.',
      args: false,
      dev: false,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const mapInfo = maps.list.find(m => m.id === 1)
    const mapWithoutChanges = mapInfo.mapAsArray
    const playerEmoji = "🧙🏻‍♂️"
    const playerPosition = { y: 0, x: 2 }

    let msgMap: WAMessage
    let steps = 15

    const makeScreenMessage = (mapName: string, mapDraw: string) => {
      return formatMapDraw(mapName, mapDraw)
        + `Reaja com: ${maps.controls.join(', ')}\n\n> Você: ${playerEmoji}\n> Passos restantes: ${steps}`
    }

    while (steps !== 0) {
      let mapWithChanges = structuredClone(mapWithoutChanges)

      if (!msgMap) {
        mapWithChanges[playerPosition.y][playerPosition.x] = playerEmoji
        msgMap = await client.sendMessage(messageObj.key.remoteJid, {
          text: makeScreenMessage(mapInfo.name, getMapAsString(mapWithChanges)),
        })
      }

      const reaction = await collectReaction({
        client,
        groupId: messageObj.key!.remoteJid!,
        targetUserId: messageObj.key!.participant!,
        minutesToAnswer: 3,
        filter: r => r.key!.participant! === messageObj.key!.participant! && maps.controls.includes(r.text)
      }).catch((e: Error) => null)

      if (!reaction) {
        break
      }

      const moveDirection = reaction.text

      if (moveDirection === maps.directions.up) {
        if (!mapWithChanges[playerPosition.y - 1]) continue
        playerPosition.y -= 1
      }

      if (moveDirection === maps.directions.down) {
        if (!mapWithChanges[playerPosition.y + 1]) continue
        playerPosition.y += 1
      }

      if (moveDirection === maps.directions.right) {
        if (!mapWithChanges[playerPosition.y][playerPosition.x + 1]) continue
        playerPosition.x += 1
      }

      if (moveDirection === maps.directions.left) {
        if (!mapWithChanges[playerPosition.y][playerPosition.x - 1]) continue
        playerPosition.x -= 1
      }

      steps--

      if (steps <= 0) {
        mapWithChanges = structuredClone(mapWithoutChanges)
        mapWithChanges[playerPosition.y][playerPosition.x] = playerEmoji
        await client.sendMessage(messageObj.key.remoteJid, {
          text: makeScreenMessage(mapInfo.name, getMapAsString(mapWithChanges)),
          edit: msgMap.key
        })
        continue
      }

      mapWithChanges = structuredClone(mapWithoutChanges)
      mapWithChanges[playerPosition.y][playerPosition.x] = playerEmoji
      await client.sendMessage(messageObj.key.remoteJid, {
        text: makeScreenMessage(mapInfo.name, getMapAsString(mapWithChanges)),
        edit: msgMap.key
      })

      const locationThatPlayerIsAt = mapInfo.locations.find(l => l.y === playerPosition.y && l.x === playerPosition.x)
      if (locationThatPlayerIsAt) {
        await client.sendMessage(messageObj.key.remoteJid, {
          text: makeScreenMessage(mapInfo.name, getMapAsString(mapWithChanges)) + `\n\n> Você está em ${locationThatPlayerIsAt.tag}\n> Reaja com '❕' para interagir.`,
          edit: msgMap.key
        })

        const reactionAnswer = await collectReaction({
          client,
          groupId: messageObj.key!.remoteJid!,
          targetUserId: messageObj.key!.participant!,
          minutesToAnswer: 3,
          filter: r => r.key!.participant! === messageObj.key!.participant! && r.text === '❕'
        }).catch((e: Error) => null)

        if (reactionAnswer) {
          await interactWithLocation({
            client,
            messageObj,
            msgMap,
            locationTag: locationThatPlayerIsAt.tag
          })

          await client.sendMessage(messageObj.key.remoteJid, {
            text: makeScreenMessage(mapInfo.name, getMapAsString(mapWithChanges)),
            edit: msgMap.key
          })
        }

      }

    }

  }

}
