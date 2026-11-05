# Ciclo 1 — auditoria e integridade das questões

Data: 2026-11-05

## O que foi corrigido
- Enunciados oficiais inexistentes no aplicativo não geram mais respostas nem novas avaliações. O índice documental permanece visível, com links para as fontes originais.
- Tentativas e respostas antigas de itens incompletos continuam no armazenamento e no backup JSON, mas ficam arquivadas e não influenciam as estatísticas de aprendizagem.
- Os simulados oficiais de 2017, 2019 e 2023 permanecem desabilitados enquanto não houver questões completas verificadas. Os simulados autorais continuam utilizáveis.
- Foram preservados os identificadores anteriores e a estrutura do backup (schema=1).

## Inventário auditado
- 19 áreas específicas e 12 de Formação Geral cadastradas.
- 11 aulas e 22 questões autorais disponíveis, de dificuldade predominantemente introdutória.
- 108 itens oficiais catalogados (101 com gabarito informado; 7 anulados); **0 inteiramente prontos para resolver no aplicativo**.
- 12 discursivas oficiais indexadas e 2 discursivas autorais no editor.

## Validações
- `npm run build` passou (TypeScript + verificação de conteúdo).
- `npm test` passou: 23 testes Node.
- `node --test tests/quality-gates.mjs` passou: 3 testes de regressão para aplicativo HTML.
- Testes em navegador real bloqueados pelo ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). Testes em Galaxy Tab S10 FE e Galaxy S23 não executados.

## Pendente
- Incorporar primeiras questões oficiais completas após conferência do caderno, gabarito, diagramas e condições de reprodução.
- Criar exercícios autorais com complexidade padrão ENADE, após revisão independente.
- Aba Fórmulas Essenciais, autenticação Google e sincronização segura não implementadas.

## Como usar
- Abra `ENADE_2026_Ciclo1_Atualizado.html` no navegador. Faça backup JSON do progresso anterior antes de trocar de arquivo.
- Para testar o projeto TypeScript: `npm run build && npm run single && npm test`. Os scripts foram escritos para Node 20+ e TypeScript, e não dependem de API paga.
- Para testes do HTML independente: `node --test tests/quality-gates.mjs`.
