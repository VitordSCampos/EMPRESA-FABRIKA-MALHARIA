// Funções PURAS de cálculo (sem React, sem estado).
// A lógica veio do protótipo do Figma Make, onde estava dentro do App.tsx.
// Dono: F2 (Engenharia). Quem precisar de custo/preço IMPORTA daqui, não recalcula.

export interface ParametrosPrecificacao {
  /** % de perda de tecido sobre o custo base */
  perda: number
  /** % de impostos */
  impostos: number
  /** % de comissão */
  comissao: number
  /** % da taxa de maquininha/cartão */
  taxaCartao: number
  /** % de margem desejada */
  margem: number
  /** Frete por peça (R$) */
  frete: number
}

/** Soma preço × quantidade de uma lista de linhas. */
export function somarLinhas(linhas: { preco: number; quantidade: number }[]): number {
  return linhas.reduce((soma, l) => soma + l.preco * l.quantidade, 0)
}

/** Custo de produção = base (tecidos + aviamentos + beneficiamentos) + perda. */
export function custoProducao(base: number, perdaPercentual: number): number {
  return base + base * (perdaPercentual / 100)
}

/** Preço de venda sugerido (markup por dentro, igual ao protótipo). */
export function precoVenda(base: number, p: ParametrosPrecificacao): number {
  const custo = custoProducao(base, p.perda)
  const divisor = 1 - (p.impostos + p.comissao + p.taxaCartao + p.margem) / 100
  // Evita divisão por zero/negativa se a soma dos percentuais chegar a 100% ou mais.
  return divisor > 0 ? (custo + p.frete) / divisor : Number.NaN
}
