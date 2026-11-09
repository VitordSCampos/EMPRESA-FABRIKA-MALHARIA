// Tabela padrão do sistema: busca, filtro por status, ordenação por coluna,
// paginação, estado vazio e linhas clicáveis.
//
// Exemplo mínimo:
//   <DataTable
//     colunas={[
//       { chave: "codigo", titulo: "Código" },
//       { chave: "nome", titulo: "Tecido" },
//       { chave: "preco", titulo: "Preço / m", render: (t) => formatarMoeda(t.preco) },
//     ]}
//     linhas={tecidos}
//     idDaLinha={(t) => t.codigo}
//     aoClicarLinha={(t) => abrirDetalhe(t)}
//   />

import { useMemo, useState, type KeyboardEvent, type ReactNode } from "react"
import { EstadoVazio } from "./EstadoVazio"

export interface Coluna<T> {
  /** Nome do campo da linha (usado em busca e ordenação) */
  chave: string
  titulo: string
  /** Como desenhar a célula. Se omitido, mostra linha[chave]. */
  render?: (linha: T) => ReactNode
  /** Valor usado para ordenar/buscar quando `render` formata o dado. Padrão: linha[chave]. */
  valor?: (linha: T) => string | number
  /** Desligue com false para colunas que não ordenam (ex.: ações). */
  ordenavel?: boolean
}

interface DataTableProps<T> {
  colunas: Coluna<T>[]
  linhas: T[]
  idDaLinha: (linha: T) => string
  placeholderBusca?: string
  /** Mostra um filtro por status. Ex.: { rotulo: "Status", valor: (l) => l.status } */
  filtroStatus?: { rotulo: string; valor: (linha: T) => string }
  /** Botões à direita da barra (ex.: "Atualizar") */
  acoes?: ReactNode
  porPagina?: number
  aoClicarLinha?: (linha: T) => void
  textoVazio?: string
}

type Direcao = "asc" | "desc"

export function DataTable<T extends object>({
  colunas,
  linhas,
  idDaLinha,
  placeholderBusca = "Buscar...",
  filtroStatus,
  acoes,
  porPagina = 8,
  aoClicarLinha,
  textoVazio = "Nenhum registro encontrado",
}: DataTableProps<T>) {
  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("Todos")
  const [ordem, setOrdem] = useState<{ chave: string; direcao: Direcao } | null>(null)
  const [pagina, setPagina] = useState(1)

  const valorDe = (linha: T, c: Coluna<T>): string | number => {
    if (c.valor) return c.valor(linha)
    const bruto = (linha as Record<string, unknown>)[c.chave]
    return typeof bruto === "number" ? bruto : String(bruto ?? "")
  }

  const opcoesStatus = useMemo(
    () => (filtroStatus ? Array.from(new Set(linhas.map(filtroStatus.valor))) : []),
    [linhas, filtroStatus],
  )

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    let resultado = linhas.filter((l) => {
      const passaBusca = termo === "" || colunas.some((c) => String(valorDe(l, c)).toLowerCase().includes(termo))
      const passaStatus = !filtroStatus || status === "Todos" || filtroStatus.valor(l) === status
      return passaBusca && passaStatus
    })
    if (ordem) {
      const coluna = colunas.find((c) => c.chave === ordem.chave)
      if (coluna) {
        const fator = ordem.direcao === "asc" ? 1 : -1
        resultado = [...resultado].sort((a, b) => {
          const va = valorDe(a, coluna)
          const vb = valorDe(b, coluna)
          if (typeof va === "number" && typeof vb === "number") return (va - vb) * fator
          return String(va).localeCompare(String(vb), "pt-BR", { numeric: true }) * fator
        })
      }
    }
    return resultado
  }, [linhas, colunas, busca, status, ordem, filtroStatus])

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const visiveis = filtradas.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina)

  const alternarOrdem = (chave: string) => {
    setOrdem((atual) => {
      if (!atual || atual.chave !== chave) return { chave, direcao: "asc" }
      if (atual.direcao === "asc") return { chave, direcao: "desc" }
      return null
    })
  }

  const aoTeclarLinha = (e: KeyboardEvent, linha: T) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      aoClicarLinha?.(linha)
    }
  }

  return (
    <div className="card tabela-card">
      <div className="tabela-ferramentas">
        <div className="tabela-busca">
          <label className="somente-leitor-de-tela" htmlFor="busca-tabela">{placeholderBusca}</label>
          <input
            id="busca-tabela"
            type="search"
            placeholder={placeholderBusca}
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
          />
        </div>
        {filtroStatus && (
          <div className="tabela-filtro">
            <label className="somente-leitor-de-tela" htmlFor="filtro-status">{filtroStatus.rotulo}</label>
            <select id="filtro-status" value={status} onChange={(e) => { setStatus(e.target.value); setPagina(1) }}>
              <option>Todos</option>
              {opcoesStatus.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        )}
        {acoes && <div className="tabela-acoes">{acoes}</div>}
      </div>

      {filtradas.length === 0 ? (
        <EstadoVazio titulo={textoVazio} texto="Tente ajustar a busca ou o filtro." />
      ) : (
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                {colunas.map((c) => {
                  const ordenavel = c.ordenavel !== false
                  const ativa = ordem?.chave === c.chave
                  return (
                    <th key={c.chave} scope="col" aria-sort={ativa ? (ordem!.direcao === "asc" ? "ascending" : "descending") : undefined}>
                      {ordenavel ? (
                        <button onClick={() => alternarOrdem(c.chave)}>
                          {c.titulo} <span aria-hidden="true">{ativa ? (ordem!.direcao === "asc" ? "↑" : "↓") : "↕"}</span>
                        </button>
                      ) : c.titulo}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((linha) => (
                <tr
                  key={idDaLinha(linha)}
                  className={aoClicarLinha ? "clicavel" : undefined}
                  tabIndex={aoClicarLinha ? 0 : undefined}
                  onClick={aoClicarLinha ? () => aoClicarLinha(linha) : undefined}
                  onKeyDown={aoClicarLinha ? (e) => aoTeclarLinha(e, linha) : undefined}
                >
                  {colunas.map((c) => (
                    <td key={c.chave}>{c.render ? c.render(linha) : String(valorDe(linha, c))}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="tabela-rodape">
        <span>Mostrando {visiveis.length} de {filtradas.length} registros</span>
        {totalPaginas > 1 && (
          <nav className="paginacao" aria-label="Paginação">
            <button onClick={() => setPagina(paginaAtual - 1)} disabled={paginaAtual === 1} aria-label="Página anterior">‹</button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPagina(n)} aria-current={n === paginaAtual ? "page" : undefined} aria-label={`Página ${n}`}>{n}</button>
            ))}
            <button onClick={() => setPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas} aria-label="Próxima página">›</button>
          </nav>
        )}
      </div>
    </div>
  )
}
