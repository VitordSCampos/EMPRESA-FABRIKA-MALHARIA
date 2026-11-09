import type { ReactNode } from "react"
import { Icon } from "./Icon"

/** Mostrado quando uma lista/tabela não tem resultados. */
export function EstadoVazio({ titulo, texto, acao }: { titulo: string; texto?: string; acao?: ReactNode }) {
  return (
    <div className="estado-vazio">
      <Icon nome="inbox" tamanho={40} />
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      {acao}
    </div>
  )
}
