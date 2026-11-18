// Cartão usado nas telas Relatórios e Integrações: gráfico decorativo,
// rótulo, título, descrição e uma ação (botão) embaixo.

import type { ReactNode } from "react"

export type VarianteMini = "cinza" | "elipses" | "preto" | "bege"

// Alturas (em %) de cada barra do gráfico decorativo.
const ALTURAS: Record<VarianteMini, number[]> = {
  cinza: [38, 74, 52, 100],
  elipses: [30, 90, 52, 100],
  preto: [38, 74, 52, 100],
  bege: [38, 74, 52, 100],
}

/** Gráfico decorativo do topo do cartão (não representa dados reais). */
export function MiniGrafico({ variante }: { variante: VarianteMini }) {
  const classe = variante === "cinza" ? "analise-mini" : `analise-mini analise-mini--${variante}`
  return (
    <div className={classe} aria-hidden="true">
      {ALTURAS[variante].map((altura, i) => (
        <span key={i} style={{ height: `${altura}%` }} />
      ))}
    </div>
  )
}

interface CartaoAnaliseProps {
  variante: VarianteMini
  /** Texto pequeno em maiúsculas (ex.: "RELATÓRIO") */
  eyebrow: string
  titulo: string
  descricao: string
  /** Botão do cartão */
  acao: ReactNode
}

export function CartaoAnalise({ variante, eyebrow, titulo, descricao, acao }: CartaoAnaliseProps) {
  return (
    <article className="card analise-cartao">
      <MiniGrafico variante={variante} />
      <div className="analise-cartao-texto">
        <span className="analise-cartao-eyebrow">{eyebrow}</span>
        <h2 className="analise-cartao-titulo">{titulo}</h2>
        <p className="analise-cartao-descricao">{descricao}</p>
      </div>
      {acao}
    </article>
  )
}
