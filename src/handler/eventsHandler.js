const { Client } = require("@open-wa/wa-automate");
const { readdirSync } = require('node:fs');
const { join } = require('node:path');

/**
 * @param {Client} client 
 */
module.exports = client => {
    const eventsFolder = readdirSync(join(__dirname, '../events')).filter(eventFile => eventFile.endsWith('.js'));

    for (const eventFileName of eventsFolder) {
         const event = require(join(__dirname, `../events/${eventFileName}`));

         client[event.name]((...args) => event.execute(...args, client));
    }
}