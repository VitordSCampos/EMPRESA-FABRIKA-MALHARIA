// Casca de todas as telas: sidebar fixa + topbar + área de conteúdo.
// As telas aparecem dentro de {children} (ver App.tsx).

import { useEffect, useState, type ReactNode } from "react"
import { useCaminho } from "@/app/router"
import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"

export function Layout({ children }: { children: ReactNode }) {
  const caminho = useCaminho()
  const [menuAberto, setMenuAberto] = useState(false)

  // Fecha o menu (versão mobile) ao trocar de tela e leva o scroll ao topo.
  useEffect(() => {
    setMenuAberto(false)
    window.scrollTo(0, 0)
  }, [caminho])

  return (
    <div className="app-shell">
      {/* Link de atalho para teclado. Usa onClick (e não href="#...") porque o roteador usa o hash da URL. */}
      <a
        href="#/"
        className="pular-conteudo"
        onClick={(e) => { e.preventDefault(); document.getElementById("conteudo-principal")?.focus() }}
      >
        Pular para o conteúdo
      </a>
      <Sidebar caminho={caminho} aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <div className="conteudo">
        <Topbar caminho={caminho} aoAbrirMenu={() => setMenuAberto(true)} />
        <main id="conteudo-principal" tabIndex={-1}>{children}</main>
      </div>
    </div>
  )
}
