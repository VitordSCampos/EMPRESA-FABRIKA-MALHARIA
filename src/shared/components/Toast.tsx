// Mensagens rápidas de confirmação ("Ficha salva com sucesso").
// Uso: const { mostrar } = useToast();  mostrar("Salvo", "A versão 1.0 foi salva.")

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { Icon } from "./Icon"

interface ToastItem { id: number; titulo: string; detalhe?: string }
interface ToastApi { mostrar: (titulo: string, detalhe?: string) => void }

const ToastContext = createContext<ToastApi | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ToastItem[]>([])
  const proximoId = useRef(1)

  const mostrar = useCallback((titulo: string, detalhe?: string) => {
    const id = proximoId.current++
    setItens((atual) => [...atual, { id, titulo, detalhe }])
    window.setTimeout(() => setItens((atual) => atual.filter((t) => t.id !== id)), 3200)
  }, [])

  const api = useMemo(() => ({ mostrar }), [mostrar])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {itens.map((t) => (
          <div className="toast" key={t.id}>
            <div className="toast-icone"><Icon nome="check" tamanho={24} /></div>
            <span>
              <b>{t.titulo}</b>
              {t.detalhe && <small>{t.detalhe}</small>}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>")
  return ctx
}
