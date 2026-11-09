import { rotas } from "@/app/menu"
import { Link, casar } from "@/app/router"

/** Trilha de navegação: Grupo / Tela (/ Subtela). Montada a partir de menu.ts. */
export function Breadcrumb({ caminho }: { caminho: string }) {
  const meta = rotas.find((r) => casar(r.path, caminho))
  if (!meta) return <nav className="breadcrumb" aria-label="Você está em"><strong aria-current="page">Fabrika</strong></nav>

  const pai = meta.pai ? rotas.find((r) => r.path === meta.pai) : undefined

  return (
    <nav className="breadcrumb" aria-label="Você está em">
      <span className="nivel-intermediario">{meta.grupo}</span>
      <span className="separador nivel-intermediario" aria-hidden="true">/</span>
      {pai && (
        <>
          <Link para={pai.path} className="nivel-intermediario">{pai.titulo}</Link>
          <span className="separador" aria-hidden="true">/</span>
        </>
      )}
      <span aria-current="page">{meta.titulo}</span>
    </nav>
  )
}
