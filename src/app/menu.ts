// MAPA DO SISTEMA: uma entrada por tela.
// Aqui ficam só DADOS (nome, grupo, frente responsável, escopo da tela).
// Para criar uma tela nova: 1) adicione a entrada aqui, 2) crie o componente
// em src/features/<dominio>/ e 3) registre em src/app/routes.tsx.
//
// Os "escopo" abaixo vêm do briefing do protótipo e aparecem na tela
// "em construção" para quem for implementá-la.

import type { NomeIcone } from "@/shared/components/Icon"

export type Frente = "F1" | "F2" | "F3" | "F4" | "F5" | "F6" | "F7" | "F8"

export interface RotaMeta {
  /** Caminho. Aceita parâmetros, ex.: "/comercial/pedidos/:id" */
  path: string
  titulo: string
  grupo: string
  icone: NomeIcone
  frente: Frente
  descricao: string
  /** O que precisa ser construído nesta tela (do briefing) */
  escopo: string[]
  /** Não aparece na sidebar (telas internas, ex.: "Nova ficha") */
  oculta?: boolean
  /** Rota pai, para o item da sidebar ficar ativo e o breadcrumb */
  pai?: string
  /** Só aparece em desenvolvimento (npm run dev) */
  somenteDev?: boolean
}

export const rotas: RotaMeta[] = [
  { path: "/", titulo: "Dashboard", grupo: "Visão geral", icone: "grid", frente: "F8",
    descricao: "Visão gerencial do dia.",
    escopo: ["Cards de KPI (produção, eficiência, máquinas ativas, OPs atrasadas, lixo têxtil)", "Gráfico de barras (produção) e de linha (eficiência)", "Grade de máquinas com status e lista de alertas", "Filtro de período: Hoje / 7 dias / 30 dias"] },

  // ----- Comercial -----
  { path: "/comercial/pedidos", titulo: "Pedidos", grupo: "Comercial", icone: "orders", frente: "F4",
    descricao: "Acompanhe pedidos, prazos e a situação da produção.",
    escopo: ["Tabela: nº, cliente, data, entrega, itens, valor, status", "'+ Novo pedido' com stepper: Cliente → Itens → Prazo → Resumo", "Detalhe com abas Itens | Produção | Financeiro", "Botão 'Gerar ordem de produção'"] },
  { path: "/comercial/clientes", titulo: "Clientes", grupo: "Comercial", icone: "users", frente: "F4",
    descricao: "Cadastre clientes e consulte o histórico de pedidos.",
    escopo: ["Tabela de clientes", "Modal de cadastro (nome, CNPJ/CPF, contato)", "Histórico de pedidos por cliente"] },

  // ----- Cadastro -----
  { path: "/cadastro/tecidos", titulo: "Tecidos", grupo: "Cadastro", icone: "fabric", frente: "F3",
    descricao: "Materiais, preços vigentes e posição de estoque.",
    escopo: ["Tabela + '+ Novo' + modal de edição", "Campos: código, nome, composição, gramatura, largura, cor, fornecedor, preço/m, estoque", "Ao alterar o preço: toast 'O custo de N fichas técnicas será recalculado'"] },
  { path: "/cadastro/aviamentos", titulo: "Aviamentos", grupo: "Cadastro", icone: "box", frente: "F3",
    descricao: "Controle de aviamentos, fornecedores e estoque mínimo.",
    escopo: ["Tabela + modal", "Campos: código, nome, unidade, fornecedor, preço unitário, estoque mínimo"] },
  { path: "/cadastro/modelagem", titulo: "Modelagem", grupo: "Cadastro", icone: "layers", frente: "F3",
    descricao: "Modelos, consumo previsto e tabelas de medidas.",
    escopo: ["Tabela + modal", "Consumo de tecido por peça, tabela de medidas por tamanho", "Upload de molde (fake) e status: Em teste / Ajustando / Aprovada"] },
  { path: "/cadastro/beneficiamentos", titulo: "Beneficiamentos", grupo: "Cadastro", icone: "spark", frente: "F3",
    descricao: "Serviços internos e terceirizados aplicados aos produtos.",
    escopo: ["Tabela + modal", "Tipo (estampa, bordado, tingimento), interno/terceirizado, fornecedor, preço/peça, prazo"] },
  { path: "/cadastro/fornecedores", titulo: "Fornecedores", grupo: "Cadastro", icone: "users", frente: "F3",
    descricao: "Parceiros, condições comerciais e materiais fornecidos.",
    escopo: ["Tabela + modal (razão social, CNPJ, contato, prazo médio)", "Detalhe com aba 'Materiais e preços'"] },

  // ----- Engenharia -----
  { path: "/engenharia/produtos", titulo: "Produtos", grupo: "Engenharia", icone: "product", frente: "F2",
    descricao: "Portfólio de produtos e situação das fichas técnicas.",
    escopo: ["Lista com foto, nome, código, coleção, status da ficha e custo", "'+ Novo produto' (modal)", "Produtos aprovados na ficha aparecem aqui"] },
  { path: "/engenharia/ficha-tecnica", titulo: "Ficha técnica", grupo: "Engenharia", icone: "file", frente: "F2",
    descricao: "Versões e custos de produção aprovados.",
    escopo: ["Lista de fichas: produto, versão, status, custo, data", "Botão '+ Nova' leva à tela de nova ficha"] },
  { path: "/engenharia/ficha-tecnica/nova", titulo: "Nova", grupo: "Engenharia", icone: "file", frente: "F2", oculta: true, pai: "/engenharia/ficha-tecnica",
    descricao: "Crie o produto, configure os insumos e defina o preço de venda.",
    escopo: ["Abas: Composição, Resíduo têxtil, Custos, Precificação", "Linhas de tecido/aviamento/beneficiamento com preço automático e subtotal", "Painel lateral 'Resumo de custos' recalculando em tempo real (usar utils/calculos.ts)", "Barra de status: Rascunho → Em teste → Ajuste de modelagem → Aprovada", "Histórico de versões e frete por CEP (mock)"] },

  // ----- PCP -----
  { path: "/pcp/ordens-de-producao", titulo: "Ordens de produção", grupo: "PCP", icone: "calendar", frente: "F5",
    descricao: "Planeje, libere e acompanhe a execução das ordens.",
    escopo: ["Tabela com toggle Tabela/Kanban", "Detalhe da OP: ficha vinculada, materiais, etapas com progresso", "'Liberar para produção' com aviso de falta de material"] },
  { path: "/pcp/programacao", titulo: "Programação", grupo: "PCP", icone: "calendar", frente: "F5",
    descricao: "Agenda semanal de máquinas e setores produtivos.",
    escopo: ["Gantt semanal: linhas = máquinas/setores, barras = OPs", "Clicar na barra abre a OP", "Seletor de semana funcional"] },
  { path: "/pcp/necessidade-de-materiais", titulo: "Necessidade de materiais", grupo: "PCP", icone: "box", frente: "F5",
    descricao: "Necessidades calculadas pelas fichas técnicas das OPs.",
    escopo: ["Tabela: material, necessário, em estoque, falta", "Botão 'Gerar compra'"] },

  // ----- Suprimentos -----
  { path: "/suprimentos/estoque", titulo: "Estoque", grupo: "Suprimentos", icone: "box", frente: "F6",
    descricao: "Consulte saldos e mínimos por categoria de item.",
    escopo: ["Abas Tecidos | Aviamentos (e demais)", "Saldo, mínimo, status (OK/Baixo/Crítico) com barra de nível", "Botões 'Entrada' (com anexo de NF) e 'Ajuste'"] },
  { path: "/suprimentos/compras", titulo: "Compras", grupo: "Suprimentos", icone: "orders", frente: "F6",
    descricao: "Pedidos de compra e recebimentos de fornecedores.",
    escopo: ["Tabela: nº, fornecedor, itens, valor, previsão, status", "'+ Novo' pré-preenchido a partir da Necessidade de materiais", "Botão 'Receber' leva à Entrada do estoque"] },
  { path: "/suprimentos/sobras", titulo: "Sobras e lixo têxtil", grupo: "Suprimentos", icone: "fabric", frente: "F6",
    descricao: "Compare perdas previstas e reais e registre reaproveitamento.",
    escopo: ["Registro de sobras por OP (material, quantidade, motivo, reaproveitável)", "Cards: perda real, perda prevista, kg no mês", "Gráfico previsto x real", "Botão 'Atualizar % de perda na ficha técnica'"] },

  // ----- Produção -----
  { path: "/producao/apontamento", titulo: "Apontamento", grupo: "Produção", icone: "check", frente: "F7",
    descricao: "Registre a execução das etapas diretamente no chão de fábrica.",
    escopo: ["Estilo tablet, botões grandes", "Selecionar OP e etapa; quantidade produzida, defeitos e sobra", "Iniciar / Pausar / Finalizar com cronômetro", "Ao finalizar: atualiza a OP e lança a sobra em Suprimentos"] },
  { path: "/producao/maquinas", titulo: "Máquinas", grupo: "Produção", icone: "settings", frente: "F7",
    descricao: "Eficiência, operação atual e manutenção dos equipamentos.",
    escopo: ["Grade de cards: máquina, tipo, status, OP atual, eficiência, última manutenção", "Detalhe com gráfico de sensores", "'Agendar manutenção' (modal com data)"] },

  // ----- Finanças -----
  { path: "/financas/custos", titulo: "Custos", grupo: "Finanças", icone: "cost", frente: "F8",
    descricao: "Custos consolidados a partir das fichas técnicas.",
    escopo: ["Lista de produtos com custo: tecidos, aviamentos, beneficiamentos, perda, custo final", "Clicar abre o detalhamento (somente leitura)"] },
  { path: "/financas/precificacao", titulo: "Precificação", grupo: "Finanças", icone: "cost", frente: "F8",
    descricao: "Transforme o custo da ficha técnica em preço de venda.",
    escopo: ["Selecionar produto; custo de produção somente leitura", "Impostos, comissão, taxa de cartão, frete e margem editáveis", "Preço de venda sugerido em tempo real (utils/calculos.ts)", "Gráfico de composição do preço e 'Simular cenário' (à vista x cartão)"] },
  { path: "/financas/notas-fiscais", titulo: "Notas fiscais", grupo: "Finanças", icone: "file", frente: "F8",
    descricao: "Emissão e acompanhamento das notas fiscais de venda.",
    escopo: ["Tabela de NFs: nº, cliente, valor, status", "'Emitir NF' com animação 'Consultando SEFAZ via API...' e chave fictícia"] },
  { path: "/financas/contas", titulo: "Contas", grupo: "Finanças", icone: "cost", frente: "F8",
    descricao: "Fluxo de contas a receber e a pagar.",
    escopo: ["Abas A receber | A pagar", "Tabela e cards de saldo"] },

  // ----- Análises -----
  { path: "/analises/sustentabilidade", titulo: "Sustentabilidade", grupo: "Análises", icone: "fabric", frente: "F8",
    descricao: "Indicadores calculados a partir das fichas técnicas e apontamentos.",
    escopo: ["Gráficos: resíduos gerados, utilizados e fora do aterro", "Filtro de período (Mês / Trimestre / Ano)"] },
  { path: "/analises/relatorios", titulo: "Relatórios", grupo: "Análises", icone: "chart", frente: "F8",
    descricao: "Indicadores consolidados para decisões mais rápidas.",
    escopo: ["Galeria de cards de relatório", "Cada card abre tela com filtros, gráfico e 'Exportar' (toast)"] },
  { path: "/analises/integracoes", titulo: "Integrações", grupo: "Análises", icone: "plug", frente: "F8",
    descricao: "Monitore os serviços conectados ao ecossistema Fabrika.",
    escopo: ["Cards: SEFAZ, Fornecedores, Sensores, Financeiro", "Status, última sincronização e 'Testar conexão' (loading → sucesso)"] },

  // ----- Só em desenvolvimento -----
  { path: "/dev/componentes", titulo: "Guia de componentes", grupo: "Desenvolvimento", icone: "code", frente: "F1", somenteDev: true,
    descricao: "Catálogo dos componentes compartilhados, com exemplos de uso.",
    escopo: [] },
]

/** Grupos na ordem em que aparecem na sidebar. */
export function gruposDoMenu(): { titulo: string; itens: RotaMeta[] }[] {
  const grupos: { titulo: string; itens: RotaMeta[] }[] = []
  for (const r of rotas) {
    if (r.oculta) continue
    if (r.somenteDev && !import.meta.env.DEV) continue
    let g = grupos.find((x) => x.titulo === r.grupo)
    if (!g) { g = { titulo: r.grupo, itens: [] }; grupos.push(g) }
    g.itens.push(r)
  }
  return grupos
}
