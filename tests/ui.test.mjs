import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {webcrypto} from 'node:crypto';
function app(sharedStorage=new Map()){
 const content=fs.readFileSync('ENADE_Eletrica_2026_Teste_Offline.html','utf8');const script=content.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(script&&script.length>60000);
 const local=sharedStorage;const root={innerHTML:'',events:{},addEventListener(name,fn){this.events[name]=fn}};
 const document={querySelector:()=>root,querySelectorAll:()=>[],getElementById:()=>null,documentElement:{classList:{toggle(){}}},createElement:()=>({style:{},click(){},remove(){}}),body:{append(){}},addEventListener(){}};
 const context=vm.createContext({document,window:{scrollTo(){},confirm:()=>true,addEventListener(){}},navigator:{},location:{protocol:'file:'},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v)},console,setTimeout:()=>{},setInterval:()=>{},Date,Math,Map,Set,JSON,Array,String,Number,Boolean,Promise,structuredClone,crypto:webcrypto,Blob,URL});
 vm.runInContext(script,context,{filename:'enade-inline.js'});
 const click=(data)=>root.events.click({target:{closest(){return{dataset:data}}}});
 return {root,context,click,local};
}
const microtasks=()=>new Promise(r=>setImmediate(r));
test('HTML offline é autossuficiente e os onze menus renderizam',async()=>{
 const a=app();await microtasks();assert.match(a.root.innerHTML,/Começar estudo de hoje/);
 for(const nav of ['plan','library','bank','formulas','sim','discursive','tutor','stats','errors','settings','home']){a.click({nav});assert.match(a.root.innerHTML,/layout/);assert.ok(a.root.innerHTML.length>400)}
});
test('troca de aula, conclusão e resolução com histórico local',async()=>{
 const a=app();await microtasks();a.click({lesson:'circuito-ohm'});assert.match(a.root.innerHTML,/Exemplo resolvido/);
 a.click({complete:'circuito-ohm'});assert.match(a.root.innerHTML,/1\/21/);assert.match(a.root.innerHTML,/Potência ativa, reativa e aparente/);
 a.click({single:'AUT-001'});assert.match(a.root.innerHTML,/50 V/);
 a.root.events.change({target:{name:'learn-choice',value:'1'}});
 a.click({action:'submit-learning'});assert.match(a.root.innerHTML,/Resposta correta!/);
 a.click({nav:'stats'});assert.match(a.root.innerHTML,/Respostas/);
});
test('simulado é criado, respondido e finalizado com resultados e histórico',async()=>{
 const a=app();await microtasks();a.click({nav:'sim'});a.click({simquick:'5'});
 assert.match(a.root.innerHTML,/Finalizar simulado/);
 a.root.events.change({target:{name:'attempt-choice',value:'0'}});
 a.click({action:'finish-attempt'});assert.match(a.root.innerHTML,/Resultado do simulado/);
 a.click({nav:'sim'});assert.match(a.root.innerHTML,/Histórico de simulados/);
});
test('PWA declara arquivos armazenáveis, sem dependências externas em tempo de execução',()=>{
 const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest'));assert.equal(manifest.display,'standalone');
 const sw=fs.readFileSync('dist/sw.js','utf8');const core=sw.match(/const CORE=\[([^\]]+)\]/)?.[1];assert.ok(core&&core.includes('content.js')&&core.includes('official.js'));
 for(const asset of ['dist/index.html','dist/assets/main.js','dist/assets/content.js','dist/assets/official.js','dist/assets/styles.css','dist/sw.js','dist/icon.svg'])assert.ok(fs.existsSync(asset));
});

test('banco distingue catálogo oficial de questões respondíveis e bloqueia simulados sem enunciados',async()=>{
 const a=app();await microtasks();a.click({nav:'bank'});
 assert.match(a.root.innerHTML,/0 questões oficiais completas e respondíveis/);
 assert.match(a.root.innerHTML,/101 itens oficiais com gabarito catalogado/);
 assert.match(a.root.innerHTML,/7 anuladas/);
 assert.doesNotMatch(a.root.innerHTML,/data-single="INEP-/);
 assert.match(a.root.innerHTML,/Índice oficial — aguarda enunciados completos/);
 a.click({single:'INEP-2017-EE-Q03'});
 assert.doesNotMatch(a.root.innerHTML,/name="learn-choice"/);
 a.click({nav:'sim'});
 assert.match(a.root.innerHTML,/ENADE 2019 · 0 prontas/);
 a.click({simofficial:'2019'});
 assert.doesNotMatch(a.root.innerHTML,/Finalizar simulado/);
});
test('tentativa antiga permanece registrada, mas não é tratada como avaliação válida',async()=>{
 const storage=new Map();
 const previous={schema:1,responses:[{id:'legacy-1',questionId:'INEP-2017-EE-Q03',choice:1,correct:true,at:new Date().toISOString(),seconds:12,attemptId:'legacy-attempt'}],attempts:[{id:'legacy-attempt',kind:'ENADE 2017 antigo',questionIds:['INEP-2017-EE-Q03'],choices:{'INEP-2017-EE-Q03':1},flagged:[],startedAt:Date.now()-10000,endsAt:Date.now()+10000,pausedSeconds:0,pauseSince:null,duration:600,index:0,mode:'practice',finishedAt:Date.now()}],completedLessons:[],bookmarks:[],discursive:{},minutes:10,settings:{theme:'light',session:45},revisionDates:{},studySessions:[]};
 storage.set('enade-progress-v1',JSON.stringify(previous));const a=app(storage);await microtasks();
 a.click({nav:'stats'});assert.match(a.root.innerHTML,/preservadas para backup/);assert.match(a.root.innerHTML,/0%/);
 a.click({nav:'sim'});a.click({attempt:'legacy-attempt'});
 assert.match(a.root.innerHTML,/Registro histórico preservado/);assert.match(a.root.innerHTML,/resposta salva: B/);
 assert.deepEqual(JSON.parse(storage.get('enade-progress-v1')).responses,previous.responses);
});
test('estudo diário avança sequencialmente e sobrevive a recarregamento sem reabrir aula anterior',async()=>{
 const storage=new Map();const a=app(storage);await microtasks();
 a.click({action:'today'});assert.match(a.root.innerHTML,/Lei de Ohm, potência e circuitos resistivos/);
 a.click({complete:'circuito-ohm'});assert.match(a.root.innerHTML,/1\/21/);assert.match(a.root.innerHTML,/Continuar para próxima aula/);
 a.click({action:'today'});assert.match(a.root.innerHTML,/Potência ativa, reativa e aparente/);
 a.click({complete:'potencia-trifasica'});assert.match(a.root.innerHTML,/2\/21/);
 await microtasks();const b=app(storage);await microtasks();
 assert.match(b.root.innerHTML,/2\/21/);b.click({action:'today'});assert.match(b.root.innerHTML,/Transformadores e relação de transformação/);
});
test('questões já respondidas permitem concluir e avançar sem perder histórico',async()=>{
 const a=app();await microtasks();a.click({single:'AUT-001'});
 a.root.events.change({target:{name:'learn-choice',value:'1'}});a.click({action:'submit-learning'});
 a.click({nav:'home'});assert.match(a.root.innerHTML,/Já terminei: concluir e avançar/);
 a.click({complete:'circuito-ohm'});assert.match(a.root.innerHTML,/1\/21/);
 assert.match(a.root.innerHTML,/Questões respondidas<\/small><strong>1<\/strong>/);
});
test('prática vinculada oferece encerramento da sessão e passagem de conteúdo',async()=>{
 const a=app();await microtasks();a.click({lesson:'circuito-ohm'});a.click({practice:'circuito-ohm'});
 for(let n=0;n<4;n++){
   a.root.events.change({target:{name:'learn-choice',value:'1'}});a.click({action:'submit-learning'});
   if(n<3) a.click({action:'next-learning'});
 }
 assert.match(a.root.innerHTML,/Concluir estudo e avançar/);
 a.click({action:'finish-study'});assert.match(a.root.innerHTML,/1\/21/);
 a.click({action:'today'});assert.match(a.root.innerHTML,/Potência ativa, reativa e aparente/);
});
test('ao concluir todas as aulas, recomenda revisão sem regressar silenciosamente à primeira',async()=>{
 const a=app();await microtasks();
 const {LESSONS}=await import('../dist/assets/content.js');
 for(const l of LESSONS) a.click({complete:l.id});
 assert.match(a.root.innerHTML,/21\/21/);assert.match(a.root.innerHTML,/Aulas disponíveis concluídas/);
 a.click({action:'today'});assert.match(a.root.innerHTML,/Aulas disponíveis concluídas/);
});
test('fórmulas podem ser consultadas e favorited, e questão avançada abre sem PDF',async()=>{
 const a=app();await microtasks();a.click({nav:'formulas'});
 assert.match(a.root.innerHTML,/Fórmulas Essenciais/);assert.match(a.root.innerHTML,/Teorema|Lei de Ohm/);
 a.click({formulaView:'f-qc'});assert.match(a.root.innerHTML,/correção do fator de potência/i);
 a.click({formulaFav:'f-qc'});assert.match(a.root.innerHTML,/Remover dos favoritos/);
 a.click({single:'ADV-001'});assert.match(a.root.innerHTML,/Uma indústria demanda 200 kW/);
 assert.doesNotMatch(a.root.innerHTML,/Alternativa A \(consulte o PDF\)/);
 a.root.events.change({target:{name:'learn-choice',value:'2'}});
 a.click({action:'submit-learning'});assert.match(a.root.innerHTML,/127,0 kvar/);
});
test('simulado avançado usa apenas questões autorais completas de nível elevado',async()=>{
 const a=app();await microtasks();a.click({nav:'sim'});a.click({action:'sim-advanced'});
 assert.match(a.root.innerHTML,/Treino autoral avançado/);assert.match(a.root.innerHTML,/Questão 1 de 10/);
 assert.doesNotMatch(a.root.innerHTML,/consulte o PDF/i);
});
