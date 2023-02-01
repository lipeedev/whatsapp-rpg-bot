const { Client, Collection } = require("@open-wa/wa-automate");
const { readdirSync } = require('node:fs');
const { join } = require('node:path');

/**
 * @param {Client} client 
 */
module.exports = client => {
    
    client.commands = new Collection();

    const commandFolders = readdirSync(join(__dirname, '../commands'));

    for (const commandFolder of commandFolders) {
        const commandFileNames = readdirSync(join(__dirname, '../commands/' + commandFolder)).filter(file => file.endsWith('.js'));

        for (const commandFileName of commandFileNames) {
            const command = require(join(__dirname, `../commands/${commandFolder}/${commandFileName}`));

            client.commands.set(command.name, command);
        }
    }
}