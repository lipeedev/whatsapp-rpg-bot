import { botConfig } from '../structures/bot-config';

export default {
  onlyGroupsMessage: '[ ❕ ] *Aviso*\nMeus comandos só estão disponíveis para o uso em grupos!',
  noArgsErrorMessage: '[ ❌ ] *Erro de Argumentos*\nVocê não forneceu os argumentos necessários para este comando!',
  invalidArgumentsErrorMessage: '[ ❌ ] *Erro de Argumentos*\nVocê forneceu argumentos de tipos inválidos para este comando!',
  commandNotFoundErrorMessage: '[ ❌ ] *Erro de Execução*\nEste comando não foi encontrado!',
  noResponseErrorMessage: '[ ❌ ] *Erro de Resposta*\nVocê não forneceu respostas!',
  insufficientPermissionErrorMessage: '[ ❌ ] *Erro de Permissão*\nVocê não possui permissão para isto!',
  maxRangeErrorMessage: (max: number) => `[ ❌ ] *Erro de Alcance*\nO limite máximo para isso é de ${max}!`,
  insufficientMoneyErrorMessage: (money: number) => `[ ❌ ] *Erro de Falta de Recurso*\nVocê não tem moedas o suficiente, necessita: ${money} 💰`,
  itemNotFoundErrorMessage: (item: string) => `[ ❌ ] *Erro de Execução*\nO item ${item} não foi encontrado!`,
  genericErrorMessage: (config: typeof botConfig, error: Error) => ` [ ❌ ] *Erro Interno*\n_Reporte ao meu desenvolvedor!_\n\n*[ ❗ ] Clique aqui:*\nhttps://wa.me/${config.developer.number}?text=${encodeURIComponent(`Erro (${new Date().toISOString()})\n${error.message}`)}`,
  invalidChooseFromListErrorMessage: (list: unknown[]) => `[ ❌ ] *Erro de Argumentos*\nVocê forneceu argumentos inválidos para este comando!\n\n[ ❗ ] Opções disponiveis:\n\n${list.map(value => `[ ${value} ]`).join('\n')}`,
  successShopBuyMessage: (amount: number, itemName: string) => `[ ✅ ] *Operação Realizada*\nCompra efetuada com sucesso: *${amount}x ${itemName}* 🎊`,
  successIncreasePlayerValuesMessage: `[ ✅ ] *Operação Realizada*\nValores do jogador alterados com sucesso!`,
  successChangeShopValuesMessage: `[ ✅ ] *Operação Realizada*\nValores do Loja alterados com sucesso!`,
  levelResourceLimitErrorMessage: `[ ❌ ] *Erro de Limite*\nO Limite do seu nivel atual foi alcançado`
};
