import {initialProgress,type Progress} from './model.js';
const KEY='enade-progress-v1',DB='enade-local';
let database:Promise<IDBDatabase>|null=null,temporary:Progress|null=null;
function db():Promise<IDBDatabase>{if(database)return database;database=new Promise((resolve,reject)=>{const r=indexedDB.open(DB,2);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('data'))r.result.createObjectStore('data');if(!r.result.objectStoreNames.contains('pdfs'))r.result.createObjectStore('pdfs');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return database;}
export async function load():Promise<Progress>{
 try{const d=await db();const found=await new Promise<Progress|null>(res=>{const r=d.transaction('data','readonly').objectStore('data').get(KEY);r.onsuccess=()=>res((r.result as Progress)||null);r.onerror=()=>res(null)});if(found)return found;}catch{}
 try{const old=localStorage.getItem(KEY);if(old)return JSON.parse(old) as Progress;}catch{}
 return temporary||initialProgress();
}
export async function save(progress:Progress):Promise<void>{const snap=structuredClone(progress);temporary=snap;try{localStorage.setItem(KEY,JSON.stringify(snap));}catch{}
 try{const d=await db();await new Promise<void>((resolve,reject)=>{const tx=d.transaction('data','readwrite');tx.objectStore('data').put(snap,KEY);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}catch{}
}
export function restore(input:unknown):Progress{
 if(!input||typeof input!=='object'||(input as Progress).schema!==1)throw new Error('Formato de backup incompatível.');
 const x=input as Progress;if(!Array.isArray(x.responses)||!Array.isArray(x.attempts)||!Array.isArray(x.completedLessons)||!Array.isArray(x.bookmarks)||!x.settings||typeof x.discursive!=='object')throw new Error('Backup incompleto.');
 return x;
}

export async function saveExamPdf(year:number,pdf:Blob):Promise<void>{
 const d=await db();await new Promise<void>((resolve,reject)=>{const tx=d.transaction('pdfs','readwrite');tx.objectStore('pdfs').put(pdf,String(year));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});
}
export async function loadExamPdf(year:number):Promise<Blob|null>{
 try{const d=await db();return await new Promise<Blob|null>(resolve=>{const r=d.transaction('pdfs','readonly').objectStore('pdfs').get(String(year));r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>resolve(null)})}catch{return null}
}
export async function deleteExamPdf(year:number):Promise<void>{
 const d=await db();await new Promise<void>((resolve,reject)=>{const tx=d.transaction('pdfs','readwrite');tx.objectStore('pdfs').delete(String(year));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)});
}
