import { WASocket, proto } from "@whiskeysockets/baileys";
import EventEmitter from "events";

type CollectorOptions = {
  filter: (m: proto.IWebMessageInfo) => boolean,
  time: number
}

export type CollectorEvent = {
  collect: (msg: proto.IWebMessageInfo) => void,
  end: (collectedList: proto.IWebMessageInfo[]) => void,
};

export interface ICollector {
  on<U extends keyof CollectorEvent>(event: U, listener: CollectorEvent[U]): this;
  off<U extends keyof CollectorEvent>(event: U, listener: CollectorEvent[U]): this;

  emit<U extends keyof CollectorEvent>(
    event: U,
    ...args: Parameters<CollectorEvent[U]>
  ): boolean;
}

export class Collector extends EventEmitter implements ICollector {

  private isEnded = false;
  private isOff = false;
  private collectedMessages: proto.IWebMessageInfo[]

  constructor(
    private readonly client: WASocket,
    private readonly options: CollectorOptions
  ) {
    super();
    this.collectedMessages = []
  }

  create() {
    setTimeout(() => this.isEnded = true, this.options.time);

    this.client.ev.on('messages.upsert', m => {
      if (this.getEnd) {
        if (this.getOff) {
          this.removeAllListeners();
          return
        }

        this.emit('end', this.collectedMessages)
        this.isOff = true
        return;
      }

      const msg = m.messages[0];

      if (this.options.filter(msg)) {
        this.collectedMessages.push(msg)
        this.emit('collect', msg)
      }

    })

  }

  get getEnd() {
    return this.isEnded
  }

  get getOff() {
    return this.isOff
  }

}
