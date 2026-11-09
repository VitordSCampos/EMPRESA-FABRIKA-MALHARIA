import { useId, type KeyboardEvent } from "react"

export interface Aba { id: string; rotulo: string }

interface TabsProps {
  abas: Aba[]
  ativa: string
  aoMudar: (id: string) => void
  rotuloAcessivel?: string
}

/** Abas controladas. Quem usa guarda a aba ativa em um useState e mostra o conteúdo.
 *  Setas ← → trocam de aba pelo teclado. */
export function Tabs({ abas, ativa, aoMudar, rotuloAcessivel = "Seções" }: TabsProps) {
  const base = useId()

  const aoTeclar = (e: KeyboardEvent, indice: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    const passo = e.key === "ArrowRight" ? 1 : -1
    const proxima = abas[(indice + passo + abas.length) % abas.length]
    aoMudar(proxima.id)
    document.getElementById(`${base}-${proxima.id}`)?.focus()
  }

  return (
    <div className="abas" role="tablist" aria-label={rotuloAcessivel}>
      {abas.map((aba, i) => (
        <button
          key={aba.id}
          id={`${base}-${aba.id}`}
          className="aba"
          role="tab"
          aria-selected={ativa === aba.id}
          tabIndex={ativa === aba.id ? 0 : -1}
          onClick={() => aoMudar(aba.id)}
          onKeyDown={(e) => aoTeclar(e, i)}
        >
          {aba.rotulo}
        </button>
      ))}
    </div>
  )
}
