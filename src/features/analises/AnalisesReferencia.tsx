import "./analises-referencia.css";

type Tipo = "relatorios" | "integracoes";
type Cartao = { titulo: string; descricao: string; variante: "cinza" | "elipses" | "preto" | "bege" };

const dados: Record<Tipo, Cartao[]> = {
  relatorios: [
    { titulo: "Custo por produto", descricao: "Composição e evolução dos custos", variante: "cinza" },
    { titulo: "Resíduo têxtil por produto", descricao: "Previsto versus realizado", variante: "elipses" },
    { titulo: "Produção x Meta", descricao: "Eficiência por período e setor", variante: "preto" },
    { titulo: "Materiais por fornecedor", descricao: "Volume, prazo e variação de preço", variante: "bege" },
  ],
  integracoes: [
    { titulo: "E-commerce", descricao: "Sincronização de pedidos", variante: "cinza" },
    { titulo: "Fornecedores", descricao: "Atualização de materiais e preços", variante: "elipses" },
    { titulo: "Sensores das máquinas", descricao: "Telemetria do chão de fábrica", variante: "preto" },
    { titulo: "Produtos", descricao: "Catálogo e preços sugeridos", variante: "bege" },
  ],
};

export function AnalisesReferencia({ tipo }: { tipo: Tipo }) {
  const relatorios = tipo === "relatorios";
  return <div className="ref-analises">
    <header className="ref-analises-heading">
      <p>ANÁLISE E CONECTIVIDADE</p>
      <h1>{relatorios ? "Relatórios" : "Integrações"}</h1>
      <span>{relatorios ? "Indicadores consolidados para decisões mais rápidas." : "Monitore os serviços conectados ao ecossistema Fabrika."}</span>
    </header>
    <div className="ref-analises-grid">
      {dados[tipo].map((item) => <article className="ref-analises-card" key={item.titulo}>
        <div className={`ref-analises-thumb ref-analises-thumb--${item.variante}`} aria-hidden="true">
          <div className="ref-analises-chart">{[30, 58, 44, 70].map((altura, i) => <span key={i} style={{ height: altura }} />)}</div>
        </div>
        <p className="ref-analises-tag">{relatorios ? "RELATÓRIO" : "INTEGRAÇÃO: NÃO CONFIGURADA"}</p>
        <h2>{item.titulo}</h2>
        <p className="ref-analises-description">{item.descricao}</p>
        <button type="button" disabled title="Funcionalidade ainda não implementada">{relatorios ? "Abrir e exportar" : "Testar conexão"}</button>
      </article>)}
    </div>
    <p className="ref-analises-note">{relatorios ? "Relatórios e exportação estão em desenvolvimento." : "As integrações ainda não foram conectadas."}</p>
  </div>;
}
