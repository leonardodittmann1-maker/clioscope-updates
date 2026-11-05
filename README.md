# ENADE Engenharia Elétrica 2026 — Plataforma pessoal de estudos

Aplicação existente, preservada e expandida na branch `enade-eletrica-2026` do repositório `leonardodittmann1-maker/clioscope-updates`. As branches `main` e `meu-ponto-app` não fazem parte deste aplicativo.

## Conteúdo disponível (05/11/2026)

- **21 aulas com conteúdo real** (11 anteriores + 10 novas de aprofundamento).
- **48 questões autorais completas** (22 fundamentos + 26 problemas autorais mais exigentes, identificados como treinamento, não como itens oficiais).
- **26 fichas de fórmulas** com hipóteses, variáveis, unidades, exemplo, equívocos e questão relacionada. A frequência de cobrança nas provas anteriores **não foi auditada**; nenhuma fórmula é anunciada como "mais cobrada" sem provas.
- **108 itens oficiais históricos apenas catalogados**, com 101 gabaritos registrados e 7 anulados. **Zero questões oficiais completas/respondíveis**, pois os enunciados e diagramas não foram integralmente extraídos e validados. Não confunda índice documental com banco oficial resolúvel. Esse trabalho continua pendente.
- **2 propostas discursivas autorais**; treinamento com rascunho e critérios orientativos, não nota oficial.
- Biblioteca de 31 áreas/objetos, com indicação de matérias sem aula concluída; filtros, tutor guiado, revisão, estatísticas, progresso e simulados de treino. Simulado completo no formato ENADE 2026 exige 45 itens **verificados** de formação específica/geral mais uma discursiva, ainda indisponíveis.

## Arquivos para uso

- `app.html`: versão única, HTML/CSS/JS incorporados, para estudo local e offline após salvar no dispositivo.
- `dist/index.html`: versão web/PWA para ser servida em uma origem HTTPS, com `dist/assets`, `dist/sw.js`, `dist/manifest.webmanifest` e `dist/icon.svg`.
- `src/*.ts`: código-fonte TypeScript.
- `tests/*.test.mjs`: testes Node determinísticos, inclusive recomputação independente de 25 problemas numéricos.
- `docs/firestore.rules`: regras restritivas do Firestore, **bloqueiam todos os acessos até substituir o UID autorizado e implantar**.

## Executar e validar

Com Node e TypeScript disponíveis:

```sh
npm install --ignore-scripts
npm run build
npm test
npm run single
npm run start
```

`npm run start` serve o diretório `dist` na porta 4173; a aplicação deve ser acessada em navegador local. Para a versão HTML, abra `app.html` sem compilação. A versão `dist` possui um service worker de cache das páginas e dos conteúdos de estudo após primeira visita online. O HTML local armazena progresso no navegador atual e não garante acesso ao mesmo armazenamento ao mudar de nome/URI do arquivo.

## Google Login, Firestore e privacidade

**O login Google e a sincronização entre Galaxy Tab S10 FE e Galaxy S23 foram implementados como integração opcional de código, mas NÃO estão operacionais nem validados em contas reais.** Não existe projeto Firebase conectado, endereço HTTPS implantado, regra de UID autorizada, ou teste em dois dispositivos neste projeto. Nenhum pagamento/serviço de faturamento foi ativado.

Para ativar futuramente:

1. Criar projeto Firebase no **plano Spark**, sem faturamento e conferir as cotas aplicáveis. Ativar Authentication/Google e Firestore.
2. Hospedar a pasta `dist` em endereço HTTPS e registrar domínio autorizado no Firebase Authentication. Um endereço tecnicamente acessível não torna o banco privado público: as regras de autorização devem impedir acesso por outras contas. Não é necessário divulgar o endereço.
3. Em `docs/firestore.rules`, substituir **INSIRA_UID_AUTORIZADO_AQUI** pelo UID que aparece nas configurações do aplicativo após entrar com Google e publicar as regras na própria conta Firebase. Antes disso o Firestore deve permanecer inacessível.
4. No aplicativo, em Configurações, informar a **configuração web pública** do Firebase (`apiKey`, `authDomain`, `projectId`, `appId`) e conectar-se com o Google no **HTTPS**. Não fornecer senhas nem chaves privadas.
5. Testar backup local, primeiro acesso, fechamento da aba, duas sessões independentes, conflitos offline e sincronização ao reconectar em ambos os dispositivos.

O código usa IDs estáveis e tenta mesclar respostas e tentativas, conservando conflitos de rascunhos para revisão. O armazenamento remoto compacto atual aceita até 850 KB: migrar para documentos paginados antes de atingir esse limite. Uma instalação completa depende de acesso à conta autorizada e não pode ser declarada pronta apenas por existir código.

## Migração e backups

**Antes de substituir versões no Android, exporte o backup JSON em Configurações e backup**. O progresso é guardado localmente, separado por navegador/origem; substituir arquivos `content://` pode mudar a origem e parecer que os dados desapareceram. A importação do backup restaura o progresso de maneira compatível, mas solicita confirmação e substitui o progresso local atual. Guarde cópia do backup.

## Fontes e validade acadêmica

O escopo segue Portaria Inep nº 164/2026, Portaria nº 154/2026 e o edital de bacharelados aplicável. Questões de 2023/2019/2017 são documentos históricos de treinamento e não refletem o formato de 2026. Referências e anos estão em `src/official.ts` e `docs/FONTES.md`. Não há afirmativa de que o Inep tenha revisado as resoluções autorais ou as aulas. A classificação "padrão ENADE" é uma proposta didática, não calibração psicométrica comprovada.

## Limitações e qualidade

Os **34 testes Node** da versão de trabalho passaram em 05/11/2026. Os testes de navegador real, Samsung Tab S10 FE/S23 e Firebase não puderam ser concluídos. A auditoria e a correspondência integral de questões originais oficiais continuam pendentes; não inventar itens, enunciados, gabaritos ou imagens.
