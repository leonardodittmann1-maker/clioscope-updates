/** Índice oficial de três edições anteriores de Engenharia Elétrica.
 * Os enunciados e imagens são consultados no PDF original. Este catálogo não
 * reproduz o texto integral nem inventa resoluções ausentes.
 * Revisão das fontes: 30/10/2026.
 */
import type {Question} from './model.js';
export type OfficialItem={id:string;year:2017|2019|2023;number:number;section:'geral'|'especifico';answer:'A'|'B'|'C'|'D'|'E'|'ANULADA';examUrl:string;keyUrl:string;sourceNote:string};
export type OfficialDiscursive={id:string;year:2017|2019|2023;number:number;section:'geral'|'especifico';examUrl:string;sourceNote:string};
export const OFFICIAL_SOURCES={
  2023:{exam:'https://download.inep.gov.br/enade/provas_e_gabaritos/2023_PV_engenharia_eletrica.pdf',key:'https://download.inep.gov.br/enade/provas_e_gabaritos/2023_GB_engenharia_eletrica.pdf',origin:'Inep — prova e gabarito definitivo 2023'},
  2019:{exam:'https://download.inep.gov.br/educacao_superior/enade/provas/2019/ENGENHARIA_ELETRICA.pdf',key:'https://download.inep.gov.br/educacao_superior/enade/gabaritos/2019/engenharia_eletrica.pdf',origin:'Inep — prova e gabarito definitivo 2019'},
  2017:{exam:'https://download.inep.gov.br/educacao_superior/enade/provas/2017/16_ENG_ELE_BACHAREL_BAIXA.pdf',key:'https://download.inep.gov.br/educacao_superior/enade/gabaritos/2017/16_Engenharia_Eletrica.pdf',origin:'Gabarito definitivo Engenharia Elétrica 2017 (cópia da Univali conferida, não confundir com gabaritos de outras Engenharias)'}
} as const;
// Uma letra por questão objetiva, na ordem oficial; X representa ANULADA.
// Lista explícita sem depender da formatação de texto do PDF.
const KEYS:{[year:number]:('A'|'B'|'C'|'D'|'E'|'ANULADA')[]}={
  2023:['D','D','B','A','E','C','A','B','E','A','A','E','C','B','A','D','B','E','D','A','B','D','C','D','A','E','D','D','B','ANULADA','C','A','D','E','C','A','E','B'],
  2019:['ANULADA','D','C','B','C','C','D','B','ANULADA','A','C','D','B','B','A','D','D','A','B','E','E','ANULADA','E','C','ANULADA','A','E','ANULADA','B','C','D','B','ANULADA','B','C'],
  2017:['C','C','B','B','C','E','A','D','E','D','C','A','E','A','B','C','D','B','C','A','D','E','E','B','B','D','D','A','A','E','C','B','D','C','C']
};
export const OFFICIAL_ITEMS:OfficialItem[]=[2023,2019,2017].flatMap(year=>KEYS[year].map((answer,i)=>{
 const number=i+1,section=(year===2023?number<=9:number<=8)?'geral':'especifico',s=OFFICIAL_SOURCES[year as 2017|2019|2023];
 return {id:`INEP-${year}-EE-Q${String(number).padStart(2,'0')}`,year:year as 2017|2019|2023,number,section,answer,examUrl:s.exam,keyUrl:s.key,sourceNote:s.origin};
}));
export const OFFICIAL_DISCURSIVES:OfficialDiscursive[]=[2023,2019,2017].flatMap(year=>Array.from({length:year===2023?2:5},(_,i)=>{
 const number=i+1,s=OFFICIAL_SOURCES[year as 2017|2019|2023];
 return {id:`INEP-${year}-EE-D${number}`,year:year as 2017|2019|2023,number,section:(year===2023?number===1:number<=2)?'geral' as const:'especifico' as const,examUrl:s.exam,sourceNote:s.origin};
}));
export const OFFICIAL_QUESTIONS:Question[]=OFFICIAL_ITEMS.filter(item=>item.answer!=='ANULADA' && item.id!=='INEP-2023-EE-Q10').map(item=>({
 id:item.id,year:item.year,areaId:item.section==='geral'?'FG00':'EE00',
 topic:`ENADE ${item.year} — questão ${String(item.number).padStart(2,'0')} (${item.section==='geral'?'Formação Geral':'Componente Específico'})`,
 prompt:`Questão oficial ${item.number} do ENADE Engenharia Elétrica ${item.year}. Abra o caderno oficial abaixo para ler o enunciado completo, as alternativas e os diagramas antes de responder. O texto não foi copiado para este aplicativo.`,
 choices:['Alternativa A (consulte o PDF)','Alternativa B (consulte o PDF)','Alternativa C (consulte o PDF)','Alternativa D (consulte o PDF)','Alternativa E (consulte o PDF)'],
 answer:'ABCDE'.indexOf(item.answer),why:`O gabarito definitivo do Inep registra a alternativa ${item.answer} para a questão ${item.number} de ${item.year}. A resolução detalhada independente ainda não foi revisada; consulte o caderno para estudar a justificativa.`,
 hints:['Abra o caderno de prova e localize a questão pelo número.','Resolva no papel antes de assinalar a resposta no aplicativo.'],
 difficulty:'Média',origin:'oficial-referenciada',source:item.examUrl,needsSource:true,
 status:'oficial-gabarito-conferido',revisionDate:'2026-10-30'
}));
export const OFFICIAL_ANNULLED=OFFICIAL_ITEMS.filter(i=>i.answer==='ANULADA');
