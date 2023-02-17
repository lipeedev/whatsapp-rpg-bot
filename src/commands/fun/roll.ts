import { Command, CommandExecuteOptions } from "../../structures/Command";
import constants from "../../utils/constants";
import generateRandomNumber from "../../utils/generate-random-number";

export default class RollCommand extends Command {
    constructor() {
        super({
            name: 'roll',
            aliases: ['r'],
            args: true,
            description: 'Rola X dados de X faces, escolhidos pelo jogador.',
            usage: '<vezes>d<máximo>',
            examples: ['3d5', '5d10', '2d6 +4'],
            isRegisterRequired: false
        })
    }

    async execute({ client, messageObj, args }: CommandExecuteOptions) {
        const argsDataInString = args.join('').split('d').join('+').split('+');

        if(argsDataInString.length > 3) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj });
            return;
        }

        if (argsDataInString[2] && isNaN(Number(argsDataInString[2]))) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj });
            return;
        } 

        const [timesToRoll, maxRangeToGenerateNumber, bonusToAdd] = argsDataInString.map(Number);

        if (!timesToRoll || !maxRangeToGenerateNumber) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.noArgsErrorMessage }, { quoted: messageObj });
            return;
        }

        if (isNaN(timesToRoll) || isNaN(maxRangeToGenerateNumber)) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj });
            return;
        }

        if (maxRangeToGenerateNumber > 100 || timesToRoll > 100) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.maxRangeErrorMessage(100) }, { quoted: messageObj });
            return;
        }

        const arrayOfRandomNumbers: number[] = [];

        for (let i = 0; i < timesToRoll; i++) {
            arrayOfRandomNumbers.push(generateRandomNumber(maxRangeToGenerateNumber));
        }

        let sumOfAllNumbersInArray = arrayOfRandomNumbers.reduce((accumulator, nextNumb) => accumulator + nextNumb);
        const isValidBonusNumber = !isNaN(bonusToAdd)

        if (isValidBonusNumber) sumOfAllNumbersInArray += bonusToAdd; 

        const outputMessage = `${messageObj.pushName} rolou:\n( ${arrayOfRandomNumbers.join(' + ')} ) ${ isValidBonusNumber ? `[+${bonusToAdd}]` : ''} =\n*${sumOfAllNumbersInArray}*`;
        await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage }, { quoted: messageObj });

    }
}

