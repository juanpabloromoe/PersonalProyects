/* CV Workbench. One codebase, two editions:
   public  - GitHub Pages; everything lives in this browser's localStorage, AI by copy-paste.
   private - built into a claude.ai artifact (window.CVW_PRIVATE); profile, applications and matches live in the artifact db,
             Claude runs the AI steps, files save through the downloads capability, the photo through assets. */
(function(){
"use strict";
const I = window.CVW_I18N; let LANG = "en";
const t = (k, vars) => { let s = (I[LANG] && I[LANG][k]) || I.en[k] || k; if (vars) Object.entries(vars).forEach(([a,b]) => s = s.split("{" + a + "}").join(b)); return s; };

/* ---------- vocabulary ---------- */
// Role families. Each one is also a tag you can put on bullets, courses and skills.
const FAMILIES = [
  {id:"design",w:{design:3,mech:1,proto:2,mfg:1}},
  {id:"mfg",w:{mfg:3,ops:2,quality:2,cost:1,automation:1}},
  {id:"quality",w:{quality:3,data:2,mfg:2}},
  {id:"log",w:{log:3,ops:3,cost:2,data:2}},
  {id:"automation",w:{automation:3,electrical:2,software:1,mfg:1}},
  {id:"electrical",w:{electrical:3,automation:2,design:1}},
  {id:"software",w:{software:3,data:2}},
  {id:"data",w:{data:3,software:2,research:1}},
  {id:"business",w:{business:3,cost:2,data:1,comms:1}},
  {id:"marketing",w:{marketing:3,comms:2,data:1}},
  {id:"research",w:{research:3,data:2}}
];
const TAGS = ["design","mech","proto","mfg","quality","log","ops","cost","automation","electrical","software","data","business","marketing","research","lead","comms","service"];
const KB = [
 ["CATIA",["catia"],["design","mech"]],["SolidWorks",["solidworks"],["design","mech"]],["Siemens NX",["siemens nx","\\bnx\\b","unigraphics"],["design"]],["AutoCAD",["autocad"],["design"]],["Creo",["\\bcreo\\b"],["design"]],["Inventor",["\\binventor\\b"],["design"]],["Fusion 360",["fusion 360"],["design"]],
 ["CAD",["\\bcad\\b","konstruktion","diseño asistido"],["design"]],["Technical drawings",["technical drawing","technische zeichnung","dibujo técnico","planos"],["design"]],["GD&T / tolerances",["gd&t","toleranc","toleranz"],["quality","design"]],
 ["FEA / simulation",["\\bfem\\b","\\bfea\\b","finite element","ansys","abaqus","simulation","simulación"],["design","research"]],["MATLAB",["matlab","simulink"],["data","research"]],
 ["3D printing",["3d print","3d-druck","impresión 3d","additive"],["proto"]],["Prototyping",["prototyp","prototipo"],["proto"]],["CNC / machining",["\\bcnc\\b","machining","mecanizado"],["mfg"]],
 ["Manufacturing / production",["manufactur","fertigung","produktion","production","manufactura","producción"],["mfg"]],["Assembly",["assembly","montage","ensamble"],["mfg"]],
 ["Quality",["quality","qualität","calidad"],["quality"]],["Metrology",["metrolog","messtechnik","measurement"],["quality"]],["FMEA",["fmea","amef"],["quality"]],["Root cause / 8D",["\\b8d\\b","root cause","ursachenanalyse","causa raíz"],["quality"]],
 ["SPC / MSA",["\\bspc\\b","\\bmsa\\b","\\bcpk\\b"],["quality","data"]],["Lean / continuous improvement",["\\blean\\b","kaizen","\\bkvp\\b","continuous improvement","mejora continua","\\b5s\\b"],["ops","quality"]],["Six Sigma",["six sigma","dmaic"],["quality","data"]],
 ["Logistics",["logisti","logística"],["log"]],["Supply chain",["supply chain","lieferkette","cadena de suministro","\\bscm\\b"],["log"]],["Procurement / purchasing",["procurement","purchasing","einkauf","beschaffung","sourcing","compras"],["log","cost"]],
 ["Inventory / warehouse",["inventory","warehouse","lager","inventario","almacén"],["log","ops"]],["Material flow / intralogistics",["material flow","materialfluss","intralogist","flujo de material"],["log","automation"]],["Packaging",["packaging","verpackung","empaque"],["log","design"]],
 ["Process improvement",["process improvement","process optim","prozessoptim","optimization","optimierung","optimización"],["ops"]],["Cost reduction",["cost reduc","kostenreduz","cost saving","reducción de costos"],["cost"]],
 ["Automation",["automat"],["automation"]],["Robotics",["robot"],["automation"]],["PLC",["\\bplc\\b","\\bsps\\b"],["automation","electrical"]],["Circuits / PCB",["circuit","\\bpcb\\b","altium","kicad","schaltung"],["electrical"]],["Embedded / Arduino",["embedded","arduino","microcontroller","raspberry pi"],["electrical","software"]],
 ["Python",["python"],["software","data"]],["C / C++",["\\bc\\+\\+","\\bc/c\\+\\+"],["software"]],["Java",["\\bjava\\b"],["software"]],["JavaScript / TypeScript",["javascript","typescript"],["software"]],["SQL",["\\bsql\\b"],["data","software"]],["Git",["\\bgit\\b","github"],["software"]],["Cloud (AWS/Azure/GCP)",["\\baws\\b","azure","\\bgcp\\b","google cloud"],["software"]],
 ["Machine learning / AI",["machine learning","maschinelles lernen","aprendizaje automático","artificial intelligence","\\bai\\b","\\bki\\b"],["data","research"]],
 ["Data analysis",["data analy","datenanaly","análisis de datos","analytics"],["data"]],["Excel",["excel"],["data"]],["Power BI / Tableau",["power bi","powerbi","tableau"],["data"]],["Statistics",["statisti","estadístic"],["data"]],["Minitab",["minitab"],["data","quality"]],["SAP / ERP",["\\bsap\\b","\\berp\\b"],["log","business"]],
 ["Financial analysis",["financial model","financial analy","finanzanaly","análisis financiero","valuation"],["business"]],["Accounting",["accounting","buchhaltung","contabilidad"],["business"]],["Consulting",["consulting","beratung","consultoría"],["business"]],
 ["Marketing",["marketing"],["marketing"]],["Social media / content",["social media","content creation","redes sociales"],["marketing"]],["SEO",["\\bseo\\b"],["marketing"]],["CRM / Salesforce",["salesforce","\\bcrm\\b","hubspot"],["marketing","business"]],
 ["Project management",["project manage","projektmanag","gestión de proyectos"],["lead"]],["Agile / Scrum",["agile","scrum","kanban"],["software","lead"]],["Teamwork",["teamwork","team player","teamfähig","trabajo en equipo"],["lead"]],["Leadership",["leadership","führung","liderazgo"],["lead"]],
 ["Communication",["communicat","kommunikat","comunicación"],["comms"]],["English",["english","englisch","inglés"],["comms"]],["German",["german","deutsch","alemán"],["comms"]],["Spanish",["spanish","spanisch","español"],["comms"]],["French",["french","französisch","francés"],["comms"]],
 ["Research",["research","forschung","investigación"],["research"]],["Automotive",["automotive","fahrzeug","vehicle","automotriz"],["mech"]],["Driver's license",["driver's licen","führerschein","licencia de conducir"],[]],
 ["Work authorization",["authorized to work","work authorization","sponsorship","arbeitserlaubnis","permiso de trabajo"],[]],["Mandatory internship",["pflichtpraktikum","mandatory internship","curricular","prácticas profesionales"],[]]
].map(([l,p,tg])=>({l, re:new RegExp(p.join("|"),"i"), t:tg}));

const PRESETS = {
  us:{layout:"us",paper:"letter",head:"en",photo:false,auth:"us",dates:"en"},
  de:{layout:"eu",paper:"a4",head:"de",photo:true,auth:"eu",dates:"num"},
  eu:{layout:"eu",paper:"a4",head:"en",photo:false,auth:"eu",dates:"num"},
  es:{layout:"eu",paper:"a4",head:"es",photo:false,auth:"eu",dates:"num"},
  mx:{layout:"us",paper:"letter",head:"es",photo:false,auth:"us",dates:"es"}
};
const HEAD = {
  en:{major:"Major",profile:"Profile",experience:"Experience",education:"Education",projects:"Projects",leadership:"Leadership and Activities",skills:"Skills",languages:"Languages",certs:"Certifications",coursework:"Relevant coursework",cwproj:"Relevant Coursework and Projects",gpa:"GPA",expected:"Expected",present:"Present",citizenship:"Citizenship",born:"Date of birth",page:"Page",exp:"exp."},
  de:{major:"Studiengang",profile:"Kurzprofil",experience:"Praxiserfahrung",education:"Ausbildung",projects:"Projekte",leadership:"Engagement",skills:"Kenntnisse",languages:"Sprachkenntnisse",certs:"Zertifikate",coursework:"Schwerpunkte",cwproj:"Studienschwerpunkte und Projekte",gpa:"Notendurchschnitt",expected:"Voraussichtlich",present:"heute",citizenship:"Staatsangehörigkeit",born:"Geburtsdatum",page:"Seite",exp:"vsl."},
  es:{major:"Carrera",profile:"Perfil",experience:"Experiencia",education:"Educación",projects:"Proyectos",leadership:"Liderazgo y actividades",skills:"Habilidades",languages:"Idiomas",certs:"Certificaciones",coursework:"Materias relevantes",cwproj:"Materias y proyectos relevantes",gpa:"Promedio",expected:"Graduación prevista",present:"Actualidad",citizenship:"Nacionalidad",born:"Fecha de nacimiento",page:"Página",exp:"prev."}
};
const MONTHS = {en:["January","February","March","April","May","June","July","August","September","October","November","December"],es:["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]};
const STATUSES = ["Draft","Applied","Interview","Offer","Rejected"];

/* ---------- state ---------- */
const DEF_JOB = {company:"",role:"",deadline:"",url:"",posting:"",format:"us",track:"all",families:[],include:{},photo:true,othercourses:true,sign:false,workauth:true,allow2:false,avail:"",summary:"",ai:null,reverted:{},appId:null,matchId:null,letter:"",why:"",letterAsk:"",letterQs:[]};
const S = {profile:null, apps:[], matches:[], mfilter:"new", job:{...DEF_JOB}, lastPdf:null, seq:0, pendingImport:"", photoData:null, prev:null, docExtra:{}};
const PRIVATE = !!window.CVW_PRIVATE;
const HOST = {db:null, sample:null, downloads:null, assets:null}; // filled only in the private edition
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = p => (p||"x") + "-" + Math.random().toString(36).slice(2,8);
function toast(m){const el=$("#toast");el.textContent=m;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2600)}
const store = {get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast(t("storageFull"));return false}}};
const accountFail = e => toast(t("saveFailAccount",{e:(e&&(e.code||e.message))||"?"}));
function saveProfile(quiet){
  const ok=store.set("cvw.profile", S.profile);
  if(HOST.db){S.profile.updatedAt=new Date().toISOString().slice(0,10);
    HOST.db.doc("profile/main").set({...S.docExtra,json:JSON.stringify(S.profile),updatedAt:S.profile.updatedAt}).then(()=>{if(!quiet)toast(t("savedAccount"))}).catch(accountFail)}
  return ok}
const saveApps = () => store.set("cvw.apps", S.apps);
// Private edition: one db document per application, with the job snapshot stored as a JSON string.
function putApp(rec){saveApps();if(!HOST.db)return;const {id,...r}=rec;r.job=JSON.stringify(r.job||{});HOST.db.collection("applications").doc(id).set(r).catch(accountFail)}
function dropApp(id){saveApps();if(!HOST.db)return;try{HOST.db.collection("applications").doc(id).delete().catch(accountFail)}catch(e){accountFail(e)}}
const appFromDoc = d => {const a={id:d.id,...d.data()};if(typeof a.job==="string"){try{a.job=JSON.parse(a.job)}catch(e){a.job={}}}a.job=a.job||{};if(!a.deadline&&a.job.deadline)a.deadline=a.job.deadline;return a};
const saveJob = () => store.set("cvw.job", S.job);
function blankProfile(){return {contact:{name:"",email:"",phone:"",linkedin:"",website:"",location:"",citizenship:"",birthDate:"",photo:""},headline:"",workAuthUS:"",workAuthEU:"",availability:"",
  education:[{id:uid("edu"),school:"",location:"",degree:"",gpa:"",majors:[{id:uid("maj"),name:"",field:"",start:"",end:"",expected:true,coursework:[]}]}],
  entries:[{id:uid("exp"),section:"experience",org:"",role:"",location:"",start:"",end:"",tags:[],show:{us:true,eu:true},bullets:[{id:uid("b"),text:"",tags:[]}]}],
  skills:[{cat:"Technical",items:[]}],languages:[],certifications:[],answers:[]}}
/* The first private dashboard stored the profile in an older shape (coursework per track at the top level,
   English/German pairs such as name/nameDe). Convert it once; German wording moves to p.i18n.de. */
const isLegacy = p => !!p && (typeof p.headline==="object" || (p.coursework && !Array.isArray(p.coursework)) || (p.availability && typeof p.availability==="object"));
function fromLegacy(o){
  const p=JSON.parse(JSON.stringify(o)),de={},pair=(en,d)=>{if(en&&d&&en!==d)de[en]=d};
  const hl=p.headline||{};p.headline=hl.en||"";pair(p.headline,hl.de);
  const av=p.availability||{};p.availability=typeof av==="string"?av:(av.en||"");pair(p.availability,av.de);
  const c=p.contact=p.contact||{};pair(c.citizenship,c.citizenshipDe);
  if(c.linkedin&&!/^www\./.test(c.linkedin)&&/^linkedin\.com/.test(c.linkedin))c.linkedin="www."+c.linkedin;
  const cw=p.coursework||{};const FIELD={mech:"design",log:"log"};
  p.education=(p.education||[]).map(e=>{pair(e.degree,e.degreeDe);return {...e,majors:(e.majors||[]).map(m=>{pair(m.name,m.nameDe);
    return {id:m.track||m.id,name:m.name,field:FIELD[m.track]||"",start:m.start,end:m.end,expected:m.expected!==false,coursework:(Array.isArray(cw[m.track])?cw[m.track]:[])}})}});
  delete p.coursework;
  (p.entries||[]).forEach(e=>{pair(e.label,e.labelDe);pair(e.role,e.roleDe)});
  (p.skills||[]).forEach(k=>pair(k.cat,k.catDe));
  (p.languages||[]).forEach(l=>{pair(l.name,l.nameDe);pair(l.level,l.levelDe)});
  if(!p.workAuthEU&&c.citizenship&&/us|united states/i.test(c.citizenship)&&/mex/i.test(c.citizenship)){
    p.workAuthEU="U.S. and Mexican citizen; visa-free entry to Germany, internship permit under §16e AufenthG possible";
    de[p.workAuthEU]="US- und mexikanische Staatsbürgerschaft; visumfreie Einreise (§41 AufenthV), Praktikum nach §16e AufenthG möglich"}
  p.i18n={...(p.i18n||{}),de:{...de,...((p.i18n||{}).de||{})}};
  p.options={usStyle:"cwproj",headings:{en:{experience:"Work Experience",leadership:"Leadership, Research and Activities",skills:"Technical & Language Skills",cwproj:"Related Coursework and Projects"}},...(p.options||{})};
  return p;
}
function normalize(p){ // fill gaps so imported or older profiles never crash the renderer
  const b=blankProfile(); p=p||{}; if(isLegacy(p))p=fromLegacy(p); p.contact={...b.contact,...(p.contact||{})};
  p.i18n=p.i18n&&typeof p.i18n==="object"?p.i18n:{}; p.options={usStyle:"standard",headings:{},letterStyle:"cv",...(p.options||{})}; p.voice={sample:"",notes:"",...(p.voice||{})};
  ["headline","workAuthUS","workAuthEU","availability"].forEach(k=>{if(typeof p[k]!=="string")p[k]=""});
  p.education=(Array.isArray(p.education)?p.education:[]).map(e=>({id:e.id||uid("edu"),school:e.school||"",location:e.location||"",degree:e.degree||"",gpa:e.gpa||"",majors:(Array.isArray(e.majors)&&e.majors.length?e.majors:[{name:""}]).map(m=>({id:m.id||uid("maj"),name:m.name||"",field:m.field||"",start:m.start||"",end:m.end||"",expected:m.expected!==false,coursework:(m.coursework||[]).map(c=>typeof c==="string"?{name:c,tags:[]}:{name:c.name||"",tags:c.tags||[]}).filter(c=>c.name)}))}));
  p.entries=(Array.isArray(p.entries)?p.entries:[]).map(e=>({id:e.id||uid("e"),section:["experience","projects","leadership"].includes(e.section)?e.section:"experience",org:e.org||"",orgSuffix:e.orgSuffix||"",role:e.role||"",location:e.location||"",start:e.start||"",end:e.end||"",label:e.label||"",tags:e.tags||[],show:e.show||{us:true,eu:true},bullets:(e.bullets||[]).map(x=>typeof x==="string"?{id:uid("b"),text:x,tags:[]}:{id:x.id||uid("b"),text:x.text||"",tags:x.tags||[]})}));
  p.skills=(Array.isArray(p.skills)?p.skills:[]).map(c=>({cat:c.cat||"Skills",items:(c.items||[]).map(i=>typeof i==="string"?{name:i,tags:[]}:{name:i.name||"",tags:i.tags||[]}).filter(i=>i.name)}));
  p.languages=(p.languages||[]).map(l=>typeof l==="string"?{name:l,level:""}:{name:l.name||"",level:l.level||""}).filter(l=>l.name);
  p.certifications=(p.certifications||[]).map(c=>typeof c==="string"?{name:c,tags:[]}:{name:c.name||"",tags:c.tags||[]}).filter(c=>c.name);
  p.answers=p.answers||[]; return p;
}

/* ---------- matching ---------- */
function profileText(p){const a=[];p.entries.forEach(e=>{a.push(e.org,e.role);e.bullets.forEach(b=>a.push(b.text))});p.skills.forEach(c=>c.items.forEach(i=>a.push(i.name)));p.certifications.forEach(c=>a.push(c.name));p.languages.forEach(l=>a.push(l.name));p.education.forEach(e=>e.majors.forEach(m=>{a.push(m.name);m.coursework.forEach(c=>a.push(c.name))}));p.answers.forEach(x=>a.push(x.keyword+" "+(x.answer||"")));return a.join(" \n ")}
function analyze(){const txt=S.job.posting||"";if(txt.trim().length<30)return null;const pt=profileText(S.profile);const hits=KB.filter(k=>k.re.test(txt)).map(k=>({...k,have:k.re.test(pt)}));return {hits,have:hits.filter(h=>h.have),missing:hits.filter(h=>!h.have)}}
function weights(){
  const w={},add=(o,f=1)=>Object.entries(o||{}).forEach(([k,v])=>w[k]=(w[k]||0)+v*f);
  const majors=allMajors(); const m=majors.find(x=>x.id===S.job.track);
  if(m&&m.field){const f=FAMILIES.find(x=>x.id===m.field);if(f)add(f.w,0.8)}
  S.job.families.forEach(id=>{const f=FAMILIES.find(x=>x.id===id);if(f)add(f.w)});
  const a=analyze(); if(a)a.hits.forEach(h=>h.t.forEach(x=>w[x]=(w[x]||0)+0.8));
  if(S.job.ai&&S.job.ai.tagWeights)add(S.job.ai.tagWeights,0.5);
  return {w,a};
}
const score=(tags,text,W,a)=>{let s=0;(tags||[]).forEach(x=>s+=W[x]||0);if(a&&text)a.hits.forEach(h=>{if(h.re.test(text))s+=1.2});return s};
const allMajors=()=>S.profile.education.flatMap(e=>e.majors);

/* ---------- model ---------- */
function fmtMonth(ym,style){if(!ym)return"";const [y,m]=ym.split("-").map(Number);if(!m)return String(y);if(style==="num")return String(m).padStart(2,"0")+"/"+y;const L=style==="es"?MONTHS.es:MONTHS.en;return L[m-1]+" "+y}
function range(e,style,H){if(e.label)return e.label;return fmtMonth(e.start,style)+" – "+(e.end?fmtMonth(e.end,style):H.present)}
function buildModel(drop){
  const p=S.profile,J=S.job,P=PRESETS[J.format],lk=P.layout==="us"?"us":"eu";
  const own=Object.fromEntries(Object.entries((p.options.headings||{})[P.head]||{}).filter(([,v])=>v&&String(v).trim()));const H={...HEAD[P.head],...own};
  const {w:W,a}=weights();const ai=J.ai||{};const aiText={};(ai.bullets||[]).forEach(b=>{if(b&&b.id&&b.text&&!J.reverted[b.id])aiText[b.id]=b.text});
  const aiPick=ai.bullets&&ai.bullets.length?new Set(ai.bullets.map(b=>b.id)):null;const TR=ai.translations||{};const L10=p.i18n[P.head]||{};const tr=s=>TR[s]||L10[s]||s;
  const sections={experience:[],projects:[],leadership:[]},pool=[];let firstExp=true;
  p.entries.forEach(e=>{
    const inc=J.include[e.id]!==undefined?J.include[e.id]:!!(e.show&&e.show[lk]);if(!inc)return;
    const service=(e.tags||[]).includes("service");const main=e.section==="experience"&&firstExp&&!service;if(e.section==="experience"&&!service)firstExp=false;
    let cap=service?1:main?4:(e.section==="leadership"?3:2);
    let bs=e.bullets.filter(b=>b.text).map((b,i)=>({id:b.id,text:aiText[b.id]||b.text,score:score(b.tags,b.text,W,a)+(aiPick&&aiPick.has(b.id)?3:0)-i*0.01}));
    if(aiPick){const pk=bs.filter(b=>aiPick.has(b.id));if(pk.length){bs=pk;cap=Math.max(cap,pk.length)}}
    bs.sort((x,y)=>y.score-x.score);bs=bs.slice(0,cap);
    if(!main&&!aiPick){const ord=e.bullets.map(b=>b.id);bs.sort((x,y)=>ord.indexOf(x.id)-ord.indexOf(y.id))}
    if(service&&lk==="eu")bs=[];
    const ent={org:e.org,orgSuffix:e.orgSuffix,role:tr(e.role),location:e.location,date:e.label?tr(e.label):range(e,P.dates,H),bullets:bs};
    sections[e.section].push(ent);bs.forEach(b=>pool.push({b,ent}));
  });
  const dropped=[];if(drop>0){pool.sort((x,y)=>x.b.score-y.b.score);for(const it of pool){if(dropped.length>=drop)break;if(it.ent.bullets.length>1){it.ent.bullets=it.ent.bullets.filter(b=>b!==it.b);dropped.push(it.b)}}}
  const lead=J.track;
  const edu=p.education.map(e=>({...e,majors:[...e.majors].sort((x,y)=>(y.id===lead)-(x.id===lead)).map((m,i)=>{
    let cw=m.coursework.map((c,j)=>({n:tr(c.name),s:score(c.tags,c.name,W,a)-j*0.01})).sort((x,y)=>y.s-x.s).map(c=>c.n);
    if(lk==="eu")cw=cw.slice(0,5);const show=lead==="all"||m.id===lead||J.othercourses;return {...m,name:tr(m.name),cw:show?cw:[]}}),degree:tr(e.degree||""),short:((e.school||"").match(/\(([^)]+)\)\s*$/)||[])[1]||e.school}));
  const skills=p.skills.map(c=>{const it=c.items.map((x,i)=>({n:tr(x.name),s:score(x.tags,x.name,W,a)-i*0.01})).sort((x,y)=>y.s-x.s);return {cat:tr(c.cat),items:it.map(x=>x.n),s:it.length?it[0].s:0}}).filter(c=>c.items.length);
  if(J.families.length||a)skills.sort((x,y)=>y.s-x.s);
  const certs=p.certifications.map((c,i)=>({n:c.name,s:score(c.tags,c.name,W,a)-i*0.01})).sort((x,y)=>y.s-x.s).map(c=>c.n);
  const auth=J.workauth?tr((P.auth==="us"?p.workAuthUS:p.workAuthEU).trim()):"";
  const langs=p.languages.map(l=>({name:tr(l.name),level:tr(l.level)}));
  return {p,J,P,H,tr,sections,edu,skills,certs,langs,dropped,a,auth,summary:(J.summary||"").trim(),avail:(J.avail||"").trim(),headline:tr(p.headline||""),
    cwproj:lk==="us"&&p.options.usStyle==="cwproj",citizenship:tr(p.contact.citizenship||""),degreeOf:e=>tr(e.degree||"")};
}

/* ---------- PDF ---------- */
// jsPDF's built-in fonts cover Western European characters (á, ñ, ü, ß). Smart quotes are normalized.
const clean=s=>String(s||"").replace(/[\u2018\u2019]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/\u2014/g,"–").replace(/[^\x00-\xFF\u2013\u2022\u20AC]/g,"");
function Pen(doc,M){const P={doc,M,y:M.t,W:doc.internal.pageSize.getWidth(),H:doc.internal.pageSize.getHeight(),pages:1,
  font(f,st,sz){doc.setFont(f,st);doc.setFontSize(sz);return P},need(h){if(P.y+h>P.H-M.b){doc.addPage();P.pages++;P.y=M.t}},
  w:x=>doc.getTextWidth(clean(x)),text(x,X,o){doc.text(clean(x),X,P.y,o)},wrap:(x,w)=>doc.splitTextToSize(clean(x),w),
  segs(l,x){let cx=x;l.forEach(s=>{doc.setFont(s.f,s.st);doc.setFontSize(s.sz);doc.text(clean(s.t),cx,P.y);cx+=doc.getTextWidth(clean(s.t))})}};return P}
const mkDoc=fmt=>new window.jspdf.jsPDF({unit:"pt",format:fmt,compress:true});
function contactLine(c,intl){return [intl&&c.phoneIntl?c.phoneIntl:c.phone,c.email,c.linkedin,c.website].filter(Boolean)}
const photoOf=c=>c.photo||S.photoData||"";

function renderUS(m,sc){
  // st: the "coursework and projects" variant (Major lines, availability under education, its own coursework section).
  const doc=mkDoc(m.P.paper),M={l:40,r:40,t:36,b:32},P=Pen(doc,M),F="times",H=m.H,c=m.p.contact,st=m.cwproj;
  const fs={name:20*sc,contact:9.6*sc,head:11.2*sc,body:10*sc},lh=fs.body*1.17,R=P.W-M.r,gap=sc>=1?1:0;
  const photo=photoOf(c),usePhoto=m.J.photo&&photo&&m.J.format==="mx";
  P.y+=fs.name*0.8;P.font(F,"bold",fs.name);P.text(c.name||"Your Name",P.W/2,{align:"center"});P.y+=fs.contact*1.45;
  P.font(F,"normal",fs.contact);P.wrap(contactLine(c).join(" | "),R-M.l).forEach(l=>{P.text(l,P.W/2,{align:"center"});P.y+=fs.contact*1.3});
  if(m.auth){P.text(m.auth,P.W/2,{align:"center"});P.y+=fs.contact*1.3}
  if(m.avail&&!st){P.text(m.avail,P.W/2,{align:"center"});P.y+=fs.contact*1.3}
  if(usePhoto){try{doc.addImage(photo,"JPEG",R-58,M.t,58,74.6)}catch(e){}}
  P.y+=fs.head*0.2;
  const heading=(x,right)=>{P.need(fs.head*2.6);P.y+=fs.head*0.35*gap;P.font(F,"bold",fs.head);P.text(x.toUpperCase(),M.l);if(right)P.text(right,R,{align:"right"});P.y+=fs.head*0.38;doc.setLineWidth(0.8);doc.line(M.l,P.y,R,P.y);P.y+=fs.head*1.05};
  const bullets=arr=>arr.forEach(b=>{P.font(F,"normal",fs.body);const L=P.wrap(b.text||b,R-M.l-10);P.need(L.length*lh);L.forEach((ln,i)=>{if(i===0)P.text("•",M.l);P.text(ln,M.l+10);P.y+=lh})});
  const eh=(left,suffix,right)=>{P.need(lh*2.4);const s=[{t:left,f:F,st:"bold",sz:fs.body}];if(suffix)s.push({t:" | "+suffix,f:F,st:"normal",sz:fs.body});P.segs(s,M.l);if(right){P.font(F,"italic",fs.body);P.text(right,R,{align:"right"})}P.y+=lh};
  const profile=()=>{if(!m.summary)return;heading(H.profile);P.font(F,"normal",fs.body);P.wrap(m.summary,R-M.l).forEach(l=>{P.need(lh);P.text(l,M.l);P.y+=lh});P.y+=lh*0.25};
  if(!st)profile();
  heading(H.education,m.citizenship?H.citizenship+": "+m.citizenship:"");
  m.edu.forEach(e=>{const last=e.majors.reduce((x,y)=>y.end>x?y.end:x,"");const any=e.majors.some(y=>y.expected);
    eh(e.school,"",[e.location,last?(any?H.expected+" ":"")+fmtMonth(last,m.P.dates):""].filter(Boolean).join(" | "));
    if(e.degree){P.font(F,"italic",fs.body);P.text(e.degree,M.l);P.y+=lh}
    const differ=new Set(e.majors.map(y=>y.end)).size>1;P.font(F,"normal",fs.body);
    e.majors.filter(y=>y.name).forEach(y=>{P.text((st?H.major+": ":"")+y.name+(differ&&y.end?" ("+(st?H.expected.toLowerCase():H.exp)+" "+fmtMonth(y.end,m.P.dates)+")":""),M.l);P.y+=lh});
    if(e.gpa){P.text(H.gpa+": "+e.gpa,M.l);P.y+=lh}
    if(!st)e.majors.forEach(y=>{if(y.cw.length){P.font(F,"bold",fs.body);const lab=H.coursework+(e.majors.length>1?" ("+y.name+")":"")+": ";const lw=P.w(lab);P.text(lab,M.l);P.font(F,"normal",fs.body);
      const words=P.wrap(y.cw.join(", "),R-M.l-lw);const first=words[0];P.text(first,M.l+lw);P.y+=lh;const rest=words.slice(1).join(" ");if(rest)P.wrap(rest,R-M.l).forEach(l=>{P.need(lh);P.text(l,M.l);P.y+=lh})}});
  });
  if(st&&m.avail){P.font(F,"normal",fs.body);P.text(m.avail,M.l);P.y+=lh}
  P.y+=lh*0.25;
  if(st)profile();
  const sec=(title,list,proj)=>{if(!list.length)return;heading(title);list.forEach(e=>{eh(e.org,e.orgSuffix,proj?e.date:[e.location,e.date].filter(Boolean).join(" | "));if(e.role){P.font(F,"italic",fs.body);P.text(e.role,M.l);P.y+=lh}bullets(e.bullets)});P.y+=lh*0.25};
  if(st){
    const cws=m.edu.flatMap(e=>e.majors.filter(y=>y.cw.length).map(y=>({e,y}))),proj=m.sections.projects;
    if(cws.length||proj.length){heading(H.cwproj);cws.forEach(({e,y})=>{eh(y.name,e.short,"");bullets([y.cw.join(", ")])});
      proj.forEach(e=>{eh(e.org,e.orgSuffix,e.date);if(e.role){P.font(F,"italic",fs.body);P.text(e.role,M.l);P.y+=lh}bullets(e.bullets)});P.y+=lh*0.25}
    sec(H.experience,m.sections.experience);sec(H.leadership,m.sections.leadership);
  }else{sec(H.experience,m.sections.experience);sec(H.projects,m.sections.projects,true);sec(H.leadership,m.sections.leadership)}
  heading(H.skills);
  const line=(lab,val)=>{if(!val)return;P.font(F,"bold",fs.body);const lw=P.w(lab+": ");const L=P.wrap(val,R-M.l-lw);P.need(L.length*lh);P.text(lab+":",M.l);P.font(F,"normal",fs.body);L.forEach((ln,i)=>{P.text(ln,i===0?M.l+lw:M.l);P.y+=lh})};
  m.skills.forEach(s=>line(s.cat,s.items.join(", ")));
  line(H.languages,m.langs.map(l=>l.name+(l.level?" ("+l.level+")":"")).join(" • "));
  line(H.certs,m.certs.join(", "));
  return {doc,pages:P.pages};
}

function renderEU(m,sc){
  const doc=mkDoc(m.P.paper),M={l:50,r:46,t:44,b:44},P=Pen(doc,M),F="helvetica",H=m.H,c=m.p.contact;
  const fs={name:21*sc,sub:10.5*sc,head:10.8*sc,body:9.8*sc,small:8.8*sc},lh=fs.body*1.3,R=P.W-M.r,DC=M.l,CX=M.l+100*sc+8,ACC=[22,64,76],G=[90,100,98];
  const photo=photoOf(c),usePhoto=m.J.photo&&photo&&m.J.format!=="eu";const phW=86,phH=110.6,TR=usePhoto?R-phW-16:R;
  P.y+=fs.name*0.85;P.font(F,"bold",fs.name);doc.setTextColor(20,26,24);P.text(c.name||"Your Name",M.l);P.y+=fs.sub*1.6;
  if(m.headline){P.font(F,"normal",fs.sub);doc.setTextColor(...ACC);P.wrap(m.headline,TR-M.l).forEach(l=>{P.text(l,M.l);P.y+=fs.sub*1.3})}doc.setTextColor(30,36,34);
  P.y+=3;P.font(F,"normal",fs.small);const sm=x=>P.wrap(x,TR-M.l).forEach(l=>{P.text(l,M.l);P.y+=fs.small*1.45});
  sm(contactLine(c,true).join("  ·  "));
  const pd=[c.location,m.auth||(m.citizenship?H.citizenship+": "+m.citizenship:""),c.birthDate&&m.J.format==="de"?H.born+": "+c.birthDate:""].filter(Boolean);if(pd.length)sm(pd.join("  ·  "));
  if(m.avail){P.font(F,"bold",fs.small);sm(m.avail)}
  if(usePhoto){try{doc.addImage(photo,"JPEG",R-phW,M.t,phW,phH)}catch(e){}P.y=Math.max(P.y,M.t+phH+8)}
  P.y+=8;
  const heading=x=>{P.need(fs.head*3.2);P.y+=fs.head*0.5;P.font(F,"bold",fs.head);doc.setTextColor(...ACC);P.text(x.toUpperCase(),M.l);doc.setTextColor(30,36,34);P.y+=fs.head*0.45;doc.setDrawColor(...ACC);doc.setLineWidth(0.7);doc.line(M.l,P.y,R,P.y);doc.setDrawColor(0);P.y+=fs.head*1.15};
  const dateCol=x=>{if(!x)return;P.font(F,"normal",fs.small);doc.setTextColor(...G);P.wrap(x,CX-DC-8).forEach((l,i)=>doc.text(clean(l),DC,P.y+i*fs.small*1.3));doc.setTextColor(30,36,34)};
  const para=(x,st,size,X)=>{P.font(F,st||"normal",size||fs.body);const L=P.wrap(x,R-(X||CX));P.need(L.length*lh);L.forEach(l=>{P.text(l,X||CX);P.y+=lh})};
  const grey=x=>{doc.setTextColor(...G);para(x,"normal");doc.setTextColor(30,36,34)};
  const bullets=arr=>arr.forEach(b=>{P.font(F,"normal",fs.body);const L=P.wrap(b.text,R-CX-10);P.need(L.length*lh);L.forEach((l,i)=>{if(i===0)P.text("•",CX);P.text(l,CX+10);P.y+=lh})});
  if(m.summary){heading(H.profile);para(m.summary,"normal",fs.body,M.l);P.y+=2}
  heading(H.education);
  m.edu.forEach(e=>e.majors.forEach((y,i)=>{if(!y.name&&!e.school)return;const d=(y.start?fmtMonth(y.start,"num")+" – ":"")+(y.end?(y.expected?H.exp+" ":"")+fmtMonth(y.end,"num"):"");
    P.need(lh*3);dateCol(d);para([e.degree,y.name].filter(Boolean).join(", ")||e.school,"bold");grey([e.school,e.location].filter(Boolean).join(", "));
    if(y.cw.length)para(H.coursework+": "+y.cw.join(", "),"normal");if(i===e.majors.length-1&&e.gpa)para(H.gpa+": "+e.gpa,"normal");P.y+=lh*0.45}));
  [["experience",H.experience],["projects",H.projects],["leadership",H.leadership]].forEach(([k,title])=>{const list=m.sections[k];if(!list.length)return;heading(title);
    list.forEach(e=>{P.need(lh*3);dateCol(e.date);const org=e.org+(e.orgSuffix?", "+e.orgSuffix:"");para(e.role||org,"bold");const sub=e.role?[org,e.location].filter(Boolean).join(", "):e.location;if(sub)grey(sub);bullets(e.bullets);P.y+=lh*0.45})});
  heading(H.skills);
  m.skills.forEach(s=>{P.need(lh*2);dateCol(s.cat);para(s.items.join(", "),"normal");P.y+=lh*0.2});
  if(m.langs.length){P.need(lh*2);dateCol(H.languages);para(m.langs.map(l=>l.name+(l.level?": "+l.level:"")).join("  ·  "),"normal");P.y+=lh*0.2}
  if(m.certs.length){P.need(lh*2);dateCol(H.certs);para(m.certs.join(", "),"normal")}
  if(m.J.sign){P.y+=lh*1.2;P.need(lh*3);const d=new Date();P.font(F,"normal",fs.body);P.text((c.location||"").split(",")[0]+", "+String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear(),M.l);P.y+=lh*1.6;P.font(F,"italic",fs.body+1);P.text(c.name,M.l)}
  const n=doc.getNumberOfPages();if(n>1)for(let i=1;i<=n;i++){doc.setPage(i);doc.setFont(F,"normal");doc.setFontSize(7.5);doc.setTextColor(...G);doc.text(clean(c.name+"  ·  "+H.page+" "+i+"/"+n),R,P.H-22,{align:"right"})}
  return {doc,pages:P.pages};
}
function produce(){
  const us=PRESETS[S.job.format].layout==="us",target=(us||!S.job.allow2)?1:2;
  const combos=[];[1,.97,.94,.91,.885].forEach(sc=>{for(let d=0;d<=8;d++)combos.push({sc,d,pen:d+(1-sc)*33})});combos.sort((a,b)=>a.pen-b.pen);
  let last=null;for(const c of combos){const m=buildModel(c.d);if(c.d>0&&m.dropped.length<c.d)continue;const out=(us?renderUS:renderEU)(m,c.sc);last={out,m,sc:c.sc,fits:out.pages<=target};if(last.fits)return last}
  return last;
}
let rt=null;const schedule=()=>{clearTimeout(rt);rt=setTimeout(renderPreview,200)};
async function renderPreview(){
  if(!S.profile||!window.jspdf)return;const seq=++S.seq;let r;
  try{r=produce()}catch(e){console.error(e);$("#fit").textContent=t("renderError");$("#fit-note").textContent=String(e.message||e);return}
  S.lastPdf=r.out.doc;const P=PRESETS[S.job.format];const f=$("#fit");f.className="fit "+(r.fits?"ok":"over");
  $("#dim").textContent=P.paper==="letter"?"215.9 × 279.4 mm · US Letter":"210 × 297 mm · A4";
  f.textContent=t(r.out.pages===1?"page1":"pagesN",{n:r.out.pages})+" · "+t(r.fits?"fits":"tooLong");
  const notes=[];if(r.sc<1)notes.push(t("scaled",{n:Math.round(r.sc*100)}));if(r.m.dropped.length)notes.push(t("dropped",{n:r.m.dropped.length}));if(!r.fits)notes.push(t("stillLong"));
  if(S.job.photo&&P.photo&&!photoOf(S.profile.contact))notes.push(t("noPhoto"));
  $("#fit-note").textContent=notes.join(" ");
  const lib=window.pdfjsLib,box=$("#sheets");if(!lib){box.innerHTML='<div class="sheet-empty">'+esc(t("noPreview"))+"</div>";return}
  try{lib.GlobalWorkerOptions.workerSrc=window.PDFJS_WORKER;const pdf=await lib.getDocument({data:r.out.doc.output("arraybuffer"),isEvalSupported:false}).promise;if(seq!==S.seq)return;
    const frag=document.createDocumentFragment();for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i),vp=pg.getViewport({scale:2}),cv=document.createElement("canvas");cv.width=vp.width;cv.height=vp.height;cv.setAttribute("aria-label","CV page "+i);await pg.render({canvasContext:cv.getContext("2d"),viewport:vp}).promise;frag.appendChild(cv)}
    if(seq===S.seq)box.replaceChildren(frag)}catch(e){console.error(e);box.innerHTML='<div class="sheet-empty">'+esc(e.message)+"</div>"}
}

/* ---------- files ---------- */
function saveFile(name,blob){
  if(HOST.downloads){HOST.downloads.save({filename:name,data:blob}).then(()=>toast(t("savedFile",{f:name}))).catch(e=>toast(e&&e.code==="declined"?t("dlCancelled"):t("dlFail",{e:(e&&(e.message||e.code))||"?"})));return}
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500)}
const slug=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^\w]+/g,"_").replace(/^_|_$/g,"");
function fileName(kind){const tag={us:"Resume",de:"Lebenslauf",eu:"CV",es:"CV",mx:"CV"}[S.job.format];return [kind==="letter"?(S.job.format==="de"?"Anschreiben":"Cover_Letter"):tag,slug(S.profile.contact.name),slug(S.job.company)].filter(Boolean).join("_")+".pdf"}
async function pdfText(file){const lib=window.pdfjsLib;lib.GlobalWorkerOptions.workerSrc=window.PDFJS_WORKER;const pdf=await lib.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise;let out="";for(let i=1;i<=pdf.numPages;i++){const pg=await pdf.getPage(i);const tc=await pg.getTextContent();let lastY=null;tc.items.forEach(it=>{const y=it.transform[5];if(lastY!==null&&Math.abs(y-lastY)>2)out+="\n";else if(lastY!==null)out+=" ";out+=it.str;lastY=y});out+="\n\n"}return out.replace(/[ \t]+/g," ").trim()}
function photoFrom(file){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const W=420,Hh=540,ar=W/Hh;let sw=img.width,sh=img.height,sx=0,sy=0;if(sw/sh>ar){sw=sh*ar;sx=(img.width-sw)/2}else{sh=sw/ar;sy=Math.max(0,(img.height-sh)*0.25)}const c=document.createElement("canvas");c.width=W;c.height=Hh;const g=c.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,W,Hh);g.drawImage(img,sx,sy,sw,sh,0,0,W,Hh);res(c.toDataURL("image/jpeg",0.85))};img.onerror=rej;img.src=URL.createObjectURL(file)})}
async function copy(text){try{await navigator.clipboard.writeText(text);toast(t("copied"))}catch(e){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(t("copied"))}catch(x){toast(t("copyFail"))}ta.remove()}}
function parseJSON(txt){txt=String(txt||"").trim();const f=txt.match(/```(?:json)?\s*([\s\S]*?)```/);if(f)txt=f[1];const a=txt.indexOf("{"),b=txt.lastIndexOf("}");if(a<0||b<a)throw new Error("no JSON");return JSON.parse(txt.slice(a,b+1))}

/* ---------- Claude (private edition only) ---------- */
let aiCtl=null;
function claudeError(e){const c=e&&e.code;return c==="not_granted"?t("claudeOff"):c==="rate_limited"?t("claudeBusy"):c==="cancelled"||(e&&e.name==="AbortError")?t("stopped"):c==="invalid_json"?t("claudeBad"):t("claudeFail",{e:(e&&(e.message||c))||"?"})}
async function askClaude(prompt){aiCtl=new AbortController();return HOST.sample.json(prompt,{signal:aiCtl.signal,modelTier:"default"})}
function busy(btn,on,label){btn.disabled=on;btn.innerHTML=on?'<span class="spin" aria-hidden="true"></span> '+esc(label):esc(t(btn.dataset.i))}

/* ---------- AI prompts ---------- */
const SCHEMA=`{"contact":{"name":"","email":"","phone":"","linkedin":"","website":"","location":"City, Country","citizenship":""},
"headline":"one-line professional headline",
"education":[{"school":"","location":"","degree":"e.g. Bachelor of Science","gpa":"only if stated","majors":[{"name":"","field":"one of: ${FAMILIES.map(f=>f.id).join(", ")}","start":"YYYY-MM","end":"YYYY-MM","expected":true,"coursework":[{"name":"","tags":["tag"]}]}]}],
"entries":[{"section":"experience | projects | leadership","org":"","role":"","location":"","start":"YYYY-MM","end":"YYYY-MM or empty if current","tags":["tag"],"bullets":[{"text":"","tags":["tag"]}]}],
"skills":[{"cat":"category name","items":[{"name":"","tags":["tag"]}]}],
"languages":[{"name":"","level":"e.g. Native, C1, B2"}],
"certifications":[{"name":"","tags":[]}]}`;
function importPrompt(text){return `Convert the CV / LinkedIn profile text below into JSON for a CV tool.

RULES
- Copy facts only. Do not invent, improve, or add anything that is not in the text. Leave a field empty ("") if it is missing.
- Keep each bullet's wording and every number exactly as written. If an entry has a paragraph instead of bullets, split it into sentences as bullets.
- Mark service or retail jobs with the tag "service".
- Tags must come from this list only: ${TAGS.join(", ")}.
- Dates as YYYY-MM. Reply with only the JSON, no other text.

JSON SHAPE
${SCHEMA}

TEXT
${text.slice(0,30000)}`}
function factsFor(){const p=S.profile;return {headline:p.headline,education:p.education.map(e=>({school:e.school,degree:e.degree,gpa:e.gpa,majors:e.majors.map(m=>({name:m.name,end:m.end,coursework:m.coursework.map(c=>c.name)}))})),entries:p.entries.map(e=>({section:e.section,org:e.org,role:e.role,dates:range(e,"en",HEAD.en),bullets:e.bullets.filter(b=>b.text).map(b=>({id:b.id,text:b.text}))})),skills:p.skills.map(c=>({cat:c.cat,items:c.items.map(i=>i.name)})),languages:p.languages,certifications:p.certifications.map(c=>c.name),extraFacts:p.answers.filter(a=>a.have).map(a=>a.keyword+": "+a.answer)}}
function tailorPrompt(){
  const J=S.job,P=PRESETS[J.format],lang={en:"English",de:"German",es:"Spanish"}[P.head];
  const major=allMajors().find(m=>m.id===J.track);
  return `You tailor a student's CV to one job posting. The student will send this CV to a real employer, so accuracy matters more than polish.

HARD RULES
- Use ONLY facts in FACTS. Never add a tool, skill, number, responsibility, result or employer that is not stated there. Do not inflate ("helped" must not become "led").
- You may reorder, shorten, and reword bullets, and use the posting's terminology ONLY where it truthfully names the same thing the bullet describes.
- Keep every number exactly. Start each bullet with a strong verb. Max 230 characters per bullet.
- Write the bullets and profile in ${lang}.${P.head!=="en"?` Also return "translations": an object mapping each role title, course name, skill name, skill category and the headline from FACTS to ${lang} (keep tool and product names unchanged).`:""}

TASK
Target: ${J.company||"(company not given)"}, ${J.role||"(position not given)"}. CV style: ${{us:"US one-page résumé",de:"German Lebenslauf",eu:"European CV in English",es:"Spanish CV",mx:"Mexican / Latin American CV"}[J.format]}.${major?" Lead degree: "+major.name+".":""}
1. For each entry pick the most relevant bullets (best first; 3–4 for the most relevant job, 1–3 for others) and return them, reworded only if it improves the match. Use the bullet ids from FACTS.
2. Give tag weights 0–3 for: ${TAGS.join(", ")}.
3. Draft a 2-sentence profile statement from the facts only (no clichés such as "passionate" or "hard-working").
4. List the posting's important requirements the facts do NOT show, each with one short question for the student.

Reply with only JSON:
{"bullets":[{"id":"...","text":"..."}],"tagWeights":{"design":2},"summary":"...","gaps":[{"requirement":"...","question":"..."}],${P.head!=="en"?'"translations":{"...":"..."},':""}"note":"one sentence on the angle you took"}

FACTS
${JSON.stringify(factsFor())}

POSTING
${(J.posting||"").slice(0,12000)}`}
/* Cover letters: written only when the application asks, in the student's own voice, from FACTS only. */
const VOICE_RULES=`- Sound like the student wrote it: a real engineering student, direct and practical. Plain everyday words, short and medium sentences, first person. Contractions are fine.
- Lead with what they did and what they want to learn. No flattery of the company, no big claims about its mission they did not make themselves.
- One idea per paragraph. No em dashes, no rhetorical questions, no lists of three adjectives, no "not only... but also", no sentence that only summarizes the one before.
- Never use these words or phrases (or their translations): passionate, thrilled, excited to, eager, leverage, synergy, dynamic, fast-paced, cutting-edge, innovative, spearhead, delve, testament, honed, align(s) perfectly, I am confident, I am writing to, great fit, invaluable, furthermore, moreover, additionally, in conclusion, journey, unique opportunity.`;
const voiceOf=()=>{const v=S.profile.voice||{};return {notes:(v.notes||"").trim()||(window.CVW_VOICE||""),sample:(v.sample||"").trim()}};
const LETTER_LANG={en:"English",es:"Spanish",de:"German"};
function letterPrompt(json){const J=S.job,P=PRESETS[J.format],v=voiceOf(),why=(J.why||"").trim();return `Write a cover letter for this job application, as the student.

RULES
- Use ONLY facts in FACTS and WHY. Do not invent experience, numbers, tools, courses, feelings or reasons. If the posting wants something FACTS cannot back, leave it out and add a short question for the student to "questions".
- Write in ${LETTER_LANG[P.head]||"English"}. ${P.head==="de"?"German Anschreiben conventions, Sie-Form, 1 page.":"200–330 words, 3–4 short paragraphs, US business letter."}
- Paragraph 1: the position and the main reason they fit. Middle: one or two concrete examples from FACTS that match what the posting asks for, with their real numbers. Last: availability${J.avail?" ("+J.avail+")":""}, work authorization if FACTS has it, and a short plain close.
- ${why?"WHY is the student's own reason for this company. Keep their ideas and as much of their wording as you can; fix only grammar and spelling, and translate if needed.":"WHY is empty: do not claim any personal reason or feeling about the company. Talk about the work described in the posting instead."}
- Salutation: use a name only if the posting gives one; otherwise "Dear Hiring Manager," (or the usual one for the language). End with a plain sign-off and the name ${S.profile.contact.name||""}.
- No header, address or date; the tool adds those.

VOICE
${VOICE_RULES}${v.notes?"\n- How this student writes: "+v.notes:""}${v.sample?"\n- A sample of their own writing (copy its tone, not its content):\n\"\"\"\n"+v.sample.slice(0,1500)+"\n\"\"\"":""}

${json?'Reply with only JSON: {"letter":"the letter from salutation to name, paragraphs separated by blank lines","questions":["short question for the student", "..."]}':"Reply with the letter text, then a line \"QUESTIONS:\" with anything you needed but FACTS did not have."}

Company: ${J.company||"(not given)"}. Position: ${J.role||"(not given)"}.

WHY
${why||"(empty)"}

FACTS
${JSON.stringify(factsFor())}

POSTING
${(J.posting||"").slice(0,12000)}`}

/* ---------- import ---------- */
async function startImport(){
  const f=$("#imp-file").files[0];let text=$("#imp-text").value.trim();
  if(f){try{text=await pdfText(f)}catch(e){toast(t("pdfFail"));return}}
  if(text.length<80){toast(t("needText"));return}
  S.pendingImport=importPrompt(text);$("#imp-prompt").value=S.pendingImport;impMsg("");$("#imp-ai").hidden=false;$("#imp-len").textContent=t("readChars",{n:text.length.toLocaleString()});$("#imp-ai").scrollIntoView({behavior:"smooth"});
}
function impMsg(x,err){const el=$("#imp-msg");el.hidden=!x;el.textContent=x||"";el.classList.toggle("err",!!err)}
function applyImport(d){
  if(!d){try{d=parseJSON($("#imp-answer").value)}catch(e){impMsg(t("badJSON"),true);return}}
  const p=normalize(d);p.entries.forEach(e=>{if(!e.show)e.show={us:true,eu:true};if(e.tags.includes("service"))e.show={us:true,eu:false}});
  if(S.profile){keepPrev(S.profile);if(S.profile.contact.photoAssetId&&!p.contact.photo)p.contact.photoAssetId=S.profile.contact.photoAssetId}
  S.profile=p;saveProfile();S.job={...DEF_JOB};saveJob();enterApp("profile");toast(t("imported"));
}
// The profile an import replaced stays recoverable (in this browser, and in the account for the private edition).
function keepPrev(p){S.prev=JSON.parse(JSON.stringify(p));store.set("cvw.profile.prev",S.prev);if(HOST.db)S.docExtra={...S.docExtra,prevJson:JSON.stringify(S.prev)}}
async function importClaude(){const b=$("#imp-claude");busy(b,true,t("claudeReading"));impMsg("");
  try{const r=await askClaude(S.pendingImport);if(!r||typeof r!=="object")throw {code:"invalid_json"};applyImport(r)}catch(e){impMsg(claudeError(e),true)}finally{busy(b,false)}}

/* ---------- tailor UI ---------- */
function syncSeg(id,v){document.querySelectorAll(id+" button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.v===v)))}
function renderTrack(){const ms=allMajors().filter(m=>m.name);$("#track-row").hidden=ms.length<2;if(ms.length<2){S.job.track=ms[0]?ms[0].id:"all";return}
  $("#s-track").innerHTML=ms.map(m=>`<button data-v="${esc(m.id)}" aria-pressed="false">${esc(m.name)}</button>`).join("")+`<button data-v="all" aria-pressed="false">${esc(t("bothEqual"))}</button>`;
  if(!ms.some(m=>m.id===S.job.track))S.job.track="all";syncSeg("#s-track",S.job.track)}
function renderFamilies(){$("#s-family").innerHTML=FAMILIES.map(f=>`<button class="chip" data-id="${f.id}" aria-pressed="${S.job.families.includes(f.id)}">${esc(t("fam_"+f.id))}</button>`).join("")}
function renderToggles(){const lk=PRESETS[S.job.format].layout==="us"?"us":"eu";$("#entry-toggles").innerHTML='<span class="small muted" style="font-weight:600">'+esc(t("include"))+"</span>"+S.profile.entries.map(e=>{const on=S.job.include[e.id]!==undefined?S.job.include[e.id]:!!(e.show&&e.show[lk]);return `<label class="entryrow"><input type="checkbox" data-eid="${esc(e.id)}" ${on?"checked":""}> ${esc(e.org||"—")}${e.role?' <span class="muted">· '+esc(e.role)+"</span>":""}</label>`}).join("")}
function formatNote(){$("#format-note").textContent=t("note_"+S.job.format)}
function companyTip(c){c=(c||"").toLowerCase();if(c.includes("porsche"))return t("tipPorsche");if(/\b(bmw|bosch)\b/.test(c))return t("tipPortal");return ""}
function renderKeywords(){
  const a=analyze(),el=$("#kw-area");if(!a){el.innerHTML='<p class="muted small" style="margin:0">'+esc(t("kwEmpty"))+"</p>";return}
  const done=new Set(S.profile.answers.map(x=>x.keyword));const miss=a.missing.filter(h=>!done.has(h.l)&&!["Mandatory internship","Work authorization"].includes(h.l));
  let h=`<div class="small">${t("kwCount",{a:"<b>"+a.have.length+"</b>",b:"<b>"+a.hits.length+"</b>"})}</div>`;
  if(/verhandlungssicher|fließend\w*\s+deutsch|fluent\s+german|sehr gute\s+deutsch/i.test(S.job.posting))h+=`<div class="status err">${esc(t("fluentGerman"))}</div>`;
  if(a.hits.some(k=>k.l==="Work authorization"))h+=`<div class="status">${esc(t("authAsked"))}</div>`;
  if(a.hits.some(k=>k.l==="Mandatory internship"))h+=`<div class="status">${esc(t("mandatory"))}</div>`;
  const tip=companyTip(S.job.company);if(tip)h+=`<div class="status">${esc(tip)}</div>`;
  if(a.have.length)h+=`<div class="chips">${a.have.map(k=>`<span class="chip good">${esc(k.l)}</span>`).join("")}</div>`;
  if(miss.length){h+=`<div class="small" style="margin-top:4px"><b>${esc(t("notInProfile"))}</b> ${esc(t("answerTrue"))}</div>`;
    h+=miss.map(k=>`<div class="q"><b>${esc(k.l)}</b><span class="small muted">${esc(t("qGeneric",{x:k.l}))}</span><input type="text" data-kw="${esc(k.l)}" placeholder="${esc(t("leaveEmpty"))}"><div class="row"><button class="btn small" data-addkw="${esc(k.l)}">${esc(t("addSkill"))}</button><button class="btn small" data-nokw="${esc(k.l)}">${esc(t("dontHave"))}</button></div></div>`).join("")}
  el.innerHTML=h;
}
function addAnswer(kw,answer,have){const p=S.profile;p.answers.push({keyword:kw,answer,have,date:new Date().toISOString().slice(0,10)});
  if(have){const k=KB.find(x=>x.l===kw);let cat=p.skills.find(c=>c.cat===t("otherSkills"));if(!cat){cat={cat:t("otherSkills"),items:[]};p.skills.push(cat)}cat.items.push({name:kw.replace(/ \/.*$/,""),tags:k?k.t:[]})}
  saveProfile();renderKeywords();schedule()}
async function tailorClaude(){if((S.job.posting||"").trim().length<40){setStatus(t("pasteFirst"),true);return}
  const b=$("#ai-go");busy(b,true,t("claudeWorking"));$("#ai-stop").hidden=false;setStatus("");
  try{applyAI(await askClaude(tailorPrompt()))}catch(e){setStatus(claudeError(e),!(e&&e.code==="cancelled"))}finally{busy(b,false);$("#ai-stop").hidden=true}}
function applyAI(r){if(!r){try{r=parseJSON($("#ai-answer").value)}catch(e){setStatus(t("badJSON"),true);return}}
  if(!r||!Array.isArray(r.bullets)){setStatus(t("badJSON"),true);return}
  const known=new Set(S.profile.entries.flatMap(e=>e.bullets.map(b=>b.id)));r.bullets=r.bullets.filter(b=>b&&known.has(b.id)&&typeof b.text==="string");
  S.job.ai=r;S.job.reverted={};if(r.summary&&!S.job.summary){S.job.summary=r.summary;$("#o-summary").value=r.summary}saveJob();setStatus(r.note||t("applied"));renderAI();schedule()}
function setStatus(x,err){const s=$("#ai-status");s.hidden=!x;s.textContent=x||"";s.classList.toggle("err",!!err)}
function renderAI(){const ai=S.job.ai,out=$("#ai-out");$("#ai-clear").hidden=!ai;if(!ai){out.innerHTML="";return}
  const by={};S.profile.entries.forEach(e=>e.bullets.forEach(b=>by[b.id]={b,e}));let h="";
  ai.bullets.forEach(b=>{const o=by[b.id];if(!o)return;const same=o.b.text.trim()===b.text.trim(),rev=!!S.job.reverted[b.id];
    h+=`<div class="edit"><div class="row" style="justify-content:space-between"><span class="small muted">${esc(o.e.org)}</span>${same?`<span class="chip">${esc(t("kept"))}</span>`:`<button class="btn small" data-rev="${esc(b.id)}">${esc(rev?t("useAI"):t("useMine"))}</button>`}</div>${same?"":`<div class="was">${esc(o.b.text)}</div>`}<div class="now">${esc(rev?o.b.text:b.text)}</div></div>`});
  if(ai.gaps&&ai.gaps.length)h+=`<div class="small" style="margin-top:6px"><b>${esc(t("aiQuestions"))}</b></div>`+ai.gaps.map(g=>`<div class="q"><b>${esc(g.requirement)}</b><span class="small muted">${esc(g.question)}</span></div>`).join("");
  out.innerHTML=h}

/* ---------- cover letter ---------- */
const LETTER_RE=/cover\s*letter|letter\s+of\s+(motivation|interest)|motivation(al)?\s+letter|anschreiben|motivationsschreiben|carta\s+de\s+(presentaci[oó]n|motivaci[oó]n)/i;
function letterAsked(txt){txt=String(txt||"");const m=txt.match(LETTER_RE);if(!m)return "";const near=txt.slice(Math.max(0,m.index-120),m.index+160);
  if(/optional|not required|if you (wish|like)|encouraged|preferred|opcional|optional|freiwillig/i.test(near))return "optional";return "yes"}
function renderLetterAsk(){const J=S.job,det=letterAsked(J.posting),v=J.letterAsk||det;syncSeg("#cl-ask",v);
  $("#cl-det").textContent=t(v==="yes"?"clDetYes":v==="optional"?"clDetOpt":v==="no"?"clDetNo":"clDetNone");
  $("#cl-body").hidden=!(v==="yes"||v==="optional"||(J.letter||"").trim())}
const AI_TELLS={en:["passionate","thrilled","excited to","eager to","leverage","synergy","dynamic","fast-paced","cutting-edge","innovative","spearhead","delve","testament","honed","aligns perfectly","align perfectly","i am confident","i am writing to","great fit","perfect fit","invaluable","furthermore","moreover","additionally","in conclusion","journey","unique opportunity","not only","esteemed","i believe i would","proven track record","hit the ground running","team player","detail-oriented","results-driven"],
  es:["apasionado","apasionada","me complace","por medio de la presente","sinergia","dinámico","vanguardia","innovador","no solo","además,","en conclusión","oportunidad única","sería un gran","estimado equipo de"],
  de:["mit großem interesse","hiermit bewerbe ich mich","leidenschaft","leidenschaftlich","synergie","dynamisch","innovativ","darüber hinaus","nicht nur","abschließend","einzigartige gelegenheit","teamplayer"]};
function letterCheck(txt){const out=[];txt=String(txt||"");if(!txt.trim())return out;const low=txt.toLowerCase();
  const lists=[...new Set([...AI_TELLS.en,...AI_TELLS.es,...AI_TELLS.de])];lists.forEach(w=>{if(low.includes(w))out.push(t("chkPhrase",{p:w}))});
  if(/—/.test(txt))out.push(t("chkDash"));
  const words=(txt.match(/\S+/g)||[]).length,P=PRESETS[S.job.format];if(P.head!=="de"&&(words<170||words>380))out.push(t("chkWords",{n:words}));
  txt.replace(/\n+/g," ").split(/(?<=[.!?])\s+/).forEach(x=>{const n=(x.match(/\S+/g)||[]).length;if(n>34)out.push(t("chkLong",{n,s:x.slice(0,60)+"…"}))});
  const known=(profileText(S.profile)+" "+(S.profile.education||[]).map(e=>e.gpa).join(" ")+" "+(S.job.avail||"")+" "+(S.job.posting||"")+" "+(S.job.why||"")).replace(/,/g,"");
  (txt.match(/\$?\d[\d,.]*\s?%?/g)||[]).map(x=>x.trim().replace(/[.,]$/,"")).filter(x=>!/^(19|20)\d\d$/.test(x)&&!/^\d$/.test(x)).forEach(x=>{if(!known.includes(x.replace(/,/g,"")))out.push(t("chkNum",{p:x}))});
  return [...new Set(out)]}
function renderLetterCheck(){const txt=$("#cl-text").value,el=$("#cl-check");if(!txt.trim()){el.innerHTML="";return}const L=letterCheck(txt);
  el.innerHTML=`<b class="small">${esc(t("clCheck"))}</b>`+(L.length?L.map(x=>`<span class="chip warn">${esc(x)}</span>`).join(""):`<span class="chip good">${esc(t("clCheckOk"))}</span>`)}
function renderLetterQs(){const q=S.job.letterQs||[],el=$("#cl-qs");el.innerHTML=q.length?`<b class="small">${esc(t("clQuestions"))}</b>`+q.map(x=>`<div class="q"><span class="small">${esc(x)}</span></div>`).join(""):""}
function renderLetter(){renderLetterAsk();renderLetterCheck();renderLetterQs()}
async function letterClaude(){if((S.job.posting||"").trim().length<40){toast(t("pasteFirst"));return}const b=$("#cl-claude");busy(b,true,t("claudeLetter"));
  try{const r=await askClaude(letterPrompt(true));const L=r&&(r.letter||r.text);if(typeof L!=="string"||!L.trim())throw {code:"invalid_json"};
    $("#cl-text").value=L.trim();S.job.letter=L.trim();S.job.letterQs=Array.isArray(r.questions)?r.questions.filter(x=>typeof x==="string"&&x.trim()).slice(0,6):[];saveJob();renderLetter()}catch(e){toast(claudeError(e))}finally{busy(b,false)}}
function letterDate(head){const d=new Date();return head==="de"?String(d.getDate()).padStart(2,"0")+"."+String(d.getMonth()+1).padStart(2,"0")+"."+d.getFullYear():head==="es"?d.getDate()+" de "+MONTHS.es[d.getMonth()]+" de "+d.getFullYear():MONTHS.en[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()}
function letterDoc(txt,fsz){
  const P=PRESETS[S.job.format],doc=mkDoc(P.paper),c=S.profile.contact,cvHead=P.layout==="us"&&S.profile.options.letterStyle!=="classic";
  const M=cvHead?{l:72,r:72,t:36,b:54}:{l:64,r:64,t:56,b:56},pen=Pen(doc,M),F=P.layout==="us"?"times":"helvetica",R=pen.W-M.r,lh=fsz*1.38;
  if(cvHead){pen.y+=16;pen.font(F,"bold",20);pen.text(c.name||"",pen.W/2,{align:"center"});pen.y+=14;pen.font(F,"normal",9.6);
    pen.wrap(contactLine(c).join(" | "),R-M.l).forEach(l=>{pen.text(l,pen.W/2,{align:"center"});pen.y+=12.5});pen.y+=22}
  else{pen.y+=16;pen.font(F,"bold",16);pen.text(c.name||"",M.l);pen.y+=16;pen.font(F,"normal",9.5);pen.wrap(contactLine(c).concat(c.location||[]).join("  ·  "),R-M.l).forEach(l=>{pen.text(l,M.l);pen.y+=13});pen.y+=18}
  pen.font(F,"normal",fsz);pen.text(letterDate(P.head),P.head==="de"?R:M.l,P.head==="de"?{align:"right"}:undefined);pen.y+=lh*1.6;
  if(S.job.company){if(P.head==="en"){pen.text(t("hiringTeam"),M.l);pen.y+=lh}pen.text(S.job.company,M.l);pen.y+=lh*1.6}
  txt.split(/\n/).forEach(par=>{if(!par.trim()){pen.y+=lh*0.55;return}pen.wrap(par,R-M.l).forEach(l=>{pen.need(lh);pen.text(l,M.l);pen.y+=lh})});
  return {doc,pages:pen.pages}}
function letterPdf(){const txt=$("#cl-text").value.trim();if(!txt){toast(t("noLetter"));return}
  let r;for(const f of [11,10.5,10]){r=letterDoc(txt,f);if(r.pages===1)break}
  saveFile(fileName("letter"),r.doc.output("blob"))}

/* ---------- applications ---------- */
function saveApplication(){const J=S.job;if(!J.company&&!J.role){toast(t("needCompany"));return}
  const now=new Date().toISOString();let rec=J.appId&&S.apps.find(a=>a.id===J.appId);
  const snap={...J,appId:undefined};
  if(rec){Object.assign(rec,{company:J.company,role:J.role,url:J.url,deadline:J.deadline,format:J.format,updatedAt:now,job:snap})}
  else{rec={id:uid("app"),company:J.company,role:J.role,url:J.url,deadline:J.deadline,format:J.format,status:"Draft",savedAt:now,job:snap};S.apps.push(rec);S.job.appId=rec.id;saveJob()}
  putApp(rec);renderApps();toast(t("savedApp"))}
function dueBadge(d){if(!d)return"";const days=Math.ceil((new Date(d+"T23:59:59")-new Date())/864e5);const cls=days<0?"past":days<=7?"soon":"ok";return `<span class="due ${cls}">${esc(days<0?t("closed"):days===0?t("today"):t("inDays",{n:days}))}</span>`}
function renderApps(){const A=[...S.apps].sort((a,b)=>(a.deadline||"9999").localeCompare(b.deadline||"9999"));const n=s=>A.filter(a=>a.status===s).length;
  $("#stats").innerHTML=[[t("stTailored"),A.length],[t("stApplied"),A.length-n("Draft")],[t("stInterviews"),n("Interview")+n("Offer")],[t("stDue"),A.filter(a=>a.status==="Draft"&&a.deadline&&(new Date(a.deadline)-new Date())/864e5<=7&&(new Date(a.deadline+"T23:59:59")>new Date())).length]].map(([l,v])=>`<div class="stat"><b>${v}</b><span>${esc(l)}</span></div>`).join("");
  $("#apps-body").innerHTML=A.length?A.map(a=>`<tr><td class="num">${esc(a.deadline||"—")} ${a.status==="Draft"?dueBadge(a.deadline):""}</td><td>${a.url?`<a href="${esc(a.url)}" target="_blank" rel="noopener">${esc(a.company)}</a>`:esc(a.company)}</td><td>${esc(a.role)}</td><td>${esc(t("fmtShort_"+a.format))}</td><td><select data-st="${esc(a.id)}" aria-label="Status">${STATUSES.map(s=>`<option value="${s}" ${s===a.status?"selected":""}>${esc(t("status_"+s))}</option>`).join("")}</select></td><td class="row"><button class="btn small" data-open="${esc(a.id)}">${esc(t("open"))}</button><button class="btn small" data-del="${esc(a.id)}">${esc(t("delete"))}</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty">${esc(t("noApps"))}</td></tr>`}

/* ---------- matches (private edition: filled by the daily scan) ---------- */
const FAM_OLD={production:"mfg",logistics:"log"};
function mDue(d){if(!/^\d{4}-\d{2}-\d{2}$/.test(d||""))return d?`<span class="chip">${esc(d)}</span>`:"";const days=Math.ceil((new Date(d+"T23:59:59")-new Date())/864e5);
  const cls=days<0?"bad":days<=14?"warn":"good";return `<span class="chip ${cls}">${esc(days<0?t("mClosed",{d}):days===0?t("mDueToday"):t("mDue",{d,n:days}))}</span>`}
function renderMatches(){
  const el=$("#m-list");if(!el)return;const n=S.matches.filter(m=>(m.status||"new")==="new").length,b=$("#m-badge");b.hidden=!n;b.textContent=n;
  const f=S.mfilter,st=m=>m.status||"new";
  const L=S.matches.filter(m=>f==="all"||(f==="new"?["new","opened"].includes(st(m)):st(m)===f))
    .sort((a,b)=>(b.foundAt||"").slice(0,10).localeCompare((a.foundAt||"").slice(0,10))||(b.fit||0)-(a.fit||0));
  if(!L.length){el.innerHTML=`<div class="panel empty">${esc(f==="new"?t("mNone"):t("mNoneOther"))}</div>`;return}
  const trk=x=>{const mj=S.profile&&allMajors().find(y=>y.id===x);return mj?mj.name:x==="both"||x==="all"?t("bothEqual"):x};
  el.innerHTML=L.map(m=>{const s=st(m);const flags=(m.flags||[]).map(x=>`<span class="chip ${x.ok===false?"warn":x.ok?"good":""}">${esc(x.text)}</span>`).join("");
    const meta=[t("fmt"+String(m.format||"us").toUpperCase()),m.track?t("mLeads",{x:trk(m.track)}):"",m.foundAt?t("mFound",{d:String(m.foundAt).slice(0,10)}):"",m.source?t("mVia",{s:m.source}):""].filter(Boolean).join(" · ");
    return `<div class="panel match"><div class="top"><div><h3>${esc(m.role)}</h3><div class="small"><span class="co">${esc(m.company)}</span>${m.location?" · "+esc(m.location):""}</div></div>${m.fit?`<span class="score">${esc(t("mFit",{n:m.fit}))}</span>`:""}</div>
      <div class="flags">${mDue(m.deadline)}${m.dates?`<span class="chip">${esc(m.dates)}</span>`:""}${m.pay?`<span class="chip">${esc(m.pay)}</span>`:""}${m.coverLetter==="required"||m.coverLetter==="optional"?`<span class="chip hl">${esc(t(m.coverLetter==="required"?"mLetterReq":"mLetterOpt"))}</span>`:""}${s==="applied"?`<span class="chip good">${esc(t("status_Applied"))}</span>`:""}</div>
      ${m.why&&m.why.length?`<ul>${m.why.map(w=>`<li>${esc(w)}</li>`).join("")}</ul>`:""}${flags?`<div class="flags">${flags}</div>`:""}
      <div class="meta">${esc(meta)}</div>
      <div class="row"><button class="btn primary" data-mopen="${esc(m.id)}">${esc(t("mOpen"))}</button>${m.url?`<a class="btn" href="${esc(m.url)}" target="_blank" rel="noopener">${esc(t("mPosting"))}</a>`:""}${s!=="applied"?`<button class="btn" data-mapplied="${esc(m.id)}">${esc(t("mApplied"))}</button>`:""}${s==="skipped"?`<button class="btn" data-mrestore="${esc(m.id)}">${esc(t("mRestore"))}</button>`:s!=="applied"?`<button class="btn" data-mskip="${esc(m.id)}">${esc(t("mSkip"))}</button>`:""}</div></div>`}).join("")}
function setMatch(id,fields){const m=S.matches.find(x=>x.id===id);if(!m)return;Object.assign(m,fields);
  if(HOST.db)HOST.db.collection("matches").doc(id).update(fields).catch(accountFail);else store.set("cvw.matches",S.matches);renderMatches()}
// The scan stores each match's job in the first dashboard's shape; map it onto the current one.
function matchJob(m){let j={};try{j=typeof m.job==="string"?JSON.parse(m.job):(m.job||{})}catch(e){}
  const out={...DEF_JOB};Object.keys(DEF_JOB).forEach(k=>{if(j[k]!==undefined)out[k]=j[k]});
  out.format=j.format||m.format;out.track=j.track||m.track||"all";
  out.families=j.families||[];fixJob(out);
  const dl=j.deadline||m.deadline||"";Object.assign(out,{company:m.company||j.company||"",role:m.role||j.role||"",url:m.url||j.url||"",posting:j.posting||m.posting||"",deadline:/^\d{4}-\d{2}-\d{2}$/.test(dl)?dl:"",
    include:j.include||{},reverted:j.reverted||{},ai:j.ai||null,matchId:m.id,appId:null,letter:"",why:"",letterQs:[],letterAsk:{required:"yes",optional:"optional",no:"no"}[m.coverLetter]||""});
  if(!out.avail&&S.profile)out.avail=S.profile.availability;return out}
function openMatch(id){const m=S.matches.find(x=>x.id===id);if(!m)return;S.job=matchJob(m);saveJob();loadJobUI();showTab("tailor");if((m.status||"new")==="new")setMatch(id,{status:"opened"})}
function matchApplied(id){const m=S.matches.find(x=>x.id===id);if(!m)return;const J=matchJob(m);
  const rec={id:uid("app"),company:J.company,role:J.role,url:J.url,deadline:J.deadline,format:J.format,status:"Applied",savedAt:new Date().toISOString(),job:{...J,appId:undefined}};
  S.apps.push(rec);putApp(rec);renderApps();setMatch(id,{status:"applied"});toast(t("mMarked"))}

/* ---------- profile editor ---------- */
function renderProfile(){
  const p=S.profile,c=p.contact;
  const fld=(path,label,val,hint,type)=>`<label class="f">${esc(label)}${hint?` <span class="hint">${esc(hint)}</span>`:""}<input type="${type||"text"}" data-path="${esc(path)}" value="${esc(val||"")}"></label>`;
  const tagHint=t("tagsHint")+": "+TAGS.join(", ");
  let h=`<div class="panel step"><h2>${esc(t("pContact"))}</h2><div class="grid2">${fld("contact.name",t("name"),c.name)}${fld("contact.email","Email",c.email)}${fld("contact.phone",t("phone"),c.phone)}${fld("contact.location",t("cityCountry"),c.location)}${fld("contact.linkedin","LinkedIn",c.linkedin)}${fld("contact.website",t("website"),c.website)}${fld("contact.citizenship",t("citizenshipL"),c.citizenship)}${fld("contact.birthDate",t("birth"),c.birthDate,t("birthHint"))}${fld("headline",t("headline"),p.headline)}${fld("availability",t("availDefault"),p.availability)}${fld("workAuthUS",t("authUS"),p.workAuthUS,t("authUSHint"))}${fld("workAuthEU",t("authEU"),p.workAuthEU,t("authEUHint"))}</div>
  <div class="row" style="align-items:flex-start"><div class="photo" style="${photoOf(c)?`background-image:url(${photoOf(c)})`:""}"></div><div class="step" style="gap:6px"><b class="small">${esc(t("photoT"))}</b><span class="small muted">${esc(t("photoD"))}${HOST.assets?" "+esc(t("photoAccount")):""}</span><input type="file" id="ph-file" accept="image/jpeg,image/png,image/webp">${c.photo||c.photoAssetId?`<div><button class="btn small" id="ph-del">${esc(t("removePhoto"))}</button></div>`:""}</div></div></div>`;
  const hd=(p.options.headings||{}).en||{};
  h+=`<div class="panel step"><h2>${esc(t("cvStyle"))}</h2><label class="f">${esc(t("usStyleL"))}<select data-path="options.usStyle"><option value="standard" ${p.options.usStyle!=="cwproj"?"selected":""}>${esc(t("usStd"))}</option><option value="cwproj" ${p.options.usStyle==="cwproj"?"selected":""}>${esc(t("usCw"))}</option></select></label>
    <span class="flabel">${esc(t("headingsL"))} <span class="hint">${esc(t("headingsHint"))}</span></span><div class="grid2">${fld("options.headings.en.experience",t("hExp"),hd.experience,HEAD.en.experience)}${fld("options.headings.en.leadership",t("hLead"),hd.leadership,HEAD.en.leadership)}${fld("options.headings.en.skills",t("hSkills"),hd.skills,HEAD.en.skills)}${fld("options.headings.en.cwproj",t("hCw"),hd.cwproj,HEAD.en.cwproj)}</div>
    <label class="f">${esc(t("letterStyleL"))}<select data-path="options.letterStyle"><option value="cv" ${p.options.letterStyle!=="classic"?"selected":""}>${esc(t("letterCv"))}</option><option value="classic" ${p.options.letterStyle==="classic"?"selected":""}>${esc(t("letterClassic"))}</option></select></label></div>
  <div class="panel step"><h2>${esc(t("pVoice"))}</h2><p class="small muted" style="margin:0">${esc(t("pVoiceD"))}</p>
    <label class="f">${esc(t("voiceNotes"))} <span class="hint">${esc(t("voiceNotesHint"))}</span><textarea rows="3" data-path="voice.notes">${esc(p.voice.notes||window.CVW_VOICE||"")}</textarea></label>
    <label class="f">${esc(t("voiceSample"))} <span class="hint">${esc(t("voiceSampleHint"))}</span><textarea rows="5" data-path="voice.sample">${esc(p.voice.sample)}</textarea></label></div>`;
  p.education.forEach((e,i)=>{h+=`<div class="panel step"><div class="entryhead"><h3>${esc(t("pEducation"))}</h3><button class="btn small" data-deledu="${i}">${esc(t("delete"))}</button></div><div class="grid2">${fld(`education.${i}.school`,t("school"),e.school)}${fld(`education.${i}.location`,t("location"),e.location)}${fld(`education.${i}.degree`,t("degree"),e.degree,t("degreeHint"))}${fld(`education.${i}.gpa`,t("gpa"),e.gpa,t("gpaHint"))}</div>`;
    e.majors.forEach((m,j)=>{h+=`<div class="step" style="border-top:1px dashed var(--line);padding-top:10px"><div class="grid3">${fld(`education.${i}.majors.${j}.name`,t("major"),m.name)}${fld(`education.${i}.majors.${j}.start`,t("start"),m.start,"YYYY-MM")}${fld(`education.${i}.majors.${j}.end`,t("endExp"),m.end,"YYYY-MM")}</div>
      <label class="f">${esc(t("majorField"))}<select data-path="education.${i}.majors.${j}.field"><option value="">—</option>${FAMILIES.map(f=>`<option value="${f.id}" ${m.field===f.id?"selected":""}>${esc(t("fam_"+f.id))}</option>`).join("")}</select></label>
      <label class="f">${esc(t("coursework"))} <span class="hint">${esc(t("courseHint"))}</span><textarea rows="4" data-cw="${i}.${j}">${esc(m.coursework.map(x=>x.name+(x.tags.length?" | "+x.tags.join(", "):"")).join("\n"))}</textarea></label>
      ${e.majors.length>1?`<div><button class="btn small" data-delmaj="${i}.${j}">${esc(t("removeMajor"))}</button></div>`:""}</div>`});
    h+=`<div><button class="btn small" data-addmaj="${i}">${esc(t("addMajor"))}</button></div></div>`});
  h+=`<div><button class="btn" id="add-edu">${esc(t("addEdu"))}</button></div>`;
  p.entries.forEach((e,i)=>{h+=`<div class="panel step"><div class="entryhead"><h3>${esc(e.org||t("newEntry"))}</h3><div class="row"><select data-path="entries.${i}.section" aria-label="Section">${["experience","projects","leadership"].map(s=>`<option value="${s}" ${e.section===s?"selected":""}>${esc(t("sec_"+s))}</option>`).join("")}</select><label class="entryrow"><input type="checkbox" data-show="${i}.us" ${e.show.us?"checked":""}> ${esc(t("onUS"))}</label><label class="entryrow"><input type="checkbox" data-show="${i}.eu" ${e.show.eu?"checked":""}> ${esc(t("onEU"))}</label><button class="btn small" data-delent="${i}">${esc(t("delete"))}</button></div></div>
    <div class="grid3">${fld(`entries.${i}.org`,t("org"),e.org)}${fld(`entries.${i}.role`,t("role"),e.role)}${fld(`entries.${i}.location`,t("location"),e.location)}${fld(`entries.${i}.start`,t("start"),e.start,"YYYY-MM")}${fld(`entries.${i}.end`,t("end"),e.end,t("endHint"))}${fld(`entries.${i}.tags`,t("tags"),(e.tags||[]).join(", "),"",)}</div>
    <div class="step" style="gap:8px"><span class="small muted" style="font-weight:600">${esc(t("bullets"))}</span>${e.bullets.map((b,j)=>`<div class="bul"><textarea data-bt="${i}.${j}" aria-label="Bullet">${esc(b.text)}</textarea><input type="text" data-bg="${i}.${j}" value="${esc(b.tags.join(", "))}" aria-label="Tags" title="${esc(tagHint)}" placeholder="${esc(t("tags"))}"><button class="btn small" data-bdel="${i}.${j}">${esc(t("remove"))}</button></div>`).join("")}<div><button class="btn small" data-badd="${i}">${esc(t("addBullet"))}</button></div></div></div>`});
  h+=`<div class="row"><button class="btn" data-addent="experience">${esc(t("addExp"))}</button><button class="btn" data-addent="projects">${esc(t("addProj"))}</button><button class="btn" data-addent="leadership">${esc(t("addLead"))}</button></div>`;
  h+=`<div class="panel step"><h2>${esc(t("pSkills"))}</h2><p class="small muted" style="margin:0">${esc(t("skillsHint"))}</p><textarea rows="5" id="pf-skills">${esc(p.skills.map(c=>c.cat+": "+c.items.map(i=>i.name).join(", ")).join("\n"))}</textarea>
    <label class="f">${esc(t("languagesL"))} <span class="hint">${esc(t("langHint"))}</span><textarea rows="3" id="pf-langs">${esc(p.languages.map(l=>l.name+(l.level?" | "+l.level:"")).join("\n"))}</textarea></label>
    <label class="f">${esc(t("certsL"))} <span class="hint">${esc(t("oneLine"))}</span><textarea rows="3" id="pf-certs">${esc(p.certifications.map(c=>c.name).join("\n"))}</textarea></label></div>
    <div class="panel step"><p class="small muted" style="margin:0">${esc(tagHint)}</p><div class="row"><button class="btn primary" id="pf-save">${esc(t("saveProfile"))}</button><button class="btn" id="pf-export">${esc(t("backup"))}</button><label class="btn">${esc(t("restore"))}<input type="file" id="pf-import" accept="application/json" hidden></label><button class="btn" id="pf-importpdf">${esc(t("importNew"))}</button>${S.prev?`<button class="btn" id="pf-prev">${esc(t("restorePrev"))}</button>`:""}${PRIVATE?"":`<button class="btn" id="pf-reset">${esc(t("startOver"))}</button>`}</div><div id="reset-confirm" class="status err" hidden>${esc(t("resetQ"))} <button class="btn small" id="reset-yes">${esc(t("resetYes"))}</button></div></div>`;
  $("#prof").innerHTML=h;
}
function setPath(o,path,v){const k=path.split(".");let x=o;k.slice(0,-1).forEach(s=>{if(x[s]==null)x[s]={};x=x[s]});x[k[k.length-1]]=v}
const splitTags=v=>v.split(",").map(x=>x.trim().toLowerCase()).filter(x=>TAGS.includes(x));
function readProfile(){const p=S.profile,q=s=>document.querySelectorAll("#prof "+s);
  q("[data-path]").forEach(i=>{const v=i.value.trim();if(/\.tags$/.test(i.dataset.path))setPath(p,i.dataset.path,splitTags(v));else setPath(p,i.dataset.path,v)});
  q("[data-cw]").forEach(x=>{const [i,j]=x.dataset.cw.split(".").map(Number);p.education[i].majors[j].coursework=x.value.split("\n").map(s=>s.trim()).filter(Boolean).map(s=>{const [n,tg]=s.split("|");return {name:n.trim(),tags:splitTags(tg||"")}})});
  q("[data-bt]").forEach(x=>{const [i,j]=x.dataset.bt.split(".").map(Number);p.entries[i].bullets[j].text=x.value.trim()});
  q("[data-bg]").forEach(x=>{const [i,j]=x.dataset.bg.split(".").map(Number);p.entries[i].bullets[j].tags=splitTags(x.value)});
  q("[data-show]").forEach(x=>{const [i,k]=x.dataset.show.split(".");p.entries[+i].show[k]=x.checked});
  const old={};p.skills.forEach(c=>c.items.forEach(i=>old[i.name]=i));
  const sk=$("#pf-skills");if(sk)p.skills=sk.value.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const ix=l.indexOf(":");return {cat:ix>0?l.slice(0,ix).trim():"Skills",items:(ix>0?l.slice(ix+1):l).split(",").map(x=>x.trim()).filter(Boolean).map(n=>old[n]||{name:n,tags:[]})}});
  const lg=$("#pf-langs");if(lg)p.languages=lg.value.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const [n,lv]=l.split("|").map(x=>(x||"").trim());return {name:n,level:lv||""}});
  const ce=$("#pf-certs");if(ce){const o={};p.certifications.forEach(c=>o[c.name]=c);p.certifications=ce.value.split("\n").map(x=>x.trim()).filter(Boolean).map(n=>o[n]||{name:n,tags:[]})}}

/* ---------- demo profile (fictional) ---------- */
function demoProfile(){return normalize({contact:{name:"Alex Rivera (example)",email:"alex.rivera@example.com",phone:"+1 555 010 0199",linkedin:"linkedin.com/in/example",website:"",location:"Austin, TX, USA",citizenship:"USA"},
  headline:"Mechanical Engineering student focused on manufacturing and product design",workAuthUS:"U.S. citizen; no sponsorship required",workAuthEU:"",availability:"Available May–August 2027",
  education:[{school:"Example State University",location:"Austin, TX",degree:"Bachelor of Science",gpa:"3.6/4.0",majors:[{id:"maj-demo",name:"Mechanical Engineering",field:"design",start:"2024-08",end:"2028-05",expected:true,coursework:[{name:"Statics",tags:["mech"]},{name:"Materials Science",tags:["mfg","quality"]},{name:"Manufacturing Processes",tags:["mfg"]},{name:"Engineering Graphics (CAD)",tags:["design"]},{name:"Statistics for Engineers",tags:["data","quality"]}]}]}],
  entries:[{id:"demo-1",section:"experience",org:"Example Robotics Co.",role:"Engineering Intern",location:"Austin, TX",start:"2026-06",end:"2026-08",tags:["design","mfg"],bullets:[{id:"d1",text:"Redesigned a sheet-metal bracket in SolidWorks, cutting part count from 5 to 2 and assembly time by 30%.",tags:["design","mfg","cost"]},{id:"d2",text:"Built a 3D-printed inspection fixture that reduced measurement time per part from 6 to 2 minutes.",tags:["proto","quality"]},{id:"d3",text:"Logged and analyzed scrap data in Excel to identify the top three defect causes on the assembly line.",tags:["data","quality","mfg"]}]},
    {id:"demo-2",section:"experience",org:"Campus Coffee",role:"Barista",location:"Austin, TX",start:"2025-01",end:"2026-05",tags:["service"],show:{us:true,eu:false},bullets:[{id:"d4",text:"Trained 4 new staff members and handled 200+ orders per shift.",tags:["comms","lead"]}]},
    {id:"demo-3",section:"projects",org:"Formula SAE Team",role:"Chassis Design Member",location:"",start:"2025-09",end:"",tags:["design","mech"],bullets:[{id:"d5",text:"Modeled the rear suspension mounts in SolidWorks and ran FEA to keep the safety factor above 2.0.",tags:["design","research"]},{id:"d6",text:"Machined 12 aluminum parts on a manual mill and CNC lathe for the 2026 car.",tags:["mfg"]}]},
    {id:"demo-4",section:"leadership",org:"Engineers Without Borders, Student Chapter",role:"Logistics Lead",location:"",start:"2025-01",end:"",tags:["log","lead"],bullets:[{id:"d7",text:"Coordinated shipping and inventory for a 3-week water-filter build trip with 15 volunteers.",tags:["log","ops","lead"]}]}],
  skills:[{cat:"CAD & Design",items:[{name:"SolidWorks",tags:["design"]},{name:"AutoCAD",tags:["design"]},{name:"GD&T",tags:["design","quality"]}]},{cat:"Manufacturing",items:[{name:"CNC machining",tags:["mfg"]},{name:"3D printing",tags:["proto"]}]},{cat:"Analysis",items:[{name:"Excel",tags:["data"]},{name:"MATLAB",tags:["data"]},{name:"ANSYS (FEA)",tags:["design","research"]}]}],
  languages:[{name:"English",level:"Native"},{name:"Spanish",level:"B2"}],certifications:[{name:"SolidWorks CSWA",tags:["design"]}]})}

/* ---------- i18n + wiring ---------- */
function applyLang(){document.documentElement.lang=LANG;document.querySelectorAll("[data-i]").forEach(el=>{if(!el.disabled)el.textContent=t(el.dataset.i)});document.querySelectorAll("[data-ih]").forEach(el=>el.innerHTML=t(el.dataset.ih));document.querySelectorAll("[data-iph]").forEach(el=>el.placeholder=t(el.dataset.iph));
  $("#j-company").placeholder=t("phCompany");$("#j-role").placeholder=t("phRole");$("#o-avail").placeholder=t("phAvail");
  if(S.profile){formatNote();renderFamilies();renderTrack();renderToggles();renderKeywords();renderAI();renderApps();renderMatches();if(!$("#tab-profile").hidden)renderProfile()}}
function showTab(x){document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",String(b.dataset.tab===x)));["start","matches","tailor","apps","profile","guide"].forEach(k=>$("#tab-"+k).hidden=k!==x);
  if(x==="start"){const has=!!S.profile;$("#imp-replace").hidden=!has;$("#imp-back").hidden=!has;document.querySelectorAll("[data-fresh]").forEach(e=>e.hidden=has)}
  if(x==="matches")renderMatches();if(x==="profile")renderProfile();if(x==="guide")$("#guide").innerHTML=window.GUIDE_HTML||"";store.set("cvw.tab",x);window.scrollTo(0,0)}
// Jobs saved by the first private dashboard used other ids for tracks and role types.
function fixJob(o){o.format=PRESETS[o.format]?o.format:"us";if(o.track==="both")o.track="all";o.families=[...new Set((o.families||[]).map(f=>FAM_OLD[f]||f).filter(f=>FAMILIES.some(x=>x.id===f)))];
  o.include=o.include||{};o.reverted=o.reverted||{};return o}
function loadJobUI(){syncInputs();renderTrack();renderFamilies();renderToggles();renderKeywords();renderAI();schedule()}
function syncInputs(){const J=S.job;[["#j-company","company"],["#j-role","role"],["#j-deadline","deadline"],["#j-url","url"],["#j-posting","posting"],["#o-avail","avail"],["#o-summary","summary"],["#cl-text","letter"],["#cl-why","why"]].forEach(([id,k])=>$(id).value=J[k]||"");
  [["#o-photo","photo"],["#o-othercourses","othercourses"],["#o-auth","workauth"],["#o-two","allow2"],["#o-sign","sign"]].forEach(([id,k])=>$(id).checked=!!J[k]);syncSeg("#s-format",J.format);formatNote();renderLetter()}
function enterApp(tab){$("#tabs").hidden=false;if(!S.job.avail&&S.profile.availability)S.job.avail=S.profile.availability;syncInputs();renderTrack();renderFamilies();renderToggles();renderKeywords();renderAI();renderApps();showTab(tab||"tailor");schedule()}
function wire(){
  $("#ui-lang").addEventListener("change",e=>{LANG=e.target.value;store.set("cvw.lang",LANG);applyLang();schedule()});
  $("#tabs").addEventListener("click",e=>{const b=e.target.closest("button");if(b)showTab(b.dataset.tab)});
  $("#imp-go").addEventListener("click",startImport);$("#imp-apply").addEventListener("click",()=>applyImport());$("#imp-claude").addEventListener("click",importClaude);$("#imp-cancel").addEventListener("click",()=>showTab("profile"));
  $("#ai-go").addEventListener("click",tailorClaude);$("#ai-stop").addEventListener("click",()=>aiCtl&&aiCtl.abort());$("#cl-claude").addEventListener("click",letterClaude);
  $("#m-filter").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.mfilter=b.dataset.v;syncSeg("#m-filter",S.mfilter);renderMatches()});
  $("#m-list").addEventListener("click",e=>{const d=e.target.dataset||{};if(d.mopen)openMatch(d.mopen);if(d.mskip)setMatch(d.mskip,{status:"skipped"});if(d.mrestore)setMatch(d.mrestore,{status:"opened"});if(d.mapplied)matchApplied(d.mapplied)});
  document.addEventListener("click",e=>{const id=e.target.dataset&&e.target.dataset.copyfrom;if(id)copy($("#"+id).value)});
  $("#start-blank").addEventListener("click",()=>{S.profile=blankProfile();saveProfile();enterApp("profile")});
  $("#start-demo").addEventListener("click",()=>{S.profile=demoProfile();saveProfile();S.job={...DEF_JOB,company:"Example Motors",role:"Manufacturing Engineering Intern",posting:"Manufacturing Engineering Intern, Summer 2027. Support production line improvements, lean manufacturing and continuous improvement projects. Create CAD models and technical drawings in SolidWorks. Analyze quality data in Excel and Minitab, support root cause analysis and FMEA. Requirements: pursuing a degree in Mechanical or Industrial Engineering, experience with CAD and 3D printing, strong communication and teamwork. Must be authorized to work in the U.S."};saveJob();enterApp("tailor")});
  [["#j-company","company"],["#j-role","role"],["#j-url","url"],["#j-deadline","deadline"],["#o-avail","avail"],["#o-summary","summary"],["#cl-text","letter"],["#cl-why","why"]].forEach(([id,k])=>$(id).addEventListener("input",e=>{S.job[k]=e.target.value;saveJob();if(k==="company")renderKeywords();if(k==="letter"){clearTimeout(wire.c);wire.c=setTimeout(renderLetterCheck,300)}else if(k!=="why")schedule()}));
  $("#j-posting").addEventListener("input",e=>{S.job.posting=e.target.value;saveJob();clearTimeout(wire.k);wire.k=setTimeout(()=>{renderKeywords();renderLetterAsk();schedule()},350)});
  $("#cl-ask").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.job.letterAsk=S.job.letterAsk===b.dataset.v?"":b.dataset.v;saveJob();renderLetterAsk()});
  $("#cl-copytext").addEventListener("click",()=>{const v=$("#cl-text").value.trim();if(!v){toast(t("noLetter"));return}copy(v)});
  $("#s-format").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.job.format=b.dataset.v;S.job.include={};S.job.photo=PRESETS[b.dataset.v].photo||S.job.format==="es"||S.job.format==="mx"?S.job.photo:false;syncSeg("#s-format",S.job.format);formatNote();renderToggles();renderLetterCheck();saveJob();schedule()});
  $("#s-track").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;S.job.track=b.dataset.v;syncSeg("#s-track",S.job.track);saveJob();schedule()});
  $("#s-family").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;const i=S.job.families.indexOf(b.dataset.id);if(i>=0)S.job.families.splice(i,1);else S.job.families.push(b.dataset.id);renderFamilies();saveJob();schedule()});
  $("#entry-toggles").addEventListener("change",e=>{const id=e.target.dataset.eid;if(id){S.job.include[id]=e.target.checked;saveJob();schedule()}});
  [["#o-photo","photo"],["#o-othercourses","othercourses"],["#o-auth","workauth"],["#o-two","allow2"],["#o-sign","sign"]].forEach(([id,k])=>$(id).addEventListener("change",e=>{S.job[k]=e.target.checked;saveJob();schedule()}));
  $("#kw-area").addEventListener("click",e=>{const add=e.target.dataset.addkw,no=e.target.dataset.nokw;if(add){const inp=document.querySelector(`[data-kw="${CSS.escape(add)}"]`);const v=(inp&&inp.value||"").trim();if(!v){toast(t("writeHow"));return}addAnswer(add,v,true)}if(no)addAnswer(no,"",false)});
  $("#ai-copy").addEventListener("click",()=>{if((S.job.posting||"").trim().length<40){toast(t("pasteFirst"));return}copy(tailorPrompt())});
  $("#ai-apply").addEventListener("click",()=>applyAI());
  $("#ai-clear").addEventListener("click",()=>{S.job.ai=null;S.job.reverted={};$("#ai-answer").value="";saveJob();setStatus("");renderAI();schedule()});
  $("#ai-out").addEventListener("click",e=>{const id=e.target.dataset.rev;if(id){S.job.reverted[id]=!S.job.reverted[id];saveJob();renderAI();schedule()}});
  $("#cl-copy").addEventListener("click",()=>{if((S.job.posting||"").trim().length<40){toast(t("pasteFirst"));return}copy(letterPrompt())});
  $("#cl-dl").addEventListener("click",letterPdf);
  $("#dl").addEventListener("click",()=>{if(S.lastPdf)saveFile(fileName("cv"),S.lastPdf.output("blob"))});
  $("#save-app").addEventListener("click",saveApplication);
  $("#apps-body").addEventListener("change",e=>{const id=e.target.dataset.st;if(!id)return;const a=S.apps.find(x=>x.id===id);a.status=e.target.value;a.updatedAt=new Date().toISOString();putApp(a);renderApps()});
  $("#apps-body").addEventListener("click",e=>{const o=e.target.dataset.open,d=e.target.dataset.del;
    if(o){const a=S.apps.find(x=>x.id===o);S.job=fixJob({...DEF_JOB,...a.job,appId:a.id});saveJob();loadJobUI();showTab("tailor")}
    if(d){if(e.target.dataset.sure){S.apps=S.apps.filter(x=>x.id!==d);dropApp(d);renderApps()}else{e.target.dataset.sure="1";e.target.textContent=t("sure")}}});
  $("#prof").addEventListener("click",async e=>{const x=e.target,ds=x.dataset,p=S.profile;
    const re=()=>{saveProfile();renderProfile()};
    if(x.id==="pf-save"){readProfile();saveProfile();renderTrack();renderToggles();renderKeywords();schedule();toast(t("saved"))}
    if(x.id==="pf-export"){readProfile();saveProfile();saveFile("cv-workbench-backup.json",new Blob([JSON.stringify({profile:S.profile,apps:S.apps},null,2)],{type:"application/json"}))}
    if(x.id==="pf-reset"){$("#reset-confirm").hidden=false}
    if(x.id==="reset-yes"){["cvw.profile","cvw.apps","cvw.job","cvw.tab"].forEach(k=>{try{localStorage.removeItem(k)}catch(err){}});location.reload()}
    if(x.id==="ph-del"){readProfile();p.contact.photo="";p.contact.photoAssetId="";S.photoData=null;re();schedule()}
    if(x.id==="pf-importpdf"){readProfile();saveProfile(true);showTab("start")}
    if(x.id==="pf-prev"&&S.prev){const cur=S.profile;S.profile=normalize(S.prev);keepPrev(cur);saveProfile(true);enterApp("profile");toast(t("restoredPrev"))}
    if(x.id==="add-edu"){readProfile();p.education.push(normalize({education:[{}]}).education[0]);re()}
    if(ds.deledu){readProfile();p.education.splice(+ds.deledu,1);re()}
    if(ds.addmaj){readProfile();p.education[+ds.addmaj].majors.push({id:uid("maj"),name:"",field:"",start:"",end:"",expected:true,coursework:[]});re()}
    if(ds.delmaj){readProfile();const [i,j]=ds.delmaj.split(".").map(Number);p.education[i].majors.splice(j,1);re()}
    if(ds.addent){readProfile();p.entries.push({id:uid("e"),section:ds.addent,org:"",orgSuffix:"",role:"",location:"",start:"",end:"",label:"",tags:[],show:{us:true,eu:true},bullets:[{id:uid("b"),text:"",tags:[]}]});re()}
    if(ds.delent){readProfile();p.entries.splice(+ds.delent,1);re()}
    if(ds.badd){readProfile();p.entries[+ds.badd].bullets.push({id:uid("b"),text:"",tags:[]});re()}
    if(ds.bdel){readProfile();const [i,j]=ds.bdel.split(".").map(Number);p.entries[i].bullets.splice(j,1);re()}});
  $("#prof").addEventListener("change",async e=>{
    if(e.target.id==="ph-file"&&e.target.files[0]){readProfile();const f=e.target.files[0];
      try{if(HOST.assets){const r=await HOST.assets.upload(f);S.profile.contact.photoAssetId=r.id;S.profile.contact.photo="";await loadPhoto()}else S.profile.contact.photo=await photoFrom(f);saveProfile();renderProfile();schedule()}catch(err){toast(t("photoFail"))}}
    if(e.target.id==="pf-import"&&e.target.files[0]){try{const d=JSON.parse(await e.target.files[0].text());S.profile=normalize(d.profile||d);if(Array.isArray(d.apps)){S.apps=d.apps;S.apps.forEach(putApp)}saveProfile();enterApp("profile");toast(t("restored"))}catch(err){toast(t("badJSON"))}}});
}
async function use(n){try{return window.claude&&window.claude.use?await window.claude.use(n):null}catch(e){return null}}
async function loadPhoto(){S.photoData=null;const id=S.profile&&S.profile.contact.photoAssetId;if(!id||!PRIVATE)return;
  try{const r=await fetch("/_blob/"+id);if(r.ok)S.photoData=await photoFrom(await r.blob())}catch(e){console.warn("photo",e)}}
async function loadAccount(){ // private edition: profile/main {json, updatedAt, legacyJson?, prevJson?}, collections applications and matches
  HOST.db=await use("db");if(!HOST.db)return null;let p=null;
  try{const snap=await HOST.db.doc("profile/main").get();if(snap.exists){const {json,updatedAt,...extra}=snap.data();S.docExtra=extra;
    p=typeof json==="string"?JSON.parse(json):null;if(p&&isLegacy(p)&&!extra.legacyJson)S.docExtra.legacyJson=json;
    if(extra.prevJson){try{S.prev=JSON.parse(extra.prevJson)}catch(e){}}}}catch(e){console.warn("profile",e)}
  try{HOST.db.collection("applications").onSnapshot(q=>{S.apps=q.docs.map(appFromDoc);saveApps();renderApps()},e=>console.warn(e))}catch(e){console.warn(e)}
  try{HOST.db.collection("matches").onSnapshot(q=>{S.matches=q.docs.map(d=>({id:d.id,...d.data()}));renderMatches()},e=>console.warn(e))}catch(e){console.warn(e)}
  return p}
async function boot(){
  LANG=store.get("cvw.lang")||((navigator.language||"en").slice(0,2));if(!I[LANG])LANG="en";$("#ui-lang").value=LANG;
  if(PRIVATE){document.querySelectorAll("[data-private]").forEach(e=>e.hidden=false);$("#edition").dataset.i="edPrivate";$("#privacy").dataset.i="privacyPrivate";$('[data-i="heroText"]').dataset.i="heroTextPrivate"}
  wire();applyLang();
  let p=PRIVATE?await loadAccount():null;
  if(!p)p=store.get("cvw.profile");if(!S.prev)S.prev=store.get("cvw.profile.prev");
  if(!HOST.db){S.apps=store.get("cvw.apps")||[];S.matches=store.get("cvw.matches")||[]}
  const j=store.get("cvw.job");if(j)S.job=fixJob({...DEF_JOB,...j});
  if(p){S.profile=normalize(p);const tab=store.get("cvw.tab");enterApp(tab&&tab!=="start"?tab:(PRIVATE?"matches":"tailor"))}
  else{showTab("start");if(PRIVATE&&!HOST.db)toast(t("loadFail"))}
  if(PRIVATE){[HOST.sample,HOST.downloads,HOST.assets]=await Promise.all([use("sample"),use("downloads"),use("assets")]);
    if(HOST.sample)document.querySelectorAll("[data-claude]").forEach(e=>e.hidden=false);
    if(S.profile){await loadPhoto();if(!$("#tab-profile").hidden)renderProfile();schedule()}}
}
window.__cvw={S,HOST,produce,buildModel,normalize,fromLegacy,matchJob,letterDoc,letterCheck};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
