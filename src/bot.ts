import { readdirSync } from 'fs';
import path from 'path';
import { connect } from './connect';
import { Command } from './structures/Command';

export const commands = new Map<string, Command>();

export const bot = async () => {

  const client = await connect();
  console.clear();
  console.log('connected');

  const eventFiles = readdirSync(path.resolve(__dirname, 'events'))

  for (const eventFile of eventFiles) {
    const { default: eventData } = await import(path.resolve(__dirname, 'events', eventFile));
    client.ev.on(eventData.name, (...args) => eventData.execute(...args, client))
  }

  const commandFolders = readdirSync(path.resolve(__dirname, 'commands'))

  for (const folder of commandFolders) {
    const commandFiles = readdirSync(path.resolve(__dirname, 'commands', folder))
    for (const commandFile of commandFiles) {
      const { default: CommandClass } = await import(path.resolve(__dirname, 'commands', folder, commandFile))
      const commandData = new CommandClass() as Command;
      commands.set(commandData.name, commandData);
    }
  }

}
