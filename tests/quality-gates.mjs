// Execute from repository root: node --test tests/quality-gates.mjs
// No dependencies or network needed. Validates the self-contained app.html.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';

const html=fs.readFileSync(new URL('../app.html',import.meta.url),'utf8');
const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(code?.length>50000,'app.html must include the app logic');
const tick=()=>new Promise(r=>setImmediate(r));

function boot(local=new Map()){
 const root={innerHTML:'',events:{},addEventListener(n,fn){this.events[n]=fn}};
 const document={querySelector:()=>root,querySelectorAll:()=>[],getElementById:()=>null,documentElement:{classList:{toggle(){}}},createElement:()=>({style:{},click(){},remove(){}}),body:{append(){}},addEventListener(){}};
 const context=vm.createContext({document,window:{scrollTo(){},confirm:()=>true,addEventListener(){}},navigator:{},location:{protocol:'file:'},localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v)},console,setTimeout:()=>{},setInterval:()=>{},Date,Math,Map,Set,JSON,Array,String,Number,Boolean,Promise,structuredClone,crypto:webcrypto,Blob,URL});
 vm.runInContext(code,context,{filename:'enade-app.html'});
 const click=data=>root.events.click({target:{closest(){return{dataset:data}}}});
 return {root,click,local};
}

test('official answer keys stay catalogued, not offered as incomplete answerable questions',async()=>{
 const app=boot();await tick();app.click({nav:'bank'});
 assert.match(app.root.innerHTML,/0 questões oficiais completas e respondíveis/);
 assert.match(app.root.innerHTML,/101 itens oficiais com gabarito catalogado/);
 assert.match(app.root.innerHTML,/7 anuladas/);
 assert.match(app.root.innerHTML,/Índice oficial — aguarda enunciados completos/);
 assert.doesNotMatch(app.root.innerHTML,/data-single="INEP-/);
 app.click({single:'INEP-2023-EE-Q10'});
 assert.doesNotMatch(app.root.innerHTML,/name="learn-choice"/);
});

test('old incomplete official attempts remain visible but cannot be resumed or counted as valid score',async()=>{
 const storage=new Map();
 const previous={schema:1,responses:[{id:'legacy-response',questionId:'INEP-2023-EE-Q10',choice:0,correct:true,at:new Date().toISOString(),seconds:40,attemptId:'legacy'}],attempts:[{id:'legacy',kind:'ENADE antigo',questionIds:['INEP-2023-EE-Q10'],choices:{'INEP-2023-EE-Q10':0},flagged:[],startedAt:Date.now()-1000,endsAt:Date.now()+500000,pausedSeconds:0,pauseSince:null,duration:600,index:0,mode:'practice'}],completedLessons:[],bookmarks:[],discursive:{},minutes:0,settings:{theme:'light',session:45},revisionDates:{},studySessions:[]};
 storage.set('enade-progress-v1',JSON.stringify(previous));const app=boot(storage);await tick();
 app.click({nav:'stats'});assert.match(app.root.innerHTML,/Registros antigos arquivados/);assert.match(app.root.innerHTML,/Taxa de acerto/);
 app.click({nav:'sim'});assert.match(app.root.innerHTML,/Tentativa legada, não retomável/);
 app.click({resume:'legacy'});assert.doesNotMatch(app.root.innerHTML,/Finalizar simulado/);
 assert.equal(JSON.parse(storage.get('enade-progress-v1')).responses.length,1);
});

test('independent verified practice still works',async()=>{
 const app=boot();await tick();app.click({nav:'bank'});app.root.events.change({target:{id:'bankOrigin',value:'autoral'}});
 assert.match(app.root.innerHTML,/48 questões completas e respondíveis/);
 app.click({single:'AUT-001'});assert.match(app.root.innerHTML,/50 V/);
 app.root.events.change({target:{name:'learn-choice',value:'1'}});app.click({action:'submit-learning'});
 assert.match(app.root.innerHTML,/Resposta correta/);
});
