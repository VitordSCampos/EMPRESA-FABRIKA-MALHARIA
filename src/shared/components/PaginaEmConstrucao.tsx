// Tela provisória de cada módulo. Mostra o escopo do briefing para quem vai implementar.
// Quando a tela real ficar pronta, o dev troca o conteúdo do arquivo da feature
// e este componente deixa de ser usado ali.

import { rotas } from "@/app/menu"
import { PageHeader } from "./PageHeader"

export function PaginaEmConstrucao({ path }: { path: string }) {
  const meta = rotas.find((r) => r.path === path)
  if (!meta) return <PageHeader titulo="Tela não configurada" descricao={`Sem entrada em menu.ts para ${path}`} />

  return (
    <div className="pagina">
      <PageHeader eyebrow={meta.grupo} titulo={meta.titulo} descricao={meta.descricao} />
      <section className="card card-corpo em-construcao" aria-label="Escopo da tela">
        <p><span className="etiqueta">Em construção · Frente {meta.frente}</span></p>
        <h2>O que construir nesta tela</h2>
        <ul>
          {meta.escopo.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <small>
          Arquivo desta tela: <code>src/features/…</code> (veja <code>src/app/routes.tsx</code>). Use os componentes de
          <code> src/shared/components</code> e os dados de <code>src/shared/mock/dados.ts</code>.
        </small>
      </section>
    </div>
  )
}
