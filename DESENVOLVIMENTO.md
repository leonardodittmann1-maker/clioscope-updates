# ENADE Engenharia Elétrica 2026 — Registro de desenvolvimento

Atualizado em: 2026-11-05
Branch exclusiva: `enade-eletrica-2026`
Repositório: `leonardodittmann1-maker/clioscope-updates`
Aplicativo existente: `app.html`
Versão de referência do aplicativo: commit `c8b2cde10ec5f0780c94a4732f9ba829ef27baba`

## Estado confirmado na branch
- `app.html` existe e concentra a aplicação HTML/JavaScript com conteúdo e interface para estudo.
- Há mecanismos de armazenamento local com IndexedDB e registro de sessões; o código contém um índice de questões históricas e referências a fontes oficiais.
- O avanço de conteúdos foi ajustado previamente.
- A importação de PDFs oficiais para consulta offline é suportada pelo código.
- **Não há integração Firebase/Google implementada no `app.html` conferido.** Sincronização automática entre aparelhos não está concluída.
- O índice das provas oficiais não equivale a questões completas: faltam enunciados, alternativas e eventuais figuras diretamente no app para várias questões.
- O nível de dificuldade de questões autorais precisa ser auditado em comparação com provas reais.
- A aba de Fórmulas Essenciais ainda precisa ser verificada e implementada.
- Não há comprovação de testes atuais executados em dispositivos Samsung físicos.

## Restrições absolutas
- Trabalhar somente na branch `enade-eletrica-2026`, preservando `main`, `meu-ponto-app` e demais branches.
- Preservar identificadores, histórico, progresso local e backups; migrar estruturas de dados com segurança.
- Não ativar custos, faturamento, serviços pagos ou expor segredos.
- Questões oficiais somente podem ser marcadas completas quando enunciado, alternativas, figuras necessárias e gabarito tiverem sido conferidos e forem usados dentro do app; verificar condições legais de reprodução.
- Priorizar qualidade acadêmica, didática, matemática e de fontes sobre quantidade de telas ou itens.

## Próxima tarefa — uma sessão curta
1. Confirmar que o workspace do Codex foi baseado na branch `enade-eletrica-2026` e contém `app.html`.
2. Auditar código, modelos de questão, persistência e testes disponíveis, preservando tudo que já funciona.
3. Implementar **um lote pequeno de questões oficiais plenamente revisadas**, se os cadernos e permissões de reprodução puderem ser confirmados; caso contrário, implementar o validador que impede que índices incompletos apareçam como exercícios resolúveis, incluindo testes pertinentes.
4. Executar testes específicos, fazer commit apenas de mudanças aprovadas e atualizar este registro.

## Fluxo entre sessões
- Em cada sessão, selecionar apenas uma entrega pequena e verificável.
- Documentar arquivos alterados, testes realmente executados, conteúdo validado, commit e próxima tarefa.
- Não relatar como concluído o que estiver somente planejado ou catalogado.
- Se rede/acesso Git estiver bloqueado, evitar modificações em checkout de outra branch; registrar a falha e retomar no ambiente correto.
