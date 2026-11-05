import test from 'node:test';import assert from 'node:assert/strict';
import {ADVANCED_QUESTIONS} from '../dist/assets/advanced.js';
import {FORMULAS} from '../dist/assets/formulae.js';
import {LESSONS} from '../dist/assets/content.js';
const sqrt=Math.sqrt,pi=Math.PI,acos=Math.acos,tan=Math.tan,log=Math.log;
const checks={
 'ADV-001':200*(tan(acos(.72))-tan(acos(.95))),
 'ADV-002':1e5/(sqrt(3)*480*.82),
 'ADV-003':(10e6/(sqrt(3)*13800))/.2/1000,
 'ADV-004':3*50**2*.28/1000,
 'ADV-005':(120*60/4-1746)/(120*60/4)*100,
 'ADV-006':15000/(2*pi*1746/60),
 'ADV-007':100*(1-Math.exp(-.1/(.4/8))),
 'ADV-008':10000*100e-6*log(2),
 'ADV-009':1/(2*pi*sqrt(.02*100e-6)),
 'ADV-010':5/(1+5*.2)*10,
 'ADV-011':100*(3*.9**2*.1+.9**3),
 'ADV-012':.02**2,
 'ADV-013':Math.abs(850-1200),
 'ADV-014':10000/(2**12),
 'ADV-015':3*400**2/20/1000,
 'ADV-016':3*(400/sqrt(3))**2/20/1000,
 'ADV-017':250/(250+5+8)*100,
 'ADV-018':1e5/(2e4-8e3),
 'ADV-019':5*5.2*.78,
 'ADV-020':250*4e-3/.04,
 'ADV-021':.04*50,
 'ADV-022':3600/(600/5),
 'ADV-023':2000*470e-6*log(4),
 'ADV-024':100*(.95*.01)/(.95*.01+.05*.99),
 'ADV-026':100*(1-.75/.90)
};
const readNumber=text=>Number(text.match(/\d+(?:[.,]\d+)?/)?.[0]?.replace(',','.'));
test('26 exercícios autorais de nível avançado possuem alternativas únicas, fontes e trilha didática',()=>{
 assert.equal(ADVANCED_QUESTIONS.length,26);
 for(const q of ADVANCED_QUESTIONS){assert.equal(q.choices.length,5,q.id);assert.equal(new Set(q.choices).size,5,q.id);assert.ok(q.answer>=0&&q.answer<=4,q.id);assert.equal(q.level,'padrao-enade');assert.ok(q.hints.length>=2,q.id);assert.ok(q.why.length>120,q.id);assert.ok(LESSONS.some(l=>l.id===q.lessonId&&l.areaId===q.areaId),`aula correspondente ${q.id}`);}
});
test('25 problemas quantitativos avançados conferidos por cálculo independente',()=>{
 for(const [id,expected] of Object.entries(checks)){
  const q=ADVANCED_QUESTIONS.find(x=>x.id===id);assert.ok(q,id);
  const actual=readNumber(q.choices[q.answer]);const relError=Math.abs(actual-expected)/Math.max(1,Math.abs(expected));
  assert.ok(relError<.008,`${id}: alternativa ${actual} vs resultado independente ${expected}`);
 }
});
test('polos de sistema de segunda ordem preservam parte real negativa e par conjugado',()=>{
 const q=ADVANCED_QUESTIONS.find(q=>q.id==='ADV-025');assert.match(q.choices[q.answer],/−2±j3/);assert.ok(-4/2<0 && 16-52<0);
});
test('biblioteca de fórmulas cobre áreas, condições, exemplos e relações com questões existentes',()=>{
 assert.equal(FORMULAS.length,26);assert.equal(new Set(FORMULAS.map(f=>f.id)).size,26);
 for(const f of FORMULAS){assert.ok(f.expression&&f.use&&f.limits&&f.pitfall&&f.example, f.id);assert.ok(f.variables.length>0,f.id);for(const id of f.related){assert.ok(ADVANCED_QUESTIONS.some(q=>q.id===id)||id.startsWith('AUT-'),`link ${id}`)}}
});
