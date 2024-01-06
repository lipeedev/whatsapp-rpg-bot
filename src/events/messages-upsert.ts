import { MessageUpsertType, proto, WASocket } from '@whiskeysockets/baileys';
import { commands } from '../bot';
import { botConfig } from '../structures/bot-config';
import constants from '../utils/constants';

type MessageEventObject = {
  messages: proto.IWebMessageInfo[],
  type: MessageUpsertType
}

export default {
  name: 'messages.upsert',
  async execute(m: MessageEventObject, client: WASocket) {
    const messageObj = m.messages[0];

    if (messageObj.key.fromMe && messageObj.key.participant !== botConfig.developer.id) return
    if (!messageObj.key.remoteJid?.endsWith('@g.us')) return;
    if (!messageObj.message?.conversation) return;
    if (!messageObj.message.conversation.startsWith(botConfig.prefix)) return;

    const args = messageObj.message.conversation.slice(botConfig.prefix.length).trim().split(/ +/g);
    const commandName = args.shift()?.toLowerCase()!;

    const command = commands.get(commandName) ?? [...commands.values()].find(cmd => cmd.aliases?.includes(commandName));

    if (!command) return;

    try {
      if (command.args && !args.length) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.noArgsErrorMessage }, { quoted: messageObj });
        return;
      }

      if (command.dev && messageObj.key.participant !== botConfig.developer.id) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.insufficientPermissionErrorMessage }, { quoted: messageObj });
        return;
      }

      await command.execute({ client, messageObj, args });
    } catch (err) {
      await client.sendMessage(
        messageObj.key.remoteJid,
        { text: constants.genericErrorMessage(botConfig, err as Error) },
        { quoted: messageObj }
      );
    }

  }
}
