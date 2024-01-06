import makeWASocket, { Browsers, DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import Logger from "@whiskeysockets/baileys/lib/Utils/logger";
import { Boom } from '@hapi/boom';
import { botConfig } from "./structures";

export async function connect() { 
  const { state, saveCreds } = await useMultiFileAuthState("./cache");

  const logger = Logger.child({ })
  logger.level = 'silent';

  const client = makeWASocket({ 
    auth: state, 
    printQRInTerminal: false, 
    logger,
    syncFullHistory: true,
    browser: Browsers.macOS('Desktop'),
  });

  if (!state.creds.registered) {
    setTimeout(async () => {
      const code = await client.requestPairingCode(botConfig.number)
      console.log("CODE: ", code)
    }, 7000)
  }

  client.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          await connect();
        } 
      }

      else if (connection === 'open') {
        console.clear();
        console.log('client connected')
      }
 
  });

  client.ev.on('creds.update', saveCreds);

  return client;
}

