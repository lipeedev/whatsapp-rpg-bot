import { WAMessage } from "@whiskeysockets/baileys";
import { Command, CommandExecuteOptions } from "../../structures";

export default class PingCommand extends Command {
  constructor() {
    super({
      name: 'ping',
      aliases: ['ms'],
      usage: '',
      examples: [''],
      optionalArgs: false,
      description: 'Tempod de resposta.',
    })
  }

  async execute({ client, messageObj }: CommandExecuteOptions) {
    const start = Date.now();
    const sentMsg = await client.sendMessage(messageObj.key.remoteJid, { text: 'Calculando...' }, { quoted: messageObj as WAMessage });

    const end = Date.now();
    const ping = end - start;

    await client.sendMessage(messageObj.key.remoteJid, {
      text: `📶 | Latência:  *${ping}ms*\n🟢 | Uptime: *${process.uptime?.()?.toFixed(2)}s*`,
      edit: sentMsg.key
    });

  }
};
