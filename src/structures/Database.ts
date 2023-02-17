import { Player, Shop } from "../database/schemas";
import shop from "../utils/shop";

class Database {
    shopManager: typeof Shop;
    playerManager: typeof Player;

    constructor() {
        this.playerManager = Player;
        this.shopManager = Shop;
    }

    async findPlayerById(id: string) {
        return (await this.playerManager.findById(id));
    }

    async registerPlayer({ id, category, name }: { id: string, category?: string, name?: string }) {
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

    async increasePlayerHp(id: string, desiredHpAmount: number) {
        const player = await this.findPlayerById(id);
        if (player) {
            player.hp += desiredHpAmount;
            await player.save();
        }
    }

    async subtractPlayerHp(id: string, desiredHpAmount: number) {
        if (desiredHpAmount < 0) desiredHpAmount = 0;

        const player = await this.findPlayerById(id);
        if (player) {
            player.hp -= desiredHpAmount;

            if (player.hp < 0) player.hp = 0

            await player.save();
        }
    }

    async increasePlayerStamina(id: string, desiredStaminaAmount: number) {
        if (desiredStaminaAmount < 0) desiredStaminaAmount = 0;

        const player = await this.findPlayerById(id);
        if (player) {
            player.stamina += desiredStaminaAmount;

            await player.save();
        }
    }

    async subtractPlayerStamina(id: string, desiredStaminaAmount: number) {
        const player = await this.findPlayerById(id);

        if (player) {
            player.stamina -= desiredStaminaAmount;

            if (player.stamina < 0) player.stamina = 0

            await player.save();
        }
    }

    async changePlayerName(id: string, name: string) {
        const player = await this.findPlayerById(id);

        if (player) {
            if (player.name === name) return;

            player.name = name;
            await player.save();
        }
    }

    async changePlayerCategory(id: string, category: string) {
        const player = await this.findPlayerById(id);
        if (player) {
            if (player.category === category) return;

            player.category = category;
            await player.save();
        }
    }

    async addItemOnPayerInventory(id: string, { type, amount, value, category }: { type: string, amount: number, value: string, category: string }) {
        const player = await this.findPlayerById(id);

        if (player) {
            const itemIndexFound = player.inventory.findIndex(item => item.value?.toLowerCase() === value.toLowerCase());

            if (itemIndexFound < 0) {
                player.inventory.push({ type, value, amount, category });
            } else {
                player.inventory[itemIndexFound].amount += amount
            }

            await player.save();
        }
    }

    async removeItemFromPlayerInventory(id: string, { value, amount }: { value: string, amount: number }) {
        const player = await this.findPlayerById(id);

        if (player) {
            if (amount < 0) amount = 0;
            const itemIndexFound = player.inventory.findIndex(item => item.value?.toLowerCase() === value.toLowerCase());

            if (itemIndexFound < 0) {
                throw new Error('[ ❌ ] *Erro de Execução*\nEste item não foi encontrado no seu inventário!');
            }

            player.inventory[itemIndexFound].amount -= amount;

            if (player.inventory[itemIndexFound].amount <= 0) {
                player.inventory.splice(itemIndexFound, 1);
            }


            await player.save();
        }
    }

    async increasePlayerMoney(id: string, desiredMoneyAmount: number) {
        if (desiredMoneyAmount < 0) desiredMoneyAmount = 0;

        const player = await this.findPlayerById(id);
        if (player) {
            player.money += desiredMoneyAmount;

            await player.save();
        }
    }

    async subtractPlayerMoney(id: string, desiredMoneyAmount: number) {
        const player = await this.findPlayerById(id);
        if (player) {
            player.money -= desiredMoneyAmount;

            if (player.money < 0) player.money = 0

            await player.save();
        }
    }

    async getShopData() {
        let data = await this.shopManager.findById(1);
        if (!data) {
            data = await this.shopManager.create({ items: [] });
        }

        await data.save();
        return data;
    }

    async addItemOnShop({ type, category, isSingle, value, coast }: { type: string, category: string, isSingle?: boolean, value: string, coast: number }) {
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
