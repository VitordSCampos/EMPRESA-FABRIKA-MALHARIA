import { useState } from "react";
import PedidosPage from "./features/comercial/PedidosPage";
import ProdutosPage from "./features/engenharia/ProdutosPage";
import { AnalisesReferencia } from "./features/analises/AnalisesReferencia";

type IconName = "grid" | "fabric" | "box" | "layers" | "spark" | "people" | "file" | "product" | "orders" | "check" | "settings" | "report" | "chevron" | "menu" | "search" | "bell";
type NavItem = readonly [id: string, icon: IconName, label?: string];

const groups: { label: string; items: NavItem[] }[] = [
  { label: "Dashboard", items: [["Dashboard", "grid"]] },
  { label: "Cadastros", items: [["Tecidos", "fabric"], ["Aviamentos", "box"], ["Modelagem", "layers"], ["Beneficiamentos", "spark"], ["Fornecedores", "people"], ["Clientes", "people"]] },
  { label: "Estoque", items: [["Estoque · Tecidos", "fabric", "Tecidos"], ["Estoque · Aviamentos", "box", "Aviamentos"]] },
  { label: "Engenharia de produção", items: [["Ficha técnica", "file"]] },
  { label: "Produtos", items: [["Produtos", "product"]] },
  { label: "Comercial", items: [["Pedidos", "orders"]] },
  { label: "Produção", items: [["Produção · Pedidos", "orders", "Ordens de produção"], ["Apontamento", "check"], ["Máquinas", "settings"]] },
  { label: "Sustentabilidade", items: [["Sustentabilidade", "fabric"]] },
  { label: "Análises", items: [["Relatórios", "report"], ["Integrações", "settings"]] },
];

const tarefas: Record<string, { titulo: string; descricao: string; entregas: string[] }> = {
  Dashboard: { titulo: "Dashboard", descricao: "Indicadores da operação e avisos prioritários.", entregas: ["Cards de KPI com dados da API", "Alertas de estoque e produção", "Gráficos e filtros por período"] },
  "Ficha técnica": { titulo: "Ficha técnica", descricao: "Base para cadastro, composição, custo e aprovação de um produto.", entregas: ["Formulário de produto e versão", "Itens de tecido, aviamento e beneficiamento", "Cálculo validado no back-end"] },
  Produtos: { titulo: "Produtos", descricao: "Catálogo e histórico de versões aprovadas.", entregas: ["Listagem e busca", "Cadastro e edição", "Vínculo com ficha técnica"] },
  Pedidos: { titulo: "Pedidos", descricao: "Fluxo comercial que inicia a demanda de produção.", entregas: ["Cliente e itens do pedido", "Prazos e status", "Geração de demanda para PCP"] },
  "Produção · Pedidos": { titulo: "Ordens de produção", descricao: "Planejamento e acompanhamento das OPs.", entregas: ["Criar OP a partir de pedido", "Roteiro e etapas", "Status e apontamentos"] },
  Apontamento: { titulo: "Apontamento", descricao: "Registro de produção executada por etapa e máquina.", entregas: ["Entrada de quantidades", "Registro de perdas", "Validações de operador"] },
  Máquinas: { titulo: "Máquinas", descricao: "Cadastro e disponibilidade de recursos produtivos.", entregas: ["Cadastro de máquinas", "Capacidade e manutenção", "Disponibilidade para o PCP"] },
  Tecidos: { titulo: "Tecidos", descricao: "Cadastro mestre de matéria-prima têxtil.", entregas: ["Composição e largura", "Cor, gramatura e unidade", "Fornecedor e preço vigente"] },
  Aviamentos: { titulo: "Aviamentos", descricao: "Cadastro mestre de itens complementares.", entregas: ["Unidade e estoque mínimo", "Fornecedor e preço vigente", "Rastreabilidade por lote"] },
  Modelagem: { titulo: "Modelagem", descricao: "Estrutura de modelos, tamanhos e medidas.", entregas: ["Tabela de medidas", "Tamanhos e grades", "Anexos técnicos"] },
  Beneficiamentos: { titulo: "Beneficiamentos", descricao: "Etapas terceirizadas ou internas de acabamento.", entregas: ["Tipo de processo", "Fornecedor responsável", "Custo e prazo"] },
  Fornecedores: { titulo: "Fornecedores", descricao: "Parceiros de compra e beneficiamento.", entregas: ["Dados cadastrais", "Condições comerciais", "Avaliação e histórico"] },
  Clientes: { titulo: "Clientes", descricao: "Base comercial de clientes e contatos.", entregas: ["Dados cadastrais", "Endereços e contatos", "Histórico de pedidos"] },
  "Estoque · Tecidos": { titulo: "Estoque de tecidos", descricao: "Saldo, lote e movimentações de matéria-prima.", entregas: ["Entradas, saídas e reservas", "Lotes e localização", "Alerta de estoque mínimo"] },
  "Estoque · Aviamentos": { titulo: "Estoque de aviamentos", descricao: "Saldo e reposição dos itens complementares.", entregas: ["Entradas e baixas", "Estoque mínimo", "Inventário"] },
  Sustentabilidade: { titulo: "Sustentabilidade", descricao: "Acompanhamento dos resíduos têxteis e seus destinos.", entregas: ["Registro de resíduo em kg", "Destino e comprovantes", "Indicadores de reaproveitamento"] },
  Relatórios: { titulo: "Relatórios", descricao: "Consultas consolidadas para decisão operacional.", entregas: ["Filtros por período", "Exportação de dados", "Indicadores de custo e produção"] },
  Integrações: { titulo: "Integrações", descricao: "Conexões com serviços externos e acompanhamento de sincronização.", entregas: ["Configuração segura", "Status real da sincronização", "Logs e tratamento de falhas"] },
};

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z", fabric: "M4 7c3-3 5 3 8 0s5 3 8 0M4 12c3-3 5 3 8 0s5 3 8 0M4 17c3-3 5 3 8 0s5 3 8 0", box: "M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4M12 11v10", layers: "M12 3l8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4", spark: "M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z", people: "M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9.5 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 11a3 3 0 1 0 0-6M21 20v-2a4 4 0 0 0-3-3.87", file: "M6 2h8l4 4v16H6zM14 2v5h5M9 13h6M9 17h6", product: "M4 7l8-4 8 4v10l-8 4-8-4zM4 7l8 4 8-4", orders: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5", check: "M5 12l4 4L19 6", settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 13.5v-3l2.2-.8.7-1.7-1-2.1 2.1-2.1 2.1 1 .7-.3.8-2.2h3l.8 2.2.7.3 2.1-1 2.1 2.1-1 2.1.7 1.7 2.2.8v3l-2.2.8-.7 1.7 1 2.1-2.1 2.1-2.1-1-.7.3-.8 2.2h-3l-.8-2.2-.7-.3-2.1 1-2.1-2.1 1-2.1-.7-1.7z", report: "M5 3h14v18H5zM8 16v-4M12 16V8M16 16v-6", chevron: "M9 18l6-6-6-6", menu: "M4 7h16M4 12h16M4 17h16", search: "M10.8 10.8m-6.8 0a6.8 6.8 0 1 0 13.6 0a6.8 6.8 0 1 0-13.6 0M16 16l5 5", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={paths[name]} /></svg>;
}

function App() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [buscaSistema, setBuscaSistema] = useState("");
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const module = tarefas[activeNav] ?? { titulo: activeNav, descricao: "Área em estruturação.", entregas: ["Definir escopo", "Criar componentes", "Integrar API"] };
  function navigate(id: string) { setActiveNav(id); setSidebarOpen(false); setBuscaSistema(""); setNotificacoesAbertas(false); }
  const resultadosBusca = groups.flatMap((grupo) => grupo.items).filter(([id, , label]) => {
    const termo = buscaSistema.trim().toLocaleLowerCase("pt-BR");
    return termo && `${id} ${label ?? ""}`.toLocaleLowerCase("pt-BR").includes(termo);
  }).slice(0, 5);
  const paginaDeAnalise = activeNav === "Relatórios" || activeNav === "Integrações";
  const paginaComTelaPropria = activeNav === "Pedidos" || activeNav === "Produtos" || paginaDeAnalise;
  const areaAtual = activeNav === "Pedidos" ? "Comercial" : activeNav === "Produtos" ? "Engenharia" : activeNav === "Produção · Pedidos" ? "Produção" : paginaDeAnalise ? "Análises" : "Fabrika";

  return <div className="app-shell">
    <aside className={sidebarOpen ? "sidebar open" : "sidebar"} aria-label="Menu principal">
      <div className="brand"><div className="brand-mark">FBK<span>fabrika</span></div><div className="brand-description">PRODUÇÃO<br/>INTELIGENTE</div><button className="close-nav" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu">×</button></div>
      <nav>{groups.map(group => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.items.map(([id, icon, label]) => <button key={id} className={activeNav === id ? "active" : ""} onClick={() => navigate(id)}><Icon name={icon}/><span>{label ?? id}</span>{id === "Ficha técnica" && <Icon name="chevron"/>}</button>)}</div>)}</nav>
      <div className="sidebar-bottom"><div className="user"><div className="avatar">AC</div><div><b>Administrador</b><span>Equipe Fabrika</span></div></div></div>
    </aside>
    {sidebarOpen && <button className="backdrop" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" />}
    <main><header className="topbar">
      <button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Icon name="menu"/></button>
      <div className="breadcrumb"><span>{areaAtual}</span><b>/</b><strong>{module.titulo}</strong></div>
      <div className="topbar-right">
        <div className="topbar-search-wrap"><Icon name="search"/><input aria-label="Buscar no sistema" placeholder="Buscar no sistema..." value={buscaSistema} onChange={(evento) => setBuscaSistema(evento.target.value)}/>
          {buscaSistema && <div className="topbar-search-results">{resultadosBusca.length ? resultadosBusca.map(([id, , label]) => <button key={id} type="button" onClick={() => navigate(id)}>{label ?? id}</button>) : <span>Nenhuma tela encontrada</span>}</div>}
        </div>
        <span className="sync"><i className="sync-dot"/>Dados salvos localmente</span>
        <div className="notification-wrap"><button className="notifications-button" type="button" onClick={() => setNotificacoesAbertas((aberta) => !aberta)} aria-expanded={notificacoesAbertas}><Icon name="bell"/> Notificações</button>{notificacoesAbertas && <div className="notifications-popover"><strong>Notificações</strong><p>Nenhuma notificação nova no momento.</p></div>}</div>
      </div>
    </header>
      <section className={`page ${paginaComTelaPropria ? "page--module" : ""}`}>{!paginaComTelaPropria && <div className="page-heading"><div><p className="eyebrow">Módulo em estruturação</p><h1>{module.titulo}</h1><p>{module.descricao}</p></div><span className="status">ESQUELETO</span></div>}{activeNav === "Dashboard" ? <Dashboard onNavigate={navigate}/> : activeNav === "Pedidos" ? <PedidosPage/> : activeNav === "Produtos" ? <ProdutosPage/> : paginaDeAnalise ? <AnalisesReferencia tipo={activeNav === "Relatórios" ? "relatorios" : "integracoes"}/> : <ModuleGuide title={module.titulo} items={module.entregas}/>}</section>
    </main>
  </div>;
}

function Dashboard({ onNavigate }: { onNavigate: (id: string) => void }) {
  const cards = [["Pedidos em aberto", "—", "Comercial", "Pedidos"], ["OPs em andamento", "—", "Produção", "Produção · Pedidos"], ["Estoque crítico", "—", "Suprimentos", "Estoque · Tecidos"], ["Resíduos no mês", "—", "Sustentabilidade", "Sustentabilidade"]];
  return <><div className="summary-grid">{cards.map(([label, value, area, id]) => <button key={label} className="summary-card" onClick={() => onNavigate(id)}><span>{label}</span><strong>{value}</strong><small>{area}</small></button>)}</div><div className="dashboard-grid"><section className="panel"><div className="panel-heading"><div><h2>Visão da produção</h2><p>Área reservada para indicadores.</p></div><span>TODO</span></div><div className="chart-placeholder"><i/><i/><i/><i/><i/><i/></div></section><section className="panel"><div className="panel-heading"><div><h2>Próximas implementações</h2><p>Prioridades para dividir no time.</p></div></div><ul className="task-list"><li>Conectar os cards a fontes de dados.</li><li>Implementar alertas e regras de negócio.</li><li>Adicionar filtros e gráficos reais.</li></ul></section></div></>;
}

function ModuleGuide({ title, items }: { title: string; items: string[] }) {
  return <div className="module-layout"><section className="panel"><div className="panel-heading"><div><h2>O que implementar</h2><p>Use esta tela como ponto de partida do módulo.</p></div></div><ol className="implementation-list">{items.map(item => <li key={item}>{item}</li>)}</ol></section><section className="panel wireframe"><span>ÁREA RESERVADA</span><h2>{title}</h2><p>Crie aqui os componentes, estados, validações e integrações deste módulo.</p><div><i/><i/><i/></div></section><aside className="notes"><b>Combinado do projeto</b><p>Não coloque regras críticas somente no front-end. Deixe contratos de API e validações documentados antes de conectar os dados.</p></aside></div>;
}

export default App;
