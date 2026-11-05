import test from 'node:test';
import assert from 'node:assert/strict';
import {OFFICIAL_ITEMS,OFFICIAL_ANNULLED,OFFICIAL_DISCURSIVES,OFFICIAL_QUESTIONS} from '../dist/assets/official.js';
const key=(year,n)=>OFFICIAL_ITEMS.find(q=>q.year===year&&q.number===n)?.answer;
test('três cadernos oficiais cadastrados com números e respostas únicas',()=>{
 assert.equal(OFFICIAL_ITEMS.length,108);assert.equal(new Set(OFFICIAL_ITEMS.map(x=>x.id)).size,108);
 for(const [y,n] of [[2023,38],[2019,35],[2017,35]]){
  assert.equal(OFFICIAL_ITEMS.filter(q=>q.year===y).length,n);
  assert.equal(OFFICIAL_ITEMS.filter(q=>q.year===y&&q.section==='geral').length,y===2023?9:8);
  for(const q of OFFICIAL_ITEMS.filter(q=>q.year===y))assert.match(q.keyUrl,/inep\.gov\.br/);
 }
});
test('gabaritos definitivos: extremos e itens que diferem por área',()=>{
 assert.equal(key(2023,1),'D');assert.equal(key(2023,10),'A');assert.equal(key(2023,30),'ANULADA');assert.equal(key(2023,38),'B');
 assert.equal(key(2019,1),'ANULADA');assert.equal(key(2019,10),'A');assert.equal(key(2019,22),'ANULADA');assert.equal(key(2019,35),'C');
 assert.equal(key(2017,1),'C');assert.equal(key(2017,3),'B');assert.equal(key(2017,19),'C');assert.equal(key(2017,35),'C');
});
test('anuladas sem resposta presumida não entram na prática',()=>{
 assert.equal(OFFICIAL_ANNULLED.length,7);
 assert.deepEqual(OFFICIAL_ANNULLED.filter(x=>x.year===2019).map(x=>x.number),[1,9,22,25,28,33]);
 assert.equal(OFFICIAL_QUESTIONS.length,100);
 for(const x of OFFICIAL_ANNULLED)assert.ok(!OFFICIAL_QUESTIONS.some(q=>q.id===x.id));
});
test('12 discursivas históricas identificadas por ano e seção',()=>{
 assert.equal(OFFICIAL_DISCURSIVES.length,12);
 assert.equal(OFFICIAL_DISCURSIVES.filter(q=>q.year===2023).length,2);
 assert.equal(OFFICIAL_DISCURSIVES.filter(q=>q.year===2019).length,5);
 assert.equal(OFFICIAL_DISCURSIVES.filter(q=>q.year===2017).length,5);
});
