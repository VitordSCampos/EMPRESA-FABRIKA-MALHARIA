# Fabrika — Front end (Esqueleto F1 — Modo Wireframe Educacional)

Esqueleto do sistema PCP + ERP da Fabrika Malharias.

> 🎓 **Aviso para a equipe de desenvolvimento (estudantes):**  
> Este projeto foi configurado intencionalmente em **modo wireframe**. Toda a arquitetura (rotas, estado, TypeScript, componentes e contratos) está pronta e funcional, mas a **estilização visual final do Figma deve ser implementada por vocês!**

**Tecnologias:** HTML, CSS puro, TypeScript, React 19 e Vite.  
Sem frameworks de CSS externos (sem Tailwind, Bootstrap ou CSS-in-JS).

---

## Como rodar o projeto

```bash
npm install
npm run dev        # Acesse http://localhost:5173
npm run build      # Valida tipos do TypeScript e gera o build de produção
```

---

## 🎯 Desafio de Estilização & Design System (Figma)

Para transformar o wireframe no design oficial do Figma, a equipe deve seguir estas etapas:

### 1. Definir os Tokens de Design
Abra o arquivo [`src/styles/tokens.css`](src/styles/tokens.css).
- Inspecione o Figma e colete:
  - Paleta de cores oficial (fundo, superfície, cores da sidebar, textos e destaque).
  - Cores de status (sucesso, alerta, erro/perigo).
  - Família tipográfica (fontes de título e de corpo).
  - Medidas de cantos arredondados (`border-radius`) e sombras (`box-shadow`).
- Substitua as variáveis temporárias de wireframe pelos valores do design.

### 2. Estilizar o Layout Geral
Abra o arquivo [`src/styles/layout.css`](src/styles/layout.css).
- Estilize a **Sidebar** (menu lateral): cores de fundo, ícones, tipografia e o indicador visual de página ativa (`.nav-link[aria-current="page"]`).
- Estilize a **Topbar**: cabeçalho superior, breadcrumb e barra de busca.
- Estilize o card de usuário e logotipo (`.marca`).

### 3. Estilizar os Componentes Compartilhados
Abra o arquivo [`src/styles/components.css`](src/styles/components.css).
- Acesse `npm run dev` e clique em **Guia de componentes** (`#/dev/componentes`) no menu lateral para visualizar todos os componentes isolados em tempo real.
- Estilize cada componente conforme o Figma:
  - **Botões (`.btn`)**: variantes primário, secundário, perigo e estados (`:hover`, `:active`, `[disabled]`).
  - **Tabelas (`table`, `.tabela-card`)**: cabeçalhos, linhas zebradas ou divisores, hover nas linhas clicáveis e paginação.
  - **Badges de Status (`.status`)**: cores de fundo, texto e ícones.
  - **Modais e Drawers**: camadas flutuantes, animações de entrada e sombras.
  - **Campos de Formulário**: estados de foco (`:focus`), erro (`[aria-invalid="true"]`) e rótulos.

---

## Estrutura de Pastas

```
src/
├── app/
│   ├── menu.ts        # Mapa do sistema: rotas, grupos e escopo de cada tela
│   ├── routes.tsx     # Liga cada caminho ao componente da tela
│   └── router.tsx     # Roteador por hash (#/caminho): Link, navegar(), useParams()
├── features/         # UMA pasta por domínio de negócio; cada dev trabalha na sua
│   ├── dashboard/  comercial/  cadastros/  engenharia/  pcp/
│   ├── suprimentos/  producao/  financas/  analises/
│   └── dev/           # Guia de componentes (ambiente de visualização dos devs)
├── shared/
│   ├── components/    # Botao, Campo, DataTable, Modal, Drawer, Toast, Tabs, Stepper...
│   ├── mock/dados.ts  # ÚNICA fonte de dados fictícios do sistema
│   ├── state/         # AppState (React Context): estado global compartilhado
│   ├── utils/         # format.ts (moedas, datas) e calculos.ts (custo e preço)
│   └── types/         # Tipos TypeScript compartilhados (Tecido, Produto...)
└── styles/           # tokens.css → base.css → layout.css → components.css
```

---

## Regras do Time

- **Cores e medidas:** Sempre use `var(--...)` de `styles/tokens.css`. Nunca escreva cores hexadecimais ou pixels fixos soltos nos componentes.
- **HTML Semântico & Acessibilidade:** Mantenha os atributos de acessibilidade (`aria-current`, `aria-label`, foco visível de teclado).
- **Dados:** Use apenas `shared/mock/dados.ts`. Não crie dados soltos ou lorem ipsum.
- **Git & Branches:** Crie uma branch para a sua frente ou tarefa (ex: `feat/estilizacao-botoes` ou `feat/f2-engenharia`) e abra Pull Request para revisão.

---

## Divisão de Frentes de Negócio

| Frente | Telas Principais | Pasta |
|---|---|---|
| **Design System** | Tokens, Layout, Componentes e Guia | `src/styles/`, `src/shared/components/` |
| **F2 Engenharia** | Produtos, Ficha técnica (+ cálculo) | `features/engenharia` |
| **F3 Cadastros** | Tecidos, Aviamentos, Modelagem, Beneficiamentos, Fornecedores | `features/cadastros` |
| **F4 Comercial** | Pedidos, Clientes | `features/comercial` |
| **F5 PCP** | Ordens de produção, Programação, Necessidade de materiais | `features/pcp` |
| **F6 Suprimentos** | Estoque, Compras, Sobras e resíduos | `features/suprimentos` |
| **F7 Produção** | Apontamento, Máquinas | `features/producao` |
| **F8 Finanças & Análises**| Custos, Precificação, Notas fiscais, Dashboard | `features/financas`, `features/analises`, `features/dashboard` |
