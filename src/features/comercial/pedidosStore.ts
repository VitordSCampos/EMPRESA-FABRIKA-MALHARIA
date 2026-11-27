/*
 * A persistência em localStorage serve apenas para a demonstração no navegador.
 * Na integração, substituir carregar/salvar por chamadas à API e manter os tipos.
 */

export const PEDIDOS_STORAGE_KEY = "fabrika.pedidos.v1";
export const PEDIDOS_ATUALIZADOS_EVENT = "fabrika:pedidos-atualizados";
export const FICHAS_TECNICAS_STORAGE_KEY = "fabrika.fichas-tecnicas.v1";

export const STATUS_PEDIDO = ["Em análise", "Em produção", "Pronto", "Entregue"] as const;
export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export interface FichaTecnicaVinculo {
  id: string;
  codigo: string;
  produto: string;
  versao?: string;
  status?: string;
}

export interface ItemPedido {
  id: string;
  produto: string;
  quantidade: number;
  valorUnitario: number;
  fichaTecnica: FichaTecnicaVinculo | null;
}

export interface Pedido {
  id: string;
  cliente: string;
  dataPedido: string; // ISO: YYYY-MM-DD
  dataEntrega: string; // ISO: YYYY-MM-DD
  status: StatusPedido;
  itens: ItemPedido[];
  observacao: string;
}

function lerJson<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const conteudo = window.localStorage.getItem(chave);
    return conteudo ? (JSON.parse(conteudo) as T) : padrao;
  } catch {
    return padrao;
  }
}

export function carregarPedidos(): Pedido[] {
  const dados = lerJson<unknown>(PEDIDOS_STORAGE_KEY, []);
  if (!Array.isArray(dados)) return [];
  return dados.filter((item): item is Pedido => Boolean(
    item && typeof item === "object" &&
    typeof (item as Pedido).id === "string" &&
    typeof (item as Pedido).cliente === "string" &&
    Array.isArray((item as Pedido).itens)
  ));
}

export function salvarPedidos(pedidos: Pedido[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PEDIDOS_STORAGE_KEY, JSON.stringify(pedidos));
    window.dispatchEvent(new Event(PEDIDOS_ATUALIZADOS_EVENT));
  } catch {
    // A interface continua utilizável em memória; a camada de API substituirá este fallback.
  }
}

/**
 * Contrato de leitura esperado da futura tela/API de Ficha Técnica:
 * [{ id, codigo, produto, versao?, status? }].
 * Aceita também `nomeProduto` ou `nome` para facilitar a integração gradual.
 */
export function salvarFichasTecnicas(fichas: FichaTecnicaVinculo[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FICHAS_TECNICAS_STORAGE_KEY, JSON.stringify(fichas));
    window.dispatchEvent(new CustomEvent("fabrika:fichas-atualizadas"));
  } catch {
    // A API será a fonte oficial quando a integração for concluída.
  }
}

export function carregarFichasTecnicas(): FichaTecnicaVinculo[] {
  const dados = lerJson<unknown>(FICHAS_TECNICAS_STORAGE_KEY, []);
  if (!Array.isArray(dados)) return [];

  return dados.flatMap((item): FichaTecnicaVinculo[] => {
    if (!item || typeof item !== "object") return [];
    const registro = item as Record<string, unknown>;
    const id = String(registro.id ?? "").trim();
    const codigo = String(registro.codigo ?? "").trim();
    const produto = String(registro.produto ?? registro.nomeProduto ?? registro.nome ?? "").trim();
    if (!id || !codigo || !produto) return [];
    return [{
      id,
      codigo,
      produto,
      ...(registro.versao ? { versao: String(registro.versao) } : {}),
      ...(registro.status ? { status: String(registro.status) } : {}),
    }];
  });
}

export function dataHojeISO(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

export function formatarData(data: string): string {
  if (!data) return "—";
  const [ano, mes, dia] = data.slice(0, 10).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : data;
}

export function quantidadeDoPedido(pedido: Pedido): number {
  return pedido.itens.reduce((total, item) => total + (Number(item.quantidade) || 0), 0);
}

export function valorDoPedido(pedido: Pedido): number {
  return pedido.itens.reduce((total, item) => total + (Number(item.quantidade) || 0) * (Number(item.valorUnitario) || 0), 0);
}

export function gerarIdPedido(pedidos: Pedido[]): string {
  const maiorNumero = pedidos.reduce((maior, pedido) => {
    const numero = Number(pedido.id.replace(/\D/g, ""));
    return Number.isFinite(numero) ? Math.max(maior, numero) : maior;
  }, 1000);
  return String(maiorNumero + 1).padStart(4, "0");
}

export function gerarIdItem(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `item-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
