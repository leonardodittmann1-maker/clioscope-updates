import test from 'node:test';import assert from 'node:assert/strict';
import {initialProgress} from '../dist/assets/model.js';
import {mergeProgress,validateFirebaseConfig} from '../dist/assets/sync.js';
const response=(id,choice)=>({id,questionId:'ADV-001',choice,correct:choice===2,at:`2026-11-05T12:00:0${choice}Z`,seconds:30,attemptId:'x'});
const attempt=choices=>({id:'same-attempt',kind:'Treino',questionIds:['ADV-001'],choices,flagged:[],startedAt:100,endsAt:10000,pausedSeconds:0,pauseSince:null,duration:600,index:0,mode:'practice'});
test('merge de progresso mantém respostas de dois aparelhos sem duplicar eventos',()=>{
 const a=initialProgress(),b=initialProgress();a.responses=[response('a',1)];b.responses=[response('b',2)];a.completedLessons=['circuito-ohm'];b.completedLessons=['trafo-ideal'];a.bookmarks=['ADV-001'];b.formulaBookmarks=['f-ohm'];
 const m=mergeProgress(a,b);assert.deepEqual(m.responses.map(x=>x.id),['a','b']);assert.equal(m.completedLessons.length,2);assert.deepEqual(m.bookmarks,['ADV-001']);assert.deepEqual(m.formulaBookmarks,['f-ohm']);
 assert.equal(mergeProgress(m,b).responses.length,2,'re-sync is idempotent');
});
test('conflitos de respostas na mesma tentativa mantêm versão original',()=>{
 const a=initialProgress(),b=initialProgress();a.attempts=[attempt({'ADV-001':1})];b.attempts=[attempt({'ADV-001':2})];
 const merged=mergeProgress(a,b);assert.equal(merged.attempts.length,2);assert.ok(merged.attempts.some(x=>x.choices['ADV-001']===1));assert.ok(merged.attempts.some(x=>x.choices['ADV-001']===2));
});
test('rascunhos divergentes não se perdem',()=>{
 const a=initialProgress(),b=initialProgress();a.discursive={'DISC-A01':'Minha análise inicial'};b.discursive={'DISC-A01':'Outra abordagem técnica'};
 const m=mergeProgress(a,b);assert.equal(m.draftConflicts['DISC-A01'].length,2);assert.ok(m.discursive['DISC-A01']);
});
test('configuração web pública exige chaves completas, sem exigir segredo',()=>{
 assert.throws(()=>validateFirebaseConfig({apiKey:'x'}),/authDomain/);
 assert.deepEqual(validateFirebaseConfig({apiKey:'a',authDomain:'demo.firebaseapp.com',projectId:'demo',appId:'1:demo:web:abc'}),{apiKey:'a',authDomain:'demo.firebaseapp.com',projectId:'demo',appId:'1:demo:web:abc'});
});
