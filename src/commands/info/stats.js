const { Client } = require('@open-wa/wa-automate');
const products = require('../../utils/products');
const showPlayerInfo = require('../../utils/show-player-info');

module.exports = {
    name: 'stats',
    args: true,
    aliases: ['playerinfo', 'playerstats'],
    usage: '*get (visualizar)* ou *set(adicionar valor)* ou *remove(remover valor)*',
    optionalArgs: false,
    examples: ['set/remove hp', 'set/remove stamina', 'set/remove name', 'set/remove category', 'set/remove item', 'set/remove money'],
    description: 'Gerencia estatisticas do jogador.',
    isRegisterRequired: true,

    /**
    * @param {{ client: Client, message: Message, args: String[] }}
    */
    async execute({ client, message, args }) {
        const optionsArgsList = ['set', 'remove', 'get'];
        const optionsSecondArgsList = this.examples.map(example => example.replace('set/remove', '').trim());

        const optionArgChoose = args[0].toLowerCase();
        const optionSecondArgChoose = args[1]?.toLowerCase();
        const optionThirdArgChoose = args[2]?.toLowerCase();
        const optionFourthArgChoose = args[3]?.toLowerCase();

        if (!optionsArgsList.includes(optionArgChoose)) {
            await client.reply(message.from, client.constants.invalidChooseFromListErrorMessage(optionsArgsList), message.id);
            return;
        }

        if ((optionArgChoose === 'set' || optionArgChoose === 'remove') && !optionsSecondArgsList.includes(optionSecondArgChoose)) {
            await client.reply(message.from, client.constants.invalidChooseFromListErrorMessage(optionsSecondArgsList), message.id);
            return;
        }

        if (optionArgChoose === 'get') {
            const player = await client.db.findPlayerById(message.author);
            await client.reply(message.from, showPlayerInfo(player), message.id);
            return;
        }

        if (optionArgChoose === 'set') {
            if (!optionThirdArgChoose) {
                await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                return;
            }

            switch (optionSecondArgChoose) {
                case 'hp':
                    const valueHpDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueHpDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.increasePlayerHp(message.author, valueHpDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'stamina':
                    const valueStaminaDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueStaminaDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.increasePlayerStamina(message.author, valueStaminaDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'name':
                    const valueNameDesired = optionThirdArgChoose;

                    await client.db.changePlayerName(message.author, valueNameDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'category':
                    const valueCategoryDesired = optionThirdArgChoose;
                    const categoryList = ['camponês', 'construtor', 'mercador', 'bardo', 'mestre', 'nobre', 'lorde', 'rei'];

                    if (!categoryList.includes(valueCategoryDesired)) {
                        await client.reply(message.from, client.constants.invalidChooseFromListErrorMessage(categoryList), message.id);
                        return;
                    }

                    await client.db.changePlayerCategory(message.author, valueCategoryDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'item':
                    if (!optionThirdArgChoose || !optionFourthArgChoose) {
                        await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                        return;
                    }

                    const valueItemDesired = optionThirdArgChoose;
                    const amountItemDesired = Number(optionFourthArgChoose);

                    if (isNaN(amountItemDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    const item = products.find(product => product.value?.toLowerCase() === valueItemDesired || product.values?.some(value => value.toLowerCase() === valueItemDesired));

                    if (!item) {
                        await client.reply(message.from, client.constants.itemNotFoundErrorMessage(valueItemDesired), message.id);
                        return;
                    }

                    await client.db.addItemOnPayerInventory(message.author, { ...item, value: valueItemDesired.toCapitalize(), amount: amountItemDesired })
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'money':
                    const valueMoneyDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueMoneyDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.increasePlayerMoney(message.author, valueMoneyDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;
            }
        }

        if (optionArgChoose === 'remove') {

            switch (optionSecondArgChoose) {
                case 'hp':
                    if (!optionThirdArgChoose) {
                        await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                        return;
                    }

                    const valueHpDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueHpDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.subtractPlayerHp(message.author, valueHpDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'stamina':
                    if (!optionThirdArgChoose) {
                        await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                        return;
                    }

                    const valueStaminaDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueStaminaDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.subtractPlayerStamina(message.author, valueStaminaDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'name':
                    const valueNameDesired = 'vazio';

                    await client.db.changePlayerName(message.author, valueNameDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'category':
                    const valueCategoryDesired = 'vazio';

                    await client.db.changePlayerCategory(message.author, valueCategoryDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'item':
                    if (!optionThirdArgChoose || !optionFourthArgChoose) {
                        await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                        return;
                    }

                    const valueItemDesired = optionThirdArgChoose;
                    const amountItemDesired = Number(optionFourthArgChoose);

                    if (isNaN(amountItemDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    const result = await client.db.removeItemFromPlayerInventory(message.author, { value: valueItemDesired, amount: amountItemDesired })
                        .catch(err => err);

                    if (result?.message) {
                        await client.reply(message.from, result.message, message.id);
                        return;
                    }

                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;

                case 'money':
                    if (!optionThirdArgChoose) {
                        await client.reply(message.from, client.constants.noArgsErrorMessage, message.id);
                        return;
                    }

                    const valueMoneyDesired = Number(optionThirdArgChoose);
                    if (isNaN(valueMoneyDesired)) {
                        await client.reply(message.from, client.constants.invalidArgumentsErrorMessage, message.id);
                        return;
                    }

                    await client.db.subtractPlayerMoney(message.author, valueMoneyDesired);
                    await client.reply(message.from, client.constants.successIncreasePlayerValuesMessage, message.id);
                    break;
            }
        }

    }

}