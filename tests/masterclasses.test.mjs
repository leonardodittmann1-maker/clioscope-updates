import test from 'node:test';import assert from 'node:assert/strict';
import {MASTERCLASSES} from '../dist/assets/masterclasses.js';
import {CASE_QUESTIONS} from '../dist/assets/caseQuestions.js';
import {LESSONS,QUESTIONS} from '../dist/assets/content.js';
import {eligible} from '../dist/assets/model.js';
const close=(actual,expected,tolerance=.01)=>assert.ok(Math.abs(actual-expected)<=tolerance,`expected ${expected} actual ${actual}`);
test('cadernos universitários com hipóteses, conteúdo e exemplos completos',()=>{
 assert.equal(MASTERCLASSES.length,21);
 const ids=new Set(LESSONS.map(l=>l.id));
 for(const c of MASTERCLASSES){assert.ok(ids.has(c.lessonId),c.lessonId);assert.ok(c.objectives.length>=2,c.lessonId);assert.ok(c.chapters.length>=3,c.lessonId);
  assert.ok(c.chapters.some(x=>x.steps?.length>=5),`Falta exemplo multietapas em ${c.lessonId}`);
  for(const chapter of c.chapters){assert.ok(chapter.explanation.length>=2,`Resumo superficial ${c.lessonId} ${chapter.title}`);assert.ok(chapter.question&&chapter.answer,`Falta verificação de aprendizagem: ${chapter.title}`)}
 }
});
test('14 casos autorais possuem cinco alternativas únicas, resolução e vínculo correto',()=>{
 assert.equal(CASE_QUESTIONS.length,14);assert.equal(new Set(CASE_QUESTIONS.map(q=>q.id)).size,14);
 for(const q of CASE_QUESTIONS){assert.ok(eligible(q),q.id);assert.equal(q.choices.length,5);assert.equal(new Set(q.choices).size,5,q.id);assert.ok(q.why.length>200,q.id);assert.ok(q.hints.length>=2,q.id);assert.ok(LESSONS.some(l=>l.id===q.lessonId&&l.areaId===q.areaId),q.id);assert.ok(QUESTIONS.includes(q),q.id)}
});
test('conferência independente de cálculos multidisciplinares e gabaritos',()=>{
 const answer=(id)=>CASE_QUESTIONS.find(q=>q.id===id);
 assert.equal(answer('CASO-001').answer,1);
 const VA=14,VB=12;close((VA-24)/6+VA/12+(VA-VB)/4,0,1e-9);close((VB-VA)/4+VB/8-1,0,1e-9);
 close((24-14)**2/6+14**2/12+(14-12)**2/4+12**2/8,52,1e-9);assert.equal(answer('CASO-002').answer,3);
 const qc=230*(Math.sqrt(1-.76**2)/.76-Math.sqrt(1-.96**2)/.96);close(qc,129.60391225,.01);assert.equal(answer('CASO-003').answer,1);
 close((1-(.76/.96)**2)*100,37.3264,.01);assert.equal(answer('CASO-004').answer,2);
 close(20e6/(Math.sqrt(3)*13800)/(.08+.12+.03*20/10),3218.2289,.01);assert.equal(answer('CASO-005').answer,1);
 close(81000/(2*Math.PI*1164/60),664.5129,.01);assert.equal(answer('CASO-006').answer,2);
 close(20-12*Math.exp(-2),18.3759766,.00001);assert.equal(answer('CASO-007').answer,2);
 close(100*Math.exp(-Math.PI*.4/Math.sqrt(1-.4**2)),25.38267,.001);assert.equal(answer('CASO-008').answer,3);
 close(Math.abs(930-1000),70);close(1000/4096,.244140625,1e-8);assert.equal(answer('CASO-009').answer,2);
 close((.005*.98)/(.005*.98+.995*.02),.197580645,1e-8);assert.equal(answer('CASO-010').answer,1);
 close(3*.95**2*.05+.95**3,.99275,1e-10);assert.equal(answer('CASO-011').answer,3);
 close(1.35*400,540);close(6*60,360);close(540*20,10800);assert.equal(answer('CASO-012').answer,3);
 close(1/(100*.00385),2.597402597,.00001);assert.equal(answer('CASO-013').answer,2);
 close(2*Math.sqrt(.2**2+.3**2),.721110255,.000001);assert.equal(answer('CASO-014').answer,3);
});
test('a origem de 2026 e questões históricas não são confundidas',()=>{
 assert.equal(QUESTIONS.filter(q=>q.origin==='oficial-referenciada'&&eligible(q)).length,0);
 assert.ok(CASE_QUESTIONS.every(q=>q.origin==='autoral'&&q.year===2026));
});
