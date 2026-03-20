import { WAMessage } from "@whiskeysockets/baileys";
import { Command, CommandExecuteOptions, maps } from "../../structures";
import { collectAnswer, collectReaction, interactWithLocation } from "../../utils";
import constants from "../../utils/constants";

export default class TesteCommand extends Command {
  constructor() {
    super({
      name: 'teste',
      aliases: ['teste'],
      description: 'comando de testes para desenvolvimento.',
      args: false,
      dev: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const mapInfo = maps.list.find(m => m.id === 1)
    const mapWithoutChanges = mapInfo.mapAsArray
    const playerEmoji = "🧙🏻‍♂️"
    const playerPosition = { y: 1, x: 6 }

    const getMapAsString = (map: string[][]) => {
      return map.flatMap(m => m + '\n').join('').replaceAll(',', '')
    }

    let msgMap: WAMessage
    let steps = 15

    while (steps !== 0) {
      let mapWithChanges = structuredClone(mapWithoutChanges)

      if (!msgMap) {
        mapWithChanges[playerPosition.y][playerPosition.x] = playerEmoji
        msgMap = await client.sendMessage(messageObj.key.remoteJid, {
          text: getMapAsString(mapWithChanges) + `Passos restantes: ${steps}`
        })
      }

      const reaction = await collectReaction({
        client,
        groupId: messageObj.key!.remoteJid!,
        targetUserId: messageObj.key!.participant!,
        minutesToAnswer: 3,
        filter: r => r.key!.participant! === messageObj.key!.participant! && maps.controls.includes(r.text)
      }).catch((e: Error) => e)

      if (reaction instanceof Error || !reaction) {
        await client.sendMessage(messageObj.key!.remoteJid!, {
          text: constants.noResponseErrorMessage
        }, { quoted: messageObj as WAMessage })
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
          text: getMapAsString(mapWithChanges) + `Passos restantes: ${steps}`,
          edit: msgMap.key
        })
        continue
      }

      mapWithChanges = structuredClone(mapWithoutChanges)
      mapWithChanges[playerPosition.y][playerPosition.x] = playerEmoji
      await client.sendMessage(messageObj.key.remoteJid, {
        text: getMapAsString(mapWithChanges) + `Passos restantes: ${steps}`,
        edit: msgMap.key
      })


      const locationThatPlayerIsAt = mapInfo.locations.find(l => l.y === playerPosition.y && l.x === playerPosition.x)
      if (locationThatPlayerIsAt) {
        await client.sendMessage(messageObj.key.remoteJid, {
          text: `Você parou em ${locationThatPlayerIsAt.tag}\n> Digite 'Entrar' se quiser interagir`,
        }, { quoted: messageObj as WAMessage })

        const answer = await collectAnswer({
          client,
          groupId: messageObj.key!.remoteJid!,
          targetUserId: messageObj.key!.participant!,
          minutesToAnswer: 3,
          filter: m => m.key!.participant! === messageObj.key!.participant! && m.message.conversation.toLowerCase() === 'entrar'
        }).catch((e: Error) => e)

        if (answer) {
          await interactWithLocation({
            client,
            messageObj,
            msgMap,
            locationTag: locationThatPlayerIsAt.tag
          })

          await client.sendMessage(messageObj.key.remoteJid, {
            text: getMapAsString(mapWithChanges) + `Passos restantes: ${steps}`,
            edit: msgMap.key
          })
        }

      }

    }

  }

}
