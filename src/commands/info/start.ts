import { botConfig, Command, CommandExecuteOptions } from "../../structures";

export default class StartCommand extends Command {
    constructor() {
        super({
            name: 'start',
            aliases: ['info'],
            description: 'mensagem de introdução do bot.',
            isRegisterRequired: false,
        })
    }

    async execute({ client, messageObj, args }: CommandExecuteOptions) {

        const helloMessage = `Olá mestres e jogadores!
Estão cansado de recorrer a um segundo aplicativo, site ou rede social para efetuar rolagem de dados? Eu sou o ${botConfig.name} e estou aqui para auxiliar. 
        
𝐃𝐄𝐓𝐀𝐋𝐇𝐀𝐌𝐄𝐍𝐓𝐎
- Role dados RPG poliédricos no WhatsApp (dados Fate/Fudge incluídos).
- Role uma expressão de dados e mostre os resultados.
- Gerador de nomes Fantasias.
- Gerador de itens e armas.
- Sistema de Lojas.
- Modo de exibição de sistemas e apresentação.
        
Desenvolvido por: wa.me/${botConfig.developer.number}
        
Aberto a parcerias entre em contato.`;

        await client.sendMessage(messageObj.key.remoteJid!, { text: helloMessage }, { quoted: messageObj });
    }
};