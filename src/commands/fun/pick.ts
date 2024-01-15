import { Model } from "mongoose";
import { PlayerSchema } from "../../database/schemas";
import { Command, CommandExecuteOptions } from "../../structures";
import constants from "../../utils/constants";
import generateRandomNumber from "../../utils/generate-random-number";
import levels from "../../utils/levels";
import * as productsDefaultList from "../../utils/products";

const getRandomProduct = (args: string[]) => {
  const products = productsDefaultList.default.filter(product => product.category === 'resource');
  const choosedProduct = products.find(product => product.type === args[0].toLowerCase());

  let amount = generateRandomNumber(250);
  let productValue: string | string[];

  if (args[0]?.toLowerCase() === 'ervas') amount = generateRandomNumber(30);

  if (choosedProduct.isSingle) {
    productValue = choosedProduct.value;
  } else {
    productValue = choosedProduct.values[Math.floor(Math.random() * choosedProduct.values.length)];
  }

  return { amount, productValue, type: args[0].toLowerCase() }
}

const showProdutsPickeds = (times: number, args: string[], playerInfo: any) => {

  return [...new Array(times)].map(async () => {
    let { amount, productValue, type } = getRandomProduct(args);

    const itemIndexFound = playerInfo.inventory.findIndex(item => item.value.toLowerCase() === productValue.toLowerCase());

    const allResourcesAmount = playerInfo.inventory.filter(item => item.category === "resource").reduce((accumulator, resource) => accumulator + (resource.amount as number), 0);
    const currentLevelLimit = levels.find(({ level }) => level === playerInfo.level).limit

    const currentPlayerResourceLimit = currentLevelLimit - allResourcesAmount

    amount = amount > currentPlayerResourceLimit ? currentPlayerResourceLimit : amount

    if (itemIndexFound < 0) {
      playerInfo.inventory.push({
        type,
        amount,
        value: productValue,
        category: 'resource'
      })
    } else {
      (playerInfo.inventory[itemIndexFound].amount as number) += amount;
    }

    return `\`\`\`${amount}x ${productValue}\`\`\``;
  });
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
      isRegisterRequired: true,
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
      if (timesToPick > 30) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.maxRangeErrorMessage(30) }, { quoted: messageObj });
        return;
      }
    }

    const playerInfo = await PlayerSchema.findById(messageObj.key.participant)
    const outputProductsReceived = (await Promise.all(showProdutsPickeds(timesToPick || 1, args, playerInfo))).join('\n')

    await playerInfo.save()

    const outputMessage = `${messageObj.pushName} Recebeu:\n ${outputProductsReceived}`;

    if (outputProductsReceived)
      await client.sendMessage(messageObj.key.remoteJid!, { text: outputMessage }, { quoted: messageObj });
  }
};
