import { gruposDoMenu, rotas } from "@/app/menu"
import { Link, casar } from "@/app/router"
import { Icon } from "../Icon"

interface SidebarProps {
  caminho: string
  aberta: boolean
  aoFechar: () => void
}

export function Sidebar({ caminho, aberta, aoFechar }: SidebarProps) {
  // Rotas internas (ex.: "Nova ficha") deixam ativo o item do pai.
  const atual = rotas.find((r) => casar(r.path, caminho))
  const caminhoAtivo = atual?.pai ?? atual?.path ?? caminho

  return (
    <>
      <aside className={aberta ? "sidebar aberta" : "sidebar"} aria-label="Menu principal">
        <div className="marca">
          <div className="marca-simbolo" aria-hidden="true">F</div>
          <div>
            <b>fabrika</b>
            <span>produção inteligente</span>
          </div>
          <button className="fechar-menu" onClick={aoFechar} aria-label="Fechar menu">×</button>
        </div>

        <nav className="sidebar-nav">
          {gruposDoMenu().map((grupo) => (
            <div className="nav-grupo" key={grupo.titulo}>
              <p className="nav-grupo-titulo">{grupo.titulo}</p>
              {grupo.itens.map((item) => (
                <Link
                  key={item.path}
                  para={item.path}
                  className="nav-link"
                  aria-current={item.path === caminhoAtivo ? "page" : undefined}
                >
                  <Icon nome={item.icone} />
                  <span>{item.titulo}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-rodape">
          <div className="usuario">
            <div className="avatar" aria-hidden="true">AM</div>
            <div>
              <b>Ana Martins</b>
              <span>Gestora</span>
            </div>
          </div>
        </div>
      </aside>
      {aberta && <button className="sidebar-fundo" onClick={aoFechar} aria-label="Fechar menu" />}
    </>
  )
}
