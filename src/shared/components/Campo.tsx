import { useId, cloneElement, isValidElement, type ReactElement } from "react"

interface CampoProps {
  rotulo: string
  obrigatorio?: boolean
  /** Mensagem de erro. Quando existe, o campo fica destacado. */
  erro?: string
  /** Um único <input>, <select> ou <textarea> */
  children: ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string; required?: boolean }>
}

/** Rótulo + controle + mensagem de erro, já ligados por id (acessível).
 *  Ex.: <Campo rotulo="Nome" obrigatorio erro={erro}><input value=... /></Campo> */
export function Campo({ rotulo, obrigatorio, erro, children }: CampoProps) {
  const id = useId()
  const idErro = `${id}-erro`
  const controle = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-invalid": erro ? true : undefined,
        "aria-describedby": erro ? idErro : undefined,
        required: obrigatorio,
      })
    : children
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        {rotulo} {obrigatorio && <span className="campo-obrigatorio" aria-hidden="true">*</span>}
      </label>
      {controle}
      {erro && <span className="campo-erro" id={idErro} role="alert">{erro}</span>}
    </div>
  )
}
