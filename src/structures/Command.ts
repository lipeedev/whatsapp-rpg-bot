import { proto, WASocket } from "@whiskeysockets/baileys";
import { InMemoryDataStore } from "../connect";

export interface CommandExecuteOptions {
  client: WASocket
  messageObj: proto.IWebMessageInfo
  args: string[],
  store: InMemoryDataStore
}

export interface CommandOptions {
  name: string;
  description: string;
  aliases?: string[];
  args?: boolean;
  usage?: string;
  examples?: string[];
  isRegisterRequired?: boolean;
  optionalArgs?: boolean;
  dev?: boolean;
}

export class Command {
  name!: string
  description!: string
  aliases?: string[]
  args?: boolean
  usage?: string
  examples?: string[]
  isRegisterRequired?: boolean
  optionalArgs?: boolean;
  dev?: boolean;

  constructor(props: CommandOptions) {
    Object.assign(this, props);
  }

  async execute(param: CommandExecuteOptions) { }
}
