const { Client, Message } = require("@open-wa/wa-automate");
const generateRandomNumber = require("../../utils/generate-random-number");

module.exports = {
    name: 'roll',
    aliases: ['r'],
    args: true,
    usage: '<vezes>d<máximo>',
    examples: ['3d5', '5d10'],
    description: 'Rola X dados de X faces, escolhidos pelo jogador.',
    isRegisterRequired: false,

    /**
     * @param {{ client: Client, message: Message, args: String[] }} 
     */
    async execute({ client, message, args }) {
        const argsDataInString = args[0].split('d');
        const [timesToRoll, maxRangeToGenerateNumber] = argsDataInString.map(Number);

        if (!timesToRoll || !maxRangeToGenerateNumber) {
            await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
            return;
        }

        if (isNaN(timesToRoll) || isNaN(maxRangeToGenerateNumber)) {
            await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
            return;
        }

        if (maxRangeToGenerateNumber > 100 || timesToRoll > 100) {
            await client.reply(message.from, client.constants.maxRangeErrorMessage(100), message.id);
            return;
        }

        const arrayOfRandomNumbers = [];

        for (let i = 0; i < timesToRoll; i++) {
            arrayOfRandomNumbers.push(generateRandomNumber(maxRangeToGenerateNumber));
        }

        const sumOfAllNumbersInArray = arrayOfRandomNumbers.reduce((accumulator, nextNumb) => accumulator + nextNumb);
        const outputMessage = `@${message.author.replace('@c.us', '')} rolou:\n( ${arrayOfRandomNumbers.join(' + ')} ) =\n*${sumOfAllNumbersInArray}*`;

        await client.sendReplyWithMentions(message.from, outputMessage, message.id);

    }
};