interface StepperProps {
  etapas: string[]
  /** Índice da etapa atual, começando em 0 */
  atual: number
}

/** Indicador de etapas (ex.: Cliente → Itens → Prazo → Resumo). Só mostra; quem usa controla a etapa. */
export function Stepper({ etapas, atual }: StepperProps) {
  return (
    <ol className="stepper" aria-label="Etapas">
      {etapas.map((etapa, i) => (
        <li key={etapa} className={i < atual ? "concluida" : ""} aria-current={i === atual ? "step" : undefined}>
          {i + 1} · {etapa}
        </li>
      ))}
    </ol>
  )
}
