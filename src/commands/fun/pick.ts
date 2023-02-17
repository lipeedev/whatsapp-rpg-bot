import { Command, CommandExecuteOptions } from "../../structures";
import constants from "../../utils/constants";
import generateRandomNumber from "../../utils/generate-random-number";
import * as productsDefaultList from "../../utils/products";

const getRandomProduct = (args: string[]) => {
    const products = productsDefaultList.default.filter(product => product.category === 'resource');
    const choosedProduct = products.find(product => product.type === args[0].toLowerCase());

    let amount = generateRandomNumber(250);
    let productValue;
   
    if (args[0]?.toLowerCase() === 'ervas') amount = generateRandomNumber(30);    

    if (choosedProduct.isSingle) {
        productValue = choosedProduct.value;
    } else {
        productValue = choosedProduct.values[Math.floor(Math.random() * choosedProduct.values.length)];
    }

    return { amount, productValue }
}

const showProdutsPickeds = (times, args: string[]) => {
    return [...new Array(times)].map(() => {
        const { amount, productValue } = getRandomProduct(args);
        return `\`\`\`${amount}x ${productValue}\`\`\``;
    }).join('\n');
}

export default class PickCommand extends Command {
    constructor() {
        super({
            name: 'pick',
            args: true,
            usage: 'produto',
            optionalArgs: false,
            examples: ['madeira', 'pedra', 'carne', 'mineração', 'grãos', 'frutas', 'ervas'],
            description: 'Coleta produtos através de tarefas.',
            isRegisterRequired: false,
        })
    }

    async execute({ client, messageObj, args }: CommandExecuteOptions) {
        if (!this.examples.includes(args[0]?.toLowerCase())) {
            await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidChooseFromListErrorMessage(this.examples) }, { quoted: messageObj });
            return;
        }

        let timesToPick: number;

        if (args[1]) {
            const regexToCheckTimesToPick = /\bx\d+\b/gi;
            const isValidTimesToPick = regexToCheckTimesToPick.test(args[1])
            if (!isValidTimesToPick) {
                await client.sendMessage(messageObj.key.remoteJid!, { text: constants.invalidArgumentsErrorMessage }, { quoted: messageObj });
                return;
            }

            timesToPick = Number(args[1].replace('x', ''));
        }

        const outputMessage = `${messageObj.pushName} Recebeu:\n ${showProdutsPickeds(timesToPick || 1, args)}`;
        await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage }, { quoted: messageObj });
    }
};
