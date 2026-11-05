/** Cadernos aprofundados autorais, com hipóteses explícitas e exemplos reproduzíveis.
 * Não representam resoluções oficiais do INEP nem ranking estatístico de incidência.
 */
import {ADDITIONAL_MASTERCLASSES} from './additionalCourses.js';
export type Chapter={title:string;explanation:string[];equations?:string[];steps?:string[];question?:string;answer?:string};
export type Masterclass={lessonId:string;estimatedMinutes:number;objectives:string[];chapters:Chapter[];takeaways:string[];sources:string[]};
const base=['https://openstax.org/books/university-physics-volume-2/pages/1-introduction','https://www.gov.br/inep/pt-br/centrais-de-conteudo/legislacao/enade'];
const C=(lessonId:string,estimatedMinutes:number,objectives:string[],chapters:Chapter[],takeaways:string[],sources:string[]=base):Masterclass=>({lessonId,estimatedMinutes,objectives,chapters,takeaways,sources});
export const MASTERCLASSES:Masterclass[]=[
C('circuito-ohm',55,[
 'Montar equações nodais sem perder o sentido físico das correntes.',
 'Resolver circuitos com mais de uma fonte e verificar conservação de potência.',
 'Distinguir análise de circuitos em CC, regime senoidal e transitórios.'
],[
{title:'1. Modelo físico antes da matemática',explanation:[
 'Tensão é diferença de potencial entre dois pontos; corrente é taxa de transporte de carga; resistência modela a relação v=Ri para elementos ôhmicos. A referência de potencial é uma escolha matemática: mudar o nó de referência não modifica diferenças de tensão nem correntes físicas.',
 'As leis de Kirchhoff decorrem de conservação de carga (soma algébrica das correntes em um nó igual a zero) e de energia no modelo concentrado (soma algébrica das tensões em uma malha igual a zero). A primeira não depende de o circuito estar série ou paralelo; a segunda exige respeitar polaridades.',
 'Não assuma que dois resistores estão em paralelo apenas porque foram desenhados próximos. Eles precisam compartilhar os mesmos dois nós. Em circuitos com fontes dependentes ou mais de um nó essencial, a análise nodal costuma ser mais segura que combinações intuitivas de resistências.'
 ],equations:['Lei de Ohm: i_ab=(V_a−V_b)/R_ab','Lei dos nós: Σi_saindo=0','Potência absorvida (convenção passiva): p=vi'],question:'O potencial absoluto de um nó é uma grandeza física mensurável independentemente da referência?',answer:'Não. O que se mede é diferença de potencial. A escolha do nó de referência simplifica o cálculo; correntes e tensões entre componentes não mudam.'},
{title:'2. Caso de engenharia: rede resistiva com duas fontes',explanation:[
 'Considere uma fonte ideal de 24 V cujo terminal positivo chega ao nó A por um resistor de 6 Ω. O nó A liga-se ao terra por 12 Ω e ao nó B por 4 Ω. O nó B liga-se ao terra por 8 Ω e recebe uma fonte ideal de corrente de 1 A, dirigida do terra para B.',
 'As incógnitas são V_A e V_B. Escreva correntes saindo de cada nó; a fonte de 1 A está entrando em B, por isso aparece com sinal negativo na soma de saídas. A geometria do desenho não substitui a declaração das conexões.',
 'Resolva as duas equações simultaneamente e, em seguida, teste se todas as correntes respeitam o balanço de cada nó. Essa verificação detecta mais erros do que conferir somente a alternativa final.'
 ],equations:['Nó A: (V_A−24)/6 + V_A/12 +(V_A−V_B)/4=0','Nó B: (V_B−V_A)/4 + V_B/8−1=0','Equivalente: 2V_A−V_B=16; −2V_A+3V_B=8'],steps:[
 'Multiplique a equação de A por 12: 2(V_A−24)+V_A+3(V_A−V_B)=0. Portanto 6V_A−3V_B=48.',
 'Multiplique a equação de B por 8: 2(V_B−V_A)+V_B−8=0. Portanto −2V_A+3V_B=8.',
 'Da primeira: V_B=2V_A−16. Substitua na segunda: −2V_A+3(2V_A−16)=8, então 4V_A=56 e V_A=14 V.',
 'V_B=2·14−16=12 V. Correntes: da fonte de 24 V para A, 10/6≈1,667 A; A para terra, 14/12≈1,167 A; A para B, (14−12)/4=0,50 A; B para terra, 12/8=1,50 A.',
 'Balanço em A: 1,667≈1,167+0,500 A. Balanço em B: 1,00+0,50=1,50 A. As duas leis dos nós são satisfeitas.'
 ],question:'Se a fonte de 1 A fosse invertida, poderíamos manter a mesma equação de B?',answer:'Não. O sinal da fonte muda; isso altera o sistema e as tensões resultantes. Convenções coerentes são parte da solução.'},
{title:'3. Conferência independente: balanço de potência',explanation:[
 'Um resultado algébrico pode estar matematicamente consistente e, ainda assim, representar uma conexão errada. A conferência por energia fornece uma segunda linha de defesa.',
 'Na convenção passiva, p=vi é positiva quando a corrente entra pelo terminal de tensão positiva. Fontes podem fornecer potência (sinal negativo na convenção de absorção). Resistores ideais sempre dissipam i²R.'
 ],equations:['P_R=I²R=V²/R','ΣP_absorvida+ΣP_fornecida(com sinal)=0'],steps:[
 'Resistor 6 Ω: P=(24−14)²/6≈16,667 W. Resistor 12 Ω: 14²/12≈16,333 W.',
 'Resistor 4 Ω: P=(14−12)²/4=1 W. Resistor 8 Ω: P=12²/8=18 W.',
 'Total dissipado: 16,667+16,333+1+18=52 W.',
 'Fonte de tensão entrega 24·(10/6)=40 W; fonte de corrente injeta 1 A em nó a 12 V, entregando 12 W. Total fornecido: 52 W.',
 'A diferença entre fornecimento e dissipação é zero, descontando arredondamentos.'
 ],question:'Por que a potência na resistência de 6 Ω não é 24²/6?',answer:'Porque o resistor não está ligado entre 24 V e 0 V: seus terminais estão a 24 V e 14 V. A queda é apenas 10 V.'},
{title:'4. Generalização útil para a prova',explanation:[
 'Com fontes dependentes, mantenha a variável de controle na equação da fonte. Para calcular resistência de Thévenin, não desative fontes dependentes; use uma fonte-teste ou outra estratégia adequada.',
 'Em CA senoidal, substitua R por impedâncias complexas Z_R=R, Z_L=jωL, Z_C=1/(jωC). A estrutura de Kirchhoff continua válida para fasores, mas a potência precisa ser tratada como complexa S=P+jQ.',
 'Em transitórios, condições iniciais importam: v_C(0+) = v_C(0−) e i_L(0+) = i_L(0−) em modelos ideais sem impulsos. Não se transfere um resultado de CC diretamente para o instante inicial sem verificar elementos armazenadores.'
 ],equations:['Z_L=jωL ; Z_C=1/(jωC)','S=V·I* = P+jQ'],question:'Ao analisar uma rede com fontes dependentes e senoides, basta desativar todas as fontes para obter a resistência de Thévenin?',answer:'Não. Fontes dependentes permanecem no modelo, e em regime senoidal devemos trabalhar com impedâncias complexas e fontes-teste quando necessário.'}
],['Desenhe os nós e sentidos de corrente antes de calcular.','Equações e conservação de potência devem concordar.','Cuidado ao transitar entre CC, fasores e transitórios.'],['https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules',...base]),
C('potencia-trifasica',60,[
 'Distinguir potência ativa, reativa e aparente em sistemas equilibrados.',
 'Dimensionar compensação de reativos sem confundir fator de potência e eficiência.',
 'Relacionar corrente de linha, perdas e limitações de sistemas reais.'
],[
{title:'1. O que circula em uma instalação trifásica',explanation:[
 'Em regime senoidal equilibrado, as três fases fornecem potências com deslocamento de 120°. Para calcular a potência total com grandezas de linha, use √3V_LI_L. Potência ativa P é a transferência média de energia útil e perdas; Q representa a troca de energia com campos armazenadores; S é o módulo da potência complexa.',
 'Fator de potência é a razão P/S em regime mais geral. O uso cosφ coincide com P/S apenas para formas de onda senoidais adequadas. Em sistemas distorcidos, o fator de potência total também depende de harmônicos e não pode ser reduzido sempre ao ângulo de deslocamento.',
 'Um banco capacitivo ideal pode reduzir a componente indutiva fundamental de Q, mas não corrige automaticamente distorções e pode causar ressonância com indutâncias da rede. A compensação deve partir de medições e estudo de qualidade de energia.'
 ],equations:['S=√(P²+Q²)','P=√3·V_L·I_L·cosφ','Q=P·tanφ (senoidal)','Q_C=P·[tan(arccos FP_i)−tan(arccos FP_f)]'],question:'Para a mesma potência ativa e tensão, o que acontece à corrente quando o fator de potência melhora?',answer:'Em sistema trifásico senoidal equilibrado, I=P/(√3V_LFP), logo a corrente diminui. Não significa que o consumo ativo da carga diminuiu na mesma proporção.'},
{title:'2. Estudo aplicado: compensação e perdas',explanation:[
 'Uma instalação de 400 V entre linhas absorve 230 kW de potência ativa com FP de deslocamento inicial 0,76 indutivo. O objetivo é FP de 0,96, mantendo P constante. Admita regime trifásico senoidal equilibrado e perdas do banco desprezíveis.',
 'Não dimensione o banco simplesmente multiplicando P pela diferença entre fatores de potência. A grandeza a compensar é a diferença de potências reativas, em kvar.',
 'O resultado nominal é ponto de partida. Na prática, mudanças do perfil de carga, degraus de controle, harmônicos, tolerâncias e sob/ sobretensões podem alterar a solução.'
 ],steps:[
 'Ângulo inicial: tanφ_i=√(1−0,76²)/0,76≈0,8554; Q_i≈230·0,8554=196,7 kvar.',
 'Ângulo desejado: tanφ_f=√(1−0,96²)/0,96≈0,29167; Q_f≈230·0,29167=67,1 kvar.',
 'Potência capacitiva fundamental aproximada: Q_C=196,7−67,1≈129,6 kvar.',
 'Corrente inicial: I_i=230000/(√3·400·0,76)≈436,8 A. Corrente final: I_f=230000/(√3·400·0,96)≈345,8 A.',
 'Se a resistência do mesmo alimentador e sua temperatura fossem mantidas, a razão aproximada das perdas I²R seria (345,8/436,8)²≈0,627: redução ideal de 37,3% nessa parcela das perdas.',
 'Isso não significa redução de 37,3% na energia total da fábrica: o motor/ processo continua exigindo aproximadamente a mesma potência ativa; as perdas são apenas uma fração do consumo.'
 ],equations:['I=P/(√3·V_L·FP)','P_Joule=3I²R_fase'],question:'Por que 129,6 kvar não deve ser confundido com 129,6 kW?',answer:'A potência reativa é medida em var; ela representa intercâmbio de energia em campos elétricos/magnéticos, não transferência média de trabalho como os watts.'},
{title:'3. Compensação com segurança técnica',explanation:[
 'Antes de instalar capacitores, avalie o espectro de corrente e tensão, o nível de curto-circuito, a potência reativa já presente e a possibilidade de sobrecompensação em cargas leves.',
 'Em sistemas com inversores e retificadores, o banco pode criar ressonância paralela com a impedância da alimentação. Nesses casos, bancos dessintonizados ou filtros podem ser necessários; não existe dimensionamento seguro por uma única fórmula.',
 'Também confira tensão nominal dos capacitores, corrente admissível, proteção por estágio, descarga e manutenção conforme normas e recomendações do fabricante.'
 ],question:'É correto concluir que fator de potência de deslocamento igual a 1 significa ausência de harmônicos?',answer:'Não. O deslocamento pode ser nulo na fundamental e ainda haver distorção significativa da corrente, reduzindo o fator de potência total.'}
],['Use grandezas de linha coerentes com potência trifásica total.','Compensação requer diferença de Q, não diferença direta entre FP.','Energia ativa, perdas I²R e qualidade de energia são conceitos relacionados, mas distintos.'],['https://openstax.org/books/university-physics-volume-2/pages/15-5-power-in-an-ac-circuit',...base]),
C('curto-circuito-pu',65,[
 'Converter impedâncias para uma base comum antes de somá-las.',
 'Calcular uma corrente de falta trifásica simplificada e interpretar limites do modelo.',
 'Associar resultados aos requisitos de capacidade de interrupção e ajustes de proteção.'
],[
{title:'1. De onde nasce a corrente de curto-circuito',explanation:[
 'Uma falta modifica drasticamente a topologia elétrica e pode criar um caminho de impedância baixa. Para falta trifásica equilibrada em um sistema idealizado, usa-se a rede de sequência positiva até o ponto da falta. Os equivalentes de Thévenin representam fontes e impedâncias a montante.',
 'A representação por unidade (pu) permite comparar impedâncias de componentes com tensões nominais diferentes, desde que todas sejam expressas em bases compatíveis. Potências-base são trifásicas; tensões-base costumam ser entre linhas.',
 'Não some uma impedância de transformador em 20 MVA a outra de cabo em 10 MVA como se compartilhassem a mesma base. O resultado final poderia parecer plausível e estar significativamente errado.'
 ],equations:['I_base=S_base/(√3·V_L,base)','Z_base=V_L,base²/S_base','Z_pu,nova=Z_pu,antiga·(S_base,nova/S_base,antiga)·(V_base,antiga/V_base,nova)²','I_falta,pu≈V_pre,pu/Z_Th,pu'],question:'Por que um trafo de 20 MVA em 13,8 kV não implica curto-circuito de 20 MVA?',answer:'A potência nominal é capacidade de carga de regime, enquanto a corrente de falta depende das impedâncias equivalentes e da contribuição das fontes.'},
{title:'2. Estudo resolvido em diferentes bases',explanation:[
 'Considere no barramento de 13,8 kV um equivalente fonte com reatância j0,08 pu na base 20 MVA, transformador série j0,12 pu na mesma base e trecho de alimentador com j0,03 pu declarado na base 10 MVA e mesma tensão-base.',
 'Admita tensão pré-falta 1 pu, fonte ideal por trás da reatância, resistência desprezível, ausência de outras fontes e falta trifásica franca nos terminais. Este modelo não fornece correntes assimétricas de pico nem atende sozinho a estudos normativos completos.'
 ],steps:[
 'Escolha base comum de 20 MVA e 13,8 kV. Como a tensão-base é a mesma, converta a reatância do alimentador: X_c=0,03·(20/10)=0,06 pu.',
 'Some as reatâncias série até a falta: X_Th=0,08+0,12+0,06=0,26 pu.',
 'Corrente-base: I_b=20.000.000/(√3·13.800)≈836,7 A.',
 'Corrente de falta na base: I_f,pu=1/0,26≈3,846 pu.',
 'Corrente simétrica aproximada: I_f≈836,7·3,846≈3.218 A ou 3,22 kA.',
 'Conferência em ohms: Z_b=13.800²/20.000.000≈9,522 Ω; X_Th=0,26·9,522≈2,476 Ω. I≈13.800/(√3·2,476)≈3,22 kA.'
 ],equations:['X_Th,pu=0,26','I_f≈3,22 kA'],question:'Se esquecermos a conversão do alimentador, qual o tipo de erro esperado?',answer:'A reatância seria subestimada (0,03 no lugar de 0,06 pu), levando a uma corrente de curto-circuito artificialmente maior.'},
{title:'3. Relação com seletividade e proteção',explanation:[
 'Uma corrente de falta calculada não representa diretamente o ajuste correto do relé. Seletividade, sensibilidade, saturação de transformadores de corrente, tempos de atuação, partidas de motor e coordenação com dispositivos a jusante precisam ser analisados.',
 'Para especificar poder de interrupção, avalie o método normativo aplicável, a contribuição de motores e fontes distribuídas, o comportamento subtransitório, a componente contínua e as margens de projeto.',
 'Cargas e usinas são dinâmicas. Um único cálculo simplificado não substitui estudo de proteção, nem autoriza a operação ou a energização de equipamentos.'
 ],question:'Corrente de curto-circuito calculada e corrente nominal do disjuntor são a mesma especificação?',answer:'Não. Corrente nominal refere-se à condução contínua; capacidade de interrupção e fechamento/ suportabilidade respondem a solicitações de falta e devem obedecer ao contexto normativo.'}
],['Impedâncias devem compartilhar base de potência e tensão antes da soma.','A conta de sequência positiva serve à falta trifásica equilibrada do modelo.','Proteção exige mais que comparar corrente de falta a um número nominal.'],base),
C('maquina-inducao',55,[
 'Explicar o campo girante, escorregamento e frequência rotórica.',
 'Relacionar balanço de potência, perdas e torque útil.',
 'Distinguir operação real, nominal e partida.'
],[
{title:'1. Campo girante e produção de torque',explanation:[
 'Correntes trifásicas equilibradas no estator criam um campo magnético girante à velocidade síncrona n_s. O rotor é induzido pela velocidade relativa entre condutores e campo. Em regime motor, o rotor costuma girar ligeiramente abaixo de n_s para que exista indução e torque.',
 'O escorregamento s=(n_s−n)/n_s é adimensional; em regime motor normal é positivo e pequeno. A frequência elétrica rotórica no modelo ideal é s·f. Em um motor com quatro polos a 60 Hz, n_s=1800 rpm; número de pares de polos não deve substituir o número total na fórmula 120f/p.',
 'Torque na saída é potência mecânica útil dividida pela velocidade angular. Torque interno e torque útil diferem pelas perdas mecânicas e adicionais.'
 ],equations:['n_s=120f/p (rpm, p=polos)','s=(n_s−n)/n_s','f_rotor=s·f','T_eixo=P_eixo/ω; ω=2πn/60'],question:'O rotor de um motor de indução idealmente gira exatamente à velocidade síncrona sob carga?',answer:'Não. Com escorregamento zero, não haveria frequência relativa no rotor nem torque eletromagnético em um motor de indução convencional.'},
{title:'2. Caso integrado: potência, perdas e torque',explanation:[
 'Um motor trifásico de seis polos alimentado a 60 Hz opera a 1164 rpm. Recebe 90 kW elétricos e entrega 81 kW úteis no eixo. Considere regime permanente e os valores declarados simultâneos.',
 'A questão exige separar três grandezas: velocidade síncrona, rendimento e torque. Sem a potência mecânica de saída não é correto usar diretamente os 90 kW de entrada para calcular torque útil.'
 ],steps:[
 'Velocidade síncrona: n_s=120·60/6=1200 rpm.',
 'Escorregamento: s=(1200−1164)/1200=0,03, ou 3%. Frequência rotórica aproximada: 0,03·60=1,8 Hz.',
 'Rendimento: η=P_eixo/P_entrada=81/90=0,90 ou 90%. Perdas totais: 90−81=9 kW.',
 'Velocidade angular do eixo: ω=2π·1164/60≈121,89 rad/s.',
 'Torque útil: T=81000/121,89≈664,5 N·m.',
 'Esse torque não determina, sozinho, a corrente de partida, o conjugado máximo, a eficiência em outros pontos nem a classe de isolação.'
 ],question:'Por que a perda total de 9 kW não é necessariamente igual à perda de cobre do rotor?',answer:'Inclui perdas no estator, ferro, rotor, atrito, ventilação e adicionais, dependendo do balanço. O cobre do rotor está ligado ao escorregamento e à potência de entreferro, não diretamente à diferença total.'},
{title:'3. Balanço energético interno',explanation:[
 'Após descontar perdas elétricas e magnéticas do estator, a potência cruza o entreferro P_ag. Uma parcela s·P_ag é dissipada no rotor e a parcela (1−s)·P_ag é convertida eletromecanicamente. As perdas mecânicas ainda devem ser subtraídas para obter a potência no eixo.',
 'Durante partida direta, escorregamento próximo de 1 e correntes elevadas exigem análise da rede e da máquina. Estratégias com inversores, soft-starters e autotransformadores têm implicações diferentes de torque, harmônicos e controle.',
 'Na engenharia de manutenção, verifique tensão desequilibrada, corrente de fase, aquecimento, vibração e histórico de carga antes de atribuir qualquer anomalia apenas ao escorregamento.'
 ],equations:['P_cobre,rotor=s·P_ag','P_convertida=(1−s)·P_ag','P_eixo=P_convertida−P_mecânicas'],question:'Se s aumenta e P_ag permanece constante, o que acontece à parcela de perdas ôhmicas do rotor?',answer:'Ela cresce proporcionalmente a s. Porém, em uma máquina real P_ag e outras variáveis também mudam com o ponto de operação.'}
],['ns depende de frequência e número total de polos.','η, P_ag e P_eixo não são intercambiáveis.','Definir torque útil exige potência mecânica útil e rotação do eixo.'],base),
C('transitorios-rlc',60,[
 'Aplicar continuidade de tensão capacitiva e corrente indutiva.',
 'Derivar resposta RC com condição inicial diferente de zero.',
 'Distinguir resposta subamortecida em RLC e ressonância.'
],[
{title:'1. Memória do circuito e condição inicial',explanation:[
 'Um capacitor ideal armazena energia E_C=½Cv² e um indutor ideal armazena E_L=½Li². Essas grandezas impedem saltos instantâneos de tensão capacitiva e corrente indutiva sem impulsos infinitos no modelo.',
 'Uma chave pode mudar abruptamente a topologia, mas a condição imediatamente após a manobra deve respeitar v_C(0+)=v_C(0−) e i_L(0+)=i_L(0−). Não confunda o estado final com o instante 0+.',
 'Respostas de primeira ordem caminham entre o valor inicial e o final: x(t)=x∞+[x(0+)−x∞]e^(−t/τ). O tempo τ não é tempo para completar 100% do processo.'
 ],equations:['τ_RC=R_eqC','τ_RL=L/R_eq','x(t)=x_∞+[x(0+)−x_∞]e^(−t/τ)'],question:'A tensão de um capacitor ideal inicialmente a 8 V salta para 20 V no instante de fechar a chave?',answer:'Não. Ela parte de 8 V e tende a 20 V segundo a dinâmica resultante, salvo impulsos idealizados de corrente.'},
{title:'2. Exemplo RC com tensão inicial',explanation:[
 'Uma fonte de 20 V é conectada, em t=0, a resistor de 4 kΩ em série com capacitor de 220 µF inicialmente carregado a 8 V. Admita componentes lineares ideais, sem outros caminhos de corrente.',
 'A diferença inicial na resistência é 20−8=12 V. A corrente decai à medida que a tensão do capacitor cresce; o sinal da resposta deve refletir isso.'
 ],steps:[
 'Constante de tempo: τ=R·C=4000·220·10⁻⁶=0,88 s.',
 'Resposta: v_C(t)=20+(8−20)e^(−t/0,88)=20−12e^(−t/0,88) volts.',
 'Em t=1,76 s=2τ: e^(−2)≈0,135335; v_C≈20−12·0,135335=18,376 V.',
 'A corrente instantânea é i(t)=[20−v_C(t)]/4000. Em 2τ: i≈1,624/4000=0,406 mA.',
 'A corrente inicial era (20−8)/4000=3 mA, maior que a de 2τ.',
 'Para alcançar 19 V, resolva 20−12e^(−t/0,88)=19; t=0,88·ln12≈2,187 s.'
 ],question:'Por que 19 V não ocorre em uma constante de tempo?',answer:'A fração de aproximação ao valor final depende da diferença inicial: após 1τ resta cerca de 36,8% dos 12 V iniciais, ou 4,41 V de desvio, e não apenas 1 V.'},
{title:'3. Ordem 2: RLC e amortecimento',explanation:[
 'No circuito RLC série sem excitação, a equação característica associada à corrente é s²+(R/L)s+1/(LC)=0. Defina α=R/(2L) e ω0=1/√(LC). Se α<ω0, os polos são complexos conjugados com parte real negativa e há oscilação amortecida.',
 'Em modelos ideais, para L=50 mH, C=20 µF e R=20 Ω, ω0=1/√(0,05·20·10⁻⁶)=1000 rad/s; α=20/(2·0,05)=200 s⁻¹; ωd=√(ω0²−α²)≈979,8 rad/s, isto é cerca de 155,9 Hz.',
 'Essa frequência amortecida não é simplesmente 1/τ, e a presença da fonte e as condições iniciais definem a amplitude e a fase dos transientes. Interpretação de curva exige reconhecer o que está sendo medido.'
 ],equations:['ω0=1/√(LC)','α=R/(2L)','ωd=√(ω0²−α²) (quando α<ω0)'],question:'Um circuito com R muito elevado necessariamente apresenta oscilação?',answer:'Não. Se α≥ω0 a resposta deixa de ser subamortecida; pode ser criticamente amortecida ou superamortecida.'}
],['Condição inicial é tão importante quanto constante de tempo.','Cheque dimensões: RC e L/R devem resultar em segundos.','RLC exige observar polos e amortecimento, não apenas uma fórmula de ressonância.'],base),
C('controle-malha',60,[
 'Relacionar denominador fechado, polos, estabilidade e resposta transitória.',
 'Calcular sobressinal e tempo de acomodação em segunda ordem.',
 'Interpretar limites de um ganho elevado de realimentação.'
],[
{title:'1. Modelar antes de ajustar',explanation:[
 'Uma função de transferência G(s) descreve a relação entre transformadas da saída e entrada com condições iniciais nulas em um sistema linear invariante no tempo. Um controlador fecha a malha comparando referência e medida, mas a realimentação não garante estabilidade.',
 'Na realimentação negativa, T(s)=G(s)/(1+G(s)H(s)). Polos de malha fechada são as raízes do denominador após simplificação compatível; o critério de estabilidade envolve todos os modos relevantes do sistema.',
 'Em controles físicos, saturação, atraso, ruído, limites do atuador e dinâmica não modelada podem alterar o comportamento previsto por uma função linear de baixa ordem.'
 ],equations:['T(s)=G(s)/(1+G(s)H(s))','Forma padrão: T(s)=ωn²/[s²+2ζωn s+ωn²]'],question:'Um processo com alta realimentação negativa sempre responde mais rápido e sem oscilação?',answer:'Não. A localização dos polos e as limitações físicas definem estabilidade, oscilação e transitórios.'},
{title:'2. Caso de projeto com sobressinal',explanation:[
 'Considere G(s)=25/[s(s+4)] em realimentação negativa unitária. O denominador fechado será s²+4s+25. Compare os coeficientes com o sistema canônico de segunda ordem.',
 'As métricas usuais a seguir são aproximações para modelo de segunda ordem subamortecido sem zeros dominantes e entrada em degrau.'
 ],steps:[
 'Feche a malha: T(s)=25/[s(s+4)+25]=25/(s²+4s+25).',
 'Compare com s²+2ζωn s+ωn²: ωn²=25, logo ωn=5 rad/s; 2ζωn=4, portanto ζ=4/10=0,4.',
 'Polos: s=[−4±√(16−100)]/2=−2±j√21≈−2±j4,583. Partes reais negativas: estável no modelo.',
 'Sobressinal relativo ideal: M_p=e^[−πζ/√(1−ζ²)]≈e^(−1,3711)=0,2538, aproximadamente 25,4%.',
 'Tempo de pico: t_p=π/[ωn√(1−ζ²)]≈0,686 s.',
 'Tempo de acomodação pela aproximação de 2%: t_s≈4/(ζωn)=4/2=2 s.',
 'Ganho estático T(0)=25/25=1; a saída tende à referência unitária, mas não sem ultrapassagem transitória.'
 ],equations:['M_p=exp[−πζ/√(1−ζ²)]','t_p=π/(ωn√(1−ζ²))','t_s≈4/(ζωn) (aproximação de 2%)'],question:'Se a estabilidade foi confirmada, por que pode ocorrer sobressinal?',answer:'Estabilidade assintótica indica decaimento final dos modos; polos complexos conjugados ainda podem causar oscilação e ultrapassagem da referência.'},
{title:'3. Passos de projeto responsável',explanation:[
 'No projeto real, ajuste ganhos com critérios de margem de fase e ganho, banda passante e rejeição de perturbações. Aumentar banda pode amplificar ruído e exigir velocidade de atuação que o processo físico não alcança.',
 'Para controladores digitais, período de amostragem e atraso de processamento importam. Converter um modelo contínuo sem considerar zero-order hold, quantização e saturação pode invalidar o desempenho previsto.',
 'Comprove comportamento por simulação, teste controlado e identificação dos parâmetros. Uma curva experimental de resposta em degrau pode revelar polo dominante, oscilação persistente ou não linearidade não capturada no modelo.'
 ],question:'Quais seriam evidências de que uma fórmula de segunda ordem deixou de representar o processo?',answer:'Oscilações com múltiplas frequências, atraso relevante, saturação, assimetria ou tempo de acomodação medido incompatível com os polos previstos.'}
],['Polos determinam modos de resposta, não apenas ganho DC.','Sobressinal, tempo de pico e acomodação dependem do amortecimento.','Modelos precisam ser confrontados com limites e testes do processo.'],base),
C('nyquist',50,[
 'Separar amostragem, resolução espectral e quantização.',
 'Calcular frequências de aliasing e identificar artefatos.',
 'Selecionar aquisição adequada para análise de vibração.'
],[
{title:'1. Três problemas diferentes de uma medição digital',explanation:[
 'Amostragem discretiza o tempo; quantização discretiza a amplitude; duração da janela influencia resolução em frequência. Aumentar apenas o número de bits não remove aliasing, e aumentar apenas a taxa de amostragem não garante alta resolução espectral quando o registro é muito curto.',
 'Para uma banda analógica limitada, a condição teórica de Nyquist exige f_s>2f_max. Na prática, componentes acima de f_s/2 precisam ser atenuadas por filtragem anti-aliasing antes de amostrar.',
 'Transformada discreta de Fourier de N amostras possui espaçamento nominal Δf=f_s/N. Isso define a grade de frequências; resolução efetiva depende também de janela, vazamento e sinal-ruído.'
 ],equations:['f_N=f_s/2','Δt=1/f_s','Δf=f_s/N','T_registro=N/f_s'],question:'Um ADC de 24 bits a 1 kHz consegue medir sem aliasing uma senoide pura de 930 Hz?',answer:'Não. A resolução em amplitude não impede aliasing. O sinal de 930 Hz será indistinguível de uma componente de 70 Hz após amostragem a 1 kHz.'},
{title:'2. Caso aplicado a vibração',explanation:[
 'Uma aquisição utiliza f_s=1000 amostras/s e N=4096 amostras para avaliar uma máquina. A vibração inclui componentes de 70 Hz e 930 Hz, e não há filtro anti-aliasing.',
 'Essa configuração permite uma bela visualização do espectro, mas a interpretação pode estar completamente errada se componentes acima de Nyquist alcançarem a entrada.'
 ],steps:[
 'Frequência de Nyquist: f_N=1000/2=500 Hz.',
 'A componente de 930 Hz ultrapassa Nyquist. Sua componente aparente na banda base é |930−1000|=70 Hz.',
 'A componente real de 70 Hz e a falsa de 70 Hz ficam sobrepostas: o processamento digital não sabe separá-las.',
 'Espaçamento nominal de bins: Δf=1000/4096≈0,24414 Hz.',
 'Tempo total: T=4096/1000=4,096 s.',
 'Aumentar N mantendo f_s melhora o espaçamento entre bins, mas não resolve a componente de 930 Hz. Exige filtro analógico ou aumento coerente da taxa.'
 ],question:'Se o operador dobrar apenas N para 8192, o aliasing desaparece?',answer:'Não. Δf melhora, mas f_N permanece 500 Hz enquanto f_s=1000. O aliasing é determinado pela frequência de amostragem e pelo conteúdo acima da banda.'},
{title:'3. Diagnóstico e interpretação física',explanation:[
 'No monitoramento de mancais e rolamentos, picos de vibração podem refletir frequência de rotação, harmônicos, folgas, desbalanceamento, frequências características ou fenômenos elétricos. Um pico aparente não prova sozinho uma falha específica.',
 'Registre frequência de amostragem, janela, antialiasing, eixo, posição do sensor, velocidade da máquina, carga, unidades (mm/s RMS, aceleração etc.) e histórico. Medidas incomparáveis podem produzir tendência enganosa.',
 'O modo correto de estabelecer causa é confrontar o espectro com cinemática, outras medições, regime de operação e inspeção técnica. Não substitua julgamento físico por classificação automática baseada em um pico.'
 ],question:'Um pico de 70 Hz em um registro com f_s=1000 é necessariamente um fenômeno de 70 Hz?',answer:'Não; componentes de 930 Hz, 1070 Hz e outras frequências equivalentes por alias podem se apresentar em 70 Hz.'}
],['Nyquist controla dobramento de frequência, não resolução em amplitude.','Δf é diferente de f_s e requer interpretar N e duração.','Diagnóstico exige conhecer cadeia de medição e operação real.'],['https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/',...base]),
C('estatistica',55,[
 'Aplicar Bayes corretamente na interpretação de alarmes de falhas raras.',
 'Analisar redundância com hipóteses de independência.',
 'Evitar usar precisão aparente como certeza de diagnóstico.'
],[
{title:'1. O problema da taxa-base',explanation:[
 'Um sensor pode ter sensibilidade elevada e ainda produzir muitos alarmes falsos se a condição monitorada for rara. Sensibilidade é P(positivo | falha); a pergunta operacional costuma ser P(falha | positivo), que depende também da prevalência e da taxa de falsos positivos.',
 'Bayes atualiza uma probabilidade anterior (prior) com a evidência observada. O denominador soma caminhos alternativos capazes de produzir o mesmo resultado do teste. Ignorar esse denominador é confundir confiabilidade do alarme com confiabilidade do diagnóstico.',
 'Essa lógica vale para manutenção preditiva, sistemas de monitoramento, qualidade, alarmes de supervisão e ensaios com baixa prevalência de defeitos.'
 ],equations:['P(F|+) = P(+|F)P(F)/[P(+|F)P(F)+P(+|¬F)P(¬F)]'],question:'Um detector com 98% de sensibilidade significa que 98% dos alarmes representam defeito?',answer:'Não. Sensibilidade considera somente a população com defeito; a interpretação de um alarme positivo precisa considerar toda a população.'},
{title:'2. Exemplo: alarme de defeito em lote de máquinas',explanation:[
 'Apenas 0,5% das máquinas apresentam determinada falha no intervalo. Um teste tem 98% de sensibilidade e 2% de falso positivo entre máquinas sem falha. Qual a chance de uma máquina realmente estar defeituosa após alarme positivo?',
 'O denominador contém alarmes verdadeiros e falsos. Pense em 100 mil máquinas para conferir o resultado por contagem, independentemente da álgebra.'
 ],steps:[
 'Prior P(F)=0,005, P(¬F)=0,995. Sensibilidade P(+|F)=0,98 e falso positivo P(+|¬F)=0,02.',
 'Probabilidade conjunta de alarme verdadeiro: P(F∩+)=0,005·0,98=0,0049.',
 'Probabilidade conjunta de alarme falso: P(¬F∩+)=0,995·0,02=0,0199.',
 'Probabilidade total de alarme P(+)=0,0049+0,0199=0,0248.',
 'Posterior P(F|+)=0,0049/0,0248≈0,19758=19,76%.',
 'Conferência em 100 mil máquinas: 500 defeituosas produzem aproximadamente 490 positivos verdadeiros; 99.500 boas produzem 1.990 positivos falsos; 490/(490+1990)≈19,76%.'
 ],question:'Como uma política de inspeção prévia pode alterar a taxa de alarmes falsos relativos?',answer:'Ao selecionar um grupo com maior prevalência real de falhas, o valor preditivo positivo do teste pode aumentar, mantendo sensibilidade e especificidade iguais.'},
{title:'3. Redundância e limites de independência',explanation:[
 'Para três sensores idênticos e independentes com probabilidade de sucesso p=0,95, votação 2 de 3 atua se pelo menos dois funcionarem. A soma binomial dos eventos é 3p²(1−p)+p³=0,99275, ou 99,275%.',
 'O resultado não incorpora falha de causa comum, fonte de alimentação compartilhada, software idêntico defeituoso ou erro de projeto sistemático. Esses mecanismos podem derrubar canais simultaneamente e invalidar a multiplicação de probabilidades.',
 'Uma análise rigorosa separa confiabilidade, disponibilidade, segurança funcional e manutenção. Uma topologia 2oo3 também modifica risco de disparo espúrio e de não atuação, que devem ser avaliados com definições diferentes de sucesso.'
 ],equations:['P(2oo3)=3p²(1−p)+p³','P(ambas falham independentes)=p_f²'],question:'Se as falhas dos três sensores estiverem correlacionadas, a fórmula binomial pode ser usada sem ajustes?',answer:'Não. A distribuição binomial pressupõe independência e mesma probabilidade; falhas correlacionadas exigem modelagem adicional.'}
],['Probabilidade inversa exige Bayes, não troca direta de condicionais.','Baixa prevalência pode dominar o significado de um alarme positivo.','Redundância só melhora confiabilidade conforme hipóteses explícitas.'],['https://openstax.org/books/introductory-statistics-2e/pages/3-4-contingency-tables',...base]),
C('eletronica-potencia',50,[
 'Distinguir retificadores monofásicos e trifásicos.',
 'Aplicar a média ideal de um retificador trifásico de seis pulsos.',
 'Relacionar ripple, harmônicos e dimensionamento prático.'
],[
{title:'1. Topologia de seis pulsos',explanation:[
 'Uma ponte trifásica de seis diodos conecta, a cada instante, as fases de maior e menor potencial ao barramento CC, produzindo uma forma de onda com seis pulsos por ciclo da rede. Ela é diferente de uma ponte monofásica de quatro diodos.',
 'Para rede trifásica senoidal equilibrada e condução contínua ideal, sem sobreposição de comutação nem queda nos diodos, a tensão média pode ser aproximada por 1,35 vezes a tensão RMS entre linhas. A frequência característica da ondulação é 6f da rede.',
 'Uma carga resistiva isolada, corrente descontínua, capacitor de filtro ou impedância significativa de fonte pode mudar a forma de onda e a validade das expressões simplificadas.'
 ],equations:['V_DC,média≈1,35·V_LL,rms (6 pulsos, corrente contínua)','f_ondulação=6f_rede','P_DC≈V_DC·I_DC'],question:'Uma ponte monofásica de onda completa tem a mesma frequência principal de ondulação que uma ponte trifásica de seis pulsos?',answer:'Não. A monofásica apresenta 2f da rede; a trifásica ideal de seis pulsos apresenta 6f.'},
{title:'2. Caso aplicado: barramento CC',explanation:[
 'Uma rede de 400 V RMS entre linhas a 60 Hz alimenta ponte trifásica de seis diodos com reator suficiente para corrente CC contínua. Admita fonte equilibrada, diodos ideais e sem sobreposição de comutação. A corrente CC da carga é 20 A.',
 'A expressão ideal fornece apenas a média do barramento na topologia declarada, não especifica a corrente RMS nos diodos, o fator de potência real ou as perdas totais do conversor.'
 ],steps:[
 'Tensão CC média ideal: V_DC≈1,35·400=540 V.',
 'Frequência dominante de ondulação: 6·60=360 Hz.',
 'Potência média ideal na carga sob corrente de 20 A: P≈540·20=10.800 W=10,8 kW.',
 'Uma estimativa realista exigiria quedas dos semicondutores, reatâncias de rede e de comutação, regime de condução, controle e características do filtro.',
 'A rede CA fornece corrente não senoidal; fator de potência total e THD não se obtêm apenas de 540 V e 20 A.'
 ],question:'Uma leitura de 540 V garante que qualquer motor CC conectado receba a mesma potência?',answer:'Não. A potência depende da corrente, da dinâmica eletromecânica, da regulação, das perdas e do perfil de ondulação; 540 V é apenas uma aproximação de média ideal.'},
{title:'3. Harmônicos e interação com a rede',explanation:[
 'Em pontes de seis pulsos ideais, ordens características de corrente de linha são h=6k±1, como 5ª, 7ª, 11ª e 13ª, embora amplitudes dependam da topologia e impedâncias. Isso pode causar aquecimento, distorção de tensão e interação com compensação reativa.',
 'Inversores PWM controlam tensão/frequência de saída com chaveamento. Não confunda frequência fundamental da carga, frequência de chaveamento e frequência de ondulação do retificador.',
 'A análise completa de compatibilidade inclui proteção, filtros, potência de curto-circuito, modo de aterramento, segurança e normas aplicáveis.'
 ],equations:['h=6k±1 (ordens características do retificador ideal de seis pulsos)'],question:'A instalação de capacitores de fator de potência sempre reduz a distorção harmônica causada por um retificador?',answer:'Não. Pode ocorrer ressonância e amplificação em certas frequências. É preciso estudo harmônico e avaliação da impedância da rede.'}
],['1,35VLL requer hipótese explícita de ponte trifásica seis-pulsos ideal.','Ondulação 6f não equivale a frequência de chaveamento PWM.','Projeto real exige análise de harmônicos e comutação.'],base),
C('instrumentacao',55,[
 'Explicar resolução, erro e incerteza de forma distinta.',
 'Relacionar sensores de resistência com efeitos de cabeamento e autoaquecimento.',
 'Conferir coerência metrológica e rastreabilidade.'
],[
{title:'1. Medir é mais que ler um número',explanation:[
 'Resolução informa o menor incremento discernível, não a incerteza total. Erro é diferença entre indicação e valor de referência em condições especificadas; incerteza quantifica dispersão associada ao resultado e depende das contribuições do processo de medição.',
 'Uma calibração compara indicação a padrões apropriados, com rastreabilidade e declaração das condições. Não se deve transformar uma calibração em ajuste automático: primeiro se mede a relação, depois se decide corrigir ou não.',
 'A medição em campo envolve influência de temperatura, aterramento, ruído, posição de sensor, cabeamento e quantização. Analisar só o número de bits de um ADC não é suficiente.'
 ],equations:['Erro=indicação−referência','Correção aproximada=−erro (na condição calibrada)','LSB ideal≈faixa/(2^n)'],question:'Um instrumento com ADC de 16 bits é necessariamente mais exato que outro com 12 bits?',answer:'Não. Exatidão envolve referência, sensores, erros sistemáticos, ruído, temperatura e calibração; bits descrevem apenas níveis de discretização ideal.'},
{title:'2. Exemplo com sensor Pt100',explanation:[
 'Um Pt100 idealizado apresenta R_0=100 Ω a 0 °C. Em faixa limitada próxima do ambiente, uma aproximação linear é R(T)≈100(1+0,00385T) Ω, em que T é expresso em °C relativos à referência. Para uma modelagem precisa em faixa extensa, deve-se usar a curva padrão apropriada.',
 'Em uma leitura de dois fios, a resistência dos cabos soma-se à do sensor. Em três ou quatro fios, técnicas adequadas podem compensar os efeitos de ligação, dentro de suas hipóteses.'
 ],steps:[
 'Com T=80 °C, R_Pt100≈100(1+0,00385·80)=130,8 Ω.',
 'Uma fonte de excitação de 1 mA produz V≈0,001·130,8=0,1308 V, isto é 130,8 mV.',
 'O autoaquecimento elétrico do elemento é P=I²R=(0,001)²·130,8=0,0001308 W=0,1308 mW.',
 'Se os dois cabos somam 1 Ω e o circuito trata a resistência total como sensor, a leitura aparente sobe para 131,8 Ω.',
 'A diferença aparente de temperatura, no modelo linear, é ΔT≈1/(100·0,00385)≈2,60 °C.',
 'Para avaliação metrológica, inclua incerteza da referência, excitação, eletrônica, interferência e condições de aplicação.'
 ],question:'Como reduzir erro de cabo sem simplesmente calibrar a leitura em um único ponto?',answer:'Utilizar configuração apropriada de três ou quatro fios, verificar conexões e rastreabilidade; compensações específicas exigem hipóteses documentadas.'},
{title:'3. Incerteza combinada e decisão',explanation:[
 'Se duas contribuições independentes já estão expressas como incertezas padrão u_1=0,20 °C e u_2=0,30 °C, pode-se estimar u_c=√(u_1²+u_2²)=√0,13≈0,361 °C. Com fator de abrangência k≈2, U≈0,72 °C.',
 'O fator k=2 não é garantia universal de 95% sem condições estatísticas adequadas. Correlação entre fontes, distribuição e graus de liberdade podem modificar o resultado.',
 'A decisão de aceitação ou rejeição técnica deve usar tolerâncias do processo e regra de decisão explicitada, e não interpretar apenas o valor central da leitura.'
 ],equations:['u_c=√(u_1²+u_2²) (independentes, padrão)','U=k·u_c'],question:'Uma indicação de 80,0 °C com incerteza expandida de 0,7 °C confirma temperatura exatamente igual a 80,0 °C?',answer:'Não. O resultado representa uma estimativa e um intervalo de cobertura conforme as condições metrológicas, não um valor exato.'}
],['Não confunda precisão de leitura, exatidão e incerteza.','Sensor e cabeamento integram o sistema de medição.','Decisões exigem tolerância, incerteza e contexto da aplicação.'],['https://www.bipm.org/en/publications/guides/gum.html',...base])
];
MASTERCLASSES.push(...ADDITIONAL_MASTERCLASSES);
export const MASTER_BY_LESSON = new Map(MASTERCLASSES.map(c=>[c.lessonId,c]));
