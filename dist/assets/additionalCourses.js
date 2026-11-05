const c = (lessonId, objectives, chapters, takeaways, sources = []) => ({ lessonId, estimatedMinutes: 50, objectives, chapters, takeaways, sources: sources.length ? sources : ['https://openstax.org/books/university-physics-volume-2/pages/1-introduction', 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade'] });
export const ADDITIONAL_MASTERCLASSES = [
    c('trafo-ideal', ['Analisar a relação de transformação e suas hipóteses.', 'Calcular potência de carga, correntes de linha e rendimento de transformador trifásico.', 'Separar queda de tensão, perdas, magnetização e transitório de energização.'], [
        { title: '1. Transformador real não é apenas uma proporção de espiras', explanation: [
                'O transformador transfere potência por acoplamento magnético entre enrolamentos, mantendo a frequência da fonte. No modelo ideal, V1/V2=N1/N2 e as correntes seguem a relação inversa. Esse modelo é ponto de partida para compreender tensões de placas, mas não reproduz perdas nem queda sob carga.',
                'Na máquina real, resistência dos enrolamentos gera perdas de cobre, enquanto o núcleo apresenta perdas por histerese e correntes parasitas. A reatância de dispersão representa fluxo que não concatena integralmente ambos os enrolamentos. A corrente de magnetização existe mesmo sem carga.',
                'Não confunda potência aparente nominal em kVA com potência ativa útil em kW: o fator de potência da carga determina a parcela ativa. Para circuitos trifásicos equilibrados, S=√3 V_linha I_linha.'
            ], equations: ['V1/V2≈N1/N2 (modelo ideal)', 'S3φ=√3·V_L·I_L', 'η=P_saida/P_entrada'], question: 'Se um trafo possui placa de 500 kVA, é correto afirmar que ele entrega 500 kW em qualquer condição?', answer: 'Não. kVA é potência aparente; P depende do fator de potência da carga. Também existem limites térmicos, de temperatura, tensão, condições de instalação e perdas.' },
        { title: '2. Exemplo integrado: carregamento e eficiência', explanation: [
                'Um transformador trifásico de 500 kVA, 13,8 kV/380 V, alimenta carga equilibrada equivalente a 80% de sua potência aparente nominal, com fator de potência 0,85. As perdas totais no ponto considerado são de 8 kW. Considere regime permanente e tensões terminais próximas das nominais.',
                'Primeiro converta a porcentagem de carga em kVA. Depois encontre kW útil, corrente de linha e rendimento. Os 8 kW de perda precisam ser adicionados à saída, não subtraídos do valor de entrada ainda desconhecido.'
            ], steps: [
                'Saída aparente: S2=0,80·500=400 kVA.',
                'Potência ativa na carga: P2=S2·FP=400·0,85=340 kW.',
                'Corrente no secundário: I2=400000/(√3·380)≈607,7 A.',
                'Potência ativa de entrada: P1≈P2+P_perdas=340+8=348 kW.',
                'Rendimento no ponto de carga: η=340/348≈0,9770=97,70%.',
                'A corrente primária ideal correspondente a 400 kVA em 13,8 kV seria ≈16,74 A; corrente real depende de perdas e da magnetização.'
            ], question: 'Por que não calculamos rendimento como 340/400?', answer: 'Porque 400 kVA é potência aparente, enquanto rendimento é a razão entre potências ativas de saída e entrada, em kW.' },
        { title: '3. O que muda no comissionamento e na proteção', explanation: [
                'O teste de relação de transformação, resistência de enrolamento e isolação revela condições distintas. A regulação de tensão está associada à impedância interna e ao fator de potência da carga; não é uma variação puramente geométrica de espiras.',
                'Na energização pode ocorrer corrente transitória de magnetização elevada (inrush), com assimetrias e conteúdo harmônico. Não trate todo pico inicial de corrente como curto-circuito, mas também não dispense análise de proteção diferencial e de restrição harmônica.',
                'Em transformadores de potência, a função de proteção e a interpretação de ensaios devem considerar normas, esquema de ligação, grupos vetoriais, TC, ajustes e recomendações do fabricante.'
            ], question: 'Uma diferença de relação nominal explica sozinha aquecimento anormal e vibração?', answer: 'Não. Devem ser investigados carregamento, ventilação, resistência, perdas, núcleo, conexões e condições do sistema.' }
    ], ['Separar kVA, kW e perdas é indispensável.', 'O modelo ideal não prevê regulação, perdas ou energização.', 'Ensaios diferentes avaliam grandezas e defeitos diferentes.']),
    c('magnetismo', ['Calcular fluxo e fem induzida sem confundir ângulos geométricos.', 'Relacionar saturação, núcleo e perdas em conversores eletromagnéticos.', 'Aplicar Faraday e Lenz em estimativa de transformador.'], [
        { title: '1. Fluxo, campo e orientação', explanation: [
                'O fluxo magnético é a integral da densidade de fluxo B através da superfície, com produto escalar B·dA. Para campo uniforme e superfície plana, Φ=B A cosθ, em que θ é medido entre B e a normal da superfície, não necessariamente entre B e o próprio plano.',
                'A lei de Faraday relaciona tensão induzida à taxa de variação do fluxo concatenado: e=−N dΦ/dt. O sinal negativo corresponde à lei de Lenz e reflete oposição à variação que gerou a fem.',
                'Usar B em teslas, área em m² e Φ em webers permite verificar dimensão. Fluxo elevado em núcleo com material não linear pode aproximá-lo da saturação; isso eleva corrente magnetizante e perdas.'
            ], equations: ['Φ=∫B·dA', 'Φ=BAcosθ (campo uniforme)', 'e=−N·dΦ/dt'], question: 'Um plano paralelo ao campo B apresenta fluxo máximo?', answer: 'Não. Se B é paralelo ao plano, o ângulo com a normal é 90°, portanto o fluxo ideal é zero.' },
        { title: '2. Exemplo: tensão eficaz de uma bobina', explanation: [
                'Considere uma bobina de 100 espiras submetida a fluxo senoidal Φ(t)=Φmax·sen(2πft), com Φmax=8 mWb por espira e frequência de 50 Hz. Admita espiras idênticas e acoplamento uniforme.',
                'Derive a expressão temporal e passe de pico para RMS. A relação 4,44fNΦmax pressupõe fluxo sinusoidal, não é equação universal para qualquer forma de onda.'
            ], steps: [
                'Converta o fluxo máximo: 8 mWb=0,008 Wb.',
                'Derive Φ(t): dΦ/dt=2πfΦmax·cos(2πft).',
                'Pico da fem: E_pico=2π·50·100·0,008≈251,3 V.',
                'Valor eficaz de senoide: E_RMS=E_pico/√2≈177,7 V.',
                'Conferência com a expressão usual: 4,44·50·100·0,008≈177,6 V.',
                'O pequeno desvio é arredondamento do fator 4,44, aproximação de 2π/√2.'
            ], question: 'Se a frequência dobrar e Φmax permanecer igual, o que acontece à tensão induzida eficaz no modelo?', answer: 'Dobra, pois E∝fNΦmax. Em uma máquina real, manter o mesmo fluxo também depende da fonte e das condições de operação.' },
        { title: '3. Saturação, entreferro e projeto', explanation: [
                'A curva B-H de um material ferromagnético não é linear em toda a faixa. Próximo à saturação, aumentar a intensidade H produz incrementos menores de B, enquanto corrente e perdas podem crescer fortemente.',
                'O entreferro aumenta a relutância do caminho magnético, podendo melhorar linearidade e capacidade de armazenar energia em certos dispositivos, porém altera a corrente magnetizante necessária.',
                'Dimensionar um transformador ou indutor exige observar frequência, perdas no núcleo, perdas Joule, temperatura, isolamento e forma de onda aplicada, não apenas escolher uma área e multiplicar por B.'
            ], question: 'Por que tensão contínua aplicada ao primário de trafo convencional não produz transferência sustentada por indução?', answer: 'Fluxo constante não gera fem de transformação no secundário; corrente de magnetização do primário pode crescer e provocar aquecimento por saturação e resistência do enrolamento.' }
    ], ['Faraday vincula tensão à variação temporal do fluxo.', 'O ângulo da área é medido com sua normal.', 'Saturação e perdas limitam o modelo ideal.']),
    c('seguranca', ['Distinguir funções do disjuntor, fusível e DR.', 'Relacionar corrente de falta e impedância do laço à atuação de proteção.', 'Identificar limites normativos de métodos simplificados.'], [
        { title: '1. Proteções não são intercambiáveis', explanation: [
                'O disjuntor termomagnético pode atuar em sobrecarga e em curto-circuito conforme sua curva e capacidades nominais. O fusível interrompe por aquecimento do elemento conforme suas características temporais. O DR monitora desequilíbrio de correntes que atravessam seu núcleo sensor.',
                'O DR não detecta necessariamente uma sobrecorrente equilibrada de ida e retorno. Por isso, DR puro não substitui proteção contra sobrecarga ou curto-circuito, a menos que seja um dispositivo combinado projetado para ambas as funções.',
                'Proteção contra contatos, seccionamento, aterramento e equipotencialização dependem do esquema de aterramento e da norma aplicável. Não escolha correntes nominais e tempos apenas pela sensibilidade do DR.'
            ], question: 'Um DR de 30 mA funciona como disjuntor de 30 mA para sobrecarga?', answer: 'Não. 30 mA é a corrente diferencial residual nominal de atuação; sobrecorrente exige dispositivo próprio ou combinado.' },
        { title: '2. Estudo simplificado: impedância de laço de falta', explanation: [
                'Em um circuito de baixa tensão com tensão fase-terra de 230 V e impedância total do laço de falta de 0,50 Ω, suponha falta fase-PE franca e fonte ideal representada pela impedância fornecida.',
                'Essa conta estima a corrente de falta, mas não confirma automaticamente o tempo de desligamento: deve-se comparar à característica do dispositivo e às exigências do esquema de proteção aplicável.'
            ], steps: [
                'Tensão de referência U0=230 V (fase-terra).',
                'Impedância de laço Zs=0,50 Ω, incluindo percurso completo do circuito de falta na hipótese simplificada.',
                'Corrente presumida Ia≈U0/Zs=230/0,50=460 A.',
                'Confronte os 460 A com a curva tempo-corrente do dispositivo de proteção realmente instalado.',
                'Verifique também poder de interrupção, capacidade dos condutores de proteção e energia passante, além das condições de aterramento.'
            ], equations: ['I_falta≈U0/Z_s (modelo de laço simplificado)'], question: '460 A garantem desligamento instantâneo de qualquer disjuntor?', answer: 'Não. Tempo depende de curva, corrente nominal, dispositivo específico e tolerâncias; além disso o estudo deve respeitar o esquema de aterramento.' },
        { title: '3. Qualidade do projeto e inspeção', explanation: [
                'Uma proteção pode existir fisicamente e ainda ser inadequada por seletividade, ligação, corrente residual, curva ou posição. Inspeção inclui verificação de continuidade PE, equipotencialização, testes conforme procedimento e documentação.',
                'Em circuitos com inversores e componentes eletrônicos, correntes residuais com componentes contínuas ou altas frequências podem exigir tipos adequados de DR; a escolha não deve ser reduzida apenas à corrente em mA.',
                'Uma regra memorizada não substitui documentação técnica, normas e avaliação do risco. A integridade do procedimento de inspeção é tão importante quanto o cálculo.'
            ], question: 'Qual condição pode tornar um teste positivo de DR insuficiente para aprovar a instalação?', answer: 'Ausência de verificação de continuidade do condutor de proteção, ligação incorreta, curva incompatível, corrente residual com formas de onda inadequadas ou descumprimento de critérios normativos.' }
    ], ['DR, disjuntor e fusível atuam sobre fenômenos distintos.', 'Corrente presumida não define sozinha tempo de desligamento.', 'Projeto seguro exige conjunto de proteções e ensaios.']),
    c('clima', ['Distinguir mitigação e adaptação em sistemas elétricos.', 'Estimar emissões evitadas sem confundir energia e potência.', 'Avaliar limites de análise socioambiental.'], [
        { title: '1. Avaliação técnica e compromisso social', explanation: [
                'Mitigação climática atua na redução de emissões e no aumento de remoções de gases de efeito estufa. Adaptação reduz exposição, vulnerabilidade e danos frente a impactos climáticos. Uma usina solar pode contribuir para mitigação, enquanto obras de drenagem de acesso e alerta de enchentes são exemplos de adaptação.',
                'Projetos de engenharia devem considerar distribuição de benefícios e riscos: quem acessa energia, quem sofre impactos de obras, custos sociais e condições de segurança. Energia renovável não é automaticamente livre de impactos ambientais.',
                'Indicadores climáticos devem declarar fronteira do sistema, período, fonte do fator de emissão, metodologia de ciclo de vida e cenário de comparação. Uma tonelada de CO2e representa equivalência climática sob método específico.'
            ], question: 'Melhorar drenagem de acesso de usina tem o mesmo mecanismo climático que substituir geração térmica fóssil?', answer: 'Não. A drenagem reduz vulnerabilidade aos impactos (adaptação), enquanto substituir geração emissora pode diminuir emissões (mitigação).' },
        { title: '2. Exemplo comparativo de emissões — valores hipotéticos', explanation: [
                'Considere um projeto que fornece 1,2 GWh por ano. Em estudo preliminar hipotético, o cenário substituído foi atribuído ao fator 0,50 tCO2e/MWh e o novo cenário a 0,10 tCO2e/MWh. Estes valores são hipóteses didáticas, NÃO fatores atuais oficiais do Brasil.',
                'Calcule as emissões diferenciais, mas não declare automaticamente que toda geração nova evita a mesma quantidade: despacho, adicionalidade, perdas, horários e fronteiras de ciclo de vida podem alterar o saldo real.'
            ], steps: [
                'Converta energia: 1,2 GWh/ano=1200 MWh/ano.',
                'Emissões do cenário de referência: 1200·0,50=600 tCO2e/ano.',
                'Emissões do cenário alternativo: 1200·0,10=120 tCO2e/ano.',
                'Diferença estimada: 600−120=480 tCO2e/ano nas hipóteses adotadas.',
                'Para projeto real, valide fatores de emissão, ciclo de vida, sazonalidade e comparabilidade dos cenários.'
            ], question: 'A diferença de 480 tCO2e/ano pode ser anunciada como crédito de carbono automaticamente?', answer: 'Não. Créditos exigem metodologias específicas, requisitos adicionais, verificação e rastreabilidade. Uma estimativa didática não equivale a certificação.' },
        { title: '3. Decisão multidimensional', explanation: [
                'Uma escolha de engenharia pode ser energeticamente eficiente e socialmente inadequada se deslocar populações sem mitigação de impactos, ignorar biodiversidade ou reduzir confiabilidade de abastecimento de comunidades vulneráveis.',
                'Uma avaliação equilibrada considera impactos cumulativos, licenciamento, tecnologias disponíveis, custos do ciclo de vida, segurança operacional e participação das partes afetadas.',
                'Nas questões de Formação Geral, a capacidade de argumentar com evidências e reconhecer diferentes grupos atingidos é tão importante quanto memorizar definições.'
            ], question: 'Como evitar uma decisão baseada apenas em redução percentual de emissões?', answer: 'Comparar impactos sociais, ambientais, econômicos e de confiabilidade, com fontes, unidades, cenários transparentes e regras de participação adequadas.' }
    ], ['Mitigação trata causas; adaptação enfrenta efeitos.', 'Fatores de emissão precisam de fonte e contexto.', 'A análise técnica deve incorporar consequências sociais.'], ['https://www.ipcc.ch/report/ar6/wg2/', 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade']),
    c('bayes-confiabilidade', ['Usar análise de taxa-base para alarmes raros.', 'Distinguir disponibilidade, confiabilidade e mantenabilidade.', 'Calcular disponibilidade simples sob hipóteses estacionárias.'], [
        { title: '1. Diagnóstico não é previsão sem contexto', explanation: [
                'Probabilidade de alarme dado falha (sensibilidade) é diferente de probabilidade de falha dado alarme (valor preditivo positivo). Bayes combina sensibilidade, taxa de falsos positivos e prevalência anterior.',
                'Em manutenção preditiva, falsos positivos podem induzir paradas e gastos, enquanto falsos negativos deixam defeitos sem investigação. O limiar de decisão deve considerar custo, risco e consequência de cada erro.',
                'Se duas inspeções usam o mesmo sensor e mesmo algoritmo, resultados podem estar correlacionados. Não multiplique suas probabilidades como se as evidências fossem independentes sem justificar essa hipótese.'
            ], equations: ['P(F|A)=P(A|F)P(F)/P(A)'], question: 'Sensibilidade de 95% implica 95% de chance de defeito após alarme?', answer: 'Não. É necessário conhecer a prevalência de falha e os falsos positivos.' },
        { title: '2. Disponibilidade de equipamento reparável', explanation: [
                'Sob hipótese de tempos médios representativos, regime estacionário simplificado e ciclos de falha/reparo, a disponibilidade inerente aproxima-se por A=MTBF/(MTBF+MTTR). Isso não equivale à confiabilidade R(t), que descreve a probabilidade de sobreviver sem falha por um intervalo.',
                'Considere equipamento com tempo médio entre falhas MTBF=1000 h e tempo médio de reparo MTTR=10 h. Desconsidere logística e indisponibilidade planejada no modelo.'
            ], steps: [
                'Some tempos médios de ciclo: 1000+10=1010 h.',
                'Disponibilidade A=1000/1010≈0,990099.',
                'Em percentual: A≈99,01%.',
                'Indisponibilidade complementar U=1−A≈0,009901=0,99%.',
                'Não conclua que o equipamento possui confiabilidade de 99,01% em 1000 h: é uma medida distinta de tempo médio operacional.'
            ], question: 'Uma máquina com disponibilidade de 99% necessariamente trabalha 99% de cada dia?', answer: 'Não. O valor é uma aproximação média de longo prazo; falhas podem concentrar indisponibilidade em determinados períodos.' },
        { title: '3. Dados e decisão operacional', explanation: [
                'Em usinas e sistemas industriais, a disponibilidade medida depende de como se classificam paradas programadas, indisponibilidades forçadas, tempo de espera e manutenção. Denominadores diferentes produzem indicadores diferentes.',
                'Uma ação preventiva pode reduzir MTTR por preparação de sobressalentes, ou aumentar MTBF por correção de causa raiz. Deve-se avaliar custo, confiabilidade de dados e criticidade do ativo.',
                'Séries muito curtas e eventos de falha raros tornam médias instáveis; intervalos de confiança e mecanismos físicos de falha são essenciais para conclusões robustas.'
            ], question: 'Apenas acrescentar mais inspeções garante maior disponibilidade?', answer: 'Não. Deve-se avaliar se a inspeção detecta causas relevantes, o custo e tempo de parada e o efeito real sobre falhas e reparos.' }
    ], ['Bayes requer probabilidade prévia.', 'Disponibilidade não equivale a confiabilidade em um intervalo.', 'Indicadores dependem de definições e qualidade dos registros.']),
    c('votacao-protecao', ['Derivar lógica 2oo3 por álgebra booleana.', 'Comparar segurança de atuação e risco de disparo falso.', 'Reconhecer limitações das hipóteses probabilísticas.'], [
        { title: '1. Lógica majoritária e tabela verdade', explanation: [
                'A lógica 2oo3 (two out of three) atua quando pelo menos dois dos sinais A, B e C estão ativos. A forma booleana simplificada é Y=AB+AC+BC. Cada produto representa um par suficiente; a soma lógica representa a união de condições.',
                'Os oito estados possíveis de três entradas incluem quatro com pelo menos dois sinais verdadeiros: 011, 101, 110 e 111. As outras quatro combinações não geram comando.',
                'A redundância pode aumentar tolerância a uma falha de sensor, mas não elimina problemas de alimentação compartilhada, calibração idêntica incorreta ou erro no software de decisão.'
            ], equations: ['Y=AB+AC+BC', 'Y=1 se A+B+C≥2 (soma aritmética de bits)'], question: 'A lógica 2oo3 exige os três sinais ao mesmo tempo?', answer: 'Não. Dois sinais ativos já são suficientes; três ativos também atendem.' },
        { title: '2. Exemplo quantitativo de confiabilidade e falso disparo', explanation: [
                'Admita três sensores independentes, probabilidade de detectar corretamente a condição de p=0,95 e probabilidade de falso positivo q=0,02 quando a condição não existe. Suponha lógica sem falha e ausência de causa comum.',
                'O cálculo de sucesso em presença de evento e o de disparo falso em ausência de evento são problemas diferentes, usando probabilidades condicionadas a estados físicos distintos.'
            ], steps: [
                'P(atuação correta | evento)=P(exatamente 2)+P(3)=3p²(1−p)+p³.',
                'Para p=0,95, P=3·0,95²·0,05+0,95³=0,99275=99,275%.',
                'P(disparo indevido | sem evento)=3q²(1−q)+q³.',
                'Com q=0,02, P=3·0,02²·0,98+0,02³=0,001184.',
                'Em percentual, falso disparo≈0,1184% por oportunidade sob as hipóteses adotadas.',
                'Compare às arquiteturas 1oo3 e 3oo3 conforme exigência de segurança funcional: os compromissos não são equivalentes.'
            ], question: 'Por que não usar p=0,95 também para falso disparo?', answer: 'Porque a chance de indicar presença quando há evento e quando não há evento são condicionais diferentes e têm parâmetros distintos.' },
        { title: '3. Validação da lógica', explanation: [
                'Em comissionamento, teste cada combinação da tabela verdade e condições de entrada inválida, perda de comunicação ou falha de alimentação. A lógica de votação não deve depender somente da confirmação de três sinais ativos.',
                'Registre a expectativa de saída, resultado real, tempos e responsáveis. A coerência entre documentação, programação e comportamento observado importa tanto quanto a simplificação algébrica.',
                'Quando existem dependências entre canais, os valores binomiais deixam de ser evidência suficiente para segurança, e o modelo deve representar as causas comuns.'
            ], question: 'Uma falha compartilhada de fonte pode comprometer os três sensores apesar da votação?', answer: 'Sim. O mesmo modo de falha comum pode afetar vários canais simultaneamente, invalidando suposições de independência.' }
    ], ['2oo3 é maioria de três, não unanimidade.', 'Risco de não atuação e de disparo falso são distintos.', 'Teste todas as combinações e falhas compartilhadas.']),
    c('adc-calibracao', ['Distinguir quantidade de códigos de erro total de medição.', 'Interpretar resolução quantizada e incerteza de referência.', 'Verificar filtro, saturação e interferências.'], [
        { title: '1. ADC ideal e mundo real', explanation: [
                'Um ADC de n bits divide a faixa analógica em 2ⁿ códigos digitais. Uma aproximação para a largura do intervalo ideal é LSB=(Vmax−Vmin)/2ⁿ. Esse passo não é garantia de exatidão, pois offsets, erro de ganho, não linearidades, ruído e referências afetam a conversão.',
                'Amostragem temporal e quantização em amplitude são processos diferentes. Um ADC com muitos bits pode sofrer aliasing se o filtro de entrada e a taxa de amostragem forem inadequados.',
                'Sinais fora da faixa podem saturar; o código de limite não distingue valores acima da entrada admissível. Proteção e dimensionamento analógico fazem parte da cadeia de medição.'
            ], equations: ['N=2ⁿ códigos', 'LSB≈(Vmax−Vmin)/2ⁿ'], question: 'Um ADC de 16 bits elimina necessidade de filtro anti-aliasing?', answer: 'Não. Bits aumentam resolução nominal de amplitude; o filtro limita frequências antes da amostragem.' },
        { title: '2. Estudo de medição de 0 a 10 V', explanation: [
                'Um ADC ideal de 12 bits opera de 0 a 10 V. O fabricante do sistema completo informa erro máximo de ±0,1% da escala completa nas condições declaradas. Compare resolução com especificação de erro de faixa, sem tratá-las como a mesma coisa.',
                'A avaliação demanda conversões exatas de porcentagem e unidades, além de reconhecer os limites do número de bits.'
            ], steps: [
                'Número de códigos digitais: 2¹²=4096.',
                'Passo ideal: LSB≈10/4096=0,0024414 V=2,441 mV.',
                'Erro máximo de escala informado: 0,1%·10 V=0,001·10=0,010 V=10 mV.',
                'Compare as grandezas: 10 mV é aproximadamente 4,10 LSB.',
                'Portanto resolução de 2,441 mV não garante erro menor que 2,441 mV.',
                'Um teste de calibração precisa de referência e incerteza adequadas ao erro que se pretende observar.'
            ], question: 'Por que uma indicação pode repetir sempre o mesmo código e ainda estar errada?', answer: 'Repetibilidade do código não exclui offset, erro de ganho ou referência incorreta.' },
        { title: '3. Aquisição aplicada a sensores', explanation: [
                'Sinais de termopares, acelerômetros e transdutores podem exigir condicionamento: amplificação, filtragem, isolamento e cuidados com aterramento. A escolha depende de largura de banda, ruído e dinâmica física do processo.',
                'Resistência de fonte elevada pode dificultar o carregamento do circuito sample-and-hold em conversores multiplexados, gerando erro quando o tempo de aquisição é insuficiente.',
                'Projetos confiáveis documentam faixa, escalas, offsets, unidades, tempo de amostragem e procedimento de calibração. Um gráfico bonito não substitui integridade metrológica.'
            ], question: 'Como diagnosticar erro crescente com amplitude da entrada, mantendo offset próximo de zero?', answer: 'Investigue erro de ganho, referência e linearidade, com comparação em múltiplos pontos e controle das condições do ensaio.' }
    ], ['Resolução não garante exatidão.', 'Erro informado e LSB precisam ser convertidos para a mesma unidade.', 'Toda cadeia analógica e digital influencia a medição.']),
    c('solar-estimativa', ['Estimar energia fotovoltaica a partir de HSP e PR.', 'Separar potência nominal, geração média e despacho instantâneo.', 'Reconhecer perdas por temperatura, sombreamento e indisponibilidade.'], [
        { title: '1. Potência não é energia', explanation: [
                'A potência nominal fotovoltaica em kWp caracteriza o gerador em condições de referência; não significa produção de kW constantes durante o dia. Energia kWh é integração da potência ao longo do tempo.',
                'Horas de sol pleno (HSP) representam insolação diária equivalente à irradiância de referência. O índice de desempenho PR incorpora perdas sistêmicas como temperatura, conversão, sujeira e disponibilidade, conforme convenção do estudo.',
                'Dados climáticos devem ser locais, com referência temporal e incerteza. Não é correto converter uma média diária em garantia de geração em cada dia de operação.'
            ], equations: ['E_diária≈P_pico·HSP·PR', 'P_média=E/Δt'], question: '8 kWp de módulos produz 8 kWh a cada hora do dia?', answer: 'Não. kWp é potência nominal de referência, e a irradiância varia conforme hora, clima, temperatura e perdas.' },
        { title: '2. Estimativa de geração e média anual', explanation: [
                'Considere planta de 8 kWp, HSP média diária de 4,5 h e PR=0,78. Admita essas médias para uma estimativa preliminar e 365 dias equivalentes, sem sazonalidade adicional.',
                'Use unidades coerentes para não confundir quantidade de energia com potência instantânea disponível.'
            ], steps: [
                'Energia de referência sem perdas: 8 kWp·4,5 h=36 kWh/dia.',
                'Após PR: E=36·0,78=28,08 kWh/dia.',
                'Geração anual sob médias constantes: 28,08·365=10.249,2 kWh/ano≈10,25 MWh/ano.',
                'Geração média de potência ao longo de 24 h: 28,08/24≈1,17 kW, não 8 kW.',
                'Uma bateria para deslocar 20 kWh de energia necessita análise de capacidade útil e perdas, não apenas potência de 20 kW.'
            ], question: 'Por que a potência média diária pode ficar muito abaixo de 8 kWp?', answer: 'Porque divide energia gerada ao longo das 24 horas e inclui noite, variações de irradiância e perdas, enquanto kWp é referência de pico.' },
        { title: '3. Interpretação e decisão econômica', explanation: [
                'Uma estimativa econômica deve considerar perfil horário de consumo e geração, regras tarifárias aplicáveis, degradação dos módulos, indisponibilidades, substituição de inversores e custos de manutenção.',
                'Sombras parciais e temperatura dos módulos podem causar redução não linear de desempenho; a estimativa simples com um PR constante tem limitações.',
                'Para validação, confronte séries históricas de irradiância, inclinação, orientação, perdas reais e medições, registrando método e incerteza de cada hipótese.'
            ], question: 'Duas instalações com os mesmos 8 kWp necessariamente geram a mesma energia?', answer: 'Não. Local, HSP, orientação, temperatura, sombras, disponibilidade e eficiência dos componentes mudam a geração.' }
    ], ['kWp e kWh não são intercambiáveis.', 'HSP e PR são hipóteses explícitas que precisam de fonte.', 'A estimativa é preliminar, não garantia contratual.']),
    c('economia-projeto', ['Calcular payback e VPL com fluxos líquidos coerentes.', 'Compreender taxa de desconto e valor temporal do dinheiro.', 'Avaliar decisões além do custo inicial.'], [
        { title: '1. Diferença entre caixa, resultado e valor presente', explanation: [
                'Uma proposta de eficiência energética deve separar investimento inicial, economia bruta, custos de operação, manutenção e fluxos líquidos. Payback simples indica quando o investimento se recupera nominalmente; não captura integralmente valor do dinheiro no tempo.',
                'O valor presente líquido (VPL) traz cada fluxo futuro ao valor de hoje por uma taxa de desconto compatível com o período e o risco considerado. VPL positivo sugere criação de valor nas hipóteses, mas não elimina incerteza nem substitui a avaliação técnica.',
                'Compare alternativas na mesma base de datas, inflação, tributos e horizonte de análise. Não desconte o investimento duas vezes nem misture taxa nominal com fluxos reais sem coerência.'
            ], equations: ['Payback simples=I0/FC_anual (se fluxo líquido uniforme)', 'VPL=−I0+Σ[FC_t/(1+i)^t]'], question: 'Payback de 3 anos garante que o projeto tem VPL positivo?', answer: 'Não. Depende da taxa de desconto, horizonte e fluxos posteriores; payback ignora parte dos efeitos temporais.' },
        { title: '2. Caso de investimento em eficiência', explanation: [
                'Um projeto demanda R$ 100.000 hoje e gera benefício líquido de caixa de R$ 30.000 ao fim de cada um dos próximos cinco anos. A taxa mínima de atratividade é 10% ao ano, na mesma base dos fluxos.',
                'Os fluxos são uniformes e pagos ao fim de cada ano, permitindo usar fator de valor presente de anuidade. O resultado é comparação econômica do cenário fornecido, não promessa de economia.'
            ], steps: [
                'Payback simples: 100.000/30.000=3,33 anos.',
                'Fator de valor presente da anuidade: F=(1−(1+0,10)^(−5))/0,10≈3,7907868.',
                'Valor presente das entradas: 30.000·3,7907868≈R$ 113.723,60.',
                'VPL=−100.000+113.723,60≈+R$ 13.723,60.',
                'Interpretação: sob hipóteses declaradas, o VPL é positivo a 10% a.a.',
                'Faça sensibilidade para variações de economia, vida útil, disponibilidade e taxa de desconto.'
            ], question: 'Por que somar 5·R$30.000 sem desconto não é suficiente para calcular VPL?', answer: 'Porque cada fluxo de anos futuros tem valor presente menor conforme a taxa de desconto e o tempo até recebê-lo.' },
        { title: '3. Decisão técnica e manutenção', explanation: [
                'Substituir máquinas pode afetar eficiência, disponibilidade, manutenção, capacitação e risco de parada. Um resultado financeiro positivo deve ser confrontado com normas, segurança, compatibilidade e capacidade operacional.',
                'Se economias previstas não forem medidas, crie plano de medição e verificação com linha de base, normalização por carga e temperatura, e tratamento de mudanças de produção.',
                'Registre premissas e incertezas para evitar atribuir toda a variação de consumo à intervenção e produzir conclusões enganosas.'
            ], question: 'O VPL de R$13.723,60 garante que todos os cenários de operação serão rentáveis?', answer: 'Não. Ele vale para os fluxos, horizonte e taxa utilizados; mudanças operacionais podem torná-lo negativo.' }
    ], ['Fluxos usados no VPL devem ser líquidos e coerentes temporalmente.', 'Payback e VPL respondem a perguntas diferentes.', 'Engenharia e economia devem ser avaliadas em conjunto.']),
    c('estabilidade-polos', ['Interpretar raízes características e estabilidade LTI.', 'Aplicar Routh-Hurwitz em polinômios simples.', 'Separar estabilidade do modelo e desempenho físico real.'], [
        { title: '1. Polos são modos dinâmicos', explanation: [
                'Em sistemas contínuos lineares, um polo λ aparece em modos semelhantes a e^(λt). Se a parte real é negativa, o modo decai; se positiva, cresce. Um par complexo com parte real negativa produz oscilação amortecida.',
                'Quando o modelo tem zeros, saturação, atraso ou polos não observáveis, a interpretação apenas pela função de transferência reduzida pode omitir dinâmicas internas. A estabilidade exige conhecer a realização do sistema e o contexto da análise.',
                'Não classifique como instável qualquer sistema que oscila por um curto intervalo: oscilações amortecidas são compatíveis com estabilidade assintótica.'
            ], equations: ['s²+2ζωn s+ωn²=0', 'Modo: x(t)∝e^(λt)'], question: 'Polos −2±j3 indicam oscilação com amplitude crescente?', answer: 'Não. A parte real −2 indica envoltória decrescente e a parte imaginária indica oscilação amortecida.' },
        { title: '2. Teste algébrico sem calcular raízes de grau 3', explanation: [
                'Considere o polinômio característico de malha fechada p(s)=s³+2s²+3s+10. Verifique estabilidade pelo critério Routh-Hurwitz para cúbico com coeficientes positivos.',
                'Para polinômio cúbico a3 s³+a2 s²+a1 s+a0, com coeficientes positivos, condição necessária e suficiente de estabilidade estrita é a2·a1>a3·a0.'
            ], steps: [
                'Identifique a3=1, a2=2, a1=3, a0=10.',
                'Confirme positividade de todos os coeficientes: sim, mas isso isoladamente não garante estabilidade.',
                'Calcule a2·a1=2·3=6.',
                'Calcule a3·a0=1·10=10.',
                'Como 6<10, o critério falha: o polinômio possui polos no semiplano direito, caracterizando instabilidade do modelo.',
                'Compare a um exemplo estável s³+6s²+11s+6=(s+1)(s+2)(s+3), com polos −1, −2 e −3.'
            ], equations: ['Cúbico estável: a_i>0 e a2·a1>a3·a0'], question: 'Coeficientes todos positivos garantem estabilidade para cúbicos?', answer: 'Não. É necessário também que a2·a1>a3·a0 (além das condições adequadas).' },
        { title: '3. Relação com ajustes reais', explanation: [
                'Polos podem mover-se com ganho, carga e parâmetros. Um controlador validado num ponto de operação pode ter comportamento inadequado em outro, sobretudo quando há saturação, atraso e limitações de atuador.',
                'Use margem de fase, margem de ganho e critérios de desempenho em conjunto quando aplicáveis; estabilidade do modelo é apenas um dos requisitos de engenharia.',
                'Simulações devem ser confrontadas com dados instrumentados e verificações seguras em processo real, sem usar uma conta simplificada como autorização de operação.'
            ], question: 'Um sistema matematicamente estável sempre atende tempo de resposta e sobressinal exigidos?', answer: 'Não. Estabilidade é requisito diferente de desempenho transitório; uma resposta estável pode ser muito lenta ou apresentar sobressinal excessivo.' }
    ], ['Parte real negativa determina decaimento modal.', 'Critério algébrico reduz risco de erro em polinômios maiores.', 'Estabilidade não substitui especificação de desempenho.']),
    c('tcs-protecao', ['Calcular relação nominal de TC sem ignorar classe de proteção.', 'Relacionar burden e saturação durante faltas.', 'Conhecer riscos de circuito secundário aberto.'], [
        { title: '1. Relação e função do TC', explanation: [
                'O transformador de corrente (TC) reproduz no secundário uma grandeza proporcional à corrente primária, dentro das condições de projeto, exatidão e saturação. Um TC 600/5 possui relação nominal 120:1, não significa que o secundário nunca ultrapassará 5 A.',
                'TCs para medição e proteção podem ter requisitos distintos, especialmente em correntes de falta. Remanência, offset CC, burden e classe influenciam fidelidade de reprodução durante transitórios.',
                'A carga secundária inclui cabos, instrumentos e relés, devendo ser analisada segundo suas impedâncias e a corrente relevante. A capacidade do TC não é dedutível apenas da relação nominal.'
            ], equations: ['n=Ip,nom/Is,nom', 'Is,ideal=Ip/n', 'S_burden≈Is²·|Z_burden| (na hipótese simplificada)'], question: 'Por que o secundário de um TC 600/5 pode indicar 30 A durante uma falta?', answer: 'Porque a relação ideal mantém proporção: 3600 A primários correspondem a 30 A secundários, desde que o TC ainda reproduza adequadamente sem saturação.' },
        { title: '2. Caso aplicado: defeito de 3600 A e carga secundária', explanation: [
                'Um TC 600/5 alimenta circuito secundário simplificado com impedância equivalente de 0,50 Ω. Durante falta, a corrente primária simétrica suposta chega a 3600 A. Use primeiro o modelo ideal sem saturação, apenas para estimar a solicitação secundária.',
                'Este cálculo não substitui classe de exatidão, tensão limite, composição indutiva da carga nem exigências transitórias do relé.'
            ], steps: [
                'Relação nominal: n=600/5=120.',
                'Corrente secundária ideal de falta: Is=3600/120=30 A.',
                'Queda de tensão na carga secundária puramente resistiva: Vs=30·0,50=15 V.',
                'Potência aparente na carga equivalente resistiva na falta: S=I²R=30²·0,50=450 VA.',
                'Para corrente secundária nominal de 5 A, a mesma carga seria 5²·0,50=12,5 VA.',
                'O contraste mostra que condições de falta impõem solicitações diferentes; avaliar se o TC satura requer dados de projeto específicos.'
            ], question: 'O resultado de 450 VA determina sozinho saturação do TC?', answer: 'Não. Depende da curva de excitação, classe, remanência, forma da corrente, duração, burden real e características do núcleo.' },
        { title: '3. Segurança e ensaios de proteção', explanation: [
                'Nunca abra intencionalmente o secundário de um TC energizado sem procedimento de segurança apropriado. A ausência de carga pode gerar tensões perigosas, danificar a isolação e colocar pessoas em risco.',
                'Na proteção diferencial, relações de TCs, polaridades, conexões, classe, saturação e corrente de magnetização do transformador protegido podem afetar o desempenho. Erros de polaridade produzem atuações equivocadas.',
                'Em comissionamento, registre relação, polaridade, carga secundária, continuidade e ensaios aplicáveis, utilizando equipamento e equipe habilitados segundo procedimentos e normas.'
            ], question: 'Uma relação nominal correta garante que a proteção diferencial atuará seletivamente?', answer: 'Não. Polaridade, conexões, classe, saturação, características do relé e ajustes também importam.' }
    ], ['A relação 600/5 não limita corrente secundária a 5 A.', 'Burden e saturação devem ser avaliados separadamente.', 'Segurança de TC energizado é crítica.'])
];
