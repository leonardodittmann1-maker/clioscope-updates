export type Status='oficial-gabarito-conferido'|'resolucao-independente-revisada'|'aguardando-revisao'|'inconsistencia'|'descartada';
export type Area={id:string;title:string;group:'especifico'|'geral';law:string;topics:string[]};
export type Lesson={id:string;areaId:string;title:string;summary:string;concept:string[];formula:string[];variables:string[];steps:string[];application:string;mistakes:string[];sources:string[];revision:string;duration:number;version:string};
export type Question={id:string;areaId:string;lessonId?:string;topic:string;prompt:string;choices:[string,string,string,string,string];answer:number;why:string;wrong?:string[];hints:string[];difficulty:'Fácil'|'Média'|'Difícil';level?:'fundamentos'|'desenvolvimento'|'padrao-enade';origin:'autoral'|'oficial-referenciada';year:number;source:string;page?:number;status:Status;revisionDate:string;calculation?:string;needsSource?:boolean};
export type Discursive={id:string;areaId:string;prompt:string;rubric:string[];model:string;source:string};
export type Response={id:string;questionId:string;choice:number|null;correct:boolean;at:string;seconds:number;attemptId:string};
export type Attempt={id:string;kind:string;questionIds:string[];choices:Record<string,number>;flagged:string[];startedAt:number;endsAt:number;pausedSeconds:number;pauseSince:number|null;duration:number;index:number;finishedAt?:number;mode:'real'|'practice'};
export type Progress={schema:1;responses:Response[];attempts:Attempt[];completedLessons:string[];bookmarks:string[];discursive:Record<string,string>;minutes:number;settings:{theme:'light'|'dark';session:30|45|60};revisionDates:Record<string,string>;studySessions?:{lessonId:string;finishedAt:string}[]};
export const initialProgress=():Progress=>({schema:1,responses:[],attempts:[],completedLessons:[],bookmarks:[],discursive:{},minutes:0,settings:{theme:'light',session:45},revisionDates:{},studySessions:[]});
/** Apenas questões completas com resolução revisada podem gerar respostas e avaliações.
 * O registro de um gabarito oficial, isoladamente, não valida o enunciado.
 */
export const eligible=(q:Question)=>q.status==='resolucao-independente-revisada' && !q.needsSource &&
 q.choices.length===5 && q.choices.every(c=>Boolean(c.trim())&&!/consulte o pdf|consulte o caderno/i.test(c)) &&
 !/abra o caderno oficial|consulte o pdf|texto não foi copiado/i.test(q.prompt);

export const score=(answers:Record<string,number>,questions:Question[])=>({total:questions.length,answered:questions.filter(q=>answers[q.id]!==undefined).length,correct:questions.filter(q=>answers[q.id]===q.answer).length});
export const daysUntil=(date:string,now=new Date())=>Math.max(0,Math.ceil((new Date(`${date}T00:00:00-03:00`).getTime()-now.getTime())/86400000));
export function pickAdaptive(questions:Question[], responses:Response[], count:number):Question[]{
 const records=new Map<string,Response[]>();for(const r of responses){records.set(r.questionId,[...(records.get(r.questionId)||[]),r]);}
 const areaUsed=new Map<string,number>();const results:Question[]=[];
 const candidates=questions.filter(eligible).sort((a,b)=>a.id.localeCompare(b.id));
 while(results.length<count&&candidates.length){
  let winner=0,best=-Infinity;
  for(let i=0;i<candidates.length;i++){
   const q=candidates[i],hist=records.get(q.id)||[],miss=hist.filter(x=>!x.correct).length,last=hist[hist.length-1];
   const priority=(hist.length===0?8:0)+(last&&!last.correct?12:0)+miss*2-hist.length*1.5-(areaUsed.get(q.areaId)||0)*5+(q.difficulty==='Média'?1:0);
   if(priority>best){best=priority;winner=i;}
  }
  const q=candidates.splice(winner,1)[0];results.push(q);areaUsed.set(q.areaId,(areaUsed.get(q.areaId)||0)+1);
 }
 return results;
}
