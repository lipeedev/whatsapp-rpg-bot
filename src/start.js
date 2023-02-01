const { Client } = require('@open-wa/wa-automate');
const { commandHandler, eventHandler } = require('./handler');
const Database = require('./structures/database');

/**
 * @param {Client} client
 */
function start(client) {
    client.bot = require('../config.json');
    client.constants = require('./utils/constants');
    client.db = new Database();
    
    commandHandler(client);
    eventHandler(client);
}

module.exports = { start };