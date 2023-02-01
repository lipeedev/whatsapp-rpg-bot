const { Client, Message } = require("@open-wa/wa-automate");

/**
 * @param {{
 * client: Client
 * message: Message
 * question: String
 * options: String[]
 * isNumber: Boolean
 * isCapitalize: Boolean
 * }} 
 * @returns {Promise<String>}
 */
module.exports = ({ client, message, question, options, isNumber, isCapitalize }) => {
    return new Promise(async resolve => {
        const filter = m => m.author === message.author;
        const collector = client.createMessageCollector(message.from, filter, { max: 1, time: 60_000 });
        const formattedOptions = options?.length ? `[ Opções ]: _${options.join(' | ')}_` : '';

        const formattedQuestionMessage = `[ ❔ ] *${question}*\n[ ⏰ ] Tempo: *1 Min.*\n${formattedOptions}`;

        await client.reply(message.from, formattedQuestionMessage, message.id);
        let output = '';

        collector.on('collect', async collected => {
            let messageBodyCollected = collected.body?.toLowerCase();

            if (isNumber && isNaN(Number(messageBodyCollected))) {
                output = 'client_error_response';
                await client.reply(collected.from, client.constants.invalidArgumentsErrorMessage, collected.id);
                return;
            }

            if (options && !options.includes(messageBodyCollected)) {
                output = 'client_error_response';
                await client.reply(collected.from, client.constants.invalidChooseFromListErrorMessage(options), collected.id);
                return;
            }

            if (messageBodyCollected.length) {
                messageBodyCollected = messageBodyCollected.replace(/_/g, ' ').trim();
                if (isCapitalize) {
                    messageBodyCollected = messageBodyCollected.toCapitalize();
                }
            }

            output = messageBodyCollected;
            await client.react(collected.id, '✅');
        });

        collector.on('end', async collected => {
            if (!collected.size || !output.length) {
                await client.reply(message.from, client.constants.noResponseErrorMessage, message.id);
                return;
            }

            if (output !== 'client_error_response') {
                resolve(output);
            }
        })

    });
}