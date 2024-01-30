import { proto } from "@whiskeysockets/baileys";
import { Command, CommandExecuteOptions } from "../../structures"
import { Collector } from "../../structures/Collector"

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'teste',
      aliases: ['t'],
      description: 'comando de testes para desenvolvimento.',
      isRegisterRequired: false,
      args: false,
      dev: true,
    })
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const collector = new Collector(client, {
      filter: m => m.message.conversation === 'lipekk' && m.key.remoteJid === messageObj.key.remoteJid,
      time: 2_000
    })

    collector.create();

    collector.on('collect', (m: proto.IWebMessageInfo) => {
      client.sendMessage(messageObj.key.remoteJid, {
        text: `msg coletada: ${m.message.conversation}`
      })
    })


    collector.on('end', (m: proto.IWebMessageInfo[]) => {
      if (!m.length) return client.sendMessage(messageObj.key.remoteJid, { text: 'sem msg coletada' });

      client.sendMessage(messageObj.key.remoteJid, {
        text: `msg coletada END: ${m[0].message.conversation}`
      })
    })

  }
};
