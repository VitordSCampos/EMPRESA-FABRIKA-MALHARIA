export type VarianteStatus = "neutro" | "sucesso" | "alerta" | "perigo"

// Palavras que definem a cor do badge. Acrescente novas aqui, em um só lugar.
const PERIGO = /Crítico|Atrasad|Rejeitad|Falha|Comprar|Insuficiente|Sem ficha/i
const ALERTA = /Baixo|Pendente|Parad|teste|análise|Pausad|Ajustando|Solicitado|Rascunho/i
const SUCESSO = /^OK$|Aprovad|Ativo|Conclu|Entregue|Pronto|Emitida|Recebido|Operando|Atendido|Suficiente|Finalizad/i

export function varianteDoStatus(texto: string): VarianteStatus {
  if (PERIGO.test(texto)) return "perigo"
  if (ALERTA.test(texto)) return "alerta"
  if (SUCESSO.test(texto)) return "sucesso"
  return "neutro"
}

/** Badge colorido de status. O sinal (✓ ! ✕) garante que não dependa só de cor.
 *  Ex.: <StatusBadge status="Em produção" />  ou  <StatusBadge status="X" variante="alerta" /> */
export function StatusBadge({ status, variante }: { status: string; variante?: VarianteStatus }) {
  return <span className={`status status--${variante ?? varianteDoStatus(status)}`}>{status}</span>
}
