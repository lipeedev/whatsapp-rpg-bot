const { Client, Message } = require('@open-wa/wa-automate');
const makeCollector = require('../../utils/make-collector');
const shop = require("../../utils/shop");
const showShopItems = require('../../utils/show-shop-items');

module.exports = {
    name: 'shop',
    usage: 'buy nome_do_item (no lugar dos espaços use subtraço)',
    optionalArgs: true,
    examples: ['armadura_de_ferro', 'adaga', 'arco', 'espadas_gemeas'],
    description: 'Loja de itens, armaduras e diversos.',
    isRegisterRequired: true,

    /**
    * @param {{ client: Client, message: Message, args: String[] }}
    */
    async execute({ client, message, args }) {
        const dbShopItems = (await client.db.getShopData()).items;
        const shopItems = [...shop, ...dbShopItems];
        const options = ['buy', 'add'];
        const chooseOption = args[0]?.toLowerCase();


        if (chooseOption && options.includes(chooseOption)) {
            if (chooseOption === 'buy') {
                const chooseItem = args[1]?.toLowerCase();
                let chooseAmount = Number(args[2]);

                const foundChooseShopItem = shopItems.find(item => item.value.toLowerCase().replace(/ +/g, '_') === chooseItem);

                if (!chooseItem) {
                    await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                    return;
                }

                if (chooseAmount && (isNaN(chooseAmount) || chooseAmount < 0)) {
                    await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                    return;
                }

                if (!foundChooseShopItem) {
                    await client.reply(message.from, client.constants.itemNotFoundErrorMessage(chooseItem), message.id);
                    return;
                }

                chooseAmount = chooseAmount || 1;
                foundChooseShopItem.amount = chooseAmount;

                const playerMoney = (await client.db.findPlayerById(message.author)).money;

                if (playerMoney < foundChooseShopItem.coast * chooseAmount) {
                    await client.reply(message.from, client.constants.insufficientMoneyErrorMessage(foundChooseShopItem.coast * chooseAmount), message.id);
                    return;
                }
                
                await client.db.subtractPlayerMoney(message.author, foundChooseShopItem.coast * chooseAmount);
                await client.db.addItemOnPayerInventory(message.author, foundChooseShopItem);
                await client.reply(message.from, client.constants.successShopBuyMessage(chooseAmount, foundChooseShopItem.value), message.id);
                return;

            }

            if (chooseOption === 'add') {
                const groupAdminsList = await client.getGroupAdmins(message.from);

                if (!groupAdminsList.includes(message.author)) {
                    await client.reply(message.from, client.constants.invalidChooseFromListErrorMessage, message.id);
                    return;
                }

                let itemCreatedByAdmin;

                const itemName = await makeCollector({
                    client,
                    message,
                    question: 'Nome do item desejado (com sublinhado no lugar de espaços)',
                    isCapitalize: true
                });

                const itemType = await makeCollector({
                    client,
                    message,
                    question: 'Tipo do item desejado (ex: arma_branca, grãos, madeira, armadura)'
                });

                const itemCategory = await makeCollector({
                    client,
                    message,
                    question: 'Categoria do item desejado (escolha uma das opções) [resource = recurso | armor = armamentos]',
                    options: ['resource', 'armor']
                });

                let itemCoast = await makeCollector({
                    client,
                    message,
                    question: 'preço do item desejado',
                });

                itemCoast = Number(itemCoast) < 0 ? 0 : Number(itemCoast);

                itemCreatedByAdmin = {
                    type: itemType,
                    category: itemCategory,
                    isSingle: true,
                    value: itemName,
                    coast: itemCoast
                }

                const result = await client.db.addItemOnShop(itemCreatedByAdmin).catch(err => err);
              
                if (result?.message) {
                    await client.reply(message.from, result.message, message.id);
                    return;
                }

                await client.reply(message.from, client.constants.successChangeShopValuesMessage, message.id);
                return;
            }

        }

        await client.reply(message.from, showShopItems(shopItems), message.id);
    }

}