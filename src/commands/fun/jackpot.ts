import { CasinoRoulette, Command, CommandExecuteOptions, prisma } from "../../structures"
import { addPlayerStars, addPlayerXP, removePlayerStars } from "../../utils"
import constants from "../../utils/constants"

export default class JackpotCommand extends Command {
  constructor() {
    super({
      name: 'jackpot',
      aliases: ['cassino'],
      usage: 'quantia  (exemplo: 50)',
      description: 'gire a roleta e ganhe (ou não) prêmios.',
      args: true,
      dev: false,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const playerInfoFromDatabase = await prisma.player.findUnique({
      where: { id: messageObj.key.participant }
    })

    const amountFromPlayer = Number(args[0])

    if (isNaN(amountFromPlayer) || amountFromPlayer < 1) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.invalidArgumentsErrorMessage
      }, { quoted: messageObj })

      return
    }

    if (playerInfoFromDatabase.stars < amountFromPlayer) {
      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.insufficientMoney
      }, { quoted: messageObj })

      return
    }

    const roulette = new CasinoRoulette()
    const result = roulette.spin()

    let points: number
    const winPercentage = Math.random() * (0.7 - 0.3) + 0.3;
    const odd = (1 / winPercentage) * 0.5

    if (result.win) {
      points = Math.floor(amountFromPlayer * odd)
      await addPlayerStars(messageObj.key.participant, points)
    }
    else {
      points = amountFromPlayer
      await removePlayerStars(messageObj.key.participant, points)
    }

    const footerMessages = {
      lose: '💬 _A sorte florescerá em breve! 🍀_',
      win: '💬 _A sorte floresceu para você!_ 🍀'
    }
    const draw = `✿•⊱┄┄┄┄┄┄┄┄┄┄┄┄⊰•✿  
        \`\`\`🎰 Roleta 🎰 \`\`\`
✿•⊱┄┄┄┄┄┄┄┄┄┄┄┄⊰•✿  

     ✿⊱────────⊰✿  
     │${result.symbols.join('  ¦  ')}│  
     ✿⊱────────⊰✿  
  
*🌸 Jogador: ${messageObj.pushName ?? messageObj.key?.participant?.replace('@s.whatsapp.net', '')}* 
*🌸 Apostou: ${amountFromPlayer} 🌟* 
*🌸 Odd: ${odd.toFixed(2)}* 
*🌸 Resultado: ${result.win ? 'Ganhou! 🎉' : 'Perdeu! 💔'}* 
*🌸 Estrelas:  ${result.win ? `+${points}` : `-${points}`} 🌟*

${result.win ? footerMessages.win : footerMessages.lose} 
✿•⊱┄┄┄┄┄┄┄┄┄┄┄┄⊰•✿`.trim()

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: draw
    })

    if (result.win) {
      const xpEarnedAmount = Math.floor(Math.random() * 5) + 1
      const { levelUp } = await addPlayerXP(messageObj.key.participant, xpEarnedAmount)

      await client.sendMessage(messageObj.key.remoteJid!, {
        text: constants.earnedXp(xpEarnedAmount)
      }, { quoted: messageObj })

      if (levelUp) {
        await client.sendMessage(messageObj.key.remoteJid!, {
          text: constants.playerLevelUp
        }, { quoted: messageObj })
      }
    }

  }
};
