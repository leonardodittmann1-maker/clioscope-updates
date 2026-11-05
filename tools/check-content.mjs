import {AREAS,LESSONS,QUESTIONS,DISCURSIVES} from '../dist/assets/content.js';
import {eligible} from '../dist/assets/model.js';
import {OFFICIAL_ITEMS,OFFICIAL_QUESTIONS,OFFICIAL_ANNULLED,OFFICIAL_DISCURSIVES} from '../dist/assets/official.js';
const fail=x=>{throw new Error(x)};
const ids=a=>a.map(x=>x.id);
const checkUnique=(items,name)=>{if(new Set(ids(items)).size!==items.length)fail(`IDs repetidos em ${name}`)};
[ [AREAS,'áreas'],[LESSONS,'aulas'],[QUESTIONS,'questões'],[DISCURSIVES,'discursivas'] ].forEach(([x,n])=>checkUnique(x,n));
if(AREAS.filter(a=>a.group==='especifico').length!==19)fail('Faltam áreas específicas');
if(AREAS.filter(a=>a.group==='geral').length!==12)fail('Faltam áreas de formação geral');
for(const l of LESSONS){if(!AREAS.some(a=>a.id===l.areaId))fail(`Área inválida ${l.id}`);if(l.concept.length<3||l.steps.length<3||!l.summary||!l.revision||!l.sources.length)fail(`Aula incompleta ${l.id}`)}
for(const q of QUESTIONS){
 if(!AREAS.some(a=>a.id===q.areaId)&&!(q.origin==='oficial-referenciada'&&['FG00','EE00'].includes(q.areaId)))fail(`Área inválida em ${q.id}`);
 if(q.lessonId&&!LESSONS.some(l=>l.id===q.lessonId))fail(`Aula inválida em ${q.id}`);
 if(q.choices.length!==5||q.choices.some(s=>!s))fail(`Alternativas incompletas: ${q.id}`);
 if(!Number.isInteger(q.answer)||q.answer<0||q.answer>4)fail(`Gabarito inválido: ${q.id}`);
 if(!q.why||q.why.length<20||!q.source||!q.revisionDate)fail(`Metadados incompletos: ${q.id}`);
 if(q.origin==='autoral'&&!eligible(q))fail(`Questão autoral não pronta: ${q.id}`);
 if(q.origin==='oficial-referenciada'&&(!q.needsSource||eligible(q)||!q.source.includes('inep.gov.br')||![2017,2019,2023].includes(q.year)))fail(`Questão oficial referenciada indevidamente liberada para resposta: ${q.id}`);
 if(q.origin==='autoral'&&q.needsSource)fail(`Questão autoral incompleta: ${q.id}`);
}
if(OFFICIAL_ITEMS.length!==108||OFFICIAL_QUESTIONS.length!==100||OFFICIAL_ANNULLED.length!==7||OFFICIAL_DISCURSIVES.length!==12)fail('Índice oficial incompleto');
for(const y of [2023,2019,2017]){const items=OFFICIAL_ITEMS.filter(x=>x.year===y);if(items.length!==(y===2023?38:35))fail(`Quantidade de questões ${y} inválida`)}
const counts={areas:AREAS.length,lessonReady:LESSONS.length,questionAuthoredReady:QUESTIONS.filter(q=>q.origin==='autoral'&&eligible(q)).length,questionOfficialComplete:QUESTIONS.filter(q=>q.origin==='oficial-referenciada'&&eligible(q)).length,questionOfficialCatalogued:OFFICIAL_ITEMS.length,discursive:DISCURSIVES.length};
console.log('CONTEÚDO VALIDADO',JSON.stringify(counts));
