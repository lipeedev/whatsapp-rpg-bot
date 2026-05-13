import { WAMessage } from "@whiskeysockets/baileys";
import { classes, Command, CommandExecuteOptions, prisma } from "../../structures";
import { Canvas, loadImage } from "skia-canvas"

export default class StatsCommand extends Command {
  constructor() {
    super({
      name: 'stats',
      usage: '',
      examples: ['stats'],
      description: 'Estatisticas do jogador',
      args: false,
      dev: false,
      isRegisterRequired: true
    })
  }

  async execute({ client, messageObj }: CommandExecuteOptions) {
    const playerInfo = await prisma.player.findUnique({
      where: { id: messageObj.key.participant }
    })

    const img = await loadImage('./assets/stats.png')
    const skin = await loadImage(`./assets/${playerInfo.class}/${playerInfo.gender}/${playerInfo.skin.toLowerCase()}.png`)

    const canvas = new Canvas(img.width, img.height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(img, 0, 0)
    ctx.drawImage(skin, (img.width / 2) - (skin.width / 3), img.height - skin.height + 100, skin.width - 150, skin.height - 200)

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = "black"
    ctx.lineWidth = 0.80
    ctx.font = '25px "Press Start 2P"';

    const player = {
      hp: String(playerInfo.hp).padStart(3, '0'),
      mp: String(playerInfo.mp).padStart(3, '0'),
      points: String(playerInfo.points).padStart(3, '0'),
      strength: String(playerInfo.strength).padStart(2, '0'),
      dexterity: String(playerInfo.dexterity).padStart(2, '0'),
      intelligence: String(playerInfo.intelligence).padStart(2, '0'),
      lucky: String(playerInfo.lucky).padStart(2, '0')
    }

    ctx.fillText(player.hp, 375, 310);
    ctx.strokeText(player.hp, 375, 310);

    ctx.fillText(player.mp, 375, 361);
    ctx.strokeText(player.mp, 375, 361);

    ctx.fillText(player.strength, 557, 498);
    ctx.strokeText(player.strength, 557, 498);

    ctx.fillText(player.dexterity, 557, 554);
    ctx.strokeText(player.dexterity, 557, 554);

    ctx.fillText(player.intelligence, 557, 608);
    ctx.strokeText(player.intelligence, 557, 608);

    ctx.fillText(player.lucky, 557, 662);
    ctx.strokeText(player.lucky, 557, 662);

    ctx.lineWidth = 1.5

    ctx.fillText(player.points, 575, img.height - 65);
    ctx.strokeText(player.points, 575, img.height - 65);

    ctx.font = '20px "Press Start 2P"';
    ctx.letterSpacing = "-2.5px";

    const classTitle = classes.find(c => c.typeName === playerInfo.class).title.toUpperCase()
    const classTitlePositionX = classTitle.length > 5 ? (img.width / 2) - classTitle.length - 3 : (img.width / 2) + (classTitle.length * 7.5)

    ctx.fillText(classTitle, classTitlePositionX, 175);
    ctx.strokeText(classTitle, classTitlePositionX, 175);

    await client.sendMessage(messageObj.key.remoteJid, {
      image: await canvas.toBuffer('webp', { quality: 0.7 })
    }, { quoted: messageObj as WAMessage })

  }
};
