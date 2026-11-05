const L = (id, areaId, title, summary, concept, formula, variables, steps, application, mistakes, revision, duration = 25) => ({ id, areaId, title, summary, concept, formula, variables, steps, application, mistakes, revision, duration, version: '2.0', sources: ['https://www.in.gov.br/en/web/dou/-/portaria-n-164-de-14-de-abril-de-2026-699934764', 'https://openstax.org/books/university-physics-volume-2/pages/1-introduction'] });
export const ADVANCED_LESSONS = [
    L('curto-circuito-pu', 'EE11', 'Curto-circuito trifásico: impedância em pu', 'Transforme grandezas de base, compreenda modelos de falta e evite confusão entre corrente nominal e corrente de curto-circuito.', [
        'O sistema por unidade (pu) expressa grandezas como fração de uma base. Ele simplifica análises com transformadores e tensões diferentes, desde que as bases sejam coerentes.',
        'Uma falta trifásica equilibrada pode ser analisada por um equivalente de Thévenin de sequência positiva. A corrente inicial depende da tensão pré-falta e da impedância entre a fonte e o ponto de falta.',
        'Em uma base trifásica, a tensão-base convencional é a tensão entre linhas; a corrente-base deve ser calculada pela potência aparente trifásica.',
        'Uma reatância de 0,20 pu limita a corrente ideal a 1/0,20=5 pu se a tensão for 1 pu e a resistência for desprezada.'
    ], ['I_base = S_base/(√3·V_L,base)', 'Z_base = V_L,base²/S_base', 'I_f,pu = V_pre,pu / |Z_Th,pu|'], ['I: ampères (A)', 'S_base: volt-ampères (VA)', 'V_L: volts entre linhas (V)', 'Z_base: ohms (Ω)', 'Z_Th: impedância equivalente até a falta (pu)'], ['Uma instalação possui trafo de 10 MVA, 13,8 kV, reatância série de 0,20 pu e uma fonte ideal a montante.',
        'Calcule a corrente-base: 10.000.000/(√3·13.800)=418,4 A.',
        'Na falta trifásica: corrente de falta=1/0,20=5 pu.',
        'Converta: 5×418,4≈2092 A=2,09 kA.',
        'Interprete: a corrente nominal do trafo não é a corrente de falta. Redes reais requerem impedância da fonte, resistência e critérios normativos.'], 'Estimativa preliminar de capacidade de interrupção e ajuste de relés em subestações.', ['Misturar kV e V nas bases.', 'Somar impedâncias em pu que foram expressas em bases diferentes.', 'Tratar estudo simplificado como cálculo normativo completo.'], 'I_base=S_base/(√3·Vbase); Ifpu=1/Zpu apenas para hipóteses explicitadas.'),
    L('maquina-inducao', 'EE15', 'Motor de indução: escorregamento, torque e potência', 'Entenda como frequência, número de polos, velocidade, perdas no rotor e torque se relacionam.', [
        'A máquina de indução exige velocidade relativa entre o campo do estator e o rotor para induzir corrente rotórica e gerar torque.',
        'A velocidade síncrona depende de f e do número total de polos. A velocidade do rotor em regime motor normalmente fica abaixo da síncrona.',
        'O escorregamento em regime motor é s=(ns−n)/ns. A frequência das grandezas rotóricas é aproximadamente s·f no modelo clássico.',
        'A potência do entreferro se divide em perdas ôhmicas do rotor (s·Pag) e potência mecânica eletromagnética convertida ((1−s)·Pag).'
    ], ['n_s = 120 f / p', 's = (n_s−n)/n_s', 'P_cu,rotor = s·P_ag', 'T = P_eixo/ω ; ω = 2πn/60'], ['ns, n: rotações em rpm', 'f: frequência em Hz', 'p: polos', 's: fração', 'Pag: potência em W', 'T: torque em N·m'], ['Para um motor de quatro polos e 60 Hz, ns=120·60/4=1800 rpm.',
        'Se o rotor gira a 1746 rpm, s=(1800−1746)/1800=0,03 (3%).',
        'Se Pmec útil=15 kW nessa rotação, ω=2π·1746/60≈182,8 rad/s.',
        'Torque útil T=15000/182,8≈82 N·m.',
        'Se a potência do entreferro fosse 50 kW com s=4%, as perdas ôhmicas do rotor seriam 2 kW, antes de perdas mecânicas.'], 'Diagnóstico de motores de bombas, geradores auxiliares e acionamentos industriais.', ['Usar pares de polos no lugar do total.', 'Confundir potência elétrica absorvida com potência mecânica útil.', 'Tratar escorregamento como corrente ou rendimento.'], 'ns=120f/p, s=(ns−n)/ns e Pcu,rotor=s·Pag.'),
    L('transitorios-rlc', 'EE06', 'Transitórios RC, RL e ressonância RLC', 'Resolva respostas de primeira ordem e a frequência natural de oscilação.', [
        'A energia armazenada em capacitores (campo elétrico) e indutores (campo magnético) impede alterações instantâneas de determinadas grandezas: tensão no capacitor e corrente no indutor ideal.',
        'Circuitos RC e RL de primeira ordem apresentam respostas exponenciais com constantes de tempo definidas pelos elementos equivalentes vistos pelo armazenador.',
        'Na energização, x(t)=xf+(x0−xf)e^(−t/τ); na descarga a zero, x(t)=x0 e^(−t/τ).',
        'Um circuito RLC série ideal apresenta ressonância quando |XL|=|XC|; a resistência influencia amortecimento e largura de banda.'
    ], ['τ_RC = R·C', 'τ_RL = L/R', 'x(t) = x_f + (x_0−x_f)·e^(−t/τ)', 'f0 = 1/(2π√(LC))'], ['R: Ω', 'C: F', 'L: H', 'τ: s', 't: s', 'f0: Hz'], ['Uma carga RC tem R=10 kΩ e C=100 µF. Portanto τ=10.000·0,0001=1 s.',
        'A tensão atinge metade do final quando 0,5=1−e^(−t/τ).',
        'Logo t=τ ln2≈0,693 s. Em 1τ, chegaria a cerca de 63,2%, não 50%.',
        'Em outro circuito, L=20 mH e C=100 µF: f0=1/[2π√(0,02·0,0001)]≈112,5 Hz.',
        'Verifique as hipóteses do circuito, carga inicial e unidades antes de aplicar qualquer fórmula.'], 'Análise de transitórios em comandos, filtros e equipamentos eletrônicos.', ['Confundir a constante de tempo com o tempo total de acomodação.', 'Usar µF sem converter para farads.', 'Omitir condições iniciais.'], 'A constante de tempo organiza a resposta exponencial; em RLC, f0 depende de L e C.'),
    L('bayes-confiabilidade', 'EE19', 'Probabilidade condicional e confiabilidade', 'Interprete alarmes de falha rara e sistemas redundantes com probabilidade, sem confundir sensibilidade com confiança no resultado.', [
        'A probabilidade condicional P(A|B) considera a chance de A quando B foi observado. Ela não é igual, em geral, a P(B|A).',
        'A taxa de falha de base pode ser muito pequena; assim, mesmo sensores sensíveis podem gerar muitos falsos positivos em populações majoritariamente saudáveis.',
        'Para unidades independentes em paralelo, a função total falha somente se todas falharem. Para votação 2 de 3, devem ocorrer ao menos dois sucessos.',
        'Falha de causa comum quebra hipóteses de independência e exige análise específica.'
    ], ['P(A|B) = P(B|A)P(A)/P(B)', 'P(falha simultânea independente) = p1·p2', 'P(X≥2 para n=3) = 3p²(1−p)+p³'], ['p: probabilidade de sucesso individual', 'n: número de ensaios', 'X: número de sucessos', 'P(A|B): probabilidade condicional'], ['A falha ocorre em 1% dos equipamentos e o teste é positivo em 95% dos defeituosos.',
        'A taxa de falso positivo nos demais é 5%.',
        'P(positivo e falha)=0,95·0,01=0,0095.',
        'P(positivo e sem falha)=0,05·0,99=0,0495.',
        'Logo P(falha|positivo)=0,0095/(0,0095+0,0495)=16,1%.'], 'Interpretação de alarme de manutenção preditiva, monitoramento e decisão de investigação.', ['Confundir P(positivo|falha) com P(falha|positivo).', 'Supor independência sem avaliar eventos comuns.', 'Ignorar o efeito da taxa-base.'], 'Bayes atualiza a probabilidade com evidência; redundância precisa de hipótese de independência.'),
    L('votacao-protecao', 'EE10', 'Lógica digital de proteção e votação 2oo3', 'Aprenda a diferença entre função lógica, redundância e probabilidade de atuação.', [
        'O esquema 2oo3 permite atuar quando pelo menos dois de três sinais são verdadeiros.',
        'A expressão lógica é AB+AC+BC; isso corresponde à maioria simples de três entradas.',
        'A confiabilidade da atuação depende da probabilidade de cada sensor detectar um evento, das falhas de causa comum e da lógica de decisão.',
        'A votação reduz a dependência de um único sensor, mas pode introduzir falhas de não atuação se dois canais falharem simultaneamente.'
    ], ['Y = AB + AC + BC', 'P(atuação com 2oo3) = 3p²(1−p) + p³'], ['A, B, C: sinais digitais 0/1', 'p: probabilidade individual de detecção', 'Y: comando lógico de atuação'], ['Considere três canais independentes, cada um com probabilidade de detecção de 0,9.',
        'Probabilidade de exatamente dois detectarem: 3·0,9²·0,1=0,243.',
        'Probabilidade de todos detectarem: 0,9³=0,729.',
        'Probabilidade de a lógica receber maioria correta: 0,243+0,729=0,972=97,2%.',
        'A hipótese de independência deve ser explicitada e testada antes de aplicar isso a sistemas críticos.'], 'Lógicas de proteção, intertravamentos industriais e sistemas especiais de proteção.', ['Confundir requisito de maioria com unanimidade.', 'Desconsiderar falhas de causa comum.', 'Supor que votação substitui os estudos de segurança.'], 'A lógica 2oo3 é AB+AC+BC; confiabilidade depende dos modos de falha.'),
    L('adc-calibracao', 'EE14', 'Instrumentação: conversão A/D, resolução e exatidão', 'Diferencie resolução numérica, incerteza de medição e calibração.', [
        'O conversor A/D associa intervalos de entrada a códigos digitais. Para n bits, existem 2^n códigos.',
        'A resolução ideal de tensão é a largura total da faixa dividida aproximadamente pelo número de níveis.',
        'Resolução não significa exatidão: ruído, offset, ganho, não linearidade e referências limitam a medição.',
        'A comparação metrológica exige referência rastreável, condições documentadas e incerteza de medição.'
    ], ['N = 2ⁿ códigos', 'ΔV ≈ (V_max−V_min)/2ⁿ', 'erro = indicação − referência'], ['n: bits', 'ΔV: resolução em V', 'Vmax/Vmin: limites de faixa', 'erro: unidade da grandeza'], ['ADC ideal unipolar de 12 bits, faixa 0 a 10 V.',
        'Número de códigos=2^12=4096.',
        'LSB≈10/4096=0,002441 V=2,44 mV.',
        'Uma leitura com passo de 2,44 mV ainda pode ter erro de calibração maior que esse passo.',
        'Ao avaliar o sensor, documente os padrões, método, temperatura e incerteza.'], 'Escolha de canais de aquisição e calibração de sensores industriais.', ['Tratar número de bits como garantia de exatidão.', 'Ignorar faixa de entrada e saturação.', 'Calcular erro sem referência válida.'], 'Resolução é discretização; exatidão depende de mais características do sistema.'),
    L('solar-estimativa', 'EE12', 'Energia fotovoltaica e desempenho global', 'Estime produção sem transformar médias climáticas em garantias de geração.', [
        'O pico nominal do gerador (kWp) é definido em condições padronizadas, não representa produção constante em campo.',
        'Horas de sol pleno (HSP) representam insolação diária equivalente à irradiância de referência.',
        'A taxa de desempenho (PR) agrega perdas operacionais e deve ser estimada conforme condições locais.',
        'A geração varia por estação, sombreamento, sujeira, temperatura e indisponibilidades.'
    ], ['E ≈ P_pico · HSP · PR'], ['E: energia diária (kWh)', 'Ppico: potência de referência (kWp)', 'HSP: horas de sol pleno (h)', 'PR: fração de desempenho'], ['Considere gerador de 5 kWp, HSP=5,2 h/dia e PR=0,78.',
        'Multiplique Ppico·HSP=5·5,2=26 kWh/dia antes de perdas.',
        'Considere PR: E=26·0,78=20,28 kWh/dia.',
        'O resultado é estimativa média sob as hipóteses; não é potência instantânea nem garantia diária.'], 'Pré-estudo de geração renovável e comparação com perfil de consumo.', ['Confundir kWp com kWh.', 'Desconsiderar temperatura e sombreamento.', 'Usar HSP sem verificar período climático.'], 'Energia estimada≈potência instalada×HSP×PR.'),
    L('economia-projeto', 'EE01', 'Viabilidade econômica: payback e limitações', 'Identifique fluxo líquido antes de escolher investimento e saiba quando usar VPL.', [
        'O payback simples estima quanto tempo o fluxo líquido acumulado leva para recuperar o investimento inicial.',
        'Custos de operação e manutenção devem reduzir as economias brutas para obter o benefício líquido.',
        'O valor presente líquido (VPL) desconta fluxos de caixa e constitui critério mais completo quando existe taxa mínima de atratividade.',
        'Projetos devem considerar manutenção, incerteza, vida útil, risco e impacto operacional.'
    ], ['Payback simples = I0/economia líquida anual', 'VPL = −I0 + Σ FC_t/(1+i)^t'], ['I0: investimento inicial (R$)', 'FCt: fluxo líquido no período t (R$)', 'i: taxa de desconto por período', 'VPL: R$'], ['Uma proposta custa R$ 100.000 de início e economiza R$ 20.000 brutos por ano.',
        'As despesas operacionais adicionais são R$ 8.000/ano.',
        'A economia líquida anual é 20000−8000=12000 R$/ano.',
        'Payback simples=100000/12000≈8,33 anos.',
        'Aprovação econômica requer avaliar VPL, fluxo de caixa real e análise de sensibilidade.'], 'Estudos de eficiência energética em instalações e modernizações industriais.', ['Descontar custos de investimento duas vezes.', 'Confundir economia bruta com fluxo líquido.', 'Aprovar apenas pelo payback sem avaliar a taxa de desconto.'], 'Payback é triagem; VPL considera valor do dinheiro no tempo.'),
    L('estabilidade-polos', 'EE18', 'Estabilidade e polos de sistemas LTI', 'Analise estabilidade de funções de transferência a partir das raízes do denominador.', [
        'Para sistemas contínuos lineares invariantes no tempo, polos da função de transferência estão associados aos modos de resposta temporal.',
        'Um polo no semiplano esquerdo (parte real negativa) descreve decaimento exponencial; polos com parte real positiva geram crescimento exponencial.',
        'Um par complexo conjugado com parte real negativa representa comportamento oscilatório amortecido.',
        'Essa análise pressupõe modelo linear adequado; zeros, saturação, incerteza e modos não observáveis podem exigir investigação adicional.'
    ], ['Denominador de segunda ordem: s² + 2ζω_n s + ω_n²', 's = [−b ± √(b²−4ac)]/(2a)'], ['s: frequência complexa (1/s)', 'ζ: amortecimento relativo (adimensional)', 'ωn: frequência natural (rad/s)'], ['Analise s²+4s+13=0.',
        'O discriminante é Δ=4²−4·1·13=−36.',
        'Os polos são s=(−4±√−36)/2=−2±j3.',
        'Como as partes reais são −2, a resposta modal decai; o sistema linear é assintoticamente estável.',
        'A parte imaginária ±3 indica oscilação amortecida no modelo.'], 'Avaliação de controle de velocidade, tensão e processo industrial.', ['Classificar todos os polos complexos como instáveis.', 'Confundir parte imaginária com parte real.', 'Ignorar o efeito de polos no semiplano direito.'], 'Parte real negativa indica decaimento modal na modelagem LTI contínua.'),
    L('tcs-protecao', 'EE13', 'Transformadores de corrente e proteção', 'Use a relação de TC corretamente e conheça o limite das hipóteses ideais.', [
        'O TC fornece sinal secundário proporcional à corrente primária dentro de sua faixa e características de projeto.',
        'A relação nominal 600/5 indica relação ideal de corrente 120:1.',
        'Durante faltas, a saturação do núcleo, a carga secundária, o fluxo remanente e a componente contínua podem distorcer o sinal.',
        'A seleção do TC para proteção deve considerar classe, burden, corrente de falta, tempo de atuação e recomendações normativas.'
    ], ['I_s,ideal = I_p · (I_s,nom/I_p,nom)'], ['Ip: corrente primária (A)', 'Is: corrente secundária (A)', 'Relação nominal: A/A'], ['TC 600/5 tem relação 120:1.',
        'Se durante falta Ip=3600 A, Is,ideal=3600/120=30 A.',
        'Esse é um cálculo sem saturação nem burden.',
        'Verifique classe de exatidão para proteção, corrente secundária e burden real antes de avaliar desempenho de relé.'], 'Ajuste de relés e comissionamento de proteção e controle de subestações.', ['Tratar corrente acima do nominal como impossível.', 'Ignorar saturação durante curtos-circuitos.', 'Confundir TC de medição e de proteção.'], 'A relação ideal não substitui estudos de saturação e classe de proteção.')
];
