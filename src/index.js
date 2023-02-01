const { create, NotificationLanguage } = require('@open-wa/wa-automate');
const { start } = require('./start');
require('dotenv').config();
require('../database/connection');
require('../extended/to-capitalize')

create({
    sessionId: "BOT_RPG",
    multiDevice: true,
    useChrome: true,
    authTimeout: 0,
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: NotificationLanguage.PTBR,
    logConsole: false,
    popup: true,
    qrTimeout: 0,
}).then(client => start(client));