import { useId, type ReactNode } from "react"
import { useDialogo } from "./useDialogo"

interface CamadaProps {
  aberto: boolean
  titulo: string
  eyebrow?: string
  aoFechar: () => void
  children: ReactNode
  /** Botões do rodapé (ex.: Cancelar / Salvar) */
  rodape?: ReactNode
}

/** Janela centralizada para formulários curtos.
 *  Ex.: <Modal aberto={aberto} titulo="Novo tecido" aoFechar={() => setAberto(false)} rodape={...}>campos</Modal> */
export function Modal({ aberto, titulo, eyebrow, aoFechar, children, rodape }: CamadaProps) {
  const idTitulo = useId()
  const ref = useDialogo(aberto, aoFechar)
  if (!aberto) return null
  return (
    <div className="camada">
      <button className="camada-fundo" onClick={aoFechar} aria-label="Fechar" tabIndex={-1} data-fechar />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={idTitulo} ref={ref} tabIndex={-1}>
        <div className="camada-cabecalho">
          <div>
            {eyebrow && <span>{eyebrow}</span>}
            <h2 id={idTitulo}>{titulo}</h2>
          </div>
          <button className="btn btn--icone" onClick={aoFechar} aria-label="Fechar" data-fechar>×</button>
        </div>
        {children}
        {rodape && <div className="camada-rodape">{rodape}</div>}
      </div>
    </div>
  )
}
