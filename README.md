# ENADE Engenharia Elétrica 2026 — Aplicativo Android de estudos

Projeto pessoal e independente, construído na branch exclusiva `enade-eletrica-2026` do repositório `clioscope-updates`; nenhum arquivo ou branch de Meu Ponto deve ser alterado.

## Aplicativo Android (APK)

O código-fonte nativo está em `android/` e o fluxo de compilação gratuita do instalador em `.github/workflows/build-enade-apk.yml`. O Android incorpora `app.html` como conteúdo offline e carrega o documento numa origem virtual HTTPS local por `WebView`. **Isso não é um site público.** A aplicação tem armazenamento por `IndexedDB` e `localStorage` da sua instalação Android e utiliza o seletor de documentos Android para exportar o backup JSON e importar backups.

Depois que o GitHub Actions completar com sucesso, o instalador `ENADE-Eletrica-2026.apk` poderá ser obtido pelo próprio repositório/artefato do workflow. O APK debug é assinado com chave de desenvolvimento do runner: instalações futuras geradas em runners diferentes podem exigir desinstalação e nova instalação se a assinatura não coincidir. **Faça backup JSON antes de atualizar**. Para atualizações sem desinstalação será necessário configurar chave persistente de assinatura, mantida exclusivamente em segredos GitHub, sem publicá-la.

Não há necessidade de Play Store nem publicação de um site aberto. A sincronização entre Galaxy S23 e Galaxy Tab S10 FE **ainda não funciona**: exigirá habilitar Firebase, regras por UID, autenticação adequada ao Android e testes entre dispositivos. A estrutura web opcional não deve ser confundida com sincronização ativa no APK.

## Conteúdos realmente disponíveis

- 31 áreas/objetos de conhecimento catalogados, conforme portarias 2026.
- **21 aulas**, das quais **10 possuem cadernos de estudo aprofundados** com explicação conceitual, hipóteses, estudos de caso numéricos multietapas, verificações de entendimento e conclusões; as outras 11 são revisões estruturadas mais curtas (não atribuir-lhes profundidade que ainda não têm).
- **62 questões autorais respondíveis**, incluindo 22 fundamentos, 26 avançadas anteriores e **14 novos estudos de caso** de maior complexidade com respostas e explicações desenvolvidas. Não são questões oficiais do Inep.
- **26 fichas de fórmulas** com variáveis, unidades, condições de uso, exemplo e armadilhas. A incidência em provas anteriores não foi auditada: **não há ranking de fórmulas mais cobradas**.
- 108 itens históricos oficiais no índice, dos quais 101 com gabaritos cadastrados e 7 anulados. **0 questões oficiais completas diretamente resolvíveis**, pois ainda faltam verificar e incorporar integralmente enunciados, alternativas, diagramas, direitos e resoluções. Índices não entram em simulados.
- 2 discursivas autorais, treino de respostas e tutor guiado (sem IA generativa).
- Simulados de treinamento, revisão de erros, histórico, plano, progresso e backup JSON.

## Compilação e testes

A versão web/HTML é gerada com TypeScript 5.9 instalado e Node 22:

```bash
npm run build
npm run single
npm test
```

O projeto Android utiliza Java 17, Android Gradle Plugin 8.7.3 e Gradle 8.10.2. Compile em máquina com SDK Android instalado, ou utilize o workflow GitHub Actions da branch ENADE:

```bash
cp app.html android/app/src/main/assets/index.html
gradle -p android :app:assembleDebug --no-daemon
```

O APK local deverá aparecer em `android/app/build/outputs/apk/debug/app-debug.apk`. O fluxo de Actions valida o ZIP do APK, publica um artefato e tenta versionar o instalador na branch exclusiva.

Os testes Node conferem matrizes, preservação de histórico, filtros, correção, fórmulas, 14 novos problemas com cálculos independentes, existência da estrutura Android e workflow. **Sem SDK no ambiente de desenvolvimento local, a compilação Android somente é comprovada quando o GitHub Actions rodar com sucesso.** Compatibilidade real em Galaxy S23/Tab S10 FE permanece pendente de teste físico.

## Segurança e backups

Sem publicação de credenciais ou faturamento. A integração Google/Firebase web foi preparada, mas não está autenticada nem sincronizando. No APK, o login Google em WebView está intencionalmente bloqueado porque requer integração nativa correta, não um popup web no aplicativo incorporado.

Os dados de estudo no APK não são automaticamente os mesmos que foram salvos em versões HTML `content://`. Exporte backup JSON na versão antiga e importe na instalação nova. Guarde cópias atualizadas. Para atualizações futuras, mantenha uma assinatura Android persistente: o APK de debug gerado em máquinas diferentes pode não atualizar o anterior sem reinstalação.

Fontes oficiais: [Legislação ENADE](https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade) e [Provas e gabaritos](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enade/provas-e-gabaritos). Os conteúdos didáticos novos são autorais e não representam padrões oficiais de resolução do Inep.
