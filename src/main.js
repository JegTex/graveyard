import './style.css';

async function api(method,url,body){
  const r=await fetch(url,{method,headers:body?{'content-type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
  if(r.status===401){location.href='/login.html';throw new Error('Enter the passcode first.')}
  let data=null;try{data=await r.json()}catch(e){}
  if(!r.ok)throw new Error((data&&data.error)||'Something went wrong ('+r.status+').');
  return data;
}
async function put(path,file){
  if(file.size>4.4*1024*1024)throw new Error('This section is over 4.4 MB, which is more than Vercel accepts in one go. Split or simplify the frame.');
  const r=await fetch('/api/file?path='+encodeURIComponent(path),{method:'POST',headers:{'content-type':file.type||'application/octet-stream'},body:file});
  if(r.status===401){location.href='/login.html';throw new Error('Enter the passcode first.')}
  let d=null;try{d=await r.json()}catch(e){}
  if(!r.ok)throw new Error((d&&d.error)||'Upload failed ('+r.status+').');
  return d;
}

/* ---------- constants ---------- */
const TYPES=['Hero','Nav','Features','About','Testimonials','Pricing','FAQ','CTA','Footer','Gallery','Contact','Other'];
const COLOURS=[['Black','#141414'],['White','#FFFFFF'],['Grey','#9B9B97'],['Beige','#E5D8C2'],['Brown','#7A5236'],['Red','#D6372F'],['Orange','#EC7A2B'],['Yellow','#F2C94C'],['Green','#3C9A5F'],['Teal','#2A9D9A'],['Blue','#2F6FDE'],['Purple','#7D4FD1'],['Pink','#E46AA6']];
const STYLES=['Minimal','Bold','Editorial','Corporate','Playful','Luxury','Tech','Organic','Brutalist','Retro','Photo-led','Type-led','Illustrated','3D','Dark','Light'];
const SORTS=[['new','Newest first'],['old','Oldest first'],['az','Name A–Z']];
const colHex=Object.fromEntries(COLOURS);
const P={search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',all:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',Hero:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 10h8M7 14h5"/>',Nav:'<rect x="3" y="4" width="18" height="5" rx="1.5"/><path d="M7 13h10M7 17h6"/>',Features:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',About:'<circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/>',Testimonials:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',Pricing:'<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8.5" r="1.2"/>',FAQ:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',CTA:'<path d="m5 3 14 7-6 2-2 6L5 3Z"/>',Footer:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 15h18M7 18h4"/>',Gallery:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',Contact:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',Other:'<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',palette:'<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.9 1.2-1.8-.5-1-.2-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10Z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',sort:'<path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',chev:'<path d="m6 9 6 6 6-6"/>'};
const icon=(n,cls)=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('class','i'+(cls?' '+cls:''));s.innerHTML=P[n]||'';return s};
const $=id=>document.getElementById(id);
const el=(tag,props={},...kids)=>{const n=document.createElement(tag);for(const[k,v]of Object.entries(props)){if(v==null)continue;if(k==='class')n.className=v;else if(k==='text')n.textContent=v;else if(k.startsWith('on'))n.addEventListener(k.slice(2),v);else n.setAttribute(k,v)}kids.flat().forEach(c=>c!=null&&c!==false&&n.append(c));return n};

/* ---------- state ---------- */
const assets=true;
let all=[],loaded=false,loadError='';
const F={q:'',type:'All',cols:new Set(),stys:new Set(),yrs:new Set(),sort:'new'};
try{const s=localStorage.getItem('bsides-sort');if(SORTS.some(x=>x[0]===s))F.sort=s}catch(e){}
const payloadCache=new Map();
let hovered=null,current=null;

function toast(msg,bad){const t=$('toast');t.textContent=msg;t.className='toast'+(bad?' bad':'');t.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>t.hidden=true,bad?5200:2600)}

/* ---------- data ---------- */
const cleanTag=s=>String(s).replace(/\s+/g,' ').trim().slice(0,24);
function norm(x){return{id:String(x.id||''),name:String(x.name||'Untitled'),type:TYPES.includes(x.type)?x.type:'Other',colours:Array.isArray(x.colours)?x.colours.filter(c=>colHex[c]):[],style:Array.isArray(x.style)?x.style.map(cleanTag).filter(Boolean):[],client:String(x.client||''),project:String(x.project||''),year:String(x.year||''),notes:String(x.notes||''),link:String(x.link||''),fileKey:String(x.fileKey||''),nodeId:String(x.nodeId||''),thumb:String(x.thumb||''),payload:String(x.payload||''),payloadSize:Number(x.payloadSize)||0,createdAt:Number(x.createdAt)||0}}
const blob=u=>u||'';
const figmaUrl=(key,node)=>key?`https://www.figma.com/design/${key}/${node?'?node-id='+node.replace(':','-'):''}`:'';
const allStyles=()=>{const used=all.flatMap(s=>s.style);return[...STYLES,...[...new Set(used)].filter(s=>!STYLES.includes(s)).sort()]};
const allYears=()=>[...new Set(all.map(s=>s.year).filter(Boolean))].sort().reverse();

/* ---------- filtering ---------- */
function hay(s){return[s.name,s.type,s.client,s.project,s.year,s.notes,...s.colours,...s.style].join(' ').toLowerCase()}
function matches(s,skip){
  if(skip!=='type'&&F.type!=='All'&&s.type!==F.type)return false;
  if(skip!=='cols'&&F.cols.size&&!s.colours.some(c=>F.cols.has(c)))return false;
  if(skip!=='stys'&&F.stys.size&&!s.style.some(c=>F.stys.has(c)))return false;
  if(skip!=='yrs'&&F.yrs.size&&!F.yrs.has(s.year))return false;
  if(F.q){const h=hay(s);for(const tok of F.q.toLowerCase().split(/\s+/).filter(Boolean)){if(!h.includes(tok.replace(/s$/,'')))return false}}
  return true;
}
function sorted(list){const l=[...list];if(F.sort==='old')l.sort((a,b)=>a.createdAt-b.createdAt);else if(F.sort==='az')l.sort((a,b)=>a.name.localeCompare(b.name));else l.sort((a,b)=>b.createdAt-a.createdAt);return l}

/* ---------- sidebar ---------- */
function renderNav(){
  const nav=$('nav');nav.replaceChildren();
  const base=all.filter(s=>matches(s,'type'));
  const item=(key,label,n)=>el('button',{class:'nitem'+(n?'':' zero'),'aria-current':String(F.type===key),onclick:()=>{F.type=key;closeMenu();render();window.scrollTo({top:0})}},icon(key==='All'?'all':key),el('span',{text:label}),el('span',{class:'n',text:String(n)}));
  nav.append(el('div',{class:'glabel',text:'Library'}),item('All','All sections',base.length));
  nav.append(el('div',{class:'glabel',text:'Section types'}));
  TYPES.forEach(t=>nav.append(item(t,t,base.filter(s=>s.type===t).length)));
}

/* ---------- filter pills ---------- */
function pillContent(btn,ic,label,count){btn.replaceChildren(...[icon(ic),el('span',{text:label}),count?el('span',{class:'badge',text:String(count)}):null].filter(Boolean));btn.setAttribute('aria-pressed',String(!!count))}
function renderPills(){
  pillContent($('colBtn'),'palette','Colour',F.cols.size);
  pillContent($('styBtn'),'sparkle','Style',F.stys.size);
  pillContent($('yrBtn'),'cal','Year',F.yrs.size);
  pillContent($('sortBtn'),'sort',SORTS.find(s=>s[0]===F.sort)[1],0);
}
function checkList(panel,items,set,count,swatch){
  panel.replaceChildren(...items.map(n=>{const id='o-'+panel.id+'-'+n.replace(/\W/g,'_');const i=el('input',{type:'checkbox',id});i.checked=set.has(n);i.onchange=()=>{i.checked?set.add(n):set.delete(n);render()};return el('label',{class:'opt',for:id},i,swatch?el('span',{class:'sw',style:'background:'+colHex[n]}):null,el('span',{text:n}),el('span',{class:'n',text:String(count(n))}))}));
  if(!items.length)panel.append(el('div',{class:'opt',text:'Nothing yet'}));
}
function buildPanel(which){
  if(which==='col'){const b=all.filter(s=>matches(s,'cols'));checkList($('colPanel'),COLOURS.map(c=>c[0]),F.cols,n=>b.filter(s=>s.colours.includes(n)).length,true)}
  if(which==='sty'){const b=all.filter(s=>matches(s,'stys'));checkList($('styPanel'),allStyles(),F.stys,n=>b.filter(s=>s.style.includes(n)).length)}
  if(which==='yr'){const b=all.filter(s=>matches(s,'yrs'));checkList($('yrPanel'),allYears(),F.yrs,n=>b.filter(s=>s.year===n).length)}
  if(which==='sort'){$('sortPanel').replaceChildren(...SORTS.map(([k,l])=>el('div',{class:'opt'+(F.sort===k?' sel':''),role:'button',tabindex:'0',onclick:()=>{F.sort=k;try{localStorage.setItem('bsides-sort',k)}catch(e){}closePanels();render()},onkeydown:e=>{if(e.key==='Enter')e.target.click()}},l)))}
}
function closePanels(){document.querySelectorAll('.panel').forEach(p=>p.hidden=true);document.querySelectorAll('.drop>.pill').forEach(b=>b.setAttribute('aria-expanded','false'))}
[['col','colBtn','colPanel'],['sty','styBtn','styPanel'],['yr','yrBtn','yrPanel'],['sort','sortBtn','sortPanel']].forEach(([w,b,p])=>{$(b).onclick=e=>{e.stopPropagation();const open=$(p).hidden;closePanels();if(open){buildPanel(w);$(p).hidden=false;$(b).setAttribute('aria-expanded','true')}}});
document.addEventListener('click',e=>{if(!e.target.closest('.drop'))closePanels()});

function renderActives(){
  const a=$('actives');a.replaceChildren();
  const chip=(label,off,sw)=>a.append(el('span',{class:'achip'},sw?el('span',{class:'sw',style:'background:'+sw}):null,label,el('button',{'aria-label':'Remove '+label,onclick:()=>{off();render()}},icon('x'))));
  if(F.q)chip('“'+F.q+'”',()=>{F.q='';$('q').value=''});
  F.cols.forEach(c=>chip(c,()=>F.cols.delete(c),colHex[c]));
  F.stys.forEach(c=>chip(c,()=>F.stys.delete(c)));
  F.yrs.forEach(c=>chip(c,()=>F.yrs.delete(c)));
  if(a.childElementCount>1)a.append(el('button',{class:'linkbtn',text:'Clear all',onclick:clearFilters}));
}
function clearFilters(){F.q='';$('q').value='';F.cols.clear();F.stys.clear();F.yrs.clear();render()}

/* ---------- main render ---------- */
function stateBox(title,body,extra){return el('div',{class:'state'},el('h2',{text:title}),el('p',{text:body}),extra||null)}
function render(){
  renderNav();renderPills();renderActives();
  $('h1').replaceChildren(el('span',{class:'crumb',text:'Sections / '}),F.type==='All'?'All':F.type);
  const out=$('out');
  if(loadError&&!loaded){$('sub').textContent='';out.replaceChildren(stateBox('Graveyard can’t load right now',loadError,el('button',{class:'btn sm',onclick:load,text:'Try again'})));return}
  if(!loaded){out.replaceChildren(stateBox('Loading sections…','Fetching the library.'));return}
  const list=sorted(all.filter(s=>matches(s)));
  $('sub').textContent=all.length?`${list.length} of ${all.length} sections. Every one a client didn’t pick, ready for a second chance.`:'Every section a client didn’t pick, ready for a second chance.';
  if(!all.length){
    out.replaceChildren(stateBox('Nothing here yet','Bury the heroes, FAQs and footers that didn’t make the cut, and pull them back out for the next client.',
      assets?el('ol',{class:'steps'},el('li',{text:'In Figma, select the section frame and press ⌘C.'}),el('li',{text:'Come back here and press ⌘V anywhere.'}),el('li',{text:'In Figma press ⇧⌘C (copy as PNG), then ⌘V again for the preview.'}),el('li',{text:'Check the details and click Bury it.'})):null));
    return;
  }
  if(!list.length){out.replaceChildren(stateBox('No sections match','Try fewer words, another type, or clear a filter.',el('button',{class:'btn sm',onclick:()=>{F.type='All';clearFilters()},text:'Clear everything'})));return}
  const grid=el('div',{class:'grid'});
  list.forEach(s=>grid.append(cardFor(s)));
  out.replaceChildren(grid);
}
function cardFor(s){
  const copy=el('button',{class:'tbtn prime',title:'Copy to Figma (⌘C)',onclick:e=>{e.stopPropagation();copyToFigma(s,copy)}},icon('copy'),el('span',{text:'Copy'}));
  const src=figmaUrl(s.fileKey,s.nodeId);
  const open=src?el('a',{class:'tbtn',href:src,target:'_blank',rel:'noopener',title:'Open source in Figma',onclick:e=>e.stopPropagation()},icon('ext')):null;
  const img=s.thumb?el('img',{src:blob(s.thumb),alt:'',loading:'lazy'}):el('span',{class:'noimg',text:'No preview'});
  const thumb=el('div',{class:'thumb'},img,el('div',{class:'tools'},open,copy));
  if(s.thumb)img.addEventListener('load',()=>{if(img.naturalHeight/img.naturalWidth>.66)thumb.classList.add('tall')});
  const card=el('article',{class:'card',tabindex:'0','aria-label':s.name,
    onclick:()=>openDetail(s.id),onkeydown:e=>{if(e.key==='Enter'&&e.target===card)openDetail(s.id)},
    onmouseenter:()=>{hovered=s;prefetch(s)},onmouseleave:()=>{if(hovered===s)hovered=null},onfocus:()=>{hovered=s;prefetch(s)}},
    thumb,
    el('div',{class:'cbody'},el('div',{class:'ctitle',text:s.name}),
      el('div',{class:'cmeta'},el('span',{class:'who'},el('span',{class:'av',text:(s.client||s.type).slice(0,1)}),el('span',{text:[s.client||'No client',s.year].filter(Boolean).join(' · ')})),
        el('span',{class:'dots'},s.colours.map(c=>el('span',{class:'sw',title:c,style:'background:'+colHex[c]}))))));
  return card;
}

/* ---------- copy to Figma ---------- */
function fetchPayload(s){
  if(payloadCache.has(s.payload))return Promise.resolve(payloadCache.get(s.payload));
  return fetch(s.payload).then(r=>{if(!r.ok)throw 0;return r.text()}).catch(()=>fetch('/api/payload?url='+encodeURIComponent(s.payload)).then(r=>{if(!r.ok)throw new Error('missing');return r.text()})).then(t=>{payloadCache.set(s.payload,t);return t});
}
function prefetch(s){if(s&&s.payload&&!payloadCache.has(s.payload))fetchPayload(s).catch(()=>{})}
function copied(s,btn){toast(`Copied “${s.name}”. Press ⌘V on the Figma canvas.`);if(btn){const o=[...btn.childNodes];btn.replaceChildren(el('span',{text:'Copied'}));setTimeout(()=>btn.replaceChildren(...o),1500)}}
async function copyToFigma(s,btn){
  if(!s.payload){toast('This section has no Figma layers stored.',true);return}
  const htmlP=fetchPayload(s).then(t=>new Blob([t],{type:'text/html'}));
  let ok=false;
  try{if(navigator.clipboard&&window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'text/html':htmlP,'text/plain':new Blob([s.name],{type:'text/plain'})})]);ok=true}}catch(e){}
  if(!ok){try{const html=await fetchPayload(s);const h=ev=>{ev.clipboardData.setData('text/html',html);ev.clipboardData.setData('text/plain',s.name);ev.preventDefault();ok=true};document.addEventListener('copy',h);document.execCommand('copy');document.removeEventListener('copy',h)}catch(e){}}
  if(ok)copied(s,btn);else toast(payloadCache.has(s.payload)?'The browser blocked the copy. Click Copy once more.':'Couldn’t load the Figma layers for this section.',true);
}
// ⌘C on a hovered card (or the open section) copies it to Figma
document.addEventListener('copy',e=>{
  const t=document.activeElement;
  if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))return;
  if(String(window.getSelection()||'').trim())return;
  if($('bury').open)return;
  const s=$('detail').open?current:hovered;if(!s||!s.payload)return;
  e.preventDefault();
  const html=payloadCache.get(s.payload);
  if(html){e.clipboardData.setData('text/html',html);e.clipboardData.setData('text/plain',s.name);copied(s)}
  else copyToFigma(s);
});

/* ---------- detail ---------- */
function openDetail(id,fromHash){
  const s=all.find(x=>x.id===id);if(!s)return;
  current=s;prefetch(s);
  $('dTitle').replaceChildren(el('span',{class:'crumb',text:s.type+' / '}),s.name);
  const im=$('dImg');im.hidden=!s.thumb;if(s.thumb)im.src=blob(s.thumb);
  const src=figmaUrl(s.fileKey,s.nodeId);$('dOpen').hidden=!src;if(src)$('dOpen').href=src;
  const meta=$('dMeta');meta.replaceChildren();
  const kv=(k,v)=>{if(v)meta.append(el('div',{class:'kv'},el('div',{class:'k',text:k}),typeof v==='string'?el('div',{class:'v',text:v}):v))};
  kv('Client',[s.client,s.year].filter(Boolean).join(' · '));
  kv('Project',s.project);
  if(s.colours.length)kv('Colours',el('div',{class:'tags'},s.colours.map(c=>el('span',{class:'tag'},el('span',{class:'sw',style:'background:'+colHex[c]}),c))));
  if(s.style.length)kv('Style',el('div',{class:'tags'},s.style.map(c=>el('span',{class:'tag',text:c}))));
  kv('Notes',s.notes);
  kv('Buried',s.createdAt?new Date(s.createdAt).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'');
  $('dEditRow').hidden=!assets;resetDel();
  show($('detail'));
  if(!fromHash){try{history.replaceState(null,'','#s-'+s.id)}catch(e){}}
}
$('dCopy').onclick=()=>current&&copyToFigma(current,$('dCopy'));
$('detail').addEventListener('close',()=>{current=null;try{if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}});
function resetDel(){const b=$('dDel');b.textContent='Delete';delete b.dataset.arm;b.disabled=false}
$('dDel').onclick=async()=>{
  const b=$('dDel');if(!current)return;
  if(!b.dataset.arm){b.dataset.arm='1';b.textContent='Click again to delete for good';return}
  const s=current;b.disabled=true;
  try{await api('DELETE','/api/sections?id='+s.id);all=all.filter(x=>x.id!==s.id);shut($('detail'));render();toast('Deleted.')}
  catch(e){toast('Couldn’t delete. '+(e&&e.message||'Try again.'),true);resetDel()}
};
$('dEdit').onclick=()=>{const s=current;shut($('detail'));openBury(s)};

/* ---------- bury / edit ---------- */
const D={};
const selCols=new Set(),selStys=new Set();
function resetDraft(edit){Object.assign(D,{html:'',meta:null,size:0,fileKey:edit?edit.fileKey:'',nodeId:edit?edit.nodeId:'',img:null,imgURL:'',imgFrom:'',previewState:'idle',previewMsg:'',editing:edit||null,tagged:!!edit,saving:false})}
resetDraft(null);
function fillType(){$('fType').replaceChildren(...TYPES.map(t=>el('option',{value:t,text:t})))}
function pickChips(){
  $('fCols').replaceChildren(...COLOURS.map(([n,h])=>{const b=el('button',{type:'button',class:'pchip','aria-pressed':String(selCols.has(n))},el('span',{class:'sw',style:'background:'+h}),n);b.onclick=()=>{selCols.has(n)?selCols.delete(n):selCols.add(n);b.setAttribute('aria-pressed',String(selCols.has(n)))};return b}));
  const names=[...new Set([...allStyles(),...selStys])];
  const box=$('fStys');box.replaceChildren(...names.map(n=>{const b=el('button',{type:'button',class:'pchip','aria-pressed':String(selStys.has(n))},n);b.onclick=()=>{selStys.has(n)?selStys.delete(n):selStys.add(n);b.setAttribute('aria-pressed',String(selStys.has(n)))};return b}));
  const add=el('input',{class:'addstyle',placeholder:'+ Add style',maxlength:'24','aria-label':'Add a new style'});
  add.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===','){e.preventDefault();const v=cleanTag(add.value);if(v){const ex=names.find(n=>n.toLowerCase()===v.toLowerCase());selStys.add(ex||v);pickChips();const a=box.querySelector('.addstyle');a&&a.focus()}}});
  box.append(add);
}
function openBury(edit,initialHtml){
  if(D.imgURL)URL.revokeObjectURL(D.imgURL);
  resetDraft(edit);
  $('bTitle').textContent=edit?'Edit section':'Bury a section';
  $('bSave').textContent=edit?'Save changes':'Bury it';
  selCols.clear();selStys.clear();
  const s=edit||{};
  $('fName').value=s.name||'';$('fType').value=s.type||'Hero';$('fClient').value=s.client||'';$('fYear').value=s.year||String(new Date().getFullYear());$('fProject').value=s.project||'';$('fNotes').value=s.notes||'';
  (s.colours||[]).forEach(c=>selCols.add(c));(s.style||[]).forEach(c=>selStys.add(c));
  pickChips();
  $('clientList').replaceChildren(...[...new Set(all.map(x=>x.client).filter(Boolean))].map(c=>el('option',{value:c})));
  renderBury();
  show($('bury'));
  if(initialHtml)takeFigma(initialHtml);
}
function renderBury(){
  const v=$('bViewer');
  const editImg=D.editing&&!D.img&&D.editing.thumb?blob(D.editing.thumb):'';
  if(D.imgURL||editImg)v.replaceChildren(el('img',{src:D.imgURL||editImg,alt:'Preview'}));
  else v.replaceChildren(el('div',{class:'drophint'},el('b',{text:D.html?'Now add the preview':'Paste a Figma frame'}),
    D.html?el('ol',{class:'steps'},el('li',{text:'Back in Figma, with the frame still selected, press ⇧⌘C (copy as PNG).'}),el('li',{text:'Press ⌘V here.'})):el('ol',{class:'steps'},el('li',{text:'In Figma, select the section frame and press ⌘C.'}),el('li',{text:'Press ⌘V here.'})),
    el('span',{class:'alt'},D.html?'A screenshot works too. Paste it, drop an image here, or ':'You can paste the preview first if you prefer. Or ',el('button',{type:'button',class:'linkbtn',onclick:()=>$('bFile').click(),text:'choose a file'}),'.')));
  // status list
  const st=$('bStatus');st.replaceChildren();
  if(!D.editing){
    st.append(el('div',{class:'st'+(D.html?' done':'')},el('span',{class:'dot'}),D.html?`Figma layers captured · ${(D.size/1024).toFixed(0)} KB`:'Waiting for Figma layers (⌘V)'));
    st.append(el('div',{class:'st'+(D.img?' done':D.html?' warn':'')},el('span',{class:'dot'}),D.img?'Preview added':'Waiting for the preview (⇧⌘C in Figma, then ⌘V)'));
  }else{
    const r=el('div',{class:'row'});
    r.append(el('button',{type:'button',class:'btn sm',onclick:()=>$('bFile').click(),text:'Replace image'}));
    st.append(r,el('p',{class:'hint',text:'You can also paste a screenshot (⌘V) to replace the preview.'}));
  }
  $('bSave').disabled=D.saving||(D.editing?false:!(D.html&&D.img));
}
function parseFigma(html){
  const b=/\(figma\)[\s\S]*?\(\/figma\)/.test(html);if(!b)return null;
  const m=html.match(/\(figmeta\)([\s\S]*?)\(\/figmeta\)/);
  let meta=null;if(m){try{meta=JSON.parse(atob(m[1].trim()))}catch(e){}}
  const node=meta&&typeof meta.selectedNodeData==='string'?(meta.selectedNodeData.match(/\d+:\d+/)||[''])[0]:'';
  const key=meta&&typeof meta.fileKey==='string'&&/^[0-9a-zA-Z]{22,128}$/.test(meta.fileKey)?meta.fileKey:'';
  return{meta,size:html.length,fileKey:key,nodeId:node};
}
function takeFigma(html){
  const p=parseFigma(html);if(!p)return false;
  Object.assign(D,{html,meta:p.meta,size:p.size,fileKey:p.fileKey,nodeId:p.nodeId});
  renderBury();
  return true;
}
async function takeImage(file,from){
  try{
    const bmp=await createImageBitmap(file);
    const w=Math.min(1600,bmp.width),fullH=Math.round(bmp.height*w/bmp.width),h=Math.min(fullH,6000);
    const c=document.createElement('canvas');c.width=w;c.height=h;
    const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(bmp,0,0,w,fullH);
    let b=await new Promise(r=>c.toBlob(r,'image/webp',.86));
    if(!b||b.type!=='image/webp')b=await new Promise(r=>c.toBlob(r,'image/jpeg',.86));
    if(D.imgURL)URL.revokeObjectURL(D.imgURL);
    D.img=b;D.imgURL=URL.createObjectURL(b);D.imgFrom=from||'manual';
    renderBury();
  }catch(e){toast('That image couldn’t be read. Try another screenshot.',true)}
}
// One paste handler: Figma layers → bury; image → preview
document.addEventListener('paste',e=>{
  const t=e.target;const inField=t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA');
  const cd=e.clipboardData;if(!cd)return;
  const html=cd.getData('text/html');const isFig=!!html&&/\(figma\)/.test(html);
  const file=[...cd.files].find(f=>/^image\/(png|jpeg|webp)$/.test(f.type));
  if(inField&&!isFig&&!file)return;
  if($('bury').open){
    if(isFig&&!D.editing){e.preventDefault();takeFigma(html);toast(D.img?'Figma layers captured.':'Figma layers captured. Now ⇧⌘C in Figma and ⌘V here for the preview.')}
    else if(file){e.preventDefault();takeImage(file,'manual')}
    else if(!inField){e.preventDefault();toast('Nothing usable on the clipboard. Copy a frame in Figma, or take a screenshot.',true)}
    return;
  }
  if(!$('detail').open&&isFig&&!inField){e.preventDefault();openBury(null,html);toast('Figma layers captured. Now ⇧⌘C in Figma and ⌘V here for the preview.')}
});
$('bFile').onchange=e=>{const f=e.target.files[0];if(f)takeImage(f,'manual');e.target.value=''};
$('bViewer').addEventListener('dragover',e=>e.preventDefault());
$('bViewer').addEventListener('drop',e=>{e.preventDefault();const f=[...e.dataTransfer.files].find(f=>/^image\//.test(f.type));if(f)takeImage(f,'manual')});

$('bForm').addEventListener('submit',async e=>{
  e.preventDefault();if(D.saving)return;
  const fields={name:$('fName').value.trim()||'Untitled section',type:$('fType').value,colours:[...selCols],style:[...selStys],client:$('fClient').value.trim(),year:$('fYear').value.trim(),project:$('fProject').value.trim(),notes:$('fNotes').value.trim(),fileKey:D.fileKey||'',nodeId:D.nodeId||'',link:figmaUrl(D.fileKey,D.nodeId)};
  D.saving=true;renderBury();const btn=$('bSave'),lbl=btn.textContent;btn.textContent='Saving…';
  try{
    const ext=D.img&&D.img.type==='image/webp'?'webp':'jpg';
    if(D.editing){
      if(D.img){const th=await put('thumbs/'+D.editing.id+'.'+ext,D.img);fields.thumb=th.url}
      const saved=await api('PUT','/api/sections?id='+D.editing.id,fields);
      all=all.map(x=>x.id===saved.id?norm(saved):x);
      toast('Saved.');
    }else{
      const key=Math.random().toString(36).slice(2,10);
      const th=await put('thumbs/'+key+'.'+ext,D.img);
      const pl=await put('payloads/'+key+'.txt',new Blob([D.html],{type:'text/plain'}));
      payloadCache.set(pl.url,D.html);
      const saved=await api('POST','/api/sections',{...fields,thumb:th.url,payload:pl.url,payloadSize:D.size});
      all=[norm(saved),...all];
      toast(`Buried “${fields.name}”.`);
    }
    render();
    shut($('bury'));
  }catch(err){
    toast('Couldn’t save. '+(err&&err.message||'Try again.'),true);
  }
  D.saving=false;btn.textContent=lbl;if($('bury').open)renderBury();
});

/* ---------- dialog motion ---------- */
let lastPt=null;
document.addEventListener('pointerdown',e=>{lastPt={x:e.clientX,y:e.clientY}},true);
const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function show(d){
  d.classList.remove('closing');
  if(!d.open)d.showModal();
  const r=d.getBoundingClientRect();
  d.style.transformOrigin=lastPt?`${Math.round(lastPt.x-r.left)}px ${Math.round(lastPt.y-r.top)}px`:'50% 50%';
}
function shut(d){
  if(!d||!d.open||d.classList.contains('closing'))return;
  if(reduce()){d.close();return}
  d.classList.add('closing');
  let done=false;const fin=()=>{if(done)return;done=true;d.classList.remove('closing');d.close()};
  d.addEventListener('animationend',fin,{once:true});setTimeout(fin,260);
}
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('cancel',e=>{e.preventDefault();shut(d)}));

/* ---------- chrome ---------- */
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>shut(b.closest('dialog')));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)shut(d)}));
$('buryBtn').onclick=()=>{closeMenu();openBury()};
$('q').addEventListener('input',e=>{F.q=e.target.value.trim();render()});
function openMenu(){$('app').classList.add('open')}
function closeMenu(){$('app').classList.remove('open')}
$('menuBtn').onclick=openMenu;$('scrim').onclick=closeMenu;
$('mSearch').onclick=()=>{openMenu();setTimeout(()=>$('q').focus(),50)};
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(matchMedia('(max-width:900px)').matches)openMenu();$('q').focus();$('q').select()}
  else if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!document.querySelector('dialog[open]')){e.preventDefault();$('q').focus()}
  else if(e.key==='Escape'){closePanels();closeMenu()}
});
function fromHash(){const m=location.hash.match(/^#s-([A-Za-z0-9_-]+)$/);if(m&&loaded)openDetail(m[1],true)}
window.addEventListener('hashchange',fromHash);

/* ---------- boot ---------- */
fillType();render();
let first=true;
async function load(){
  try{
    const list=await api('GET','/api/sections');
    all=list.map(norm);loaded=true;loadError='';render();
    if(current){const s=all.find(x=>x.id===current.id);if(!s&&$('detail').open)shut($('detail'));else if(s)current=s}
    if(first){first=false;fromHash()}
  }catch(e){loadError=(e&&e.message)||'Check your connection and try again.';render()}
}
load();
window.addEventListener('focus',()=>{if(!document.querySelector('dialog[open]'))load()});
setInterval(()=>{if(document.visibilityState==='visible'&&!document.querySelector('dialog[open]'))load()},60000);
