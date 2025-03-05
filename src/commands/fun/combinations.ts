import { Command, CommandExecuteOptions, items } from "../../structures"

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'combination',
      aliases: ['comb', 'combinacao'],
      description: 'lista de combinações dos itens para criar poções',
      args: false,
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {
    const findItemByName = (name: string) => items.find(item => item.name === name)

    const outputMsg = `\`\`\`Lista de Combinações\`\`\`

${items.map(
      item => `{🏷️} *${item.name}* ${item.emoji}\n\`\`\`• Combinações:\`\`\`\n${item.combinations.map(
        combination => `> ${findItemByName(combination).emoji} ${combination}`).join('\n')}`
    ).join('\n\n◈ ━━━━━━━ ⸙ ━━━━━━━ ◈\n\n')}

\`\`\`🧪Experimente combinações\`\`\`
\`\`\`e crie poções poderosas!\`\`\`
`.trim()

    await client.sendMessage(messageObj.key.remoteJid!, {
      text: outputMsg
    }, { quoted: messageObj })

  }
};
