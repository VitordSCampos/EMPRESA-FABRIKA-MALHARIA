// Roteador mínimo baseado em hash (#/caminho). Sem biblioteca externa.
// Vantagem: funciona em qualquer hospedagem estática, sem configurar servidor.
// Se o time quiser trocar por react-router depois, só este arquivo muda.

import { createContext, useContext, useSyncExternalStore, type AnchorHTMLAttributes } from "react"

function lerCaminho(): string {
  const bruto = window.location.hash.replace(/^#/, "").split("?")[0]
  return bruto === "" ? "/" : bruto
}

function assinar(aoMudar: () => void) {
  window.addEventListener("hashchange", aoMudar)
  return () => window.removeEventListener("hashchange", aoMudar)
}

/** Caminho atual, ex.: "/cadastro/tecidos". Atualiza o componente ao navegar. */
export function useCaminho(): string {
  return useSyncExternalStore(assinar, lerCaminho, () => "/")
}

/** Navega por código, ex.: navegar("/financas/precificacao"). */
export function navegar(caminho: string) {
  window.location.hash = caminho
}

/** Compara um padrão ("/pedidos/:id") com um caminho. Retorna os parâmetros ou null. */
export function casar(padrao: string, caminho: string): Record<string, string> | null {
  const a = padrao.split("/").filter(Boolean)
  const b = caminho.split("/").filter(Boolean)
  if (a.length !== b.length) return null
  const params: Record<string, string> = {}
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i])
    else if (a[i] !== b[i]) return null
  }
  return params
}

const ParamsContext = createContext<Record<string, string>>({})
export const ParamsProvider = ParamsContext.Provider
/** Parâmetros da rota atual, ex.: const { id } = useParams() */
export const useParams = () => useContext(ParamsContext)

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  para: string
}

/** Link interno. Use no lugar de <a href>. */
export function Link({ para, children, ...resto }: LinkProps) {
  return <a href={`#${para}`} {...resto}>{children}</a>
}
