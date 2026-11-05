# Histórico de desenvolvimento — ENADE Engenharia Elétrica 2026

**Atualizado:** 2026-11-05
**Repositório:** `leonardodittmann1-maker/clioscope-updates`
**Branch exclusiva:** `enade-eletrica-2026`

## Entrega desta execução

- Preservado o projeto e o armazenamento local existentes; schema de progresso original mantido.
- Aumentado o conteúdo para **21 aulas reais**, **48 questões autorais completas** (26 novas com desenvolvimento multietapas) e **26 fichas de fórmulas explicadas**.
- Adicionado menu de Fórmulas Essenciais, pesquisa, favoritos e ligações aos exercícios.
- Adicionados filtros por nível de desafio, treino autoral avançado com 10 questões, indicadores separados para fundamentos e avançadas.
- Implementada biblioteca opcional TypeScript de integração com Google Authentication + Firestore, mecanismo de conciliação de progresso, rascunhos e tentativas, regras restritivas por UID e tela de configuração.
- Mantido modo offline e exportação/restauração JSON. HTML independente e versão PWA com cache gerados.
- Compilação TypeScript e validação de dados **aprovadas**; **33 testes Node aprovados**, incluindo rechecagem independente de 25 respostas quantitativas. Testes de navegador real bloqueados pela infraestrutura local e **não considerados aprovados**.

## Inventário e limitações

- Índice oficial: 108 questões objetivas históricas, 101 gabaritos, 7 anuladas. **0 questões oficiais com textos/alternativas/figuras verificados e inseridos no aplicativo**. Não misturar catálogo com questões resolúveis.
- Discursivas: 2 autorais; 12 históricas apenas catalogadas.
- Frequência real de fórmulas em 2017/2019/2023 não auditada; não há ranking de 'mais cobradas'.
- Firebase: integração em código pronta para configuração, **não conectada**. Sem projeto remoto, HTTPS, regra UID implantada nem teste entre Samsung Tab S10 FE e S23. Sem faturamento ativado.
- Suporte Samsung: estilos responsivos implementados; sem testes físicos e sem validação em Samsung Internet real.
- Não há simulado oficial completo ENADE 2026 por falta de 45 questões completas por composição oficial.
- Não há gravação/exfiltração de histórico no GitHub.

## Próximos trabalhos documentados

1. Obter os cadernos oficiais íntegros de 2017/2019/2023, conferir o direito de reprodução e extrair enunciados, alternativas e figuras com verificação humana; publicar em pequenos lotes rotulados.
2. Produzir resoluções específicas de cada questão oficial e conferir cálculos/gabaritos, mantendo as não validadas em quarentena.
3. Auditar recorrência real de fórmulas e mapeá-las às questões e anos, sem extrapolar probabilidades.
4. Configurar Auth e Firestore na conta autorizada, implantar `dist` em HTTPS, testar sincronização e recuperação offline nos dois aparelhos.
5. Realizar testes de navegador e dispositivos físicos, revisar acessibilidade e compatibilidade com Samsung Internet.
6. Avaliar limites do armazenamento Firestore e paginação para histórico longo.

**Regras:** só branch ENADE; nunca modificar `main`, `meu-ponto-app` ou outros projetos; não declarar recurso ativo sem validação real; não habilitar cobrança; preservar backups.
