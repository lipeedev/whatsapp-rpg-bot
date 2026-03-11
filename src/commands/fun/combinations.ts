import { WAMessage } from "@whiskeysockets/baileys"
import { Command, CommandExecuteOptions, items } from "../../structures"
import constants from "../../utils/constants";

export default class EvalCommand extends Command {
  constructor() {
    super({
      name: 'combination',
      aliases: ['comb', 'combinacao'],
      description: 'lista de combinações dos itens para criar poções',
      examples: ["nome do item"],
      args: true,
    })
  }
  async execute({ client, messageObj, args }: CommandExecuteOptions) {
    const findItemByName = (name: string) => items.find(item => item.name.toLowerCase() === name.toLowerCase())
    let outputMsg: string;

    const itemNameGivenByPlayer = args.join(" ").toLowerCase();
    const itemFounded = findItemByName(itemNameGivenByPlayer);

    if (!itemFounded) {
      outputMsg = constants.notFoundAnyItem
    }
    else {
      outputMsg = `{🏷️} *${itemFounded.name}* ${itemFounded.emoji}\n\`\`\`\n• Combinações:\`\`\`\n\n◈ ━━━━━━━ ⸙ ━━━━━━━ ◈\n\n${itemFounded.combinations.map(
        combination => `> ${findItemByName(combination)!.emoji} ${combination}`).join('\n')}\n\n◈ ━━━━━━━ ⸙ ━━━━━━━ ◈\n\n          
\`\`\`🧪Experimente combinações\`\`\`
\`\`\`e crie poções poderosas!\`\`\``.trim()
    }

    await client.sendMessage(messageObj.key!.remoteJid!, {
      text: outputMsg
    }, { quoted: messageObj as WAMessage })
  }
};
