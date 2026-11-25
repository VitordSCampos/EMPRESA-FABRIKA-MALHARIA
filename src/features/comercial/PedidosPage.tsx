import { useEffect, useMemo, useState } from "react";
import {
  carregarFichasTecnicas,
  carregarPedidos,
  dataHojeISO,
  formatarData,
  gerarIdItem,
  gerarIdPedido,
  quantidadeDoPedido,
  salvarPedidos,
  STATUS_PEDIDO,
  valorDoPedido,
  type FichaTecnicaVinculo,
  type ItemPedido,
  type Pedido,
  type StatusPedido,
} from "./pedidosStore";

type CampoOrdenacao = "id" | "cliente" | "dataPedido" | "dataEntrega" | "itens" | "valor" | "status";
type DirecaoOrdenacao = "asc" | "desc";
type FormularioPedido = Omit<Pedido, "id">;

const ITENS_POR_PAGINA = 4;
const moeda = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const classeStatus: Record<StatusPedido, string> = {
  "Em produção": "em-producao",
  "Em análise": "em-analise",
  Pronto: "pronto",
  Entregue: "entregue",
};

function novoItem(): ItemPedido {
  return { id: gerarIdItem(), produto: "", quantidade: 1, valorUnitario: 0, fichaTecnica: null };
}

function formularioVazio(): FormularioPedido {
  const hoje = dataHojeISO();
  return {
    cliente: "",
    dataPedido: hoje,
    dataEntrega: hoje,
    status: "Em análise",
    observacao: "",
    itens: [novoItem()],
  };
}

function sinalStatus(status: StatusPedido): string {
  return status === "Em análise" ? "•" : "✓";
}

function BadgeStatus({ status }: { status: StatusPedido }) {
  return <span className={`fabrika-status ${classeStatus[status]}`}>{sinalStatus(status)} {status}</span>;
}

function IconeBusca() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg>;
}

function IconeMais() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>;
}

function BotaoOrdenacao({
  campo,
  atual,
  direcao,
  children,
  onClick,
}: {
  campo: CampoOrdenacao;
  atual: CampoOrdenacao;
  direcao: DirecaoOrdenacao;
  children: React.ReactNode;
  onClick: (campo: CampoOrdenacao) => void;
}) {
  const indicador = atual === campo ? (direcao === "asc" ? "↑" : "↓") : "↕";
  return <button className="fabrika-sort-button" type="button" onClick={() => onClick(campo)}>{children} <span aria-hidden="true">{indicador}</span></button>;
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(() => carregarPedidos());
  const [fichasTecnicas, setFichasTecnicas] = useState<FichaTecnicaVinculo[]>(() => carregarFichasTecnicas());
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | StatusPedido>("Todos");
  const [pagina, setPagina] = useState(1);
  const [ordenacao, setOrdenacao] = useState<CampoOrdenacao>("id");
  const [direcao, setDirecao] = useState<DirecaoOrdenacao>("desc");
  const [formAberto, setFormAberto] = useState(false);
  const [emEdicao, setEmEdicao] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<Pedido | null>(null);
  const [form, setForm] = useState<FormularioPedido>(formularioVazio);
  const [feedback, setFeedback] = useState("");

  // A lista nasce vazia. No protótipo, o navegador mantém os registros até a API ser conectada.
  useEffect(() => {
    salvarPedidos(pedidos);
  }, [pedidos]);

  // Atualiza a lista se outro separador do mesmo navegador alterar os pedidos.
  useEffect(() => {
    const sincronizar = (evento: StorageEvent) => {
      if (evento.key === "fabrika.pedidos.v1") setPedidos(carregarPedidos());
      if (evento.key === "fabrika.fichas-tecnicas.v1") setFichasTecnicas(carregarFichasTecnicas());
    };
    const fichasAtualizadas = () => setFichasTecnicas(carregarFichasTecnicas());
    window.addEventListener("storage", sincronizar);
    window.addEventListener("fabrika:fichas-atualizadas", fichasAtualizadas);
    return () => {
      window.removeEventListener("storage", sincronizar);
      window.removeEventListener("fabrika:fichas-atualizadas", fichasAtualizadas);
    };
  }, []);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    const lista = pedidos.filter((pedido) => {
      const textoItens = pedido.itens.map((item) => `${item.produto} ${item.fichaTecnica?.codigo ?? ""}`).join(" ");
      const correspondeBusca = !termo || [pedido.id, pedido.cliente, textoItens]
        .some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo));
      return correspondeBusca && (filtro === "Todos" || pedido.status === filtro);
    });

    return [...lista].sort((a, b) => {
      let comparacao = 0;
      if (ordenacao === "id") comparacao = Number(a.id) - Number(b.id);
      if (ordenacao === "cliente") comparacao = a.cliente.localeCompare(b.cliente, "pt-BR");
      if (ordenacao === "dataPedido") comparacao = a.dataPedido.localeCompare(b.dataPedido);
      if (ordenacao === "dataEntrega") comparacao = a.dataEntrega.localeCompare(b.dataEntrega);
      if (ordenacao === "itens") comparacao = quantidadeDoPedido(a) - quantidadeDoPedido(b);
      if (ordenacao === "valor") comparacao = valorDoPedido(a) - valorDoPedido(b);
      if (ordenacao === "status") comparacao = a.status.localeCompare(b.status, "pt-BR");
      return direcao === "asc" ? comparacao : -comparacao;
    });
  }, [pedidos, busca, filtro, ordenacao, direcao]);

  const totalPaginas = Math.max(1, Math.ceil(pedidosFiltrados.length / ITENS_POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const pedidosVisiveis = pedidosFiltrados.slice((paginaAtual - 1) * ITENS_POR_PAGINA, paginaAtual * ITENS_POR_PAGINA);
  const inicioNumerosPagina = Math.max(1, Math.min(paginaAtual - 1, totalPaginas - 2));
  const numerosPaginas = Array.from({ length: Math.min(3, totalPaginas) }, (_, indice) => inicioNumerosPagina + indice);
  const semRegistros = pedidos.length === 0;

  function abrirNovoPedido() {
    setEmEdicao(null);
    setForm(formularioVazio());
    setFormAberto(true);
  }

  function abrirEdicao(pedido: Pedido) {
    setDetalhe(null);
    setEmEdicao(pedido.id);
    setForm({
      cliente: pedido.cliente,
      dataPedido: pedido.dataPedido,
      dataEntrega: pedido.dataEntrega,
      status: pedido.status,
      observacao: pedido.observacao,
      itens: pedido.itens.map((item) => ({ ...item, fichaTecnica: item.fichaTecnica ? { ...item.fichaTecnica } : null })),
    });
    setFormAberto(true);
  }

  function atualizarItem(id: string, alteracoes: Partial<ItemPedido>) {
    setForm((atual) => ({
      ...atual,
      itens: atual.itens.map((item) => item.id === id ? { ...item, ...alteracoes } : item),
    }));
  }

  function salvarFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const itensValidos = form.itens.filter((item) => item.produto.trim() && item.quantidade > 0 && item.valorUnitario >= 0);
    if (!form.cliente.trim() || itensValidos.length === 0) {
      setFeedback("Informe o cliente e pelo menos um item válido para salvar o pedido.");
      return;
    }

    const pedidoEditado = emEdicao ? pedidos.find((pedido) => pedido.id === emEdicao) : undefined;
    const pedidoSalvo: Pedido = {
      ...form,
      id: emEdicao ?? gerarIdPedido(pedidos),
      cliente: form.cliente.trim(),
      itens: itensValidos.map((item) => ({ ...item, produto: item.produto.trim() })),
      observacao: form.observacao.trim(),
    };

    setPedidos((atuais) => emEdicao
      ? atuais.map((pedido) => pedido.id === emEdicao ? pedidoSalvo : pedido)
      : [pedidoSalvo, ...atuais]);
    setPagina(1);
    setFormAberto(false);
    setEmEdicao(null);
    setFeedback(pedidoEditado ? `Pedido #${pedidoSalvo.id} atualizado.` : `Pedido #${pedidoSalvo.id} cadastrado.`);
  }

  function atualizarStatus(pedido: Pedido, status: StatusPedido) {
    const atualizado = { ...pedido, status };
    setPedidos((atuais) => atuais.map((item) => item.id === pedido.id ? atualizado : item));
    setDetalhe(atualizado);
    setFeedback(`Status do pedido #${pedido.id} alterado para "${status}".`);
  }

  function alterarOrdenacao(campo: CampoOrdenacao) {
    if (ordenacao === campo) setDirecao((atual) => atual === "asc" ? "desc" : "asc");
    else { setOrdenacao(campo); setDirecao("asc"); }
    setPagina(1);
  }

  function atualizarListagem() {
    setPedidos(carregarPedidos());
    setFichasTecnicas(carregarFichasTecnicas());
    setBusca("");
    setFiltro("Todos");
    setPagina(1);
    setFeedback("Listagem atualizada.");
  }

  return (
    <div className="module-page pedidos-page">
      <header className="module-title-row pedidos-title-row">
        <div>
          <p className="module-eyebrow">COMERCIAL</p>
          <h2>Pedidos</h2>
          <p>Acompanhe pedidos, prazos e a situação da produção.</p>
        </div>
        <button className="fabrika-primary pedidos-new-button" type="button" onClick={abrirNovoPedido}>
          <IconeMais /> Novo pedido
        </button>
      </header>

      {feedback && <div className="fabrika-feedback" role="status">{feedback}<button type="button" onClick={() => setFeedback("")} aria-label="Fechar aviso">×</button></div>}

      <section className="fabrika-table-card pedidos-table-card" aria-label="Lista de pedidos">
        <div className="fabrika-table-tools">
          <label className="fabrika-search">
            <IconeBusca />
            <input value={busca} onChange={(evento) => { setBusca(evento.target.value); setPagina(1); }} placeholder="Buscar em pedidos..." aria-label="Buscar por pedido, cliente, produto ou ficha técnica" />
          </label>
          <div className="fabrika-table-actions">
            <select aria-label="Filtrar por status" value={filtro} onChange={(evento) => { setFiltro(evento.target.value as "Todos" | StatusPedido); setPagina(1); }}>
              <option value="Todos">Todos</option>
              {STATUS_PEDIDO.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <button className="fabrika-secondary" type="button" onClick={atualizarListagem}>Atualizar</button>
          </div>
        </div>

        <div className="fabrika-table-scroll">
          <table className="fabrika-table pedidos-table">
            <thead>
              <tr>
                <th><BotaoOrdenacao campo="id" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>PEDIDO</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="cliente" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>CLIENTE</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="dataPedido" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>DATA</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="dataEntrega" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>ENTREGA</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="itens" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>ITENS</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="valor" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>VALOR</BotaoOrdenacao></th>
                <th><BotaoOrdenacao campo="status" atual={ordenacao} direcao={direcao} onClick={alterarOrdenacao}>STATUS</BotaoOrdenacao></th>
              </tr>
            </thead>
            <tbody>
              {pedidosVisiveis.map((pedido) => (
                <tr key={pedido.id} tabIndex={0} onClick={() => setDetalhe(pedido)} onKeyDown={(evento) => { if (evento.key === "Enter" || evento.key === " ") { evento.preventDefault(); setDetalhe(pedido); } }}>
                  <td><strong>#{pedido.id}</strong></td>
                  <td>{pedido.cliente}</td>
                  <td>{formatarData(pedido.dataPedido)}</td>
                  <td>{formatarData(pedido.dataEntrega)}</td>
                  <td>{quantidadeDoPedido(pedido).toLocaleString("pt-BR")} peças</td>
                  <td>{moeda(valorDoPedido(pedido))}</td>
                  <td><BadgeStatus status={pedido.status} /></td>
                </tr>
              ))}
              {pedidosVisiveis.length === 0 && (
                <tr className="pedidos-empty-row">
                  <td colSpan={7}>
                    <div className="pedidos-empty-state">
                      <span className="pedidos-empty-icon" aria-hidden="true">▤</span>
                      <strong>{semRegistros ? "Nenhum pedido cadastrado" : "Nenhum pedido encontrado"}</strong>
                      <p>{semRegistros ? "Os pedidos cadastrados pela empresa aparecerão aqui. Comece adicionando o primeiro pedido." : "Revise a busca ou o filtro de status e tente novamente."}</p>
                      {semRegistros && <button type="button" className="fabrika-primary" onClick={abrirNovoPedido}><IconeMais /> Cadastrar primeiro pedido</button>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="fabrika-table-footer pedidos-table-footer">
          <span>Mostrando {pedidosVisiveis.length} de {pedidosFiltrados.length} registros</span>
          <div className="pedidos-pagination" aria-label="Paginação">
            <button type="button" aria-label="Página anterior" disabled={paginaAtual <= 1} onClick={() => setPagina((atual) => Math.max(1, atual - 1))}>‹</button>
            {numerosPaginas.map((numero) => <button key={numero} type="button" className={paginaAtual === numero ? "is-current" : ""} aria-current={paginaAtual === numero ? "page" : undefined} disabled={paginaAtual === numero} onClick={() => setPagina(numero)}>{numero}</button>)}
            <button type="button" aria-label="Próxima página" disabled={paginaAtual >= totalPaginas} onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}>›</button>
          </div>
        </div>
      </section>

      {formAberto && (
        <div className="fabrika-overlay" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setFormAberto(false); }}>
          <section className="fabrika-dialog pedidos-form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-pedido-titulo">
            <div className="fabrika-dialog-head">
              <div><small>COMERCIAL · PEDIDOS</small><h3 id="form-pedido-titulo">{emEdicao ? `Editar pedido #${emEdicao}` : "Novo pedido"}</h3><p>Cadastre o cliente, os itens, os prazos e os vínculos técnicos.</p></div>
              <button type="button" onClick={() => setFormAberto(false)} aria-label="Fechar">×</button>
            </div>
            <form className="fabrika-form pedidos-form" onSubmit={salvarFormulario}>
              <div className="pedidos-form-grid">
                <label>Cliente <input required maxLength={120} value={form.cliente} onChange={(evento) => setForm((atual) => ({ ...atual, cliente: evento.target.value }))} placeholder="Nome do cliente" /></label>
                <label>Status do pedido <select value={form.status} onChange={(evento) => setForm((atual) => ({ ...atual, status: evento.target.value as StatusPedido }))}>{STATUS_PEDIDO.map((status) => <option key={status}>{status}</option>)}</select></label>
                <label>Data do pedido <input required type="date" value={form.dataPedido} onChange={(evento) => setForm((atual) => ({ ...atual, dataPedido: evento.target.value }))} /></label>
                <label>Data de entrega <input required type="date" min={form.dataPedido} value={form.dataEntrega} onChange={(evento) => setForm((atual) => ({ ...atual, dataEntrega: evento.target.value }))} /></label>
              </div>

              <div className="pedidos-items-heading"><div><h4>Itens do pedido</h4><p>Adicione cada produto, quantidade e valor unitário.</p></div><button type="button" className="fabrika-secondary" onClick={() => setForm((atual) => ({ ...atual, itens: [...atual.itens, novoItem()] }))}><IconeMais /> Adicionar item</button></div>

              <div className="pedidos-item-list">
                {form.itens.map((item, indice) => (
                  <fieldset className="pedidos-item-card" key={item.id}>
                    <legend>Item {indice + 1}</legend>
                    <div className="pedidos-item-grid">
                      <label className="pedidos-item-product">Produto / descrição <input required maxLength={120} value={item.produto} onChange={(evento) => atualizarItem(item.id, { produto: evento.target.value })} placeholder="Ex.: Camiseta gola redonda" /></label>
                      <label>Quantidade <input required type="number" min="1" step="1" value={item.quantidade} onChange={(evento) => atualizarItem(item.id, { quantidade: Math.max(1, Number(evento.target.value)) })} /></label>
                      <label>Valor unitário (R$) <input required type="number" min="0" step="0.01" value={item.valorUnitario} onChange={(evento) => atualizarItem(item.id, { valorUnitario: Math.max(0, Number(evento.target.value)) })} /></label>
                      <label className="pedidos-item-sheet">Ficha técnica (opcional)
                        <select value={item.fichaTecnica?.id ?? ""} disabled={fichasTecnicas.length === 0 && !item.fichaTecnica} onChange={(evento) => {
                          const ficha = fichasTecnicas.find((opcao) => opcao.id === evento.target.value) ?? null;
                          atualizarItem(item.id, { fichaTecnica: ficha });
                        }}>
                          <option value="">{fichasTecnicas.length ? "Sem vínculo" : "Nenhuma ficha técnica cadastrada"}</option>
                          {item.fichaTecnica && !fichasTecnicas.some((ficha) => ficha.id === item.fichaTecnica?.id) && <option value={item.fichaTecnica.id}>{item.fichaTecnica.codigo} · {item.fichaTecnica.produto}</option>}
                          {fichasTecnicas.map((ficha) => <option key={ficha.id} value={ficha.id}>{ficha.codigo} · {ficha.produto}{ficha.versao ? ` · ${ficha.versao}` : ""}</option>)}
                        </select>
                      </label>
                    </div>
                    <div className="pedidos-item-bottom"><span>Subtotal: <strong>{moeda(item.quantidade * item.valorUnitario)}</strong>{item.fichaTecnica && <small>Ficha vinculada: {item.fichaTecnica.codigo}</small>}</span>
                      {form.itens.length > 1 && <button type="button" className="fabrika-remove-button" onClick={() => setForm((atual) => ({ ...atual, itens: atual.itens.filter((linha) => linha.id !== item.id) }))}>Remover item</button>}
                    </div>
                  </fieldset>
                ))}
              </div>

              <label>Observações <textarea rows={2} maxLength={1000} value={form.observacao} onChange={(evento) => setForm((atual) => ({ ...atual, observacao: evento.target.value }))} placeholder="Informações complementares do pedido (opcional)" /></label>
              <div className="pedidos-total-preview"><span>{form.itens.reduce((total, item) => total + item.quantidade, 0).toLocaleString("pt-BR")} peças</span><strong>{moeda(form.itens.reduce((total, item) => total + item.quantidade * item.valorUnitario, 0))}</strong></div>
              <p className="fabrika-hint pedidos-hint">As fichas técnicas aparecerão nesta seleção quando forem cadastradas no módulo de Engenharia. O vínculo pode ser feito ou atualizado ao editar o pedido. Os valores e registros ficam neste navegador até a integração com a API.</p>
              <div className="fabrika-dialog-actions"><button type="button" className="fabrika-secondary" onClick={() => setFormAberto(false)}>Cancelar</button><button type="submit" className="fabrika-primary">{emEdicao ? "Salvar alterações" : "Cadastrar pedido"}</button></div>
            </form>
          </section>
        </div>
      )}

      {detalhe && (
        <div className="fabrika-overlay" onMouseDown={(evento) => { if (evento.target === evento.currentTarget) setDetalhe(null); }}>
          <section className="fabrika-dialog pedidos-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detalhe-pedido-titulo">
            <div className="fabrika-dialog-head"><div><small>DETALHES DO PEDIDO</small><h3 id="detalhe-pedido-titulo">Pedido #{detalhe.id}</h3><p>{detalhe.cliente}</p></div><button type="button" onClick={() => setDetalhe(null)} aria-label="Fechar">×</button></div>
            <div className="fabrika-detail-grid pedidos-detail-grid">
              <div><small>Data do pedido</small><b>{formatarData(detalhe.dataPedido)}</b></div>
              <div><small>Previsão de entrega</small><b>{formatarData(detalhe.dataEntrega)}</b></div>
              <div><small>Quantidade total</small><b>{quantidadeDoPedido(detalhe).toLocaleString("pt-BR")} peças</b></div>
              <div><small>Valor total</small><b>{moeda(valorDoPedido(detalhe))}</b></div>
              <div className="pedidos-detail-status"><small>Status atual</small><select value={detalhe.status} onChange={(evento) => atualizarStatus(detalhe, evento.target.value as StatusPedido)}>{STATUS_PEDIDO.map((status) => <option key={status}>{status}</option>)}</select></div>
            </div>
            <h4 className="pedidos-detail-subtitle">Itens e fichas técnicas</h4>
            <div className="pedidos-detail-items">
              {detalhe.itens.map((item) => <div key={item.id}><div><strong>{item.produto}</strong><small>{item.quantidade.toLocaleString("pt-BR")} peças · {moeda(item.valorUnitario)} / un.</small><small>{item.fichaTecnica ? `Ficha: ${item.fichaTecnica.codigo} · ${item.fichaTecnica.produto}` : "Sem ficha técnica vinculada"}</small></div><b>{moeda(item.quantidade * item.valorUnitario)}</b></div>)}
            </div>
            {detalhe.observacao && <p className="fabrika-hint">{detalhe.observacao}</p>}
            <div className="fabrika-dialog-actions"><button type="button" className="fabrika-secondary" onClick={() => setDetalhe(null)}>Fechar</button><button type="button" className="fabrika-primary" onClick={() => abrirEdicao(detalhe)}>Editar pedido</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
