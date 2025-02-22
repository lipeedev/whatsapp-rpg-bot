import makeWASocket, { Browsers, DisconnectReason, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import Logger from "@whiskeysockets/baileys/lib/Utils/logger";
import { Boom } from '@hapi/boom';
import { botConfig } from "./structures";
import { updateContacts } from "./utils";

export type InMemoryDataStore = ReturnType<typeof makeInMemoryStore>

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState("./cache");

  const logger = Logger.child({})
  logger.level = 'silent';

  const client = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger,
    syncFullHistory: false,
    browser: Browsers.ubuntu('Chrome')
  });

  const store = makeInMemoryStore({
    logger,
    socket: client
  })

  store.bind(client.ev)

  if (!state.creds.registered) {
    setTimeout(async () => {
      const code = await client.requestPairingCode(botConfig.number)
      console.log("CODE: ", code)
    }, 6000)
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
      console.log('[CLIENT] connected ✅')
    }

  });

  client.ev.on('creds.update', saveCreds);
  client.ev.on('contacts.update', contacts => {
    updateContacts(contacts.map(c => ({ id: c.id, name: c.name })))
  })
  client.ev.on('contacts.upsert', contacts => {
    updateContacts(contacts.map(c => ({ id: c.id, name: c.name })))
  })

  return { client, store };
}

