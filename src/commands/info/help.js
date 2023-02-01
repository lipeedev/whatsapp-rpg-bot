const showCommandInfo = require("../../utils/show-command-info");

module.exports = {
    name: 'help',
    usage: '<nome_do_comando>',
    examples: ['start'],
    optionalArgs: true,
    description: 'mostra informações sobre os comandos.',
    isRegisterRequired: false,

    /**
    * @param {{ client: Client, message: Message, args: String[] }}
    */
    async execute({ client, message, args }) {
        if (args[0]) {
            const command = args[0].toLocaleLowerCase();
            const commandData = client.commands.find(cmd => cmd.name === command || cmd.aliases?.includes(command));

            if (!commandData) {
                await client.reply(message.from, client.constants.commandNotFoundErrorMessage, message.id);
                return;
            }

            await client.reply(message.from, showCommandInfo(commandData, client), message.id);
            return;
        }

        const commandsFormatted = client.commands.map(command => showCommandInfo(command, client));
        const outputMessage = `LISTA DE COMANDOS\n\n${commandsFormatted.join('\n---------------------\n')}`;

        await client.reply(message.from, outputMessage, message.id);

    }
};