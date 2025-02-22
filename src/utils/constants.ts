import { botConfig } from '../structures/bot-config';

export default {
  onlyGroupsMessage: '❕ Meus comandos só estão disponíveis para o uso em grupos!',
  noArgsErrorMessage: '❌ Você não forneceu os argumentos necessários para este comando!',
  invalidArgumentsErrorMessage: '❌ Você forneceu argumentos de tipos inválidos para este comando!',
  commandNotFoundErrorMessage: '❌ Este comando não foi encontrado!',
  noResponseErrorMessage: '❌ Você não forneceu respostas!',
  insufficientPermissionErrorMessage: '❌ Você não possui permissão para isto!',
  invalidYoutubeUrl: '❌ URL de vídeo inválida!',
  genericErrorMessage: (config: typeof botConfig, error: Error) => `> ❌ Erro Interno\nReporte ao meu desenvolvedor!_\n\nClique aqui:\nhttps://wa.me/${config.developer.number}?text=${encodeURIComponent(`Erro (${new Date().toISOString()})\n${error.message}`)}`,
  gettingVideoInfo: "🔍 Obtendo informações do vídeo...",
  tooLargeVideoSizeErrorMessage: (totalSize: number, sizeLimit: number) => `❌ O vídeo é muito grande (${(totalSize / (1024 * 1024)).toFixed(2)} MB). Limite: ${sizeLimit / (1024 * 1024)} MB.`,
  tooLargeVideoDurationErrorMessage: (totalDuration: number, durationLimit: number) => `❌ O vídeo é muito longo (${Math.floor(totalDuration / 60)} minutos). Limite: ${Math.floor(durationLimit / 60)} minutos.`,
  initializingVideoDownload: (title: string) => `> ${title}\n\n⏬ Iniciando download...`,
  videoDownloadProgress: (percent: number) => `📥 Baixando: ${percent}%`,
  successVideoDownload: "✅ Download concluído! Enviando vídeo...",
  earnedXp: (amount: number) => `✨ Você ganhou *${amount} xp*!`,
  insufficientMoney: '💔 Você não tem estrelas o suficiente',
  explorationSuccess: (stars: number, xp: number) => `🎉 Você encontrou um tesouro!\n> Estrelas: *+${stars} 🌟*\n> XP: *+${xp} ⚗️*`,
  explorationFailure: (stars: number, xp: number) => `🔻 Você gastou recursos e não achou nada!\n> Estrelas: *-${stars} 🌟*\n> XP: *+${xp} ⚗️*`,
  playerLevelUp: '🆙 *Parabéns!*\n> Você acaba de subir um nível!'
};
