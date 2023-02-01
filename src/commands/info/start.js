const { Client, Message } = require("@open-wa/wa-automate");

module.exports = {
    name: 'start',
    aliases: ['info'],
    description: 'mensagem de introdução do bot.',
    isRegisterRequired: false,

    /**
     * @param {{ client: Client, message: Message, args: String[] }} 
     */
    async execute({ client, message, args }) {

        const helloMessage = `Olá mestres e jogadores!
Estão cansado de recorrer a um segundo aplicativo, site ou rede social para efetuar rolagem de dados? Eu sou o ${client.bot.name} e estou aqui para auxiliar. 
        
𝐃𝐄𝐓𝐀𝐋𝐇𝐀𝐌𝐄𝐍𝐓𝐎
- Role dados RPG poliédricos no WhatsApp (dados Fate/Fudge incluídos).
- Role uma expressão de dados e mostre os resultados.
- Gerador de nomes Fantasias.
- Gerador de itens e armas.
- Sistema de Lojas.
- Modo de exibição de sistemas e apresentação.
        
Desenvolvido por: wa.me/${client.bot.developer.number}
        
Aberto a parcerias entre em contato.`;

        await client.reply(message.from, helloMessage, message.id);

    }
};