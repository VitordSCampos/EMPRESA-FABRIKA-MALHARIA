// Ícones em SVG (traço, herdam a cor do texto via currentColor).
// Para adicionar um ícone: crie a entrada em `icones` e use <Icon nome="..." />.

import type { ReactNode } from "react"

const icones = {
  grid: (<><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>),
  orders: (<><path d="M4 5h2l2.2 10.2a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 1.9-1.4L21 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>),
  fabric: (<><path d="M7 4c2 4 3 7 3 10a4 4 0 1 1-8 0c0-3 2-5 5-10Z" /><path d="M17 4c-2 4-3 7-3 10a4 4 0 1 0 8 0c0-3-2-5-5-10Z" /><path d="m9 10 6 3" /></>),
  box: (<><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="m3 8 9 5 9-5v9l-9 5-9-5Z" /><path d="M12 13v9" /></>),
  layers: (<><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>),
  spark: <path d="m13 2-2 8-8 2 8 2 2 8 2-8 6-2-6-2-2-8Z" />,
  product: (<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 3v4h8V3M8 12h8M8 16h5" /></>),
  file: (<><path d="M6 2h8l4 4v16H6V2Z" /><path d="M14 2v5h5M9 12h6M9 16h6" /></>),
  cost: (<><circle cx="12" cy="12" r="9" /><path d="M16 8.5c-.8-.8-2-1.2-3.5-1.2-2 0-3.5 1-3.5 2.5 0 3.7 7 1.8 7 5.2 0 1.4-1.4 2.3-3.5 2.3-1.5 0-2.9-.5-3.8-1.4M12.5 5v14" /></>),
  history: (<><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5M12 7v5l3 2" /></>),
  settings: (<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>),
  calendar: (<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></>),
  users: (<><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2.5.6 4 2.6 4 6" /></>),
  chart: (<><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>),
  plug: (<><path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0V8ZM12 17v5" /></>),
  bell: <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  trash: <path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6" />,
  save: (<><path d="M4 3h14l2 2v16H4V3Z" /><path d="M8 3v6h8V3M8 21v-8h8v8" /></>),
  play: <path d="m9 7 8 5-8 5V7Z" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  check: <path d="m5 12 4 4L19 6" />,
  clock: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>),
  inbox: (<><path d="M3 13l3-8h12l3 8v6H3v-6Z" /><path d="M3 13h5l1 3h6l1-3h5" /></>),
  code: <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
} satisfies Record<string, ReactNode>

export type NomeIcone = keyof typeof icones

interface IconProps {
  nome: NomeIcone
  /** Tamanho em px. Mínimo 24 (acessibilidade). */
  tamanho?: number
}

export function Icon({ nome, tamanho = 24 }: IconProps) {
  const t = Math.max(tamanho, 24)
  return (
    <svg
      width={t}
      height={t}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icones[nome]}
    </svg>
  )
}
