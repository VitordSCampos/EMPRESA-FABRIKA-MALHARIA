# Divisão sugerida de tarefas

O esqueleto deixa os módulos visíveis no menu, mas ainda não contém lógica de negócio. A divisão abaixo evita duas pessoas mexendo na mesma parte do código.

| Frente | Módulos | Entrega principal |
|---|---|---|
| Cadastros | Tecidos, Aviamentos, Modelagem, Beneficiamentos, Fornecedores, Clientes | CRUDs, tipos TypeScript e validação de campos |
| Engenharia | Ficha técnica e Produtos | Versões de produto, composição, cálculo e aprovação |
| Comercial e PCP | Pedidos, Ordens de produção, Apontamento e Máquinas | Fluxo pedido → OP → etapas/apontamentos |
| Suprimentos | Estoque de tecidos e aviamentos | Lotes, movimentações, reservas e estoque mínimo |
| Sustentabilidade | Sustentabilidade | Registro de resíduos, destino e indicadores |
| Dados e plataforma | Dashboard, Relatórios e Integrações | API, autenticação, banco, filtros e indicadores |

## Ordem recomendada

1. Definir entidades, endpoints e contratos de resposta.
2. Separar cada tela de `App.tsx` em uma pasta de módulo.
3. Implementar cadastros e autenticação.
4. Implementar ficha técnica, produtos e estoque.
5. Conectar pedidos e ordens de produção.
6. Fechar dashboards, relatórios e integrações.

## Regras de trabalho

- Criem uma branch por frente, por exemplo `feat/estoque`.
- Não alterem `App.tsx` simultaneamente; cada frente deve ganhar seu próprio componente.
- Não salvem `node_modules`, `dist` ou arquivos `.env` no Git.
- Façam commits pequenos e descritivos, por exemplo: `feat: cria cadastro de tecidos`.
