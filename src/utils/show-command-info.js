const { Client } = require("@open-wa/wa-automate")

/**
 * @param {{ 
 * name: String, 
 * description: String 
 * usage: String
 * examples: String[]
 * aliases: String[]
 * optionalArgs: Boolean
 * }}   
 * 
 * @param {Client} client
 */
module.exports = ({ name, description, usage, examples, optionalArgs, aliases }, client) => {
    usage = usage ? `*Uso:* ${client.bot.prefix}${name} ${usage} ${optionalArgs ? '(opcional)' : ''}\n` : '';
    aliases = aliases?.length ? `*Usos alternativos:* ${aliases.map(alias => client.bot.prefix + alias).join(', ')}\n` : '';
    name = `[${name.toUpperCase()}]\n`;
    description = `*Descrição:* ${description}\n`;
    examples = examples?.length ? `*Exemplos:* ${examples.join(' | ')}\n` : '';
    
    return name + usage + examples + aliases + description;
}