import { WAMessage } from "@whiskeysockets/baileys"
import { classes, Command, CommandExecuteOptions, PlayerClass, prisma } from "../../structures"
import constants from "../../utils/constants"
import { collectReaction } from "../../utils"

export default class RegisterCommand extends Command {
  constructor() {
    super({
      name: 'register',
      aliases: ['registrar, cadastro'],
      description: 'Cria seu personagem',
      args: false,
      isRegisterRequired: false
    })
  }
  async execute({ client, messageObj }: CommandExecuteOptions) {

    const playerOnDatabase = await prisma.player.findUnique({
      where: { id: messageObj.key.participant }
    })

    if (playerOnDatabase) {
      await client.sendMessage(messageObj.key.remoteJid, {
        text: constants.alreadyRegistered
      }, { quoted: messageObj as WAMessage })
      return
    }

    const question = await client.sendMessage(messageObj.key.remoteJid, {
      text: `*[⚜️] Escolha uma classe:*\n\n${classes.map((c, i) => `*${i + 1}* - _${c.title}_ {${c.emoji.male}}\n- \`Força:\` ${c.stats.strength}\n- \`Destreza:\` ${c.stats.dexterity}\n- \`Inteligência:\` ${c.stats.intelligence}\n- \`Sorte:\` ${c.stats.lucky}\n`).join('\n--------------------------------\n')}\n\n_Reaja com: 1️⃣, 2️⃣_`
    })

    let infoFromChat: { class: PlayerClass, gender: string } = {
      class: classes[0],
      gender: 'male'
    }

    const classChooseAnswer = await collectReaction({
      client,
      groupId: messageObj.key!.remoteJid!,
      targetUserId: messageObj.key!.participant!,
      minutesToAnswer: 3,
      filter: r => r.key!.participant! === messageObj.key!.participant! && ['1️⃣', '2️⃣'].includes(r?.text)
    }).catch((_: Error) => null)

    if (!classChooseAnswer) {
      await client.sendMessage(messageObj.key.remoteJid, { text: constants.noResponseErrorMessage })
      return
    }

    if (classChooseAnswer.text === '1️⃣') {
      infoFromChat.class = classes[0]
    }
    else {
      infoFromChat.class = classes[1]
    }

    await client.sendMessage(messageObj.key.remoteJid, {
      text: '*[🚻] Escolha o sexo:*\n\n- {🚹} Masculino\n- {🚺} Feminino\n\n_Reaja com: 🚹, 🚺_',
      edit: question.key
    })

    const genderChooseAnswer = await collectReaction({
      client,
      groupId: messageObj.key!.remoteJid!,
      targetUserId: messageObj.key!.participant!,
      minutesToAnswer: 3,
      filter: r => r.key!.participant! === messageObj.key!.participant! && ['🚹', '🚺'].includes(r?.text)
    }).catch((_: Error) => null)

    if (genderChooseAnswer.text === '🚹') {
      infoFromChat.gender = 'male'
    }
    else {
      infoFromChat.gender = 'female'
    }

    await prisma.player.create({
      data: {
        id: messageObj.key.participant,
        gender: infoFromChat.gender,
        class: infoFromChat.class.typeName,
        strength: infoFromChat.class.stats.strength,
        dexterity: infoFromChat.class.stats.dexterity,
        intelligence: infoFromChat.class.stats.intelligence,
        lucky: infoFromChat.class.stats.lucky,
      }
    })

    await client.sendMessage(messageObj.key.remoteJid, {
      text: constants.successRegister,
      edit: question.key
    })

  }
};

