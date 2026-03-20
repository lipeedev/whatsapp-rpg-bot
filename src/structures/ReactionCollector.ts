import { WASocket, proto } from "@whiskeysockets/baileys";
import EventEmitter from "events";

interface CollectorEvents {
  'collect': (message: proto.IReaction) => void;
  'end': (collected: proto.IReaction[]) => void;
}

type CollectorOptions = {
  client: WASocket;
  groupId: string;
  filter: (r: proto.IReaction) => boolean;
  time?: number;
  max?: number;
};

export class ReactionCollector extends EventEmitter {
  private isEnded = false;
  private collectedReactions: proto.IReaction[] = [];
  private max: number;
  private reactionListener: ((r: { reaction: proto.IReaction, key: proto.MessageKey }[]) => void) | null = null

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

    this.reactionListener = r => {
      if (this.isEnded) return;

      if (this.collectedReactions.length >= this.max) {
        this.end();
        return;
      }

      const reaction = r[0].reaction;

      if (this.options.filter(reaction) && this.options.groupId === reaction.key!.remoteJid!) {
        this.collectedReactions.push(reaction);
        this.emit("collect", reaction);

        if (this.collectedReactions.length >= this.max) {
          this.end();
        }
      }
    }

    this.options.client.ev.on('messages.reaction', this.reactionListener)
  }

  private end() {
    if (this.isEnded) return;

    this.isEnded = true;
    this.emit("end", this.collectedReactions);

    if (this.reactionListener) {
      this.options.client.ev.off('messages.reaction', this.reactionListener)
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
