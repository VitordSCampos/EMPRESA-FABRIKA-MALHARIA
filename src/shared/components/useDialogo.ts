import { useEffect, useRef } from "react"

/** Comportamento comum de Modal e Drawer: fecha com Esc, leva o foco para dentro
 *  ao abrir e devolve o foco ao botão que abriu quando fecha. */
export function useDialogo(aberto: boolean, aoFechar: () => void) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!aberto) return
    const anterior = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>("input, select, textarea, button:not([data-fechar])")?.focus()
    if (!ref.current?.contains(document.activeElement)) ref.current?.focus()

    const aoTeclar = (e: KeyboardEvent) => { if (e.key === "Escape") aoFechar() }
    document.addEventListener("keydown", aoTeclar)
    return () => {
      document.removeEventListener("keydown", aoTeclar)
      anterior?.focus()
    }
  }, [aberto, aoFechar])

  return ref
}
