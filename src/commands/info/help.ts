import { commands } from "../../bot";
import { Command, CommandExecuteOptions } from "../../structures";
import { showCommandInfo } from "../../utils";
import constants from "../../utils/constants";


export default class HelpCommand extends Command {
    constructor() {
        super({
            name: 'help',
            usage: '<nome_do_comando>',
            examples: ['start'],
            optionalArgs: true,
            description: 'mostra informações sobre os comandos.',
            isRegisterRequired: false,
        })
    }

    async execute({ client, messageObj, args }: CommandExecuteOptions) {
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            const commandData = commands.get(commandName) ?? [...commands.values()].find(cmd => cmd.aliases?.includes(commandName));

            if (!commandData) {
                await client.sendMessage(messageObj.key.remoteJid!, { text: constants.commandNotFoundErrorMessage }, { quoted: messageObj });
                return;
            }

            await client.sendMessage(messageObj.key.remoteJid!, { text: showCommandInfo(commandData) }, { quoted: messageObj });
            return;
        }

        const commandsFormatted = [...commands.values()].map(command => showCommandInfo(command));
        const outputMessage = `LISTA DE COMANDOS\n\n${commandsFormatted.join('\n---------------------\n')}`;

        await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage }, { quoted: messageObj });
    }
};