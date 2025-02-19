import { WASocket } from "@whiskeysockets/baileys";
import { Player } from "./Player";
import constants from "../utils/constants";
import { cards, collectAnswer } from "../utils";
import { setTimeout as delay } from 'node:timers/promises'

type BoardProps = {
  client: WASocket,
  groupId: string,
  players: Player[]
}

export class Board {
  private currentPlayerToPlay: Player;
  private client: WASocket;
  private groupId: string;
  private players: Player[];
  private isGameRunning: boolean;

  constructor({ players, client, groupId }: BoardProps) {
    this.client = client;
    this.groupId = groupId;
    this.players = players
    this.currentPlayerToPlay = this.players[Math.floor(Math.random() * this.players.length)]
    this.isGameRunning = true;
  }

  public async startFight() {
    while (this.isGameRunning) {
      await this.draw()

      await this.managePlayerTurn()
      const player1 = this.currentPlayerToPlay
      if (player1.loseByWO) break;

      this.switchPlayerTurn()

      await this.managePlayerTurn()
      const player2 = this.currentPlayerToPlay
      if (player2.loseByWO) break;

      await this.updateStats(player1, player2);
    }
  }

  private async updateStats(player1: Player, player2: Player) {
    const lastCardFromPlayer1 = player1.playedCards[player1.playedCards.length - 1]
    const lastCardFromPlayer2 = player2.playedCards[player2.playedCards.length - 1]

    if (lastCardFromPlayer1.cardTypesCancellableInFirst.includes(lastCardFromPlayer2.type)) {
      this.subtractChakraFromPlayer(player1, lastCardFromPlayer1.ck)
      this.subtractChakraFromPlayer(player2, lastCardFromPlayer2.ck)

      this.applyDamageToPlayer(player2, lastCardFromPlayer1.damage)

      if (player1.clone1 && lastCardFromPlayer2.damage > 0) {
        this.players.find(p => p.nickname === player1.nickname)!.clone1 = false
      }

      if (player1.clone2 && lastCardFromPlayer2.damage > 0) {
        this.players.find(p => p.nickname === player1.nickname)!.clone2 = false
      }

      return
    }

  }

  private subtractChakraFromPlayer(player: Player, chakraNeeded: number) {
    let targetPlayerCk = this.players.find(p => p.nickname === player.nickname)!.ck

    if (targetPlayerCk - chakraNeeded <= 0) {
      targetPlayerCk = 0
    }
    else {
      targetPlayerCk -= chakraNeeded
    }

    this.players.find(p => p.nickname === player.nickname)!.ck = targetPlayerCk
  }

  private applyDamageToPlayer(player: Player, damage: number) {
    if (player.clone1 && damage > 0) {
      this.players.find(p => p.nickname === player.nickname)!.clone1 = false
      return
    }

    if (player.clone2 && damage > 0) {
      this.players.find(p => p.nickname === player.nickname)!.clone2 = false
      return
    }

    let targetPlayerHP = this.players.find(p => p.nickname === player.nickname)!.hp

    if (targetPlayerHP - damage <= 0) {
      targetPlayerHP = 0
    }
    else {
      targetPlayerHP -= damage
    }

    this.players.find(p => p.nickname === player.nickname)!.hp = targetPlayerHP
  }

  private async managePlayerTurn() {
    await this.client.sendMessage(this.groupId, {
      text: constants.turnToPlay(this.currentPlayerToPlay.nickname)
    })

    await delay(300)

    let validCardOfCurrentPlayer = await this.checkPlayedCard();

    if (validCardOfCurrentPlayer === null) {
      await this.client.sendMessage(this.groupId, {
        text: constants.playerLoseByWO(this.currentPlayerToPlay.nickname)
      })

      this.currentPlayerToPlay.loseByWO = true
      return;
    }

    const alreadyPlayedThisCard = () => this.currentPlayerToPlay.playedCards.find(
      card => card.title === validCardOfCurrentPlayer?.title
    )

    while (alreadyPlayedThisCard()) {
      await this.client.sendMessage(this.groupId, {
        text: constants.alreadyPlayedCard(this.currentPlayerToPlay.nickname)
      })

      await delay(300)

      validCardOfCurrentPlayer = await this.checkPlayedCard();
    }

    if (validCardOfCurrentPlayer === null) {
      await this.client.sendMessage(this.groupId, {
        text: constants.playerLoseByWO(this.currentPlayerToPlay.nickname)
      })

      this.currentPlayerToPlay.loseByWO = true
      return;
    }

    this.currentPlayerToPlay.playedCards.push(validCardOfCurrentPlayer);
  }

  private async checkPlayedCard() {
    const msgObj = await collectAnswer({
      client: this.client,
      targetUserId: this.currentPlayerToPlay.id,
      minutesToAnswer: 1,
      groupId: this.groupId,
      filter: m => cards.some(card => m.message.conversation?.includes(card.title)) && m.key.remoteJid === this.currentPlayerToPlay.id
    }).catch(() => null)

    if (!msgObj) {
      return null
    }

    const cardFound = cards.find(
      card => msgObj.message.conversation?.includes(card.title)
    )

    return cardFound
  }

  private async draw() {
    const msg = `⋘════∗ {•👻•} ∗════⋙
*${this.players[0].nickname}*
【${this.players[0].hp}❤️】 【${this.players[0].ck}🔷】
> : ̗̀➼ ${this.getCloneState(this.players[0], 0)}
> : ̗̀➼ ${this.getCloneState(this.players[0], 1)}
> : ̗̀➼
┅┅┅┅┅┅≪ •✯• ≫┅┅┅┅┅┅
*${this.players[1].nickname}*
【${this.players[1].hp}❤️】 【${this.players[1].ck}🔷】
> : ̗̀➼ ${this.getCloneState(this.players[1], 0)}
> : ̗̀➼ ${this.getCloneState(this.players[1], 1)}
> : ̗̀➼
⋘════∗ {•👻•} ∗════⋙`;

    await this.client.sendMessage(this.groupId, { text: msg })
  }

  private getCloneState(player: Player, index: 0 | 1) {
    if (player[`clone${index}`] === undefined) {
      return ''
    }
    else if (player[`clone${index}`] === false) {
      return 'Clones ❌'
    }
    else {
      return 'Clones ✅'
    }
  }

  private switchPlayerTurn() {
    this.currentPlayerToPlay = this.players.find(player => player.nickname !== this.currentPlayerToPlay.nickname) ?? this.currentPlayerToPlay
  }
}
