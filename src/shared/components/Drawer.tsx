import { useId, type ReactNode } from "react"
import { useDialogo } from "./useDialogo"

interface DrawerProps {
  aberto: boolean
  titulo: string
  eyebrow?: string
  aoFechar: () => void
  children: ReactNode
  rodape?: ReactNode
}

/** Painel lateral para detalhes de uma linha de tabela. Mesma API do Modal. */
export function Drawer({ aberto, titulo, eyebrow, aoFechar, children, rodape }: DrawerProps) {
  const idTitulo = useId()
  const ref = useDialogo(aberto, aoFechar)
  if (!aberto) return null
  return (
    <div className="camada">
      <button className="camada-fundo" onClick={aoFechar} aria-label="Fechar" tabIndex={-1} data-fechar />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby={idTitulo} ref={ref} tabIndex={-1}>
        <div className="camada-cabecalho">
          <div>
            {eyebrow && <span>{eyebrow}</span>}
            <h2 id={idTitulo}>{titulo}</h2>
          </div>
          <button className="btn btn--icone" onClick={aoFechar} aria-label="Fechar" data-fechar>×</button>
        </div>
        {children}
        {rodape && <div className="camada-rodape">{rodape}</div>}
      </aside>
    </div>
  )
}
