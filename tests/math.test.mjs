import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS} from '../dist/assets/content.js';

// Os valores esperados foram calculados à parte dos campos "why" e "calculation".
// A presença deles nas alternativas é conferida matematicamente, sem executar texto da questão.
const samples=[
 ['AUT-001',50/10,5],['AUT-002',3**2*8,72],
 ['AUT-003',(20*20)/(20+20),10],['AUT-004',6/10,0.6],
 ['AUT-005',Math.hypot(3,4),5],['AUT-006',120*12/240,6],
 ['AUT-007',240*150/600,60],['AUT-008',2*200,400],
 ['AUT-009',1000/2000,0.5],['AUT-010',0.5*0.4,0.2],
 ['AUT-011',9/(1+9),0.9],['AUT-012',50-42,8],
 ['AUT-013',(6+9+12)/3,9],['AUT-014',0.1*0.1,0.01],
 ['AUT-015',100*Math.abs(104-100)/100,4],
 ['AUT-018',2*60,120],['AUT-021',Math.sqrt(3)*400*5/1000,3.46],
 ['AUT-022',4+7-6,5]
];
test('auditoria independente de resultados numéricos em 18 questões',()=>{
  for(const [id,computed,expected] of samples){
    assert.ok(Math.abs(computed-expected)<0.006,`${id}: cálculo de verificação`);
    const q=QUESTIONS.find(q=>q.id===id);
    assert.ok(q,`Questão ${id} está cadastrada`);
    if(id==='AUT-008'){
      assert.equal(q.answer,4,`${id}: fs deve ser estritamente maior que ${computed}`);
      assert.match(q.choices[q.answer],/500/);
      continue;
    }
    const label=q.choices[q.answer].replace(/\./g,'').replace(',','.');
    const value=Number(label.match(/-?\d+(?:\.\d+)?/)?.[0]);
    assert.ok(Number.isFinite(value)&&Math.abs(value-expected)<0.006,`${id} selecionou ${value}; esperado ${expected}`);
  }
});
