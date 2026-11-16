# Fabrika PCP e ERP — Esqueleto do Frontend

Base visual em React + TypeScript + Vite para o time continuar o projeto. A navegação, a hierarquia do menu e o estilo foram alinhados ao protótipo do Figma Make; os módulos continuam deliberadamente sem regras de negócio e sem integração.

## Rodar localmente

```bash
npm install
npm run dev
```

## O que já está pronto

- Menu lateral responsivo com a mesma organização do protótipo.
- Dashboard visual com áreas reservadas para indicadores.
- Uma tela-guia para cada módulo, com as entregas esperadas.
- Estrutura simples, sem banco de dados, autenticação ou dados falsamente persistidos.

## O que o time deve implementar

Veja a divisão sugerida em [`docs/DIVISAO_DE_TAREFAS.md`](docs/DIVISAO_DE_TAREFAS.md).

Cada módulo deve ser separado em componentes próprios antes de ficar grande. Regras críticas — custo, aprovação, permissões, estoque e geração de OP — precisam ser validadas no back-end, não apenas na interface.

## Estrutura inicial

```text
src/
  App.tsx       # navegação e telas-guia
  styles.css    # estilo global e responsividade
  main.tsx      # entrada da aplicação
docs/
  DIVISAO_DE_TAREFAS.md
```
