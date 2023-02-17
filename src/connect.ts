import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys";
import Logger from "@adiwajshing/baileys/lib/Utils/logger";
import { Boom } from '@hapi/boom';
import path from 'path';

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, '..', 'cache')
  );

  const logger = Logger.child({ })
  logger.level = 'silent';

  const client = makeWASocket({ auth: state, printQRInTerminal: true, logger });

  client.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          await connect();
        }
        
      }
  });

  client.ev.on('creds.update', saveCreds);

  return client;
}