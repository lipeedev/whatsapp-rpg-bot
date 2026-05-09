import { MessageUpsertType, proto, WAMessage, WASocket } from '@whiskeysockets/baileys';
import { commands } from '../bot';
import { botConfig } from '../structures/bot-config';
import constants from '../utils/constants';
import { prisma } from '../structures';

type MessageEventObject = {
  messages: proto.IWebMessageInfo[],
  type: MessageUpsertType
}

const cachedPlayers: string[] = []

export default {
  name: 'messages.upsert',
  async execute(m: MessageEventObject, client: WASocket) {
    const messageObj = m.messages[0];
    if (messageObj.key?.fromMe && messageObj.key.participant !== botConfig.developer.id) return
    if (!messageObj.key?.remoteJid?.endsWith('@g.us')) return;
    if (!messageObj.key.participant) return;

    if (!messageObj.message?.conversation) return;
    if (!messageObj.message.conversation.startsWith(botConfig.prefix)) return;

    const args = messageObj.message.conversation.slice(botConfig.prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase()!;
    const command = commands.get(commandName) ?? [...commands.values()].find(cmd => cmd.aliases?.includes(commandName));

    if (!command) return;

    try {
      if (command.dev && messageObj.key.participant !== botConfig.developer.id) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.insufficientPermissionErrorMessage }, { quoted: messageObj as WAMessage });
        return;
      }

      if (command.isRegisterRequired) {
        if (!cachedPlayers.includes(messageObj.key?.participant)) {
          const playerOnDatabase = await prisma.player.findUnique({
            where: { id: messageObj.key.participant }
          })

          if (!playerOnDatabase) {
            await client.sendMessage(messageObj.key.remoteJid, { text: constants.playerUnregistered }, { quoted: messageObj as WAMessage })
            return
          }

          cachedPlayers.push(messageObj.key.participant)
        }
      }

      if (command.args && !args.length) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.noArgsErrorMessage }, { quoted: messageObj as WAMessage });
        return;
      }

      await command.execute({ client, messageObj, args });
    } catch (err) {
      console.error(err)
      await client.sendMessage(
        messageObj.key.remoteJid,
        { text: constants.genericErrorMessage },
        { quoted: messageObj as WAMessage }
      );
    }

  }
}

