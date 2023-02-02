const { Client, Message } = require("@open-wa/wa-automate");

module.exports = {
    name: 'onMessage',
    /**
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(message, client) {
        if (!message.isGroupMsg) {
            await client.reply(message.from, client.constants.onlyGroupsMessage, message.id);
            return;
        }

        if (!message.body.startsWith(client.bot.prefix)) {
            return;
        }

        const args = message.body.slice(client.bot.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const commandData = client.commands.find(cmd => cmd.name === command || cmd.aliases?.includes(command));

        if (commandData) {
            try {
                if (commandData.args && !args.length) {
                    await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                    return;
                }

                if (commandData.isRegisterRequired) {
                    await client.db.registerPlayer({ id: message.author });
                }

                await commandData.execute({ client, message, args });
            } catch(err) {
                await client.reply(message.from, client.constants.genericErrorMessage(client, err), message.id);
                console.error(err);
            }
        }
    }
};