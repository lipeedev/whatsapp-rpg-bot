import { botConfig, Command, CommandExecuteOptions } from "../../structures";
import ytdl from "@distube/ytdl-core";
import yts from 'yt-search';
import constants from "../../utils/constants";
import { collectAnswer, truncateString } from "../../utils";

export default class PlayCommand extends Command {
  constructor() {
    super({
      name: "play",
      aliases: ["p"],
      usage: 'titulo',
      description: "Baixa um vídeo do YouTube.",
      args: true,
    });
  }

  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const videoTitleFromUser = args.join(' ').trim();
    const videoInfoData = await yts(videoTitleFromUser);

    const msgResponse = await client.sendMessage(messageObj.key.remoteJid!, {
      text: videoInfoData.videos.slice(0, 10).map((video, index) => `\`\`\`${index + 1}. ${truncateString(video.title, 50)}\`\`\``).join('\n') + '\n\n> Escolhe em até `2 minutos`',
    }, { quoted: messageObj });

    const answerCollected = await collectAnswer({
      client,
      groupId: messageObj.key.remoteJid,
      filter: m => m.key.participant === messageObj.key.participant && /^[1-9]|10$/.test(m.message.conversation),
      targetUserId: messageObj.key.participant,
      minutesToAnswer: 2
    }).catch((e: Error) => e);

    if (answerCollected instanceof Error || !answerCollected) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.noResponseErrorMessage
      });
      return;
    }

    const videoUrl = videoInfoData.videos[Number(answerCollected.message.conversation) - 1]?.url;

    if (!videoUrl) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.invalidYoutubeUrl
      });
      return;
    }

    if (!ytdl.validateURL(videoUrl)) {
      await client.sendMessage(
        messageObj.key.remoteJid!,
        { text: constants.invalidYoutubeUrl },
        { quoted: messageObj }
      );
      return;
    }

    try {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.gettingVideoInfo,
        edit: msgResponse.key
      });

      const info = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(info.formats, { quality: "18" });

      const totalSizeInBytes = parseInt(format.contentLength, 10);
      const sizeLimitInBytes = 20 * 1024 * 1024; // 20 MB em bytes

      const totalDurationInSeconds = parseInt(info.videoDetails.lengthSeconds, 10);
      const durationLimitInSeconds = 1200; // 20 minutos em segundos

      if (totalDurationInSeconds > durationLimitInSeconds) {
        await client.sendMessage(
          messageObj.key.remoteJid!,
          {
            text: constants.tooLargeVideoDurationErrorMessage(totalDurationInSeconds, durationLimitInSeconds)
          },
          { quoted: messageObj }
        );
        return;
      }

      if (totalSizeInBytes > sizeLimitInBytes) {
        await client.sendMessage(
          messageObj.key.remoteJid!,
          {
            text: constants.tooLargeVideoSizeErrorMessage(totalSizeInBytes, sizeLimitInBytes)
          },
          { quoted: messageObj }
        );
        return;
      }

      let downloadedSize = 0;
      let lastSentPercent = 0;
      let lastUpdateTime = 0;
      const videoChunks: Buffer[] = [];

      const videoStream = ytdl(videoUrl, { format });

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.initializingVideoDownload(info.videoDetails.title),
        edit: msgResponse.key
      });

      videoStream.on("data", async (chunk) => {
        downloadedSize += chunk.length;
        videoChunks.push(chunk);

        const percent = Math.floor((downloadedSize / totalSizeInBytes) * 100);
        const currentTime = Date.now();

        // Atualizar a porcentagem apenas a cada 2 segundos
        if (percent >= lastSentPercent + 10 && currentTime - lastUpdateTime >= 2000) {
          lastSentPercent = percent;
          lastUpdateTime = currentTime;

          await client.sendMessage(messageObj.key.remoteJid!, {
            text: constants.videoDownloadProgress(percent),
            edit: msgResponse.key
          });
        }
      });

      videoStream.on("end", async () => {
        const videoBuffer = Buffer.concat(videoChunks);

        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.successVideoDownload,
          edit: msgResponse.key
        });

        await client.sendMessage(messageObj.key.remoteJid!,
          {
            video: videoBuffer,
            caption: `🎥 ${info.videoDetails.title}`,
          },
          {
            quoted: messageObj
          });
      });

      videoStream.on("error", async (err) => {
        console.error("Erro:", err);
        await client.sendMessage(
          messageObj.key.remoteJid!,
          { text: constants.genericErrorMessage(botConfig, err) },
          { quoted: messageObj }
        );
      });

    } catch (err) {
      console.error("Erro:", err);
      await client.sendMessage(
        messageObj.key.remoteJid!,
        { text: constants.genericErrorMessage(botConfig, err) },
        { quoted: messageObj }
      );
    }
  }
}
