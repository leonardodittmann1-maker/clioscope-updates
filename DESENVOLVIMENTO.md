# Registro do ENADE Engenharia Elétrica 2026

Data de referência: 2026-11-05.
Branch exclusiva: `enade-eletrica-2026`.

## Implementado nesta versão

- Conteúdo original aprofundado em 10 dos 21 tópicos existentes (arquivo `src/masterclasses.ts`), com etapas, problemas quantitativos e 4 diagramas SVG originais.
- 14 casos autorais avançados adicionais (`src/caseQuestions.ts`), total de 62 questões autorais respondíveis.
- Aulas aprofundadas integradas na biblioteca e ao fluxo de progresso anterior, IDs de aulas e questões antigas preservados.
- APK Android nativo como casca offline com WebView e origem virtual HTTPS segura, importação de PDFs/JSON por seletor de arquivos e exportação de backup pelo Android Storage Access Framework.
- Workflow GitHub Actions para construir APK sem custo de SDK local, versionando exclusivamente nesta branch.
- 41 testes Node aprovados no ambiente de origem. Sem dispositivo Android ou SDK local; verificar resultado de compilação no GitHub Actions.

## Não implementado ou não comprovado

- Questões oficiais dentro do aplicativo: 108 itens catalogados, 101 com gabarito, 7 anulados, **zero enunciados/alternativas e diagramas oficiais completamente validados**. Não confundir com itens autorais.
- Aulas profundas nas demais 11 áreas/tópicos atuais; cobertura integral das 31 áreas ainda está pendente.
- Sincronização automática entre S23 e Tab S10 FE: estrutura web preparada, **Firebase não configurado** e login Google nativo Android não implementado. Dados são locais até ativar backend com a autorização da usuária.
- Teste de instalação e navegação nos Samsung reais não foi executado; o build do GitHub Actions deve ser conferido.
- Assinatura de APK persistente: debug APK pode exigir desinstalação entre compilação em diferentes runners. Exportar backup previamente.
- Levantamento documental de frequência das fórmulas e incorporações oficiais com direitos de reprodução revisados.

## Próximas entregas acadêmicas prioritárias

1. Importar pequenos lotes de questões oficiais completas com revisão visual dos PDFs, atribuição e conferência do gabarito definitivo.
2. Aprofundar as 11 revisões ainda curtas e criar aulas para áreas sem cobertura.
3. Configurar autenticação e sincronização segura real entre dispositivos, com testes de mesclagem offline e controle por UID.
4. Validar APK e assinatura de atualização em dispositivos Samsung físicos.

## Regras permanentes

Trabalhar exclusivamente em `enade-eletrica-2026`, preservar `main` e `meu-ponto-app` e dados locais. Não declarar funcionalidade concluída sem evidência de execução. Não habilitar pagamentos, não publicar segredos, não inventar estatísticas ou questões oficiais.
