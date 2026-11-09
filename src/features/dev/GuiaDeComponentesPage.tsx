// Página SÓ de desenvolvimento (não vai para produção): mostra cada componente
// compartilhado funcionando, com o código de uso. Copie daqui para a sua tela.

import { useState } from "react"
import { Botao } from "@/shared/components/Botao"
import { Campo } from "@/shared/components/Campo"
import { DataTable, type Coluna } from "@/shared/components/DataTable"
import { Drawer } from "@/shared/components/Drawer"
import { EstadoVazio } from "@/shared/components/EstadoVazio"
import { Icon } from "@/shared/components/Icon"
import { Modal } from "@/shared/components/Modal"
import { PageHeader } from "@/shared/components/PageHeader"
import { StatusBadge } from "@/shared/components/StatusBadge"
import { Stepper } from "@/shared/components/Stepper"
import { Tabs } from "@/shared/components/Tabs"
import { useToast } from "@/shared/components/Toast"
import { useAppState } from "@/shared/state/AppState"
import type { Tecido } from "@/shared/types"
import { formatarMoeda, formatarNumero } from "@/shared/utils/format"

function Secao({ titulo, codigo, children }: { titulo: string; codigo: string; children: React.ReactNode }) {
  return (
    <section className="card card-corpo" style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>{titulo}</h2>
      <div style={{ display: "grid", gap: 14 }}>{children}</div>
      <pre style={{ margin: "16px 0 0", padding: 12, overflowX: "auto", background: "var(--cor-campo)", border: "1px solid var(--cor-linha)", borderRadius: 8, fontSize: 13 }}>
        <code>{codigo}</code>
      </pre>
    </section>
  )
}

export default function GuiaDeComponentesPage() {
  const { tecidos, atualizarPrecoTecido } = useAppState()
  const { mostrar } = useToast()
  const [modalAberto, setModalAberto] = useState(false)
  const [drawerAberto, setDrawerAberto] = useState(false)
  const [aba, setAba] = useState("composicao")
  const [nome, setNome] = useState("")
  const [tentouSalvar, setTentouSalvar] = useState(false)
  const [etapa, setEtapa] = useState(1)
  const [selecionado, setSelecionado] = useState<Tecido | null>(null)

  const colunas: Coluna<Tecido>[] = [
    { chave: "codigo", titulo: "Código" },
    { chave: "nome", titulo: "Tecido" },
    { chave: "composicao", titulo: "Composição" },
    { chave: "preco", titulo: "Preço / m", render: (t) => formatarMoeda(t.preco) },
    { chave: "estoque", titulo: "Estoque", render: (t) => `${formatarNumero(t.estoque)} m` },
    {
      chave: "status", titulo: "Status", ordenavel: false,
      render: (t) => <StatusBadge status={t.estoque < t.estoqueMinimo * 0.5 ? "Crítico" : t.estoque < t.estoqueMinimo ? "Baixo" : "OK"} />,
      valor: (t) => (t.estoque < t.estoqueMinimo * 0.5 ? "Crítico" : t.estoque < t.estoqueMinimo ? "Baixo" : "OK"),
    },
  ]
  const statusDe = (t: Tecido) => (t.estoque < t.estoqueMinimo * 0.5 ? "Crítico" : t.estoque < t.estoqueMinimo ? "Baixo" : "OK")

  const erroNome = tentouSalvar && nome.trim() === "" ? "Informe o nome do tecido" : undefined

  const salvar = () => {
    setTentouSalvar(true)
    if (nome.trim() === "") return
    setModalAberto(false)
    setNome("")
    setTentouSalvar(false)
    mostrar("Tecido salvo com sucesso", "O registro foi adicionado à lista.")
  }

  return (
    <div className="pagina">
      <PageHeader
        eyebrow="DESENVOLVIMENTO"
        titulo="Guia de componentes"
        descricao="Tudo o que está em src/shared/components, funcionando. Só aparece no npm run dev."
      />

      <Secao
        titulo="Tabela de dados (DataTable)"
        codigo={`<DataTable colunas={colunas} linhas={tecidos} idDaLinha={(t) => t.codigo}
  filtroStatus={{ rotulo: "Status", valor: statusDe }} aoClicarLinha={setSelecionado}
  acoes={<Botao>+ Novo tecido</Botao>} />`}
      >
        <DataTable
          colunas={colunas}
          linhas={tecidos}
          idDaLinha={(t) => t.codigo}
          placeholderBusca="Buscar tecidos..."
          filtroStatus={{ rotulo: "Filtrar por status", valor: statusDe }}
          aoClicarLinha={setSelecionado}
          porPagina={3}
          acoes={<Botao onClick={() => setModalAberto(true)}><Icon nome="plus" /> Novo tecido</Botao>}
        />
      </Secao>

      <Secao titulo="Botões" codigo={`<Botao variante="primario | secundario | perigo | icone">Texto</Botao>`}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Botao>Primário</Botao>
          <Botao variante="secundario">Secundário</Botao>
          <Botao variante="perigo"><Icon nome="trash" /> Excluir</Botao>
          <Botao variante="icone" aria-label="Notificações"><Icon nome="bell" /></Botao>
          <Botao disabled>Desabilitado</Botao>
        </div>
      </Secao>

      <Secao titulo="Badges de status" codigo={`<StatusBadge status="Em produção" />   // a cor é escolhida pelo texto (ver StatusBadge.tsx)`}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <StatusBadge status="Aprovada" />
          <StatusBadge status="Em teste" />
          <StatusBadge status="Crítico" />
          <StatusBadge status="Novo" />
        </div>
      </Secao>

      <Secao titulo="Abas (Tabs)" codigo={`const [aba, setAba] = useState("composicao")
<Tabs abas={[{ id: "composicao", rotulo: "Composição" }, ...]} ativa={aba} aoMudar={setAba} />`}>
        <Tabs
          abas={[
            { id: "composicao", rotulo: "Composição" },
            { id: "residuo", rotulo: "Resíduo têxtil" },
            { id: "custos", rotulo: "Custos" },
            { id: "precificacao", rotulo: "Precificação" },
          ]}
          ativa={aba}
          aoMudar={setAba}
          rotuloAcessivel="Seções da ficha técnica"
        />
        <p>Aba ativa: <b>{aba}</b></p>
      </Secao>

      <Secao titulo="Etapas (Stepper)" codigo={`<Stepper etapas={["Cliente", "Itens", "Prazo", "Resumo"]} atual={etapa} />`}>
        <Stepper etapas={["Cliente", "Itens", "Prazo", "Resumo"]} atual={etapa} />
        <div style={{ display: "flex", gap: 10 }}>
          <Botao variante="secundario" onClick={() => setEtapa((e) => Math.max(0, e - 1))}>Voltar</Botao>
          <Botao onClick={() => setEtapa((e) => Math.min(3, e + 1))}>Avançar</Botao>
        </div>
      </Secao>

      <Secao titulo="Modal, campo com validação e Toast" codigo={`<Modal aberto={aberto} titulo="Novo tecido" aoFechar={fechar} rodape={<Botao onClick={salvar}>Salvar</Botao>}>
  <Campo rotulo="Nome" obrigatorio erro={erro}><input value={nome} onChange={...} /></Campo>
</Modal>
const { mostrar } = useToast();  mostrar("Salvo", "detalhe opcional")`}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Botao onClick={() => setModalAberto(true)}>Abrir modal</Botao>
          <Botao variante="secundario" onClick={() => mostrar("Ficha salva com sucesso", "A versão 1.0 foi salva no histórico.")}>Mostrar toast</Botao>
          <Botao variante="secundario" onClick={() => setDrawerAberto(true)}>Abrir drawer</Botao>
        </div>
      </Secao>

      <Secao titulo="Estado vazio" codigo={`<EstadoVazio titulo="Nenhum pedido ainda" texto="Crie o primeiro pedido." />`}>
        <div className="card"><EstadoVazio titulo="Nenhum pedido ainda" texto="Crie o primeiro pedido para vê-lo aqui." /></div>
      </Secao>

      <Modal
        aberto={modalAberto}
        eyebrow="NOVO REGISTRO"
        titulo="Novo tecido"
        aoFechar={() => { setModalAberto(false); setTentouSalvar(false) }}
        rodape={<><Botao variante="secundario" onClick={() => setModalAberto(false)}>Cancelar</Botao><Botao onClick={salvar}>Salvar registro</Botao></>}
      >
        <div className="grade-campos">
          <Campo rotulo="Nome do tecido" obrigatorio erro={erroNome}>
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Meia malha algodão" />
          </Campo>
          <Campo rotulo="Preço por metro">
            <input type="number" min="0" step="0.01" placeholder="0,00" />
          </Campo>
        </div>
      </Modal>

      <Drawer
        aberto={drawerAberto || selecionado !== null}
        eyebrow="DETALHAMENTO"
        titulo={selecionado ? selecionado.nome : "Exemplo de drawer"}
        aoFechar={() => { setDrawerAberto(false); setSelecionado(null) }}
        rodape={<Botao variante="secundario" onClick={() => { setDrawerAberto(false); setSelecionado(null) }}>Fechar</Botao>}
      >
        {selecionado ? (
          <div style={{ display: "grid", gap: 10 }}>
            <p><small>Código</small><br /><b>{selecionado.codigo}</b></p>
            <p><small>Composição</small><br /><b>{selecionado.composicao}</b></p>
            <p><small>Preço atual</small><br /><b>{formatarMoeda(selecionado.preco)} / m</b></p>
            <Botao
              variante="secundario"
              onClick={() => {
                atualizarPrecoTecido(selecionado.codigo, Math.round((selecionado.preco + 1) * 100) / 100)
                mostrar("Preço atualizado", "O custo das fichas que usam este tecido será recalculado.")
                setSelecionado(null)
              }}
            >
              Aumentar R$ 1,00 (exemplo de estado compartilhado)
            </Botao>
          </div>
        ) : (
          <p>Use o Drawer para mostrar detalhes de uma linha de tabela sem sair da tela.</p>
        )}
      </Drawer>
    </div>
  )
}
