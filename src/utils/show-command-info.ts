import { botConfig } from "../structures";

type showCommandInfoParams = {
    name: string,
    description: string,
    usage?: string,
    examples?: string[],
    optionalArgs?: boolean,
    aliases?: string[],
}

export const showCommandInfo = ({ name, description, usage, examples, optionalArgs, aliases }: showCommandInfoParams) => {
    usage = usage ? `*Uso:* ${botConfig.prefix}${name} ${usage} ${optionalArgs ? '(opcional)' : ''}\n` : '';
    const aliasesString = aliases?.length ? `*Usos alternativos:* ${aliases.map(alias => botConfig.prefix + alias).join(', ')}\n` : '';
    name = `[${name.toUpperCase()}]\n`;
    description = `*Descrição:* ${description}\n`;
    const examplesString = examples?.length ? `*Exemplos:* ${examples.join(' | ')}\n` : '';
    
    return name + usage + examplesString + aliasesString + description;
}