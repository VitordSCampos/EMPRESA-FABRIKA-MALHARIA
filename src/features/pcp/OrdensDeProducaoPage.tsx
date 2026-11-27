import { useEffect, useMemo, useState } from "react"
import { navegar } from "@/app/router"
import {
  carregarPedidos,
  formatarData,
  PEDIDOS_ATUALIZADOS_EVENT,
  PEDIDOS_STORAGE_KEY,
  dataHojeISO,
  type Pedido,
} from "@/features/comercial/pedidosStore"

/** Contrato de apresentação da OP. Os campos de PCP serão preenchidos pela integração produtiva. */
export interface OrdemDeProducao {
  /** Identifica linha (pedido + item). */
  id: string
  /** Número legível do pedido que originou a demanda. */
  numero?: string
  pedidoId?: string
  cliente?: string
  produto?: string
  quantidade?: number
  prazo?: string
  status?: string
  progresso?: number
  grade?: string
  residuoPrevisto?: {
    quantidade: number
    unidade: string
  }
  materiais?: MaterialDaOrdem[]
  etapas?: EtapaDaOrdem[]
  apontamentos?: ApontamentoDaOrdem[]
  observacaoPedido?: string
  fichaTecnica?: {
    codigo: string
    produto: string
    versao?: string
    status?: string
  } | null
  liberacao?: {
    permitida: boolean
    motivo?: string
  }
}

export interface MaterialDaOrdem {
  id: string
  nome: string
  unidade?: string
  quantidadeNecessaria?: number
  quantidadeDisponivel?: number
  situacao?: string
}

export interface EtapaDaOrdem {
  id: string
  nome: string
  status?: string
  responsavel?: string
  inicio?: string
  previsao?: string
  conclusao?: string
}

export interface ApontamentoDaOrdem {
  id: string
  etapa?: string
  operador?: string
  dataHora?: string
  quantidadeProduzida?: number
  perdas?: number
  observacoes?: string
}

interface OrdensDeProducaoPageProps {
  /** Permite que uma futura API forneça as OPs sem alterar a apresentação. */
  ordens?: readonly OrdemDeProducao[]
  onNavigate?: (id: string) => void
}

function formatarNumero(valor?: number, casas = 0) {
  if (valor === undefined || valor === null || Number.isNaN(valor)) return "—"
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  })
}

/**
 * Cada item de um pedido comercial representa uma linha de demanda produtiva.
 * Não são criados percentuais, etapas ou dados de estoque sem apontamento real.
 */
function converterPedidosEmOrdens(pedidos: readonly Pedido[]): OrdemDeProducao[] {
  return pedidos.flatMap((pedido) =>
    pedido.itens
      .filter((item) => Boolean(item.produto?.trim()))
      .map((item) => ({
        id: `${pedido.id}:${item.id}`,
        numero: pedido.id,
        pedidoId: pedido.id,
        cliente: pedido.cliente,
        produto: item.produto,
        quantidade: Number(item.quantidade),
        prazo: pedido.dataEntrega ? formatarData(pedido.dataEntrega) : undefined,
        status: Boolean(pedido.dataEntrega) && pedido.dataEntrega < dataHojeISO() && !["Pronto", "Entregue"].includes(pedido.status)
          ? "Atrasada"
          : pedido.status,
        observacaoPedido: pedido.observacao,
        fichaTecnica: item.fichaTecnica,
      })),
  )
}

function classeDoStatus(status: string) {
  const normalizado = status.trim().toLocaleLowerCase("pt-BR")
  if (normalizado.includes("atras")) return "op-status-pill--alerta"
  if (
    normalizado.includes("conclu") ||
    normalizado.includes("pronto") ||
    normalizado.includes("entregue")
  ) return "op-status-pill--concluida"
  return "op-status-pill--neutro"
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <span className="op-no-value">—</span>
  return <span className={`op-status-pill ${classeDoStatus(status)}`}>{status}</span>
}

function Progresso({ valor }: { valor?: number }) {
  if (valor === undefined || valor === null || Number.isNaN(valor)) {
    return <span className="op-no-value">—</span>
  }

  const progressoLimitado = Math.min(100, Math.max(0, valor))
  return (
    <div className="op-progress-cell">
      <div
        className="op-progress-track"
        role="progressbar"
        aria-label="Progresso da ordem de produção"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressoLimitado}
      >
        <span style={{ width: `${progressoLimitado}%` }} />
      </div>
      <span className="op-progress-value">{formatarNumero(progressoLimitado)}%</span>
    </div>
  )
}

function TabelaOrdens({
  ordens,
  aoAbrir,
}: {
  ordens: readonly OrdemDeProducao[]
  aoAbrir: (ordem: OrdemDeProducao) => void
}) {
  return (
    <section className="op-table-card" aria-label="Ordens de produção cadastradas">
      <div className="op-table-scroll">
        <table className="op-table">
          <colgroup>
            <col className="op-col-pedido" />
            <col className="op-col-cliente" />
            <col className="op-col-produto" />
            <col className="op-col-quantidade" />
            <col className="op-col-prazo" />
            <col className="op-col-status" />
            <col className="op-col-progresso" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">Pedido</th>
              <th scope="col">Cliente</th>
              <th scope="col">Produto</th>
              <th scope="col">Quantidade</th>
              <th scope="col">Prazo</th>
              <th scope="col">Status</th>
              <th scope="col">Progresso</th>
            </tr>
          </thead>
          <tbody>
            {ordens.length === 0 ? (
              <tr className="op-empty-row">
                <td colSpan={7}>
                  <div className="op-empty-state">
                    <span className="op-empty-mark" aria-hidden="true">—</span>
                    <strong>Nenhuma ordem de produção cadastrada</strong>
                    <p>Os pedidos cadastrados na área Comercial aparecerão aqui automaticamente.</p>
                  </div>
                </td>
              </tr>
            ) : (
              ordens.map((ordem) => (
                <tr
                  key={ordem.id}
                  tabIndex={0}
                  onClick={() => aoAbrir(ordem)}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault()
                      aoAbrir(ordem)
                    }
                  }}
                  aria-label={`Abrir detalhes do pedido ${ordem.numero || ordem.id}`}
                >
                  <td>
                    <button
                      className="op-order-link"
                      type="button"
                      onClick={(evento) => {
                        evento.stopPropagation()
                        aoAbrir(ordem)
                      }}
                      aria-label={`Abrir detalhes do pedido ${ordem.numero || ordem.id}`}
                    >
                      #{ordem.numero || ordem.id}
                    </button>
                  </td>
                  <td>{ordem.cliente || "—"}</td>
                  <td>{ordem.produto || "—"}</td>
                  <td>{formatarNumero(ordem.quantidade)}</td>
                  <td>{ordem.prazo || "—"}</td>
                  <td><StatusBadge status={ordem.status} /></td>
                  <td><Progresso valor={ordem.progresso} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function DetalheOrdemDrawer({
  ordem,
  aoFechar,
}: {
  ordem: OrdemDeProducao
  aoFechar: () => void
}) {
  const grade = ordem.grade || "—"
  const residuo = ordem.residuoPrevisto
    ? `${formatarNumero(ordem.residuoPrevisto.quantidade, 1)} ${ordem.residuoPrevisto.unidade}`
    : "—"

  return (
    <>
      <button className="op-drawer-backdrop" type="button" onClick={aoFechar} aria-label="Fechar detalhes da ordem" />
      <aside className="op-side-drawer" role="dialog" aria-modal="true" aria-labelledby="op-drawer-title">
        <div className="op-drawer-scroll">
          <header className="op-drawer-header">
            <div>
              <small>ORDEM DE PRODUÇÃO · #{ordem.numero || ordem.id}</small>
              <h2 id="op-drawer-title">{ordem.produto || "Detalhes da ordem de produção"}</h2>
            </div>
            <button className="op-drawer-close" type="button" onClick={aoFechar} aria-label="Fechar">×</button>
          </header>

          <div className="op-order-summary">
            <div>
              <small>Quantidade</small>
              <strong>{ordem.quantidade === undefined ? "—" : `${formatarNumero(ordem.quantidade)} peças`}</strong>
            </div>
            <div>
              <small>Grade</small>
              <strong>{grade}</strong>
            </div>
            <div>
              <small>Resíduo previsto</small>
              <strong>{residuo}</strong>
            </div>
          </div>

          <section className="op-drawer-section">
            <div className="op-section-heading">
              <h3>Necessidade de materiais</h3>
            </div>
            {ordem.materiais?.length ? (
              <div className="op-material-list">
                {ordem.materiais.map((material) => (
                  <div className="op-material-row" key={material.id}>
                    <div>
                      <strong>{material.nome}</strong>
                      <p>
                        {material.quantidadeNecessaria === undefined
                          ? "Quantidade necessária não informada"
                          : `${formatarNumero(material.quantidadeNecessaria)} ${material.unidade || "un."} necessários`}
                        {material.quantidadeDisponivel !== undefined
                          ? ` · ${formatarNumero(material.quantidadeDisponivel)} ${material.unidade || "un."} disponíveis`
                          : ""}
                      </p>
                    </div>
                    {material.situacao && <span className="op-material-status">{material.situacao}</span>}
                  </div>
                ))}
              </div>
            ) : null}
          </section>

          {ordem.liberacao?.permitida === false && ordem.liberacao.motivo && (
            <div className="op-release-warning" role="status">{ordem.liberacao.motivo}</div>
          )}

          <section className="op-drawer-section">
            <div className="op-section-heading">
              <h3>Etapas de produção</h3>
            </div>
            <ol className="op-stage-timeline" aria-label="Roteiro de produção">
              {((ordem.etapas?.length
                ? ordem.etapas
                : ["Corte", "Malharia", "Costura", "Beneficiamento", "Acabamento", "Expedição"].map((nome, indice) => ({ id: `modelo-${indice}`, nome }))
              ) as EtapaDaOrdem[]).map((etapa) => {
                const statusEtapa = (etapa.status || "").toLocaleLowerCase("pt-BR")
                const concluida = Boolean(etapa.conclusao) || statusEtapa.includes("conclu")
                const emAndamento = statusEtapa.includes("andamento") || statusEtapa.includes("execução")
                return (
                  <li className={concluida ? "is-complete" : emAndamento ? "is-current" : ""} key={etapa.id}>
                    <span className="op-timeline-dot" aria-hidden="true">{concluida ? "✓" : ""}</span>
                    <span className="op-timeline-label">{etapa.nome}</span>
                    {(etapa.responsavel || etapa.previsao || etapa.conclusao) && (
                      <span className="op-timeline-detail">
                        {[etapa.responsavel, etapa.previsao ? `Previsão: ${etapa.previsao}` : "", etapa.conclusao ? `Conclusão: ${etapa.conclusao}` : ""].filter(Boolean).join(" · ")}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

        </div>
      </aside>
    </>
  )
}

export default function OrdensDeProducaoPage({
  ordens,
  onNavigate,
}: OrdensDeProducaoPageProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => carregarPedidos())
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemDeProducao | null>(null)

  useEffect(() => {
    const atualizarPedidos = () => setPedidos(carregarPedidos())
    const sincronizarOutraAba = (evento: StorageEvent) => {
      if (evento.key === PEDIDOS_STORAGE_KEY || evento.key === null) atualizarPedidos()
    }

    window.addEventListener(PEDIDOS_ATUALIZADOS_EVENT, atualizarPedidos)
    window.addEventListener("storage", sincronizarOutraAba)
    return () => {
      window.removeEventListener(PEDIDOS_ATUALIZADOS_EVENT, atualizarPedidos)
      window.removeEventListener("storage", sincronizarOutraAba)
    }
  }, [])

  const ordensDosPedidos = useMemo(() => converterPedidosEmOrdens(pedidos), [pedidos])
  const ordensParaExibir = ordens ?? ordensDosPedidos

  const navegarParaModulo = (id: "Apontamento" | "Máquinas") => {
    if (onNavigate) {
      onNavigate(id)
      return
    }
    navegar(id === "Apontamento" ? "/producao/apontamento" : "/producao/maquinas")
  }

  return (
    <div className="module-page op-module-page">
      <header className="module-title-row op-title-row">
        <div>
          <p className="eyebrow module-eyebrow">Produção</p>
          <h1>Ordens de produção</h1>
          <p>Acompanhe todos os pedidos e suas etapas produtivas.</p>
        </div>
      </header>

      <div className="op-navigation-bar">
        <nav className="op-section-tabs" aria-label="Módulos de produção">
          <button className="is-active" type="button" aria-current="page">Ordens</button>
          <button type="button" onClick={() => navegarParaModulo("Apontamento")}>Apontamento</button>
          <button type="button" onClick={() => navegarParaModulo("Máquinas")}>Máquinas</button>
        </nav>
      </div>

      <TabelaOrdens ordens={ordensParaExibir} aoAbrir={setOrdemSelecionada} />

      {ordemSelecionada && (
        <DetalheOrdemDrawer
          ordem={ordemSelecionada}
          aoFechar={() => setOrdemSelecionada(null)}
        />
      )}
    </div>
  )
}
