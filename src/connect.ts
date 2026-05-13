import makeWASocket, { Browsers, DisconnectReason, fetchLatestBaileysVersion, useMultiFileAuthState } from "@whiskeysockets/baileys";
import Logger from "@whiskeysockets/baileys/lib/Utils/logger";
import { botConfig } from "./structures";
import { setTimeout } from 'timers/promises'
import { Boom } from "@hapi/boom";
import { spawn } from "child_process";

export async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState("./cache");
  const { version } = await fetchLatestBaileysVersion()

  const logger = Logger.child({})
  logger.level = 'silent';

  const client = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger,
    browser: Browsers.macOS('Safari'),
    syncFullHistory: false,
    shouldSyncHistoryMessage: () => false,
    markOnlineOnConnect: false
  });

  if (!state.creds.registered) {
    await setTimeout(6000)
    const code = await client.requestPairingCode(botConfig.number)
    console.log("CODE: ", code)
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

  return { client };
}

function restartApplication() {
  spawn('tsx', process.argv.slice(1), {
    stdio: 'inherit',
    detached: true
  });

  process.stdin.pause()
  process.exit();
}
