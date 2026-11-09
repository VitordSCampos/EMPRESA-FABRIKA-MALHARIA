import type { ButtonHTMLAttributes } from "react"

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "perigo" | "icone"
}

/** Botão padrão. Ex.: <Botao variante="primario" onClick={...}>Salvar</Botao> */
export function Botao({ variante = "primario", className = "", type = "button", ...resto }: BotaoProps) {
  return <button type={type} className={`btn btn--${variante} ${className}`.trim()} {...resto} />
}
