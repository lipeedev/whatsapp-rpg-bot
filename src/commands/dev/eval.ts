import { inspect } from "util"
import { Command, CommandExecuteOptions } from "../../structures"
import { WAMessage } from "@whiskeysockets/baileys";

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'eval',
      aliases: ['ev'],
      description: 'comando de testes para desenvolvimento.',
      args: true,
      dev: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    try {
      const code = args.join(' ').trim();
      const output = inspect(eval(code), { depth: 5 })
      const msgTitle = '`</> [CONSOLE] 🧑🏻‍💻`\n*--------------------*'

      await client.sendMessage(messageObj.key!.remoteJid!, { text: `${msgTitle}\n\n${output}` }, { quoted: messageObj as WAMessage });
    } catch (err) {
      const msgTitleError = '`</> [CONSOLE - ERROR] ❌`\n*--------------------*'

      await client.sendMessage(messageObj.key!.remoteJid!, { text: `${msgTitleError}\n\n${String(err)}` }, { quoted: messageObj as WAMessage });

    }
  }
};
