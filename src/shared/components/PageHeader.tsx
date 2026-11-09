import type { ReactNode } from "react"

interface PageHeaderProps {
  /** Texto pequeno em maiúsculas acima do título (ex.: "CADASTRO") */
  eyebrow?: string
  titulo: string
  descricao?: string
  /** Botões à direita (ex.: "+ Novo tecido") */
  acoes?: ReactNode
}

/** Cabeçalho padrão de TODAS as telas. */
export function PageHeader({ eyebrow, titulo, descricao, acoes }: PageHeaderProps) {
  return (
    <header className="pagina-cabecalho">
      <div>
        {eyebrow && <span className="pagina-eyebrow">{eyebrow}</span>}
        <h1>{titulo}</h1>
        {descricao && <p>{descricao}</p>}
      </div>
      {acoes}
    </header>
  )
}
