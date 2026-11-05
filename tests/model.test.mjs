import test from 'node:test';import assert from 'node:assert/strict';
import {score,pickAdaptive,daysUntil,eligible,initialProgress} from '../dist/assets/model.js';
import {AREAS,LESSONS,QUESTIONS} from '../dist/assets/content.js';
test('matriz oficial contém 19 áreas específicas e 12 gerais',()=>{assert.equal(AREAS.filter(a=>a.group==='especifico').length,19);assert.equal(AREAS.filter(a=>a.group==='geral').length,12)});
test('itens individuais têm gabaritos inteiros e estão classificados',()=>{for(const q of QUESTIONS){assert.equal(q.choices.length,5);assert.ok(q.answer>=0&&q.answer<=4);assert.equal(eligible(q),q.origin==='autoral');assert.ok(q.source);assert.ok(q.why)}});
test('índice oficial não é conteúdo resolvível e não se confunde com a prova 2026',()=>{assert.equal(QUESTIONS.filter(x=>x.origin==='oficial-referenciada').length,101);assert.equal(QUESTIONS.find(q=>q.id==='INEP-2023-EE-Q10').answer,0);assert.equal(QUESTIONS.filter(x=>x.origin==='oficial-referenciada'&&eligible(x)).length,0);assert.equal(QUESTIONS.filter(x=>x.origin==='autoral'&&eligible(x)).length,62)});
test('score contabiliza corretas e não respondidas sem duplicar',()=>{const qs=QUESTIONS.slice(0,3);const choices={[qs[0].id]:qs[0].answer,[qs[1].id]:(qs[1].answer+1)%5};assert.deepEqual(score(choices,qs),{total:3,answered:2,correct:1})});
test('seleção adaptativa é determinística sem repetir questões',()=>{const qs=QUESTIONS.filter(q=>!q.needsSource);const a=pickAdaptive(qs,[],10).map(q=>q.id);const b=pickAdaptive(qs,[],10).map(q=>q.id);assert.deepEqual(a,b);assert.equal(new Set(a).size,10)});
test('marco de prova e estado inicial têm formato previsível',()=>{assert.equal(daysUntil('2026-11-29',new Date('2026-11-28T15:00:00-03:00')),1);assert.equal(initialProgress().responses.length,0)});
test('aulas possuem exemplos e fontes',()=>{for(const l of LESSONS){assert.ok(l.steps.length>=3);assert.ok(l.sources.length);assert.ok(l.formula.length)} });

test('cada aula possui referências técnicas e normativas identificadas',()=>{for(const l of LESSONS){assert.match(l.sources[0],/portaria|crub/);for(const s of l.sources)assert.match(s,/^https:\/\//)}});
