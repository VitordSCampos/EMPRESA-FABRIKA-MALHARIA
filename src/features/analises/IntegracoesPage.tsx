// Tela "Análises > Integrações" (somente design): cards com o status de cada serviço.

import { Botao } from "@/shared/components/Botao"
import { PageHeader } from "@/shared/components/PageHeader"
import { CartaoAnalise, type VarianteMini } from "./CartaoAnalise"
import "./analises.css"

const integracoes: { titulo: string; descricao: string; variante: VarianteMini }[] = [
  { titulo: "E-commerce", descricao: "Sincronização de pedidos", variante: "cinza" },
  { titulo: "Fornecedores", descricao: "Atualização de materiais e preços", variante: "elipses" },
  { titulo: "Sensores das máquinas", descricao: "Telemetria do chão de fábrica", variante: "preto" },
  { titulo: "Produtos", descricao: "Catálogo e preços sugeridos", variante: "bege" },
]

export default function IntegracoesPage() {
  return (
    <div className="pagina">
      <PageHeader
        eyebrow="Análise e conectividade"
        titulo="Integrações"
        descricao="Monitore os serviços conectados ao ecossistema Fabrika."
      />

      <div className="analise-grade">
        {integracoes.map((i) => (
          <CartaoAnalise
            key={i.titulo}
            variante={i.variante}
            eyebrow="Integração: conectado"
            titulo={i.titulo}
            descricao={i.descricao}
            acao={<Botao variante="secundario">Testar conexão</Botao>}
          />
        ))}
      </div>
    </div>
  )
}
