import makeWASocket, { Browsers, DisconnectReason, makeInMemoryStore, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { spawn } from 'child_process';
import * as process from 'process';
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

      console.log('[CLIENT] disconnected ❌')


      if (shouldReconnect) {
        console.log('[CLIENT] reconnecting...')
        restartApplication()
      }
    }

    else if (connection === 'open') {
      console.log('[CLIENT] connected ✅')
    }

  });

  client.ev.on('creds.update', saveCreds);
  client.ev.on('contacts.update', contacts => {
    updateContacts(contacts.map(c => ({ id: c.id!, name: c.name })))
  })
  client.ev.on('contacts.upsert', contacts => {
    updateContacts(contacts.map(c => ({ id: c.id, name: c.name })))
  })

  return { client, store };
}

function restartApplication() {
  spawn('tsx', process.argv.slice(1), {
    stdio: 'inherit',
    detached: true
  });

  process.stdin.pause()
  process.exit();
}
