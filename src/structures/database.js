const { Player, Shop } = require("../../database/schemas");
const shop = require('../utils/shop');

class Database {
    constructor() {
        this.playerManager = Player;
        this.shopManager = Shop;
    }

    async findPlayerById(id) {
        return (await this.playerManager.findById(id));
    }

    async registerPlayer({ id, category, name }) {
        const playerAlreadyExists = await this.findPlayerById(id);

        if (!playerAlreadyExists) {
            const player = await this.playerManager.create({
                _id: id,
                name,
                category
            });

            await player.save();
        }
    }

    async increasePlayerHp(id, desiredHpAmount) {
        const player = await this.findPlayerById(id);
        player.hp += desiredHpAmount;
        await player.save();
    }

    async subtractPlayerHp(id, desiredHpAmount) {
        if (desiredHpAmount < 0) desiredHpAmount = 0;

        const player = await this.findPlayerById(id);
        player.hp -= desiredHpAmount;

        if (player.hp < 0) player.hp = 0

        await player.save();
    }

    async increasePlayerStamina(id, desiredStaminaAmount) {
        if (desiredStaminaAmount < 0) desiredStaminaAmount = 0;

        const player = await this.findPlayerById(id);
        player.stamina += desiredStaminaAmount;

        await player.save();
    }

    async subtractPlayerStamina(id, desiredStaminaAmount) {
        const player = await this.findPlayerById(id);
        player.stamina -= desiredStaminaAmount;

        if (player.stamina < 0) player.stamina = 0

        await player.save();
    }

    async changePlayerName(id, name) {
        const player = await this.findPlayerById(id);

        if (player.name === name) return;

        player.name = name;
        await player.save();
    }

    async changePlayerCategory(id, category) {
        const player = await this.findPlayerById(id);

        if (player.category === category) return;

        player.category = category;
        await player.save();
    }

    async addItemOnPayerInventory(id, { type, amount, value, category }) {
        const player = await this.findPlayerById(id);

        const itemIndexFound = player.inventory.findIndex(item => item.value.toLowerCase() === value.toLowerCase());

        if (itemIndexFound < 0) {
            player.inventory.push({ type, value, amount, category });
        } else {
            player.inventory[itemIndexFound].amount += amount;
        }

        await player.save();
    }

    async removeItemFromPlayerInventory(id, { value, amount }) {
        const player = await this.findPlayerById(id);

        if (amount < 0) amount = 0;
        const itemIndexFound = player.inventory.findIndex(item => item.value.toLowerCase() === value.toLowerCase());

        if (itemIndexFound < 0) {
            throw new Error('[ ❌ ] *Erro de Execução*\nEste item não foi encontrado no seu inventário!');
        }

        player.inventory[itemIndexFound].amount -= amount;

        if (player.inventory[itemIndexFound].amount <= 0) {
            player.inventory.splice(itemIndexFound, 1);
        }

        await player.save();
    }

    async increasePlayerMoney(id, desiredMoneyAmount) {
        if (desiredMoneyAmount < 0) desiredMoneyAmount = 0;

        const player = await this.findPlayerById(id);
        player.money += desiredMoneyAmount;

        await player.save();
    }

    async subtractPlayerMoney(id, desiredMoneyAmount) {
        const player = await this.findPlayerById(id);
        player.money -= desiredMoneyAmount;

        if (player.money < 0) player.money = 0

        await player.save();
    }

    async getShopData() {
        let data = await this.shopManager.findById(1);
        if (!data) {
            data = await this.shopManager.create({ items: [] });
        }

        await data.save();
        return data;
    }

    async addItemOnShop({ type, category, isSingle, value, coast }) {
        const data = await this.getShopData();
        
        const itemAlreadyExistsOnDatabase = data.items.find(item => item.value === value && item.category === category);
        const itemAlreadyExistsOnDefaultShop = shop.find(item => item.value === value && item.category === category);

        if (itemAlreadyExistsOnDatabase || itemAlreadyExistsOnDefaultShop) {
            throw new Error('[ ❌ ] *Erro de Execução*\nEste item já existe na loja!');
        }

        data.items.push({ type, category, isSingle, value, coast });
        await data.save();

    }

}

module.exports = Database;