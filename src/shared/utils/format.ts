// Formatadores. Use SEMPRE estes (nunca toFixed ou template na mão).

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })
const num = new Intl.NumberFormat("pt-BR")

/** 1234.5 → "R$ 1.234,50" */
export const formatarMoeda = (valor: number) => brl.format(valor)

/** 4820 → "4.820" */
export const formatarNumero = (valor: number) => num.format(valor)

/** 8.5 → "8,5%" */
export const formatarPercentual = (valor: number) => `${num.format(valor)}%`

/** Date → "dd/mm/aaaa" */
export const formatarData = (data: Date) =>
  new Intl.DateTimeFormat("pt-BR").format(data)
