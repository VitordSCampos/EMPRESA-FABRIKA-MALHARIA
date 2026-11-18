// Tela "Análises > Relatórios" (somente design): galeria de cards de relatório.

import { Botao } from "@/shared/components/Botao"
import { PageHeader } from "@/shared/components/PageHeader"
import { CartaoAnalise, type VarianteMini } from "./CartaoAnalise"
import "./analises.css"

const relatorios: { titulo: string; descricao: string; variante: VarianteMini }[] = [
  { titulo: "Custo por produto", descricao: "Composição e evolução dos custos", variante: "cinza" },
  { titulo: "Resíduo têxtil por produto", descricao: "Previsto versus realizado", variante: "elipses" },
  { titulo: "Produção x Meta", descricao: "Eficiência por período e setor", variante: "preto" },
  { titulo: "Materiais por fornecedor", descricao: "Volume, prazo e variação de preço", variante: "bege" },
]

export default function RelatoriosPage() {
  return (
    <div className="pagina">
      <PageHeader
        eyebrow="Análise e conectividade"
        titulo="Relatórios"
        descricao="Indicadores consolidados para decisões mais rápidas."
      />

      <div className="analise-grade">
        {relatorios.map((r) => (
          <CartaoAnalise
            key={r.titulo}
            variante={r.variante}
            eyebrow="Relatório"
            titulo={r.titulo}
            descricao={r.descricao}
            acao={<Botao variante="secundario">Abrir e exportar</Botao>}
          />
        ))}
      </div>
    </div>
  )
}
