import { WASocket, proto } from "@whiskeysockets/baileys";
import EventEmitter from "events";

interface CollectorEvents {
  'collect': (message: proto.IWebMessageInfo) => void;
  'end': (collected: proto.IWebMessageInfo[]) => void;
}

type CollectorOptions = {
  client: WASocket;
  groupId: string;
  filter: (m: proto.IWebMessageInfo) => boolean;
  time?: number;
  max?: number;
};

export class MessageCollector extends EventEmitter {
  private isEnded = false;
  private collectedMessages: proto.IWebMessageInfo[] = [];
  private max: number;
  private messageListener: ((m: { messages: proto.IWebMessageInfo[] }) => void) | null = null

  constructor(
    private readonly options: CollectorOptions
  ) {
    super();
    this.max = options.max ?? 1;
  }

  public start() {
    if (this.options.time) {
      setTimeout(() => this.end(), this.options.time);
    }

    this.messageListener = m => {
      if (this.isEnded) return;

      if (this.collectedMessages.length >= this.max) {
        this.end();
        return;
      }

      const message = m.messages[0];

      if (this.options.filter(message) && this.options.groupId === message.key.remoteJid) {
        this.collectedMessages.push(message);
        this.emit("collect", message);

        if (this.collectedMessages.length >= this.max) {
          this.end();
        }
      }
    }

    this.options.client.ev.on('messages.upsert', this.messageListener)
  }

  private end() {
    if (this.isEnded) return;

    this.isEnded = true;
    this.emit("end", this.collectedMessages);

    if (this.messageListener) {
      this.options.client.ev.off('messages.upsert', this.messageListener)
    }

    this.removeAllListeners();
  }

  public get ended() {
    return this.isEnded;
  }

  on<U extends keyof CollectorEvents>(
    event: U,
    listener: CollectorEvents[U]
  ): this {
    return super.on(event, listener);
  }

  emit<U extends keyof CollectorEvents>(
    event: U,
    ...args: Parameters<CollectorEvents[U]>
  ): boolean {
    return super.emit(event, ...args);
  }
}
