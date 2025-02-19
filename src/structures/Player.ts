import { Card } from "../utils";

type PlayerProps = {
  nickname: string,
  hp: number,
  ck: number,
  clone1?: boolean,
  clone2?: boolean,
  id: string
}

export class Player {
  nickname: string;
  id: string;
  hp: number;
  ck: number;
  clone1: boolean;
  clone2: boolean;
  playedCards: Card[];
  loseByWO: boolean;

  constructor({ id, nickname, ck, hp, clone1, clone2 }: PlayerProps) {
    this.nickname = nickname;
    this.hp = hp;
    this.ck = ck;
    this.clone1 = clone1;
    this.clone2 = clone2;
    this.id = id;
    this.playedCards = []
    this.loseByWO = false;
  }

}
