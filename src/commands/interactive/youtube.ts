import { Command, CommandExecuteOptions, yt } from "../../structures";
import constants from "../../utils/constants";
import { collectAnswer, truncateString } from "../../utils";
import { WAMessage } from "@whiskeysockets/baileys";
import { VideoInfo } from "youtubei.js/dist/src/parser/youtube";

export default class YoutubeCommand extends Command {
  constructor() {
    super({
      name: "youtube",
      aliases: ["yt"],
      usage: 'titulo',
      description: "Baixa um vídeo do YouTube.",
      args: true,
    });
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const videoTitleFromUser = args.join(' ').trim();

    try {
      const search = await yt.search(videoTitleFromUser, { type: 'video' });
      const videos = search.results.slice(0, 10);

      if (!videos.length || videos[0]['title']?.text?.toLowerCase() === 'no results found') {
        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.videoNotFound
        }, { quoted: messageObj as WAMessage });
        return;
      }

      const menuText = videos.map((v: any, i) => `\`\`\`${i + 1}. ${truncateString(v.title?.text, 50)}\`\`\``).join('\n') + '\n\n> Escolha em até `2 minutos`';

      const msgResponse = await client.sendMessage(messageObj.key.remoteJid!, {
        text: menuText,
      }, { quoted: messageObj as WAMessage });

      const answerCollected: any = await collectAnswer({
        client,
        groupId: messageObj.key.remoteJid,
        filter: m => m.key.participant === messageObj.key.participant && /^[1-9]|10$/.test(m.message.conversation),
        targetUserId: messageObj.key.participant,
        minutesToAnswer: 2
      }).catch((e: Error) => e);

      if (answerCollected instanceof Error || !answerCollected) {
        await client.sendMessage(messageObj.key.remoteJid!, { text: constants.noResponseErrorMessage });
        return;
      }

      const selectedIndex = parseInt(answerCollected.message.conversation) - 1;
      const selectedVideo = videos[selectedIndex];

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: "[🛜] Obtendo informações do video. ",
        edit: msgResponse.key
      });

      const videoInfo = await yt.getInfo(selectedVideo['id'])
      videoInfo.chooseFormat({
        type: 'video+audio',
        quality: '360p',
        format: 'mp4',
      })

      const stream = await videoInfo.download()

      const reader = stream.getReader();
      const chunks: Buffer[] = [];
      let downloadedSize = 0;

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: '[📥] Baixando...',
        edit: msgResponse.key
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(Buffer.from(value));
        downloadedSize += value.length;
      }

      const videoBuffer = Buffer.concat(chunks);

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: '[✅] Download concluído!',
        edit: msgResponse.key
      });

      await client.sendMessage(messageObj.key.remoteJid!, {
        video: videoBuffer,
      }, { quoted: messageObj as WAMessage });

    } catch (err: any) {
      console.error("Erro YoutubeCommand:", err);
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.genericErrorMessage
      });
    }
  }
}

