/** Optional, opt-in, no-billing Firebase backend. This module does not connect without explicit configuration. */
import type {Progress,Response,Attempt} from './model.js';
export type FirebasePublicConfig={apiKey:string;authDomain:string;projectId:string;appId:string};
export type SyncInfo={uid:string;email:string|null};
export function validateFirebaseConfig(v:unknown):FirebasePublicConfig{
 if(!v||typeof v!=='object')throw new Error('Informe o JSON da configuração web do Firebase.');
 const x=v as Record<string,unknown>;
 for(const key of ['apiKey','authDomain','projectId','appId'])if(typeof x[key]!=='string'||!(x[key] as string).trim())throw new Error(`Campo obrigatório: ${key}`);
 if(!String(x.authDomain).endsWith('.firebaseapp.com')&&!String(x.authDomain).endsWith('.web.app'))throw new Error('Confira authDomain no console Firebase.');
 return {apiKey:String(x.apiKey),authDomain:String(x.authDomain),projectId:String(x.projectId),appId:String(x.appId)};
}
function keyUnion(a:string[]|undefined,b:string[]|undefined):string[]{return [...new Set([...(a||[]),...(b||[])])].sort()}
function responseUnion(a:Response[],b:Response[]):Response[]{const ids=new Map<string,Response>();for(const x of [...a,...b]){const k=x.id||`${x.questionId}|${x.at}|${x.attemptId}`;if(!ids.has(k))ids.set(k,x);}return [...ids.values()].sort((x,y)=>x.at.localeCompare(y.at)||x.id.localeCompare(y.id))}
function mergeAttempts(a:Attempt[],b:Attempt[]):Attempt[]{const map=new Map<string,Attempt>();
 for(const attempt of [...a,...b]){
  const old=map.get(attempt.id);if(!old){map.set(attempt.id,structuredClone(attempt));continue;}
  const newer=(attempt.finishedAt||attempt.startedAt)>=(old.finishedAt||old.startedAt)?attempt:old;
  const choices={...old.choices,...attempt.choices};
  const conflicts=Object.keys(attempt.choices).filter(id=>old.choices[id]!==undefined&&old.choices[id]!==attempt.choices[id]);
  if(conflicts.length){const different={...old,id:`${attempt.id}-conflito-${Object.entries(old.choices).map(([k,v])=>`${k}_${v}`).sort().join('_').slice(0,48)}`};if(!map.has(different.id))map.set(different.id,structuredClone(different));}
  map.set(attempt.id,{...old,...newer,choices,flagged:keyUnion(old.flagged,attempt.flagged),index:newer.index,finishedAt:Math.max(old.finishedAt||0,attempt.finishedAt||0)||undefined});
 }
 return [...map.values()].sort((x,y)=>x.startedAt-y.startedAt);
}
export type ExtendedProgress=Progress&{formulaBookmarks?:string[];draftConflicts?:Record<string,string[]>};
export function mergeProgress(local:ExtendedProgress,remote:ExtendedProgress):ExtendedProgress{
 if(local.schema!==1||remote.schema!==1)throw new Error('Versão de dados incompatível; exporte backups antes de sincronizar.');
 const discursive={...remote.discursive,...local.discursive};const draftConflicts:Record<string,string[]>={};
 for(const [id,text] of Object.entries(remote.draftConflicts||{}))draftConflicts[id]=[...text];
 for(const [id,text] of Object.entries(local.draftConflicts||{}))draftConflicts[id]=keyUnion(draftConflicts[id],text);
 for(const id of new Set([...Object.keys(local.discursive),...Object.keys(remote.discursive)])){
  const l=local.discursive[id],r=remote.discursive[id];
  if(typeof l==='string'&&typeof r==='string'&&l!==r){draftConflicts[id]=keyUnion(draftConflicts[id],[l,r]);discursive[id]=l.length>=r.length?l:r;}
 }
 const sessions=[...(local.studySessions||[]),...(remote.studySessions||[])],uniqueSessions=new Map(sessions.map(s=>[`${s.lessonId}|${s.finishedAt}`,s]));
 return {...remote,...local,responses:responseUnion(local.responses,remote.responses),attempts:mergeAttempts(local.attempts,remote.attempts),completedLessons:keyUnion(local.completedLessons,remote.completedLessons),bookmarks:keyUnion(local.bookmarks,remote.bookmarks),formulaBookmarks:keyUnion(local.formulaBookmarks,remote.formulaBookmarks),discursive,draftConflicts,studySessions:[...uniqueSessions.values()].sort((x,y)=>x.finishedAt.localeCompare(y.finishedAt)),minutes:Math.max(local.minutes,remote.minutes),revisionDates:{...remote.revisionDates,...local.revisionDates},settings:local.settings};
}
// Keep the SDK external so the app and lessons work fully offline before any login.
// Public web config is not a secret; Firestore RULES (not JavaScript) provide access control.
export class PrivateFirebaseSync{
 private auth:unknown;private db:unknown;private uid='';private modules:Record<string,any>={};
 async connect(config:FirebasePublicConfig):Promise<SyncInfo>{
  if(!location.protocol.startsWith('http'))throw new Error('Login Google exige origem HTTPS autorizada. O arquivo content:// ou file:// só permite estudo local.');
  const version='11.10.0';
  // @ts-ignore Firebase CDN is intentionally imported without a package dependency.
  const appModule=await import(`https://www.gstatic.com/firebasejs/${version}/firebase-app.js`);
  // @ts-ignore
  const authModule=await import(`https://www.gstatic.com/firebasejs/${version}/firebase-auth.js`);
  // @ts-ignore
  const dbModule=await import(`https://www.gstatic.com/firebasejs/${version}/firebase-firestore.js`);
  this.modules={...authModule,...dbModule};
  const app=appModule.getApps().find((a:any)=>a.name==='enade-privado')||appModule.initializeApp(config,'enade-privado');this.auth=authModule.getAuth(app);this.db=dbModule.getFirestore(app);await (this.auth as any).authStateReady?.();await authModule.getRedirectResult(this.auth).catch(()=>null);
  let user=this.modules.getAuth(app).currentUser;
  if(!user){const provider=new authModule.GoogleAuthProvider();
   try{user=(await authModule.signInWithPopup(this.auth,provider)).user}
   catch(error:any){if(['auth/popup-blocked','auth/popup-closed-by-user','auth/operation-not-supported-in-this-environment'].includes(error?.code)){await authModule.signInWithRedirect(this.auth,provider);throw new Error('Redirecionando para login Google; ao voltar à aplicação, conecte novamente.');}throw error}
  }
  this.uid=user.uid;return {uid:user.uid,email:user.email||null};
 }
 async synchronize(local:ExtendedProgress):Promise<ExtendedProgress>{
  if(!this.uid||!this.db)throw new Error('Faça login antes da sincronização.');
  if(typeof navigator!=='undefined'&&!navigator.onLine)throw new Error('Sem internet: alterações locais preservadas.');
  const m=this.modules;const doc=m.doc(this.db,'users',this.uid,'data','progress');
  const merged=await m.runTransaction(this.db,async(transaction:any)=>{
   const remote=await transaction.get(doc);
   const result=remote.exists()?mergeProgress(local,remote.data().progress as ExtendedProgress):local;
   const size=new Blob([JSON.stringify(result)]).size;
   if(size>850000)throw new Error('Backup ultrapassou 850 KB; exporte os dados e migre o armazenamento antes de continuar.');
   transaction.set(doc,{schema:1,progress:result,updatedAt:m.serverTimestamp()});return result;
  });
  return merged;
 }
 async signOut(){if(this.auth)await this.modules.signOut(this.auth);this.uid='';}
 get connected(){return Boolean(this.uid)}
}
