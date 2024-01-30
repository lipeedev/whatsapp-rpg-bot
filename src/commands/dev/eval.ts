import { inspect } from "util"
import { Command, CommandExecuteOptions } from "../../structures"

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'eval',
      aliases: ['ev'],
      description: 'comando de testes para desenvolvimento.',
      isRegisterRequired: false,
      args: true,
      dev: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    try {
      const code = args.join(' ').trim();
      const output = inspect(eval(code), { depth: 5 })
      const msgTitle = '```</> [CONSOLE] 🧑🏻‍💻```\n*--------------------*'

      await client.sendMessage(messageObj.key.remoteJid!, { text: `${msgTitle}\n\n${output}` }, { quoted: messageObj });
    } catch (err) {
      const msgTitleError = '```</> [CONSOLE - ERRO] ❌```\n*--------------------*'

      await client.sendMessage(messageObj.key.remoteJid!, { text: `${msgTitleError}\n\n${String(err)}` }, { quoted: messageObj });

    }
  }
};
