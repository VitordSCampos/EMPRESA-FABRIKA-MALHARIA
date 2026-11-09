// Estado compartilhado entre módulos (React Context, sem biblioteca extra).
// Guarde aqui só o que CRUZA telas: preços de materiais, produtos criados...
// Estado de uma tela só (filtro, modal aberto) fica no próprio componente.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { aviamentosMock, beneficiamentosMock, produtosMock, tecidosMock } from "@/shared/mock/dados"
import type { Aviamento, Beneficiamento, Produto, Tecido } from "@/shared/types"

interface AppState {
  tecidos: Tecido[]
  aviamentos: Aviamento[]
  beneficiamentos: Beneficiamento[]
  produtos: Produto[]
  /** Atualiza o preço de um tecido (ex.: tela de Cadastro > Tecidos). */
  atualizarPrecoTecido: (codigo: string, preco: number) => void
  /** Adiciona um produto (ex.: ao aprovar uma ficha técnica). */
  adicionarProduto: (produto: Produto) => void
}

const AppStateContext = createContext<AppState | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [tecidos, setTecidos] = useState<Tecido[]>(tecidosMock)
  const [aviamentos] = useState<Aviamento[]>(aviamentosMock)
  const [beneficiamentos] = useState<Beneficiamento[]>(beneficiamentosMock)
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock)

  const atualizarPrecoTecido = useCallback((codigo: string, preco: number) => {
    setTecidos((atual) => atual.map((t) => (t.codigo === codigo ? { ...t, preco } : t)))
  }, [])

  const adicionarProduto = useCallback((produto: Produto) => {
    setProdutos((atual) => [...atual, produto])
  }, [])

  const valor = useMemo<AppState>(
    () => ({ tecidos, aviamentos, beneficiamentos, produtos, atualizarPrecoTecido, adicionarProduto }),
    [tecidos, aviamentos, beneficiamentos, produtos, atualizarPrecoTecido, adicionarProduto],
  )

  return <AppStateContext.Provider value={valor}>{children}</AppStateContext.Provider>
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState precisa estar dentro de <AppStateProvider>")
  return ctx
}
