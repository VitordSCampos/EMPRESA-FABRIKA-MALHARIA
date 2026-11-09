// Liga cada caminho (definido em menu.ts) ao componente da tela.
// Para criar uma tela: crie o arquivo em src/features/<dominio>/ e adicione UMA linha aqui.

import type { ComponentType } from "react"
import { Link, ParamsProvider, casar, useCaminho } from "./router"
import { PageHeader } from "@/shared/components/PageHeader"

import DashboardPage from "@/features/dashboard/DashboardPage"
import PedidosPage from "@/features/comercial/PedidosPage"
import ClientesPage from "@/features/comercial/ClientesPage"
import TecidosPage from "@/features/cadastros/TecidosPage"
import AviamentosPage from "@/features/cadastros/AviamentosPage"
import ModelagemPage from "@/features/cadastros/ModelagemPage"
import BeneficiamentosPage from "@/features/cadastros/BeneficiamentosPage"
import FornecedoresPage from "@/features/cadastros/FornecedoresPage"
import ProdutosPage from "@/features/engenharia/ProdutosPage"
import FichaTecnicaPage from "@/features/engenharia/FichaTecnicaPage"
import NovaFichaTecnicaPage from "@/features/engenharia/NovaFichaTecnicaPage"
import OrdensDeProducaoPage from "@/features/pcp/OrdensDeProducaoPage"
import ProgramacaoPage from "@/features/pcp/ProgramacaoPage"
import NecessidadeDeMateriaisPage from "@/features/pcp/NecessidadeDeMateriaisPage"
import EstoquePage from "@/features/suprimentos/EstoquePage"
import ComprasPage from "@/features/suprimentos/ComprasPage"
import SobrasPage from "@/features/suprimentos/SobrasPage"
import ApontamentoPage from "@/features/producao/ApontamentoPage"
import MaquinasPage from "@/features/producao/MaquinasPage"
import CustosPage from "@/features/financas/CustosPage"
import PrecificacaoPage from "@/features/financas/PrecificacaoPage"
import NotasFiscaisPage from "@/features/financas/NotasFiscaisPage"
import ContasPage from "@/features/financas/ContasPage"
import SustentabilidadePage from "@/features/analises/SustentabilidadePage"
import RelatoriosPage from "@/features/analises/RelatoriosPage"
import IntegracoesPage from "@/features/analises/IntegracoesPage"
import GuiaDeComponentesPage from "@/features/dev/GuiaDeComponentesPage"

const telas: { path: string; Tela: ComponentType }[] = [
  { path: "/", Tela: DashboardPage },
  { path: "/comercial/pedidos", Tela: PedidosPage },
  { path: "/comercial/clientes", Tela: ClientesPage },
  { path: "/cadastro/tecidos", Tela: TecidosPage },
  { path: "/cadastro/aviamentos", Tela: AviamentosPage },
  { path: "/cadastro/modelagem", Tela: ModelagemPage },
  { path: "/cadastro/beneficiamentos", Tela: BeneficiamentosPage },
  { path: "/cadastro/fornecedores", Tela: FornecedoresPage },
  { path: "/engenharia/produtos", Tela: ProdutosPage },
  { path: "/engenharia/ficha-tecnica", Tela: FichaTecnicaPage },
  { path: "/engenharia/ficha-tecnica/nova", Tela: NovaFichaTecnicaPage },
  { path: "/pcp/ordens-de-producao", Tela: OrdensDeProducaoPage },
  { path: "/pcp/programacao", Tela: ProgramacaoPage },
  { path: "/pcp/necessidade-de-materiais", Tela: NecessidadeDeMateriaisPage },
  { path: "/suprimentos/estoque", Tela: EstoquePage },
  { path: "/suprimentos/compras", Tela: ComprasPage },
  { path: "/suprimentos/sobras", Tela: SobrasPage },
  { path: "/producao/apontamento", Tela: ApontamentoPage },
  { path: "/producao/maquinas", Tela: MaquinasPage },
  { path: "/financas/custos", Tela: CustosPage },
  { path: "/financas/precificacao", Tela: PrecificacaoPage },
  { path: "/financas/notas-fiscais", Tela: NotasFiscaisPage },
  { path: "/financas/contas", Tela: ContasPage },
  { path: "/analises/sustentabilidade", Tela: SustentabilidadePage },
  { path: "/analises/relatorios", Tela: RelatoriosPage },
  { path: "/analises/integracoes", Tela: IntegracoesPage },
  ...(import.meta.env.DEV ? [{ path: "/dev/componentes", Tela: GuiaDeComponentesPage }] : []),
]

function NaoEncontrada() {
  return (
    <div className="pagina">
      <PageHeader eyebrow="ERRO 404" titulo="Tela não encontrada" descricao="O endereço não existe neste sistema." />
      <Link para="/" className="btn btn--primario">Voltar ao Dashboard</Link>
    </div>
  )
}

/** Mostra a tela que corresponde ao endereço atual. */
export function TelaAtual() {
  const caminho = useCaminho()
  for (const { path, Tela } of telas) {
    const params = casar(path, caminho)
    if (params) return <ParamsProvider value={params}><Tela /></ParamsProvider>
  }
  return <NaoEncontrada />
}
