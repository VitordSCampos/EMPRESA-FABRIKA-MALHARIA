// ÚNICA fonte de dados fictícios do projeto.
// Regra: nome, código e preço são os mesmos em TODAS as telas.
// Nada de lorem ipsum. Moeda R$ 1.234,56 · datas dd/mm/aaaa · tudo em PT-BR.

import type { Aviamento, Beneficiamento, Fornecedor, Produto, Tecido } from "@/shared/types"

export const tecidosMock: Tecido[] = [
  { codigo: "TEC-001", nome: "Meia malha algodão", composicao: "100% algodão", gramatura: "180 g/m²", largura: "1,80 m", fornecedor: "Têxtil Aurora", preco: 32, estoque: 842, estoqueMinimo: 250 },
  { codigo: "TEC-002", nome: "Ribana 2x1", composicao: "96% algodão, 4% elastano", gramatura: "220 g/m²", largura: "1,20 m", fornecedor: "Têxtil Aurora", preco: 28, estoque: 126, estoqueMinimo: 150 },
  { codigo: "TEC-003", nome: "Moletom flanelado", composicao: "50% algodão, 50% poliéster", gramatura: "310 g/m²", largura: "1,75 m", fornecedor: "Têxtil Aurora", preco: 45, estoque: 64, estoqueMinimo: 180 },
  { codigo: "TEC-004", nome: "Piquet", composicao: "100% algodão", gramatura: "200 g/m²", largura: "1,80 m", fornecedor: "Têxtil Aurora", preco: 36, estoque: 318, estoqueMinimo: 200 },
]

export const aviamentosMock: Aviamento[] = [
  { codigo: "AVI-001", nome: "Botão 4 furos", unidade: "un", fornecedor: "Aviamentos Bom Retiro", preco: 0.35, estoque: 4820, estoqueMinimo: 1000 },
  { codigo: "AVI-002", nome: "Zíper 20 cm", unidade: "un", fornecedor: "Aviamentos Bom Retiro", preco: 2.1, estoque: 148, estoqueMinimo: 200 },
  { codigo: "AVI-003", nome: "Etiqueta tecida", unidade: "un", fornecedor: "Aviamentos Bom Retiro", preco: 0.6, estoque: 2360, estoqueMinimo: 500 },
  { codigo: "AVI-004", nome: "Elástico", unidade: "m", fornecedor: "Aviamentos Bom Retiro", preco: 1.2, estoque: 82, estoqueMinimo: 180 },
]

export const beneficiamentosMock: Beneficiamento[] = [
  { codigo: "BEN-001", nome: "Estampa silk", operacao: "Terceirizado", fornecedor: "Estamparia Cor & Fio", preco: 4.5, prazoDias: 3 },
  { codigo: "BEN-002", nome: "Bordado", operacao: "Terceirizado", fornecedor: "Estamparia Cor & Fio", preco: 6, prazoDias: 4 },
  { codigo: "BEN-003", nome: "Tingimento", operacao: "Interno", fornecedor: "Fabrika Malharias", preco: 3.2, prazoDias: 2 },
]

export const produtosMock: Produto[] = [
  { codigo: "PROD-001", nome: "Camiseta Básica Meia Malha", colecao: "Essenciais", statusFicha: "Aprovada", custo: 54.08 },
  { codigo: "PROD-002", nome: "Polo Piquet", colecao: "Clássicos", statusFicha: "Em teste", custo: 69.85 },
  { codigo: "PROD-003", nome: "Moletom Canguru", colecao: "Inverno 26", statusFicha: "Aprovada", custo: 114.22 },
  { codigo: "PROD-004", nome: "Cardigan Canelado", colecao: "Inverno 26", statusFicha: "Sem ficha", custo: null },
]

export const fornecedoresMock: Fornecedor[] = [
  { nome: "Têxtil Aurora", cnpj: "42.119.750/0001-30", contato: "Marcos · (11) 3222-1300", prazoMedioDias: 7 },
  { nome: "Aviamentos Bom Retiro", cnpj: "09.380.224/0001-08", contato: "Lívia · (11) 3392-8800", prazoMedioDias: 3 },
  { nome: "Estamparia Cor & Fio", cnpj: "17.981.443/0001-20", contato: "Célia · (11) 2941-5500", prazoMedioDias: 4 },
]
