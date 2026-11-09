// Tipos compartilhados entre as frentes. Mudou algo aqui? Avise o time no PR.

export type UnidadeMedida = "m" | "un" | "peça"

export interface Tecido {
  codigo: string
  nome: string
  composicao: string
  gramatura: string
  largura: string
  fornecedor: string
  /** Preço por metro (R$) */
  preco: number
  /** Estoque atual em metros */
  estoque: number
  estoqueMinimo: number
}

export interface Aviamento {
  codigo: string
  nome: string
  unidade: UnidadeMedida
  fornecedor: string
  preco: number
  estoque: number
  estoqueMinimo: number
}

export interface Beneficiamento {
  codigo: string
  nome: string
  operacao: "Interno" | "Terceirizado"
  fornecedor: string
  /** Preço por peça (R$) */
  preco: number
  prazoDias: number
}

export type StatusFicha = "Sem ficha" | "Em teste" | "Aprovada"

export interface Produto {
  codigo: string
  nome: string
  colecao: string
  statusFicha: StatusFicha
  /** Custo de produção vindo da ficha técnica (R$). null = ainda sem ficha */
  custo: number | null
}

export interface Fornecedor {
  nome: string
  cnpj: string
  contato: string
  prazoMedioDias: number
}

export type TipoMaterial = "tecido" | "aviamento" | "beneficiamento"
