import { useState } from "react"
import { Link } from "@/app/router"
import { Botao } from "../Botao"
import { Icon } from "../Icon"
import { Breadcrumb } from "./Breadcrumb"

interface TopbarProps {
  caminho: string
  aoAbrirMenu: () => void
}

export function Topbar({ caminho, aoAbrirMenu }: TopbarProps) {
  const [alertasAbertos, setAlertasAbertos] = useState(false)

  return (
    <header className="topbar">
      <div className="topbar-esquerda">
        <Botao variante="icone" className="botao-menu" onClick={aoAbrirMenu} aria-label="Abrir menu">
          <Icon nome="menu" />
        </Botao>
        <Breadcrumb caminho={caminho} />
      </div>

      <div className="topbar-acoes">
        {/* TODO(F1/F8): ligar a busca global quando houver módulos com dados reais */}
        <div className="busca-global">
          <label className="somente-leitor-de-tela" htmlFor="busca-global">Buscar no sistema</label>
          <input id="busca-global" type="search" placeholder="Buscar no sistema..." />
        </div>
        <div className="status-sync"><i aria-hidden="true" /><span>Dados sincronizados</span></div>
        <Botao
          variante="icone"
          onClick={() => setAlertasAbertos((v) => !v)}
          aria-label="Notificações"
          aria-expanded={alertasAbertos}
        >
          <Icon nome="bell" />
        </Botao>
        {alertasAbertos && (
          <div className="popover" role="region" aria-label="Alertas">
            <span className="popover-titulo">ALERTAS</span>
            <Link para="/suprimentos/estoque" className="popover-item" onClick={() => setAlertasAbertos(false)}>
              <b>3 itens com estoque baixo</b>
              <small>Ver no Estoque →</small>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
