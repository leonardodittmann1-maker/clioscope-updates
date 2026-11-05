# Relatório de execução de testes — 30/10/2026

## Confirmados nesta execução

- `npm run build`: compilação TypeScript e validação do conteúdo passaram.
- `node tools/check-content.mjs`: **31 áreas, 11 aulas, 22 questões autorais, 1 questão oficial referenciada e 2 discursivas**.
- `npm test`: **13 testes aprovados** (8 verificações de modelo/dados, 4 de renderização e fluxo simulado, 1 auditoria matemática de 18 questões). Verificações incluem as quantidades normativas, metadados, cálculo de acertos, seleção adaptativa determinística, navegação pelas seções, resposta de questão, simulado, exibição de aulas e existência de manifesto/service worker.
- `npm run single`: arquivo HTML autônomo gerado sem erro.

## Não comprovados / bloqueados

- `npm run test:browser`: os cinco casos Playwright Python foram **bloqueados pela política de navegação do navegador nesta execução**. O navegador retorna `net::ERR_BLOCKED_BY_ADMINISTRATOR` ao abrir `127.0.0.1:4173`, apesar de o servidor local responder. Os testes **não foram aprovados**, nem há evidência de erro funcional ou de sucesso no navegador.
- Android físico, computador em navegador externo, login Google, sincronização, publicação em HTTPS, instalação PWA, recuperação de cache offline após publicação, desempenho em aparelhos e segurança Firestore **não testados**.
- Conferência por segunda pessoa de cada cálculo autoral e reprodução do PDF original completo: não concluídos. Portanto, o estado de revisão corresponde a checagens internas, sem certificação oficial.

## Como executar a bateria do navegador fora deste ambiente

1. Hospede localmente `dist/` em `http://localhost:4173` (`npm run start`).
2. Instale Python Playwright e o navegador Chromium, se necessário.
3. Rode `npm run test:browser` no mesmo computador e verifique as cinco saídas.
4. Reexecute no Android após publicar numa origem HTTPS.

Os testes não foram marcados como passados quando não puderam executar.

## Teste do importador de PDF

Um PDF sintético de uma página com cabeçalho de questão foi criado e processado. O script retornou um candidato de extração com `status=aguardando-revisao` e `publishable=false`, sem promover automaticamente o texto extraído ao banco de questões. Este teste não valida a qualidade da extração das provas oficiais reais.
