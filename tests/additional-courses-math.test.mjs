import test from 'node:test';
import assert from 'node:assert/strict';
import {ADDITIONAL_MASTERCLASSES} from '../dist/assets/additionalCourses.js';
const close=(got,expected,tol=.01)=>assert.ok(Math.abs(got-expected)<=tol,`${got} != ${expected}`);
test('11 cadernos adicionais com hipótese, resolução e verificação de compreensão',()=>{
 assert.equal(ADDITIONAL_MASTERCLASSES.length,11);
 assert.equal(new Set(ADDITIONAL_MASTERCLASSES.map(m=>m.lessonId)).size,11);
 for(const m of ADDITIONAL_MASTERCLASSES){assert.ok(m.chapters.length>=3,m.lessonId);assert.ok(m.chapters.some(ch=>ch.steps?.length>=5),m.lessonId);
 assert.ok(m.chapters.every(ch=>ch.explanation.join(' ').length>260&&ch.question&&ch.answer),m.lessonId);}
});
test('conferência matemática independente de grandezas das aulas avançadas',()=>{
 close(400000/(Math.sqrt(3)*380),607.737);close(340/348*100,97.7011);
 close(2*Math.PI*50*100*.008/Math.sqrt(2),177.7153);
 close(3*.95**2*.05+.95**3,.99275,1e-10);close(3*.02**2*.98+.02**3,.001184,1e-10);
 close(10/4096*1000,2.44140625,.00000001);close(.001*10*1000,10);
 close(8*4.5*.78*365,10249.2,.001);
 close(-100000+30000*(1-1.1**-5)/.1,13723.60,.05);
 close(1000/(1000+10)*100,99.00990099,.0001);
});
