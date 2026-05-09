import { WAMessage } from "@whiskeysockets/baileys";
import { commands } from "../../bot";
import { botConfig, Command, CommandExecuteOptions } from "../../structures";
import { showCommandInfo } from "../../utils";
import constants from "../../utils/constants";


export default class HelpCommand extends Command {
  constructor() {
    super({
      name: 'help',
      aliases: ['menu'],
      usage: '<nome_do_comando>',
      examples: ['start'],
      optionalArgs: true,
      description: 'informações sobre os comandos.',
    })
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    if (args[0]) {
      const commandName = args[0].toLowerCase();
      const commandData = commands.get(commandName) ?? [...commands.values()].find(cmd => cmd.aliases?.includes(commandName));

      if (!commandData) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.commandNotFoundErrorMessage }, { quoted: messageObj as WAMessage });
        return;
      }

      await client.sendMessage(messageObj.key.remoteJid!, { text: showCommandInfo(commandData) }, { quoted: messageObj as WAMessage });
      return;
    }


    const commandsFormatted = [...commands.values()].map(command => `≽ \`${botConfig.prefix}${command.name}\`\n°• _${command.description}_`).join('\n\n')
    const decorationLine = '🔖۰꒷⏝꒷۰꒷⏝꒷•🎊•꒷⏝꒷۰꒷⏝꒷۰🔖'
    const title = '\t\t\t```°•°•♡  𝙲𝚘𝚖𝚊𝚗𝚍𝚘𝚜  ♡•°•°```'
    const footer = `> Digite \`${botConfig.prefix}${this.name} comando\` para informações do comando`
    const outputMessage =
      decorationLine
      + '\n'
      + title
      + '\n\n'
      + commandsFormatted
      + '\n\n\n'
      + footer
      + '\n\n'
      + decorationLine

    await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage });
  }
};
