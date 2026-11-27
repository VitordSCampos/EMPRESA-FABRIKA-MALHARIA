import { useEffect, useMemo, useState, type FormEvent } from "react"

type StatusApontamento = "Em andamento" | "Pausado" | "Finalizado"
type FiltroStatus = "Todos" | StatusApontamento

type ApontamentoForm = {
  ordemProducao: string
  etapa: string
  operador: string
  identificacaoOperador: string
  maquina: string
  data: string
  horaInicio: string
  horaFim: string
  quantidadeProduzida: string
  unidadeProduzida: string
  quantidadeAprovada: string
  quantidadeDefeituosa: string
  tipoPerda: string
  quantidadePerda: string
  unidadePerda: string
  quantidadeSobra: string
  unidadeSobra: string
  status: StatusApontamento | ""
  identificacaoConferida: boolean
  responsavelConferencia: string
  observacoes: string
}

type Apontamento = Omit<ApontamentoForm, "status"> & {
  status: StatusApontamento
  id: string
  criadoEm: string
  atualizadoEm: string
}

const STORAGE_KEY = "fabrika:apontamentos:v1"
const STATUS: StatusApontamento[] = ["Em andamento", "Pausado", "Finalizado"]

const FORM_VAZIO: ApontamentoForm = {
  ordemProducao: "",
  etapa: "",
  operador: "",
  identificacaoOperador: "",
  maquina: "",
  data: "",
  horaInicio: "",
  horaFim: "",
  quantidadeProduzida: "",
  unidadeProduzida: "",
  quantidadeAprovada: "",
  quantidadeDefeituosa: "",
  tipoPerda: "",
  quantidadePerda: "",
  unidadePerda: "",
  quantidadeSobra: "",
  unidadeSobra: "",
  status: "",
  identificacaoConferida: false,
  responsavelConferencia: "",
  observacoes: "",
}

function lerApontamentos(): Apontamento[] {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) return []
    const dados: unknown = JSON.parse(salvo)
    return Array.isArray(dados) ? (dados as Apontamento[]) : []
  } catch {
    return []
  }
}

function gerarId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `apontamento-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

function statusClasse(status: StatusApontamento) {
  if (status === "Pausado") return "pausado"
  if (status === "Finalizado") return "finalizado"
  return "andamento"
}

function valorOuTraco(valor: string) {
  return valor.trim() || "—"
}

function quantidadeComUnidade(quantidade: string, unidade: string) {
  if (!quantidade.trim()) return "—"
  return unidade.trim() ? `${quantidade} ${unidade.trim()}` : quantidade
}

function calcularTempo(inicio: string, fim: string) {
  if (!inicio || !fim) return "—"
  const [horaInicio, minutoInicio] = inicio.split(":").map(Number)
  const [horaFim, minutoFim] = fim.split(":").map(Number)
  if ([horaInicio, minutoInicio, horaFim, minutoFim].some(Number.isNaN)) return "—"

  let minutos = horaFim * 60 + minutoFim - (horaInicio * 60 + minutoInicio)
  if (minutos < 0) minutos += 24 * 60
  const horas = Math.floor(minutos / 60).toString().padStart(2, "0")
  const resto = (minutos % 60).toString().padStart(2, "0")
  return `${horas}:${resto}`
}

function dataLegivel(valor: string) {
  if (!valor) return "Não informada"
  const [ano, mes, dia] = valor.split("-")
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : valor
}

function dataHoraLegivel(valor: string) {
  const data = new Date(valor)
  if (Number.isNaN(data.getTime())) return "Não disponível"
  return data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

function campoTexto(
  setForm: (atualizar: (anterior: ApontamentoForm) => ApontamentoForm) => void,
  chave: keyof ApontamentoForm,
  valor: string,
) {
  setForm((anterior) => ({ ...anterior, [chave]: valor }))
}

export default function ApontamentoPage({ onNavigate = () => {} }: { onNavigate?: (id: string) => void }) {
  const [registros, setRegistros] = useState<Apontamento[]>(lerApontamentos)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("Todos")
  const [modalAberto, setModalAberto] = useState(false)
  const [form, setForm] = useState<ApontamentoForm>(FORM_VAZIO)
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null)
  const [registroSelecionado, setRegistroSelecionado] = useState<Apontamento | null>(null)
  const [erro, setErro] = useState("")
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
    } catch {
      setMensagem("Não foi possível manter os registros neste navegador.")
    }
  }, [registros])

  const registrosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR")
    return registros
      .filter((registro) => filtroStatus === "Todos" || registro.status === filtroStatus)
      .filter((registro) => {
        if (!termo) return true
        return [
          registro.ordemProducao,
          registro.etapa,
          registro.operador,
          registro.maquina,
          registro.identificacaoOperador,
        ].some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo))
      })
      .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
  }, [registros, busca, filtroStatus])

  function abrirNovo() {
    setRegistroSelecionado(null)
    setIdEmEdicao(null)
    setForm({ ...FORM_VAZIO })
    setErro("")
    setModalAberto(true)
  }

  function abrirEdicao(registro: Apontamento) {
    setRegistroSelecionado(null)
    setIdEmEdicao(registro.id)
    setForm({
      ordemProducao: registro.ordemProducao,
      etapa: registro.etapa,
      operador: registro.operador,
      identificacaoOperador: registro.identificacaoOperador,
      maquina: registro.maquina,
      data: registro.data,
      horaInicio: registro.horaInicio,
      horaFim: registro.horaFim,
      quantidadeProduzida: registro.quantidadeProduzida,
      unidadeProduzida: registro.unidadeProduzida,
      quantidadeAprovada: registro.quantidadeAprovada,
      quantidadeDefeituosa: registro.quantidadeDefeituosa,
      tipoPerda: registro.tipoPerda,
      quantidadePerda: registro.quantidadePerda,
      unidadePerda: registro.unidadePerda,
      quantidadeSobra: registro.quantidadeSobra,
      unidadeSobra: registro.unidadeSobra,
      status: registro.status,
      identificacaoConferida: registro.identificacaoConferida,
      responsavelConferencia: registro.responsavelConferencia,
      observacoes: registro.observacoes,
    })
    setErro("")
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setIdEmEdicao(null)
    setErro("")
  }

  function salvarApontamento(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setErro("")

    if (!form.ordemProducao.trim() || !form.etapa.trim() || !form.operador.trim()) {
      setErro("Preencha a OP, a etapa e o operador para continuar.")
      return
    }
    if (!form.quantidadeProduzida.trim() || Number(form.quantidadeProduzida) < 0 || !Number.isFinite(Number(form.quantidadeProduzida))) {
      setErro("Informe uma quantidade produzida válida.")
      return
    }
    if (!form.status) {
      setErro("Selecione o status do apontamento.")
      return
    }

    const agora = new Date().toISOString()
    if (idEmEdicao) {
      setRegistros((atuais) => atuais.map((registro) => registro.id === idEmEdicao
        ? { ...registro, ...form, status: form.status as StatusApontamento, atualizadoEm: agora }
        : registro))
      setMensagem("Apontamento atualizado neste navegador.")
    } else {
      const novoRegistro: Apontamento = {
        ...form,
        status: form.status as StatusApontamento,
        id: gerarId(),
        criadoEm: agora,
        atualizadoEm: agora,
      }
      setRegistros((atuais) => [novoRegistro, ...atuais])
      setMensagem("Apontamento adicionado neste navegador.")
    }

    fecharModal()
  }

  function limparFiltros() {
    setBusca("")
    setFiltroStatus("Todos")
  }

  const tituloModal = idEmEdicao ? "Editar apontamento" : "Novo apontamento"

  return (
    <div className="module-page apontamento-page">
      <div className="apontamento-heading">
        <div>
          <p className="module-eyebrow">PRODUÇÃO</p>
          <h1>Apontamento</h1>
          <p>Registre a produção executada por ordem, etapa, operador e máquina.</p>
        </div>
        <button className="fabrika-primary apontamento-new-button" type="button" onClick={abrirNovo}>
          <span aria-hidden="true">＋</span> Novo apontamento
        </button>
      </div>

      <nav className="apontamento-tabs" aria-label="Navegação da produção">
        <button type="button" onClick={() => onNavigate("Produção · Pedidos")}>Ordens</button>
        <button type="button" className="is-active" aria-current="page">Apontamento</button>
        <button type="button" onClick={() => onNavigate("Máquinas")}>Máquinas</button>
      </nav>

      <section className="fabrika-table-card apontamento-card" aria-label="Lista de apontamentos">
        <div className="apontamento-toolbar">
          <label className="apontamento-search">
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Buscar apontamentos"
              placeholder="Buscar por OP, etapa, operador ou máquina..."
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
          <div className="apontamento-filters">
            <label className="sr-only" htmlFor="apontamento-status-filtro">Filtrar por status</label>
            <select id="apontamento-status-filtro" value={filtroStatus} onChange={(evento) => setFiltroStatus(evento.target.value as FiltroStatus)}>
              <option value="Todos">Todos os status</option>
              {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="fabrika-secondary apontamento-clear-button" type="button" onClick={limparFiltros}>Limpar filtros</button>
          </div>
        </div>

        <div className="fabrika-table-scroll">
          <table className="fabrika-table apontamento-table">
            <thead>
              <tr>
                <th>OP</th>
                <th>Etapa</th>
                <th>Operador</th>
                <th>Máquina</th>
                <th>Produzido</th>
                <th>Defeitos</th>
                <th>Perdas</th>
                <th>Tempo</th>
                <th>Status</th>
                <th aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {registrosFiltrados.length ? registrosFiltrados.map((registro) => (
                <tr key={registro.id}>
                  <td><strong>{registro.ordemProducao}</strong></td>
                  <td>{registro.etapa}</td>
                  <td>{registro.operador}</td>
                  <td>{valorOuTraco(registro.maquina)}</td>
                  <td>{quantidadeComUnidade(registro.quantidadeProduzida, registro.unidadeProduzida)}</td>
                  <td>{valorOuTraco(registro.quantidadeDefeituosa)}</td>
                  <td>{quantidadeComUnidade(registro.quantidadePerda, registro.unidadePerda)}</td>
                  <td>{calcularTempo(registro.horaInicio, registro.horaFim)}</td>
                  <td><span className={`apontamento-status ${statusClasse(registro.status)}`}>{registro.status}</span></td>
                  <td>
                    <button className="apontamento-detail-button" type="button" onClick={() => setRegistroSelecionado(registro)}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} className="apontamento-empty-cell">
                    <div className="apontamento-empty-state">
                      <span className="apontamento-empty-icon" aria-hidden="true">✓</span>
                      <strong>{registros.length ? "Nenhum apontamento encontrado" : "Nenhum apontamento cadastrado"}</strong>
                      <p>{registros.length
                        ? "Não há registros que correspondam aos filtros informados. Ajuste a busca ou limpe os filtros."
                        : "Os apontamentos aparecerão aqui depois que a equipe registrar a execução das etapas de produção."}</p>
                      {registros.length
                        ? <button className="fabrika-secondary" type="button" onClick={limparFiltros}>Limpar filtros</button>
                        : <button className="fabrika-primary" type="button" onClick={abrirNovo}>＋ Novo apontamento</button>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="apontamento-table-footer">
          <span>Mostrando {registrosFiltrados.length} de {registros.length} {registros.length === 1 ? "registro" : "registros"}</span>
          <span>Armazenamento local neste navegador</span>
        </div>
      </section>

      <p className="apontamento-footnote">
        A tela organiza os registros no navegador. Integração com a API e validações definitivas devem seguir as regras da empresa.
      </p>

      {mensagem && (
        <div className="apontamento-toast" role="status">
          <span>{mensagem}</span>
          <button type="button" aria-label="Fechar aviso" onClick={() => setMensagem("")}>×</button>
        </div>
      )}

      {modalAberto && (
        <div className="apontamento-overlay" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) fecharModal() }}>
          <section className="apontamento-dialog" role="dialog" aria-modal="true" aria-labelledby="apontamento-modal-title">
            <header className="apontamento-dialog-header">
              <div>
                <small>{idEmEdicao ? "ATUALIZAÇÃO DE REGISTRO" : "NOVO REGISTRO"}</small>
                <h2 id="apontamento-modal-title">{tituloModal}</h2>
                <p>Preencha os dados da execução. Os campos obrigatórios estão identificados.</p>
              </div>
              <button className="apontamento-close" type="button" aria-label="Fechar formulário" onClick={fecharModal}>×</button>
            </header>

            <form className="apontamento-form" onSubmit={salvarApontamento}>
              <div className="apontamento-form-scroll">
                <section className="apontamento-form-section">
                  <div className="apontamento-form-section-title">
                    <h3>Identificação do apontamento</h3>
                    <p>Vincule o registro à ordem, etapa e equipe responsável.</p>
                  </div>
                  <div className="apontamento-form-grid">
                    <label>Ordem de produção (OP) *
                      <input autoFocus value={form.ordemProducao} onChange={(evento) => campoTexto(setForm, "ordemProducao", evento.target.value)} placeholder="Informe a OP" required />
                    </label>
                    <label>Etapa *
                      <input value={form.etapa} onChange={(evento) => campoTexto(setForm, "etapa", evento.target.value)} placeholder="Informe a etapa" required />
                    </label>
                    <label>Operador *
                      <input value={form.operador} onChange={(evento) => campoTexto(setForm, "operador", evento.target.value)} placeholder="Nome do operador" required />
                    </label>
                    <label>Identificação / matrícula do operador
                      <input value={form.identificacaoOperador} onChange={(evento) => campoTexto(setForm, "identificacaoOperador", evento.target.value)} placeholder="Identificação do operador" />
                    </label>
                    <label>Máquina / equipamento
                      <input value={form.maquina} onChange={(evento) => campoTexto(setForm, "maquina", evento.target.value)} placeholder="Informe a máquina ou equipamento" />
                    </label>
                    <label>Data do apontamento
                      <input type="date" value={form.data} onChange={(evento) => campoTexto(setForm, "data", evento.target.value)} />
                    </label>
                    <label>Status *
                      <select value={form.status} onChange={(evento) => setForm((anterior) => ({ ...anterior, status: evento.target.value as ApontamentoForm["status"] }))} required>
                        <option value="">Selecione o status</option>
                        {STATUS.map((status) => <option key={status} value={status}>{status}</option>)}
                      </select>
                    </label>
                  </div>
                </section>

                <section className="apontamento-form-section">
                  <div className="apontamento-form-section-title">
                    <h3>Entrada de quantidades</h3>
                    <p>Informe o volume produzido e a quantidade classificada.</p>
                  </div>
                  <div className="apontamento-form-grid apontamento-form-grid--three">
                    <label>Quantidade produzida *
                      <input type="number" min="0" step="any" value={form.quantidadeProduzida} onChange={(evento) => campoTexto(setForm, "quantidadeProduzida", evento.target.value)} placeholder="0" required />
                    </label>
                    <label>Unidade da produção
                      <input value={form.unidadeProduzida} onChange={(evento) => campoTexto(setForm, "unidadeProduzida", evento.target.value)} placeholder="Unidade" />
                    </label>
                    <label>Quantidade aprovada
                      <input type="number" min="0" step="any" value={form.quantidadeAprovada} onChange={(evento) => campoTexto(setForm, "quantidadeAprovada", evento.target.value)} placeholder="0" />
                    </label>
                    <label>Defeitos / não conformes
                      <input type="number" min="0" step="any" value={form.quantidadeDefeituosa} onChange={(evento) => campoTexto(setForm, "quantidadeDefeituosa", evento.target.value)} placeholder="0" />
                    </label>
                    <label>Hora de início
                      <input type="time" value={form.horaInicio} onChange={(evento) => campoTexto(setForm, "horaInicio", evento.target.value)} />
                    </label>
                    <label>Hora de término
                      <input type="time" value={form.horaFim} onChange={(evento) => campoTexto(setForm, "horaFim", evento.target.value)} />
                    </label>
                  </div>
                  <p className="apontamento-calculo-hint">O tempo é apresentado na lista quando os horários de início e término forem informados.</p>
                </section>

                <section className="apontamento-form-section">
                  <div className="apontamento-form-section-title">
                    <h3>Registro de perdas e sobras</h3>
                    <p>Registre a ocorrência e as quantidades correspondentes, quando houver.</p>
                  </div>
                  <div className="apontamento-form-grid">
                    <label>Tipo / descrição da perda
                      <input value={form.tipoPerda} onChange={(evento) => campoTexto(setForm, "tipoPerda", evento.target.value)} placeholder="Descreva a perda identificada" />
                    </label>
                    <div className="apontamento-inline-fields">
                      <label>Quantidade da perda
                        <input type="number" min="0" step="any" value={form.quantidadePerda} onChange={(evento) => campoTexto(setForm, "quantidadePerda", evento.target.value)} placeholder="0" />
                      </label>
                      <label>Unidade
                        <input value={form.unidadePerda} onChange={(evento) => campoTexto(setForm, "unidadePerda", evento.target.value)} placeholder="Unidade" />
                      </label>
                    </div>
                    <div className="apontamento-inline-fields">
                      <label>Quantidade de sobra
                        <input type="number" min="0" step="any" value={form.quantidadeSobra} onChange={(evento) => campoTexto(setForm, "quantidadeSobra", evento.target.value)} placeholder="0" />
                      </label>
                      <label>Unidade
                        <input value={form.unidadeSobra} onChange={(evento) => campoTexto(setForm, "unidadeSobra", evento.target.value)} placeholder="Unidade" />
                      </label>
                    </div>
                  </div>
                </section>

                <section className="apontamento-form-section">
                  <div className="apontamento-form-section-title">
                    <h3>Validação do operador</h3>
                    <p>Registre a conferência da identificação sem substituir as regras oficiais da empresa.</p>
                  </div>
                  <label className="apontamento-check-field">
                    <input type="checkbox" checked={form.identificacaoConferida} onChange={(evento) => setForm((anterior) => ({ ...anterior, identificacaoConferida: evento.target.checked }))} />
                    <span>Identificação do operador conferida</span>
                  </label>
                  <label className="apontamento-conferente-field">Responsável pela conferência
                    <input value={form.responsavelConferencia} onChange={(evento) => campoTexto(setForm, "responsavelConferencia", evento.target.value)} placeholder="Informe quem realizou a conferência" />
                  </label>
                </section>

                <section className="apontamento-form-section">
                  <div className="apontamento-form-section-title">
                    <h3>Observações</h3>
                    <p>Inclua informações adicionais sobre a execução, quando necessário.</p>
                  </div>
                  <label>Observações gerais
                    <textarea rows={3} value={form.observacoes} onChange={(evento) => campoTexto(setForm, "observacoes", evento.target.value)} placeholder="Informações adicionais sobre o apontamento" />
                  </label>
                </section>
              </div>

              {erro && <p className="apontamento-form-error" role="alert">{erro}</p>}
              <footer className="apontamento-dialog-actions">
                <button className="fabrika-secondary" type="button" onClick={fecharModal}>Cancelar</button>
                <button className="fabrika-primary" type="submit">{idEmEdicao ? "Salvar alterações" : "Salvar apontamento"}</button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {registroSelecionado && (
        <div className="apontamento-drawer-layer" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setRegistroSelecionado(null) }}>
          <aside className="apontamento-drawer" role="dialog" aria-modal="true" aria-labelledby="apontamento-drawer-title">
            <div className="apontamento-drawer-scroll">
              <header className="apontamento-drawer-header">
                <div>
                  <small>DETALHAMENTO</small>
                  <h2 id="apontamento-drawer-title">{registroSelecionado.ordemProducao}</h2>
                  <p>{registroSelecionado.etapa}</p>
                </div>
                <button className="apontamento-close" type="button" aria-label="Fechar detalhes" onClick={() => setRegistroSelecionado(null)}>×</button>
              </header>

              <div className="apontamento-drawer-status-row">
                <span className={`apontamento-status ${statusClasse(registroSelecionado.status)}`}>{registroSelecionado.status}</span>
                <small>Atualizado em {dataHoraLegivel(registroSelecionado.atualizadoEm)}</small>
              </div>

              <section className="apontamento-detail-section">
                <h3>Identificação</h3>
                <div className="apontamento-detail-grid">
                  <DetailItem label="Etapa" value={registroSelecionado.etapa} />
                  <DetailItem label="Operador" value={registroSelecionado.operador} />
                  <DetailItem label="Identificação do operador" value={registroSelecionado.identificacaoOperador} />
                  <DetailItem label="Máquina / equipamento" value={registroSelecionado.maquina} />
                  <DetailItem label="Data" value={dataLegivel(registroSelecionado.data)} />
                  <DetailItem label="Status" value={registroSelecionado.status} />
                </div>
              </section>

              <section className="apontamento-detail-section">
                <h3>Produção</h3>
                <div className="apontamento-detail-grid">
                  <DetailItem label="Quantidade produzida" value={quantidadeComUnidade(registroSelecionado.quantidadeProduzida, registroSelecionado.unidadeProduzida)} />
                  <DetailItem label="Quantidade aprovada" value={registroSelecionado.quantidadeAprovada} />
                  <DetailItem label="Defeitos / não conformes" value={registroSelecionado.quantidadeDefeituosa} />
                  <DetailItem label="Tempo" value={calcularTempo(registroSelecionado.horaInicio, registroSelecionado.horaFim)} />
                  <DetailItem label="Hora de início" value={registroSelecionado.horaInicio} />
                  <DetailItem label="Hora de término" value={registroSelecionado.horaFim} />
                </div>
              </section>

              <section className="apontamento-detail-section">
                <h3>Perdas e sobras</h3>
                <div className="apontamento-detail-grid">
                  <DetailItem label="Tipo / descrição da perda" value={registroSelecionado.tipoPerda} />
                  <DetailItem label="Quantidade da perda" value={quantidadeComUnidade(registroSelecionado.quantidadePerda, registroSelecionado.unidadePerda)} />
                  <DetailItem label="Quantidade de sobra" value={quantidadeComUnidade(registroSelecionado.quantidadeSobra, registroSelecionado.unidadeSobra)} />
                </div>
              </section>

              <section className="apontamento-detail-section">
                <h3>Validação do operador</h3>
                <div className="apontamento-detail-grid">
                  <DetailItem label="Identificação conferida" value={registroSelecionado.identificacaoConferida ? "Sim" : "Não informado / não conferido"} />
                  <DetailItem label="Responsável pela conferência" value={registroSelecionado.responsavelConferencia} />
                </div>
              </section>

              {registroSelecionado.observacoes.trim() && (
                <section className="apontamento-detail-section">
                  <h3>Observações</h3>
                  <p className="apontamento-observations">{registroSelecionado.observacoes}</p>
                </section>
              )}

              <footer className="apontamento-drawer-actions">
                <button className="fabrika-secondary" type="button" onClick={() => setRegistroSelecionado(null)}>Fechar</button>
                <button className="fabrika-primary" type="button" onClick={() => abrirEdicao(registroSelecionado)}>Editar registro</button>
              </footer>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="apontamento-detail-item">
      <small>{label}</small>
      <strong>{valorOuTraco(value)}</strong>
    </div>
  )
}
