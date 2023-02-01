const generateRandomNumber = require("../../utils/generate-random-number");
const { Client } = require('@open-wa/wa-automate');
const productsDefaultList = require("../../utils/products");

module.exports = {
    name: 'pick',
    args: true,
    usage: 'produto',
    optionalArgs: false,
    examples: ['madeira', 'pedra', 'carne', 'mineração', 'grãos', 'frutas'],
    description: 'Coleta produtos através de tarefas.',
    isRegisterRequired: true,

    /**
    * @param {{ client: Client, message: Message, args: String[] }}
    */
    async execute({ client, message, args }) {
        if (!this.examples.includes(args[0]?.toLowerCase())) {
            await client.reply(message.from, client.constants.invalidChooseFromListErrorMessage(this.examples), message.id);
            return;
        }

        products = productsDefaultList.filter(product => product.category === 'resource');
        const choosedProduct = products.find(product => product.type === args[0].toLowerCase());

        const amount = generateRandomNumber(250);
        let productValue;

        if (choosedProduct.isSingle) {
            productValue = choosedProduct.value;
        } else {
            productValue = choosedProduct.values[Math.floor(Math.random() * choosedProduct.values.length)];
        }

        await client.db.addItemOnPayerInventory(message.author, { value: productValue, type: choosedProduct.type, amount, category: choosedProduct.category });

        const outputMessage = `@${message.author.replace('@c.us', '')} Recebeu:\n \`\`\`${amount}x ${productValue}\`\`\``;
        await client.sendReplyWithMentions(message.from, outputMessage, message.id);
    }
};