// Run with Node 20+: node --test tests/quality-gates.mjs
// Standalone regression checks for app.html; no external dependencies.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
const html=fs.readFileSync(new URL('../app.html',import.meta.url),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script?.length>50000,'Expected a complete offline HTML application');
const nextTurn=()=>new Promise(resolve=>setImmediate(resolve));
function app(stored=new Map()){
 const root={innerHTML:'',events:{},addEventListener(name,fn){this.events[name]=fn}};
 const document={querySelector:()=>root,querySelectorAll:()=>[],getElementById:()=>null,documentElement:{classList:{toggle(){}}},createElement:()=>({style:{},click(){},remove(){}}),body:{append(){}},addEventListener(){}};
 const context=vm.createContext({document,window:{scrollTo(){},confirm:()=>true,addEventListener(){}},navigator:{},location:{protocol:'file:'},localStorage:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)},console,setTimeout:()=>{},setInterval:()=>{},Date,Math,Map,Set,JSON,Array,String,Number,Boolean,Promise,structuredClone,crypto:webcrypto,Blob,URL});
 vm.runInContext(script,context,{filename:'app.html'});
 return {root,stored,click:data=>root.events.click({target:{closest(){return{dataset:data}}}})};
}
test('catalogued ENADE official answers are not offered as complete questions',async()=>{
 const a=app();await nextTurn();a.click({nav:'bank'});
 assert.match(a.root.innerHTML,/0 questões oficiais completas e respondíveis/);
 assert.match(a.root.innerHTML,/101 itens oficiais com gabarito catalogado/);
 assert.match(a.root.innerHTML,/7 anuladas/);
 assert.doesNotMatch(a.root.innerHTML,/data-single="INEP-/);
 a.click({single:'INEP-2023-EE-Q10'});
 assert.doesNotMatch(a.root.innerHTML,/name="learn-choice"/);
 a.click({nav:'sim'});
 assert.match(a.root.innerHTML,/ENADE 2023 · 0 prontas/);
 a.click({simofficial:'2019'});
 assert.doesNotMatch(a.root.innerHTML,/Finalizar simulado/);
});
test('archived official attempts keep original selections but do not count as valid progress',async()=>{
 const stored=new Map();
 const old={schema:1,responses:[{id:'r1',questionId:'INEP-2023-EE-Q10',choice:0,correct:true,at:new Date().toISOString(),seconds:60,attemptId:'a1'}],attempts:[{id:'a1',kind:'ENADE legado',questionIds:['INEP-2023-EE-Q10'],choices:{'INEP-2023-EE-Q10':0},flagged:[],startedAt:Date.now()-3000,endsAt:Date.now()+100000,pausedSeconds:0,pauseSince:null,duration:600,index:0,mode:'practice'}],completedLessons:[],bookmarks:[],discursive:{},minutes:0,settings:{theme:'light',session:45},revisionDates:{},studySessions:[]};
 stored.set('enade-progress-v1',JSON.stringify(old));const a=app(stored);await nextTurn();
 a.click({nav:'stats'});assert.match(a.root.innerHTML,/Registros antigos arquivados/);
 a.click({nav:'sim'});assert.match(a.root.innerHTML,/Tentativa legada, não retomável/);
 a.click({resume:'a1'});assert.doesNotMatch(a.root.innerHTML,/Finalizar simulado/);
 assert.equal(JSON.parse(stored.get('enade-progress-v1')).responses.length,1);
});
test('available authorial training still records answers',async()=>{
 const a=app();await nextTurn();a.click({nav:'bank'});
 a.root.events.change({target:{id:'bankOrigin',value:'autoral'}});
 assert.match(a.root.innerHTML,/22 questões completas e respondíveis/);
 a.click({single:'AUT-001'});assert.match(a.root.innerHTML,/50 V/);
 a.root.events.change({target:{name:'learn-choice',value:'1'}});
 a.click({action:'submit-learning'});
 assert.match(a.root.innerHTML,/Resposta correta/);
});