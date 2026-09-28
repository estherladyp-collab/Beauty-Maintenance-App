(() => {
'use strict';

/* ---------- data ---------- */
const KEY = 'muse.v1';
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const CATS = [
  ['top','Tops'],['bottom','Bottoms'],['dress','Dresses'],['outer','Outerwear'],
  ['shoes','Shoes'],['bag','Bags'],['jewel','Jewelry']
];
const SLOT_LABEL = {top:'Top',bottom:'Bottom',dress:'Dress',outer:'Outerwear',shoes:'Shoes',bag:'Bag',jewel:'Jewelry'};
// pos = balances an inverted triangle, neg = adds width up top or narrows the hip
const STYLES = {
  top:[['V-neck','pos'],['Wrap top','pos'],['Scoop neck','pos'],['Fitted knit','ok'],['Bodysuit','ok'],['Boat neck','neg'],['Puff sleeve','neg'],['Halter','neg'],['Off-shoulder','neg']],
  bottom:[['Wide-leg trousers','pos'],['A-line skirt','pos'],['Flared jeans','pos'],['Pleated skirt','pos'],['Patch-pocket cargos','pos'],['Straight jeans','ok'],['Skinny','neg']],
  dress:[['A-line dress','pos'],['Wrap dress','pos'],['Fit-and-flare','pos'],['Column dress','ok'],['Strapless or halter','neg']],
  outer:[['Longline coat','pos'],['Belted trench','pos'],['Soft blazer','ok'],['Structured-shoulder blazer','neg'],['Cropped puffer','neg']],
  shoes:[['Heeled sandal','ok'],['Pointed pump','ok'],['Block heel','ok'],['Clean sneaker','ok'],['Ankle boot','ok']],
  bag:[['Shoulder bag','ok'],['Mini bag','ok'],['Tote','ok']],
  jewel:[['Gold hoops','ok'],['Statement earrings','ok'],['Layered chains','ok'],['Watch','ok']]
};
// w: 1 warm, 2 neutral, 0 cool
const COLORS = [
  ['Chocolate','#4b2e22',1],['Espresso','#2a1b16',1],['Camel','#b98a5a',1],['Caramel','#a86b3c',1],
  ['Rust','#a5502e',1],['Terracotta','#c26a4a',1],['Coral','#e2775b',1],['Mustard','#c99a2e',1],
  ['Gold','#c39a4d',1],['Olive','#6b6a3a',1],['Forest','#3f5238',1],['Burgundy','#6e2a30',1],
  ['Blush nude','#e2c0b0',1],['Warm cream','#efe1cf',1],['Ivory','#f4ecdd',2],['Black','#161110',2],
  ['White','#fbf8f3',2],['Denim','#4c6280',2],['Navy','#1f2a44',0],['Icy pink','#e9c4d6',0],
  ['Lavender','#b7a6d3',0],['Silver grey','#a9adb3',0]
];
const NAILS = [['Milky pink','#efd3d0'],['Sheer nude','#e3c2b3'],['Champagne shimmer','#eadbd6'],['Rose beige','#d7aa9b'],['Cocoa','#7a4a3a'],['Espresso','#3a231c'],['Sheer red','#a83a3a']];
const LIPS = [['Brown gloss','#7b4a3c'],['Mocha','#5a3328'],['Nude rosewood','#a86a5c'],['Terracotta','#b5573f'],['Plum brown','#5b2c33'],['Clear gloss','#c98f7a']];
const APPT_TYPES = [['hair','Hair','#7a5240'],['nails','Nails','#d7aa9b'],['outfit','Outfit','#c39a4d'],['lashes','Lashes','#4a3128'],['brows','Brows','#4c6280'],['skin','Skin','#65735b'],['pedi','Pedicure','#a86a5c'],['other','Other','#8d7a70']];
const ROUTINE_OF = {hair:'hairtrim',nails:'nails',lashes:'lashes',brows:'brows',skin:'face',pedi:'pedi'};
const TYPE_OF_ROUTINE = {nails:'nails',lashes:'lashes',brows:'brows',hairtrim:'hair',face:'skin',pedi:'pedi'};
const PREP = {
  hair:[['Wash and deep condition','Day before'],['Detangle gently and skip heavy oils or gels','Day before'],['Charge your phone and book a table or snack for a long sit','Day before'],['Pick reference pictures from your Mood tab','Day before'],['Arrive with clean, dry, product-free hair','Morning of'],['Bring reference pictures, hair or extensions, and your bonnet or silk scarf','Bring']],
  nails:[['Book removal if you have product on already','Day before'],['Push cuticles back only. Leave cutting to your tech','Day before'],['Pick 2 or 3 reference pictures from your Mood tab','Day before'],['Skip hand oil and lotion before you go','Morning of'],['Bring reference pictures and your shade name (milky pink, sheer nude)','Bring']],
  lashes:[['Skip mascara, and oil-based makeup remover, for 24 hours','Day before'],['Wash your face and lids clean','Morning of'],['Arrive with no eye makeup on','Morning of'],['Bring a reference picture of the length and curl you want','Bring']],
  brows:[['Leave brows alone. No plucking or waxing for 2 weeks','Day before'],['Skip retinol and exfoliating acids for 3 days','Day before'],['Arrive with no brow makeup on','Morning of'],['Bring a picture of your ideal shape','Bring']],
  skin:[['Skip retinol and exfoliating acids for 3 days','Day before'],['Drink plenty of water','Day before'],['Arrive with a bare face','Morning of'],['Bring your current skincare list or products to show','Bring']],
  pedi:[['Wait 24 hours after shaving','Day before'],['Remove old polish','Day before'],['Pick a shade from your Mood tab','Day before'],['Wear open shoes or bring flip-flops for the ride home','Bring']],
  outfit:[['Steam or iron every piece','Day before'],['Check shoes and bag are clean','Day before'],['Lay the full outfit out together','Day before'],['Charge your phone and pack the essentials','Morning of'],['Bring a layer or spare shoes','Bring']],
  other:[['Write down what you want done','Day before'],['Bring reference pictures','Bring']]
};
const defTitle = t => t==='outfit' ? 'Outfit' : (APPT_TYPES.find(x=>x[0]===t)||APPT_TYPES[7])[1]+' appointment';
const DEFTAG = {hair:'Hair',nails:'Nails',pedi:'Nails',lashes:'Makeup',brows:'Makeup',skin:'Makeup',outfit:'Outfit'};
const CFIL = [['all','All'],['hair','Hair'],['nails','Nails'],['outfit','Outfit'],['other','More']];
const typeInfo = t => APPT_TYPES.find(x => x[0]===t) || APPT_TYPES[6];
const addDays = (iso,n) => { const d=new Date(iso+'T12:00:00'); d.setDate(d.getDate()+n); return isoDay(d); };
const fmtDate = iso => new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const TAGS = ['Outfit','Hair','Nails','Makeup','Accessories'];
const HAIR = ['Big blowout','Sleek low bun','Half-up','Silk press','Braids','Wash-and-go curls'];

const ROUTINE = [
  ['nails','Nail fill or fresh set',21],['lashes','Lash lift or fill',28],['brows','Brow shaping',21],
  ['hairwash','Wash + deep condition',7],['hairtrim','Trim or hair treatment',56],
  ['face','Exfoliate + face mask',7],['body','Body scrub + oil',7],['lips','Lip scrub + mask',7],['pedi','Pedicure',28]
];

const EXTRA = {'Fitted V-neck knit':['#4b2e22','#a5502e'],'Wrap top':['#6b6a3a','#efe1cf'],'Scoop-neck tee':['#161110','#b98a5a'],'Wide-leg trousers':['#efe1cf','#161110'],'A-line midi skirt':['#161110','#4b2e22'],'Flared jeans':['#161110']};
const SEED = [
  ['top','Fitted V-neck knit','V-neck','#efe1cf'],['top','Wrap top','Wrap top','#a5502e'],['top','Bodysuit','Bodysuit','#2a1b16'],
  ['top','Scoop-neck tee','Scoop neck','#fbf8f3'],['top','Silk camisole','V-neck','#b98a5a'],
  ['bottom','Wide-leg trousers','Wide-leg trousers','#4b2e22'],['bottom','A-line midi skirt','A-line skirt','#6b6a3a'],['bottom','Flared jeans','Flared jeans','#4c6280'],
  ['bottom','Pleated skirt','Pleated skirt','#b98a5a'],['bottom','Straight jeans','Straight jeans','#161110'],
  ['dress','Wrap dress','Wrap dress','#a5502e'],['dress','Little black dress','A-line dress','#161110'],['dress','Fit-and-flare dress','Fit-and-flare','#3f5238'],
  ['outer','Longline camel coat','Longline coat','#b98a5a'],['outer','Belted trench','Belted trench','#c39a4d'],['outer','Soft blazer','Soft blazer','#4b2e22'],
  ['shoes','Nude heeled sandal','Heeled sandal','#e2c0b0'],['shoes','Black pointed pump','Pointed pump','#161110'],['shoes','Clean white sneaker','Clean sneaker','#fbf8f3'],['shoes','Chocolate ankle boot','Ankle boot','#4b2e22'],
  ['bag','Everyday shoulder bag','Shoulder bag','#a86b3c'],['bag','Evening mini bag','Mini bag','#161110'],
  ['jewel','Gold hoops','Gold hoops','#c39a4d'],['jewel','Layered gold chains','Layered chains','#c39a4d'],['jewel','Statement earrings','Statement earrings','#c39a4d']
].map((s,i) => ({id:'s'+i,cat:s[0],name:s[1],style:s[2],color:s[3],have:false,photo:null,variants:[s[3],...(EXTRA[s[1]]||[])].map((c,j) => ({id:'sv'+i+'_'+j,color:c,photo:null,have:false}))}));

const PCHIPS = [['all','All'],['fav','Favorites'],...TAGS.map(t=>[t,t])];
const inTag = (p,t) => t==='all' || (t==='fav' ? p.fav : p.tag===t);
const uid = () => Math.random().toString(36).slice(2,9);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isoDay = (d=new Date()) => { const z = new Date(d.getTime()-d.getTimezoneOffset()*6e4); return z.toISOString().slice(0,10); };
const dow = (d=new Date()) => (d.getDay()+6)%7;
const daysSince = iso => Math.floor((new Date(isoDay())-new Date(iso))/864e5);

const vOf = (it, vid) => it.variants.find(v => v.id===vid) || it.variants.find(v => v.have) || it.variants[0];
const syncHave = it => { it.have = it.variants.some(v => v.have); };
function migrate(it){ if(!it.variants) it.variants=[{id:uid(),color:it.color,photo:it.photo||null,have:!!it.have}]; syncHave(it); }
let state = load();
state.appts = state.appts || [];
state.items.forEach(migrate);
if(!state.seedFix){ const sp=(state.pics||[]).find(p=>p.id==='seed4'&&p.tag==='Makeup'); if(sp) sp.tag='Hair'; state.seedFix=true; }
if (!state.seeded && window.MUSE_SEED){ state.pics=[...window.MUSE_SEED,...(state.pics||[])]; state.seeded=true; save(); }
function load(){
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.items) return s; } catch(e){}
  return {items:SEED, looks:[], plan:{}, routine:{}, log:[], pics:[], appts:[]};
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){ toast = 'Storage is full. Remove a photo to keep saving.'; } }

let ui = {tab:'today', cat:'all', draft:null, sheet:null, ptag:'all', vsel:{}, sty:'all', cal:{y:new Date().getFullYear(),m:new Date().getMonth()}, calSel:isoDay(), adraft:null, btab:'outfit', omode:'split', tsrc:'ward', cfil:'all', assignDay:null};
let toast = '';

/* ---------- garments ---------- */
const PATHS = {
  top:'M30 10H42L50 30L58 10H70L92 28L82 44L72 38V92H28V38L18 44L8 28Z',
  pants:'M30 8H70L77 96H54L50 44L46 96H23Z',
  skirt:'M32 8H68L90 92H10Z',
  dress:'M38 6H46L50 22L54 6H62L66 30L60 44L88 96H12L40 44L34 30Z',
  coat:'M36 6L50 20L64 6L88 18L96 74L84 76L82 96H18L16 76L4 74L12 18ZM50 20L46 96H54Z',
  shoe:'M14 20H32C34 44 48 54 88 58C95 59 96 68 90 70H42L36 92H29L32 70C18 66 12 46 14 20Z',
  bag:'M16 42H84L90 92H10Z',
  hoop:''
};
let gid = 0;
function shapeFor(cat, style){
  if (cat==='bottom') return /skirt/i.test(style) ? 'skirt' : 'pants';
  return {top:'top',dress:'dress',outer:'coat',shoes:'shoe',bag:'bag',jewel:'hoop'}[cat];
}
function garment(cat, style, color){
  const id = 'g'+(gid++), shape = shapeFor(cat, style);
  const gloss = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>`;
  let body;
  if (shape==='hoop') body = `<circle cx="50" cy="52" r="26" fill="none" stroke="${color}" stroke-width="9"/><circle cx="50" cy="52" r="26" fill="none" stroke="url(#${id})" stroke-width="9"/>`;
  else {
    const handle = shape==='bag' ? `<path d="M34 42C34 14 66 14 66 42" fill="none" stroke="${color}" stroke-width="5"/>` : '';
    body = `${handle}<path d="${PATHS[shape]}" fill="${color}" stroke="rgba(0,0,0,.12)" stroke-width=".8" stroke-linejoin="round"/><path d="${PATHS[shape]}" fill="url(#${id})"/>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${gloss}${body}</svg>`;
}
function pic(it, v){ v = v || vOf(it); return v.photo ? `<img src="${v.photo}" alt="${esc(it.name)}">` : garment(it.cat, it.style, v.color); }
const colorName = hex => (COLORS.find(c => c[1]===hex)||[hex])[0];
const rating = it => (STYLES[it.cat].find(s => s[0]===it.style)||[])[1] || 'ok';

/* ---------- look board ---------- */
function boardParts(look){
  const order = look.slots.dress ? ['outer','dress','jewel','bag','shoes'] : ['outer','top','bottom','jewel','bag','shoes'];
  const cells = order.map(s => {
    const it = state.items.find(i => i.id===look.slots[s]);
    return it ? `<div class="slot s-${s}">${pic(it, vOf(it, look.vars&&look.vars[s]))}</div>` : `<div class="slot s-${s} empty">${SLOT_LABEL[s]}</div>`;
  }).join('');
  const pics = (look.pics||[]).map(id => (state.pics||[]).find(p => p.id===id)).filter(Boolean);
  const hasSlots = Object.keys(look.slots).length > 0;
  const strip = beautyStrip(look.beauty);
  if (!hasSlots && pics.length) return {core:`<div class="collage n${Math.min(pics.length,4)}">${pics.slice(0,4).map(p=>`<img src="${p.src}" alt="">`).join('')}</div>`, mood:'', strip};
  const mood = pics.length ? `<div class="mood">${pics.slice(0,4).map(p=>`<img src="${p.src}" alt="">`).join('')}</div>` : '';
  return {core:`<div class="board" role="img" aria-label="Look board">${cells}</div>`, mood, strip};
}
function board(look){ const p = boardParts(look); return p.core + p.mood + p.strip; }
function beautyStrip(b){
  if (!b) return '';
  const n = NAILS.find(x => x[0]===b.nails), l = LIPS.find(x => x[0]===b.lips);
  return `<div class="beauty-strip">
    ${n?`<div class="bs"><i class="nail" style="background:${n[1]}"></i><span><small>Nails</small>${esc(n[0])}</span></div>`:''}
    ${l?`<div class="bs"><i class="nail" style="background:${l[1]};border-radius:50% 50% 50% 50%/40% 40% 60% 60%;height:26px"></i><span><small>Lips</small>${esc(l[0])}</span></div>`:''}
    ${b.hair?`<div class="bs"><span><small>Hair</small>${esc(b.hair)}</span></div>`:''}
  </div>`;
}
function lookNotes(look){
  const rs = Object.entries(look.slots).map(([s,id]) => { const it = state.items.find(i => i.id===id); return it && {it, v:vOf(it, look.vars&&look.vars[s])}; }).filter(Boolean);
  const its = rs.map(r => r.it);
  if (!its.length) return [];
  const out = [];
  const neg = its.filter(i => rating(i)==='neg'), pos = its.filter(i => rating(i)==='pos');
  const upperNeg = neg.filter(i => ['top','dress','outer'].includes(i.cat));
  const lowerNeg = neg.filter(i => i.cat==='bottom');
  if (upperNeg.length) out.push({warn:1,t:`${upperNeg.map(i=>i.style).join(' + ')} adds width at the shoulders. Pair it with a wide-leg or A-line bottom, or swap for a V-neck.`});
  if (lowerNeg.length) out.push({warn:1,t:`${lowerNeg[0].style} narrows your hips and makes shoulders look broader. Try wide-leg or flared instead.`});
  if (!neg.length && pos.length) out.push({t:`Balanced. ${pos.map(i=>i.style).join(', ')} keeps the eye moving down and softens the shoulder line.`});
  const cool = rs.filter(r => { const c = COLORS.find(x => x[1]===r.v.color); return c && c[2]===0 && !r.v.photo; });
  if (cool.length) out.push({warn:1,t:`${cool.map(r=>colorName(r.v.color)).join(', ')} reads cool against your warm undertone. Keep it away from your face or swap for camel, rust or olive.`});
  else if (rs.some(r => (COLORS.find(x => x[1]===r.v.color)||[])[2]===1)) out.push({t:'Colors sit warm. Good with your undertone.'});
  const missing = rs.filter(r => !r.v.have);
  if (missing.length) out.push({warn:1,t:`Still on your list: ${missing.map(r=>r.it.name+' in '+colorName(r.v.color).toLowerCase()).join(', ')}.`});
  return out;
}

/* ---------- views ---------- */
function view(){
  const tabs = [['today','Today'],['wardrobe','Wardrobe'],['looks','Looks'],['mood','Mood'],['calendar','Calendar'],['beauty','Beauty']];
  const body = ui.draft ? builder() : {today,wardrobe,looks,mood,calendar,beauty}[ui.tab]();
  return `<div class="brand brand-fixed" aria-hidden="true">Muse</div>
  <main class="shell"><header class="top"><span class="eyebrow">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span></header>${body}</main>
  <nav class="nav" aria-label="Main"><div class="nav-in">${tabs.map(t=>`<button data-act="tab" data-v="${t[0]}" ${ui.tab===t[0]&&!ui.draft?'aria-current="page"':''}>${t[1]}</button>`).join('')}</div></nav>
  ${ui.sheet || ui.draft || ui.tab==='calendar' ? '' : `<label class="fab" title="Add pictures" aria-label="Add pictures"><span aria-hidden="true">＋</span><input type="file" id="picfab" accept="image/*" multiple hidden></label>`}${ui.sheet ? sheet() : ''}${toast?`<div role="status" class="note warn" style="position:fixed;left:16px;right:16px;bottom:80px;z-index:50;max-width:420px;margin:auto">${esc(toast)}</div>`:''}`;
}

function today(){
  const d = dow(), td = isoDay();
  const dayOutfit = state.appts.find(x => x.type==='outfit' && x.date===td && !x.done && x.lookId && state.looks.some(l => l.id===x.lookId));
  const look = dayOutfit ? state.looks.find(l => l.id===dayOutfit.lookId) : state.looks.find(l => l.id===state.plan[d]);
  const week = DAYS.map((n,i) => {
    const l = state.looks.find(x => x.id===state.plan[i]);
    return `<button class="day" data-act="assign" data-v="${i}" ${i===d?'aria-current="date"':''} aria-label="${n}: ${l?esc(l.name):'no look planned'}">
      <small>${n}</small>${l?`<div class="mini">${miniLook(l)}</div>`:`<span class="plus">+</span>`}</button>`;
  }).join('');
  const due = ROUTINE.map(r => ({r, left: dueIn(r)})).sort((a,b)=>a.left-b.left).slice(0,3);
  const checked = weekLog();
  const have = state.items.filter(i=>i.have).length;
  return `
  <h1 class="page-title">Good day, <em>gorgeous.</em></h1>
  <p class="lede">${checked} of the last 7 days checked in. ${checked>=5?'That is consistency.':'Small and steady wins.'}</p>
  <div class="hero ${look?'':'solo'}">
    <div>
      <div class="eyebrow">Today's look</div>
      <h2>${look?esc(look.name):'Nothing planned yet'}</h2>
      <p style="opacity:.75;margin-bottom:16px">${look?esc(look.occasion||''):'Pick a look for today so you are not deciding in front of the mirror.'}</p>
      <div class="row">
        ${look?`<button class="btn gold" data-act="wore" data-v="${d}">I wore this</button>`:''}
        <button class="btn ${look?'ghost':'gold'}" style="${look?'color:var(--milk);border-color:rgba(255,255,255,.4)':''}" data-act="assign" data-v="${d}">${look?'Change':'Choose a look'}</button>
      </div>
    </div>
    ${look?`<div>${board(look,true)}</div>`:''}
  </div>
  ${startRail()}
  ${prepToday()}
  ${freshNudge()}
  <section><div class="row between"><h2>This week</h2><span class="eyebrow">Tap a day to plan it</span></div><div class="week" style="margin-top:14px">${week}</div></section>
  <section><h2>Due next</h2><div class="list" style="margin-top:14px">${due.map(x=>task(x.r)).join('')}</div></section>
  <section><div class="card"><div class="eyebrow">Wardrobe</div><h3 style="font-size:26px;margin:6px 0">${have} of ${state.items.length} pieces owned</h3>
    <div class="progress"><i style="width:${state.items.length?have/state.items.length*100:0}%"></i></div></div></section>`;
}
function prepToday(){
  const td = isoDay(), lim = addDays(td,7);
  const soon = state.appts.filter(a=>!a.done && a.date>=td && a.date<=lim).sort((x,y)=>x.date.localeCompare(y.date));
  if(!soon.length) return '';
  return `<section><h2>Coming up</h2><div class="list" style="margin-top:14px">${soon.map(a=>{
    const open = a.prep.map((p,i)=>({p,i})).filter(x=>!x.p.done).slice(0,4);
    return `<div class="card"><button class="appt flat" data-act="editappt" data-v="${a.id}">${apptLead(a)}<span class="grow"><b>${esc(a.title)}</b><span class="status">${a.date===td?'Today':fmtDate(a.date)}${a.time?' · '+esc(a.time):''}</span></span></button>
    ${open.length?`<div class="prep">${open.map(x=>`<label class="chk"><input type="checkbox" data-act="prepcheck" data-v="${a.id}:${x.i}"><span>${esc(x.p.t)}<small>${esc(x.p.when)}</small></span></label>`).join('')}</div>`:'<p class="status" style="margin-top:8px">All prepped.</p>'}</div>`;}).join('')}</div></section>`;
}
function startRail(){
  const src = ui.tsrc;
  let rail = '';
  if (src==='ward'){
    const items = [...state.items].sort((a,b) => (b.have?1:0)-(a.have?1:0));
    rail = items.map(it => { const v = vOf(it); return `<button class="ptile itile ${v.photo?'':'draw'} ${v.have?'':'need'}" data-act="startward" data-v="${it.id}:${v.id}" aria-label="Start a look with ${esc(it.name)}">${pic(it,v)}</button>`; }).join('') +
      `<label class="ptile addp"><span>＋</span><span>Upload</span><input type="file" id="wardup" accept="image/*" multiple hidden></label>`;
  } else {
    const tag = src==='hair' ? 'Hair' : 'Nails';
    rail = (state.pics||[]).filter(p => p.tag===tag).map(p => `<button class="ptile" data-act="startpic" data-v="${p.id}:${src}" aria-label="Start a look with this ${tag.toLowerCase()} picture"><img src="${p.src}" alt=""></button>`).join('') +
      `<label class="ptile addp"><span>＋</span><span>Upload</span><input type="file" id="picup" accept="image/*" multiple hidden></label>`;
  }
  return `<section><div class="row between"><h2>Plan a look</h2><button class="btn small ghost" data-act="newtoday">Start blank</button></div>
    <div class="chips" style="margin:12px 0 4px" role="group" aria-label="Pictures"><button class="chip" aria-pressed="${src==='ward'}" data-act="tsrc" data-v="ward">Wardrobe</button><button class="chip" aria-pressed="${src==='hair'}" data-act="tsrc" data-v="hair">Hair</button><button class="chip" aria-pressed="${src==='nails'}" data-act="tsrc" data-v="nails">Nails</button></div>
    <div class="hscroll rail">${rail}</div></section>`;
}
function freshNudge(){
  const n = lastAdded();
  if (n!==null && n<=14) return '';
  const msg = n===null ? 'Start your mood library. Upload outfits, hair and nails you love, then pick from them when you plan your week.' : `Your last new picture was ${n} day${n===1?'':'s'} ago. Add a few fresh ones so your looks keep evolving.`;
  return `<div class="note warn" style="margin-top:20px"><b>Time for fresh inspiration.</b> ${msg}<div style="margin-top:10px"><button class="btn small" data-act="tab" data-v="mood">Open Mood</button></div></div>`;
}
function miniLook(l){
  const p = (l.pics||[]).map(id => (state.pics||[]).find(x => x.id===id)).find(Boolean);
  if (p) return `<img src="${p.src}" alt="" style="width:34px;height:46px;object-fit:cover;border-radius:8px;display:block">`;
  const its = ['top','dress','bottom'].map(s => { const i = state.items.find(x=>x.id===l.slots[s]); return i && {i, v:vOf(i, l.vars&&l.vars[s])}; }).filter(Boolean);
  if (!its.length) return '<span class="plus" style="border-style:solid">·</span>';
  return its.map(x => garment(x.i.cat,x.i.style,x.v.color)).join('').replace(/<svg /g,'<svg style="display:block;width:34px;height:'+(its.length>1?'24':'40')+'px" ');
}
function dueIn(r){ const last = state.routine[r[0]]; return last ? r[2]-daysSince(last) : 0; }
function task(r){
  const left = dueIn(r), last = state.routine[r[0]];
  const txt = !last ? 'Not tracked yet' : left<0 ? `${-left} day${left===-1?'':'s'} overdue` : left===0 ? 'Due today' : `Due in ${left} day${left===1?'':'s'}`;
  return `<div class="task"><i class="nail" style="background:${left<=0?'#e6cfc5':'#cdd6c1'};width:22px;height:30px"></i>
    <div class="grow"><h3>${esc(r[1])}</h3><div class="status ${left<0?'over':''}">${txt} · every ${r[2]} days</div></div>
    <button class="btn small ${left<=0?'':'ghost'}" data-act="done" data-v="${r[0]}">Done</button></div>`;
}
function weekLog(){ let n=0; for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i); if(state.log.includes(isoDay(d))) n++; } return n; }

function dots(it, cur, act, key){
  return it.variants.length>1 ? `<div class="vdots" role="group" aria-label="Colors">${it.variants.map(x=>`<button class="vdot ${x.id===cur?'on':''}" style="background:${x.color}" data-act="${act}" data-v="${key}:${x.id}" aria-pressed="${x.id===cur}" aria-label="${esc(colorName(x.color))}${x.have?'':' (on list)'}"></button>`).join('')}</div>` : '';
}
function wardrobe(){
  const have = state.items.filter(i=>i.have).length;
  const inCat = state.items.filter(i => ui.cat==='all' || i.cat===ui.cat);
  const styles = [...new Set(inCat.map(i=>i.style))];
  const list = inCat.filter(i => ui.sty==='all' || i.style===ui.sty);
  return `<h1 class="page-title">Your <em>wardrobe</em></h1>
  <p class="lede">One card per piece. Tap a dot to switch colors. Tick what you own.</p>
  <div class="card" style="margin:20px 0 14px"><div class="row between"><b>${have} of ${state.items.length} pieces owned</b><div class="row" style="gap:8px"><label class="btn small ghost" style="cursor:pointer;text-transform:none;letter-spacing:0;color:var(--espresso)">Upload photos<input type="file" id="wardup" accept="image/*" multiple hidden></label><button class="btn small" data-act="add">Add a piece</button></div></div><div class="progress"><i style="width:${state.items.length?have/state.items.length*100:0}%"></i></div></div>
  <div class="chips" role="group" aria-label="Category">${[['all','All'],...CATS].map(c=>`<button class="chip" aria-pressed="${ui.cat===c[0]}" data-act="cat" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${ui.cat!=='all'&&styles.length>1?`<div class="chips" role="group" aria-label="Style">${[['all','All styles'],...styles.map(s=>[s,s])].map(c=>`<button class="chip" aria-pressed="${ui.sty===c[0]}" data-act="sty" data-v="${esc(c[0])}">${esc(c[1])}</button>`).join('')}</div>`:''}
  ${list.length?`<div class="grid" style="margin-top:12px">${list.map(itemCard).join('')}</div>`:`<div class="empty-state" style="margin-top:12px">Nothing here yet. Add your first piece.</div>`}`;
}
function itemCard(it){
  const v = vOf(it, ui.vsel[it.id]), r = rating(it);
  return `<div class="item ${v.have?'have':'need'}"><div class="pic" data-act="edit" data-v="${it.id}" role="button" tabindex="0" aria-label="Edit ${esc(it.name)}">${pic(it,v)}</div>
    <button class="tick" data-act="own" data-v="${it.id}" aria-pressed="${v.have}" aria-label="${v.have?'Owned':'Not owned'}: ${esc(it.name)}, ${esc(colorName(v.color))}">${v.have?'✓':''}</button>
    <h3>${esc(it.name)}</h3><p>${esc(it.style)} · ${esc(colorName(v.color))}</p>
    ${dots(it,v.id,'vpick',it.id)}
    ${r==='pos'?'<span class="tag ok">Balances</span>':r==='neg'?'<span class="tag warn">Style with care</span>':''}</div>`;
}

function looks(){
  return `<div class="row between"><h1 class="page-title">Your <em>looks</em></h1><button class="btn" data-act="newlook">Create a look</button></div>
  <p class="lede">Build outfits piece by piece, add nails, lips and hair, then drop them into your week.</p>
  ${state.looks.length?`<div class="grid wide" style="margin-top:22px">${state.looks.map(l=>`<div class="card"><button style="display:block;width:100%;text-align:left" data-act="editlook" data-v="${l.id}" aria-label="Edit ${esc(l.name)}">${board(l)}</button>
    <div class="row between" style="margin-top:12px"><div><h3 style="font-size:22px">${esc(l.name)}</h3><span class="status">${esc(l.occasion||'')}</span></div><button class="btn small ghost" data-act="dellook" data-v="${l.id}">Delete</button></div></div>`).join('')}</div>`
  :`<div class="empty-state" style="margin-top:22px">No looks yet. Tap “Create a look” to build your first one.</div>`}`;
}

const BTABS = [['outfit','Outfit'],['hair','Hair'],['nails','Nails & lips'],['acc','Accessories']];
function tile(it, sel, slot, d){
  const cur = vOf(it, sel ? (d.vars&&d.vars[slot]) : ui.vsel[it.id]);
  return `<div class="tile ${sel?'on':''} ${cur.have?'':'need'}"><button class="tp" data-act="seti" data-v="${slot}:${it.id}:${cur.id}" aria-pressed="${sel}" aria-label="${esc(it.name)}, ${esc(colorName(cur.color))}">${pic(it,cur)}</button><span class="tn">${esc(it.name)}</span>${dots(it,cur.id,'seti',slot+':'+it.id)}${cur.have?'':'<span class="tl">On list</span>'}</div>`;
}
function itemRow(title, slot, d){
  const items = state.items.filter(i => i.cat===slot).sort((a,b) => (b.have?1:0)-(a.have?1:0));
  return `<div class="brow"><div class="eyebrow">${title}</div>${items.length?`<div class="hscroll">${items.map(i=>tile(i,d.slots[slot]===i.id,slot,d)).join('')}</div>`:`<p class="status">Nothing here yet. Add pieces in Wardrobe.</p>`}</div>`;
}
function picsRow(tag, d, label){
  const ps = (state.pics||[]).filter(p => p.tag===tag), sel = d.pics||[];
  return `<div class="brow"><div class="eyebrow">${label}</div><div class="hscroll">${ps.map(p=>`<button class="ptile ${sel.includes(p.id)?'on':''}" data-act="ptoggle" data-v="${p.id}" aria-pressed="${sel.includes(p.id)}" aria-label="${esc(tag)} picture"><img src="${p.src}" alt=""><span class="check">${sel.includes(p.id)?'✓':''}</span></button>`).join('')}
    <label class="ptile addp" data-tag="${tag}"><span>＋</span><span>Upload</span><input type="file" id="picup" accept="image/*" multiple hidden></label></div></div>`;
}
function builder(){
  const d = ui.draft, mode = d.slots.dress ? 'dress' : ui.omode, parts = boardParts(d), notes = lookNotes(d);
  let body = '';
  if (ui.btab==='outfit'){
    body = `<div class="row" style="justify-content:space-between"><div class="chips" role="group" aria-label="Outfit style">
      <button class="chip" aria-pressed="${mode==='split'}" data-act="setmode" data-v="split">Top + bottom</button><button class="chip" aria-pressed="${mode==='dress'}" data-act="setmode" data-v="dress">Dress</button></div>
      <button class="btn small ghost" data-act="shuffle">Surprise me</button></div>
      ${mode==='dress' ? itemRow('Dress','dress',d) : itemRow('Top','top',d)+itemRow('Bottom','bottom',d)}
      ${itemRow('Outerwear','outer',d)}${itemRow('Shoes','shoes',d)}${picsRow('Outfit',d,'Outfit inspiration')}`;
  } else if (ui.btab==='hair'){
    body = `<div class="brow"><div class="eyebrow">Hairstyle</div><div class="chips" style="flex-wrap:wrap">${HAIR.map(h=>`<button class="chip" data-act="beauty" data-k="hair" data-v="${esc(h)}" aria-pressed="${d.beauty.hair===h}">${esc(h)}</button>`).join('')}</div></div>${picsRow('Hair',d,'Hair inspiration')}`;
  } else if (ui.btab==='nails'){
    body = `<div class="brow"><div class="eyebrow">Nails</div><div class="pick">${NAILS.map(n=>`<figure><button class="nail lg" style="background:${n[1]}" data-act="beauty" data-k="nails" data-v="${esc(n[0])}" aria-pressed="${d.beauty.nails===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div></div>
      ${picsRow('Nails',d,'Nail inspiration')}
      <div class="brow"><div class="eyebrow">Lips</div><div class="pick">${LIPS.map(n=>`<figure><button class="nail lg" style="background:${n[1]};border-radius:50%;height:44px" data-act="beauty" data-k="lips" data-v="${esc(n[0])}" aria-pressed="${d.beauty.lips===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div></div>
      ${picsRow('Makeup',d,'Makeup inspiration')}`;
  } else {
    body = `${itemRow('Bag','bag',d)}${itemRow('Jewelry','jewel',d)}${picsRow('Accessories',d,'Accessories inspiration')}`;
  }
  return `<button class="back" data-act="cancel">← Back</button>
  <h1 class="page-title" style="margin-bottom:12px">${d.id?'Edit':'Create a'} <em>look</em></h1>${ui.assignDay!==null?`<p class="status" style="margin:-6px 0 10px">Saving adds this look to ${DAYS[ui.assignDay]}.</p>`:''}
  <div class="builder"><div class="pv">${parts.core}<div class="pvside">
    <input type="text" id="lname" value="${esc(d.name)}" placeholder="Name this look" maxlength="40" aria-label="Look name">
    <input type="text" id="locc" value="${esc(d.occasion)}" placeholder="Occasion" maxlength="50" aria-label="Occasion">
    <button class="btn" data-act="savelook">Save look</button>${parts.strip}${parts.mood}</div></div>
  <div class="bmain"><div class="chips" role="tablist" aria-label="Look parts">${BTABS.map(t=>`<button class="chip" role="tab" aria-selected="${ui.btab===t[0]}" aria-pressed="${ui.btab===t[0]}" data-act="btab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="bbody">${body}</div>
    ${notes.length?`<div class="eyebrow" style="margin-top:14px">Style check</div><div class="slots" style="margin-top:8px">${notes.map(n=>`<div class="note ${n.warn?'warn':''}">${esc(n.t)}</div>`).join('')}</div>`:''}
  </div></div>`;
}

function isNew(p){ return p.at && daysSince(p.at)<=7; }
function lastAdded(){ const d=(state.pics||[]).map(p=>p.at).filter(Boolean).sort().pop(); return d ? daysSince(d) : null; }
function mood(){
  const all = state.pics||[];
  const list = all.filter(p => inTag(p, ui.ptag));
  return `<div class="row between"><h1 class="page-title">Your <em>mood</em></h1>
    <label class="btn" style="display:inline-block;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px;color:var(--milk)">Upload pictures<input type="file" id="picup" accept="image/*" multiple hidden></label></div>
  <p class="lede">Hair, nails, makeup and outfit ideas you love. Pick from these when you build a look.</p>
  <div class="chips" style="margin-top:18px" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${ui.ptag===c[0]}" data-act="ptag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div class="note" style="margin-top:14px" id="dropzone"><b>Add fresh looks anytime.</b> Save an image from Pinterest or take a screenshot, then upload it here. You can also drag pictures onto this page, or copy an image on your computer and paste it.</div>
  ${list.length?`<div class="pics" style="margin-top:12px">${list.map(p=>`<button class="pic-tile" data-act="picopen" data-v="${p.id}" aria-label="Open picture, ${esc(p.tag)}"><img src="${p.src}" alt=""><span class="tag">${esc(p.tag)}</span>${p.fav?'<span class="heart" aria-label="Favorite">♥</span>':''}${isNew(p)?'<span class="new">New</span>':''}</button>`).join('')}</div>`
  :`<div class="empty-state" style="margin-top:12px">${all.length?'No pictures here yet.':'No pictures yet. Tap “Upload pictures” and pick as many as you like.'}</div>`}`;
}

function prepDone(a){ return a.prep.filter(p=>p.done).length; }
function dueDates(){
  const out = {};
  ROUTINE.forEach(r => { const last = state.routine[r[0]], t = TYPE_OF_ROUTINE[r[0]]; if(!last||!t) return;
    (out[addDays(last,r[2])] = out[addDays(last,r[2])] || []).push({r,t}); });
  return out;
}
function apptLead(a){
  const l = a.lookId && state.looks.find(x => x.id===a.lookId), p = (a.pics||[]).map(id => (state.pics||[]).find(x => x.id===id)).find(Boolean);
  if (l) return `<span class="lead thumbboard">${boardParts(l).core}</span>`;
  if (p) return `<img class="lead" src="${p.src}" alt="">`;
  return `<i class="dotc" style="background:${typeInfo(a.type)[2]}"></i>`;
}
const inFil = a => ui.cfil==='all' || (ui.cfil==='other' ? !['hair','nails','outfit'].includes(a.type) : a.type===ui.cfil);
function apptCard(a){
  const ti = typeInfo(a.type), n = a.prep.length;
  return `<button class="appt ${a.done?'done':''}" data-act="editappt" data-v="${a.id}">${apptLead(a)}
    <span class="grow"><b>${esc(a.title)}</b><span class="status">${fmtDate(a.date)}${a.time?' · '+esc(a.time):''}${a.done?' · Done':''}</span></span>
    <span class="status">${n?`${prepDone(a)} of ${n} prepped`:''}</span></button>`;
}
function calendar(){
  const {y,m} = ui.cal, first = new Date(y,m,1), off = (first.getDay()+6)%7, dim = new Date(y,m+1,0).getDate();
  const due = dueDates(), td = isoDay();
  let cells = '';
  for(let i=0;i<off;i++) cells += '<span class="cd blank"></span>';
  for(let d=1; d<=dim; d++){
    const iso = isoDay(new Date(y,m,d)), as = state.appts.filter(a=>a.date===iso && inFil(a));
    const dots = as.filter(inFil).slice(0,3).map(a=>`<i style="background:${typeInfo(a.type)[2]}"></i>`).join('');
    cells += `<button class="cd ${iso===td?'today':''} ${iso===ui.calSel?'sel':''} ${due[iso]?'due':''}" data-act="calsel" data-v="${iso}" aria-label="${fmtDate(iso)}${as.length?', '+as.length+' appointment'+(as.length>1?'s':''):''}"><span>${d}</span><span class="dots">${dots}</span></button>`;
  }
  const sel = ui.calSel, dayAppts = state.appts.filter(a=>a.date===sel && inFil(a)).sort((x,y)=>(x.time||'').localeCompare(y.time||''));
  const dayDue = due[sel] || [];
  const upcoming = state.appts.filter(a=>!a.done && a.date>=td && inFil(a)).sort((x,y)=>(x.date+(x.time||'')).localeCompare(y.date+(y.time||''))).slice(0,5);
  const toBook = ROUTINE.filter(r => TYPE_OF_ROUTINE[r[0]] && state.routine[r[0]] && dueIn(r)<=7 && !state.appts.some(a=>!a.done&&a.date>=td&&a.type===TYPE_OF_ROUTINE[r[0]]));
  return `<h1 class="page-title">Beauty <em>calendar</em></h1>
  <p class="lede">Book hair and maintenance, and get a prep list for each visit so you show up ready.</p>
  <div class="chips" style="margin-top:18px" role="group" aria-label="Category">${CFIL.map(c=>`<button class="chip" aria-pressed="${ui.cfil===c[0]}" data-act="cfil" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${toBook.length?`<section style="margin-top:22px"><h2>Time to book</h2><div class="list" style="margin-top:12px">${toBook.map(r=>`<div class="task"><i class="nail" style="background:#e6cfc5;width:22px;height:30px"></i><div class="grow"><h3>${esc(r[1])}</h3><div class="status ${dueIn(r)<0?'over':''}">${dueIn(r)<0?-dueIn(r)+' days overdue':dueIn(r)===0?'Due today':'Due in '+dueIn(r)+' days'}</div></div><button class="btn small" data-act="newappt" data-v="${TYPE_OF_ROUTINE[r[0]]}">Book</button></div>`).join('')}</div></section>`:''}
  <section><div class="row between"><button class="btn small ghost" data-act="calprev" aria-label="Previous month">←</button><h2>${first.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</h2><button class="btn small ghost" data-act="calnext" aria-label="Next month">→</button></div>
  <div class="cal" style="margin-top:14px"><div class="cal-h">${DAYS.map(d=>`<span>${d[0]}</span>`).join('')}</div><div class="cal-g">${cells}</div></div>
  <div class="legend">${APPT_TYPES.filter(t=>t[0]!=='other').map(t=>`<span><i style="background:${t[2]}"></i>${t[1]}</span>`).join('')}<span><i class="ring"></i>Due</span></div></section>
  <section><div class="row between"><h2>${fmtDate(sel)}</h2><button class="btn small" data-act="newappt" data-v="">Add appointment</button></div>
  <div class="list" style="margin-top:12px">${dayAppts.map(apptCard).join('')}${dayDue.map(x=>`<div class="task"><i class="nail" style="background:#cdd6c1;width:22px;height:30px"></i><div class="grow"><h3>${esc(x.r[1])}</h3><div class="status">Due on this day</div></div><button class="btn small ghost" data-act="newappt" data-v="${x.t}">Book</button></div>`).join('')}
  ${!dayAppts.length&&!dayDue.length?'<div class="empty-state">Nothing booked. Add an appointment to get your prep list.</div>':''}</div></section>
  <section><h2>Coming up</h2><div class="list" style="margin-top:12px">${upcoming.length?upcoming.map(apptCard).join(''):'<div class="empty-state">No upcoming appointments.</div>'}</div></section>`;
}

function beauty(){
  const warm = COLORS.filter(c => c[2]===1);
  return `<h1 class="page-title">Beauty <em>upkeep</em></h1>
  <p class="lede">Tap Done when you finish something. It resets the clock so nothing slips.</p>
  <section style="margin-top:22px"><div class="list">${ROUTINE.map(task).join('')}</div></section>
  <section><h2>Move to another device</h2><div class="card" style="margin-top:14px"><p class="lede" style="margin-bottom:14px">Your data lives on this device. Save a backup file, then load it on your other phone or laptop.</p><div class="row"><button class="btn small" data-act="export">Save backup</button><label class="btn small ghost" style="display:inline-block;cursor:pointer;text-transform:none;letter-spacing:0;font-size:13px;color:var(--espresso)">Load backup<input type="file" id="import" accept="application/json" hidden></label></div></div></section>
  <section><h2>Your style guide</h2><div class="guide" style="margin-top:14px">
    <div class="card"><div class="eyebrow">Inverted triangle</div><h3>Balance the shoulders</h3>
      <ul><li>V-necks, wraps and scoop necks open up the top and draw the eye in.</li><li>Wide-leg trousers, A-line and pleated skirts add volume below.</li><li>Belt at the waist, keep detail and texture on the bottom half.</li><li>Go easy on boat necks, puff sleeves, halters and padded shoulders.</li></ul></div>
    <div class="card"><div class="eyebrow">Warm undertone</div><h3>Gold, earth and glow</h3>
      <ul><li>Gold jewelry over silver.</li><li>Bronze, terracotta and coral blush. Brown, mocha and rosewood lips.</li><li>Milky nude and sheer pink nails.</li><li>Icy pastels and silver-greys wash you out, so keep them below the chest.</li></ul></div>
  </div>
  <div class="card" style="margin-top:14px"><div class="eyebrow" style="margin-bottom:12px">Your palette</div><div class="palette">${warm.map(c=>`<div class="pal"><i style="background:${c[1]}"></i>${c[0]}</div>`).join('')}</div></div></section>`;
}

function sheet(){
  const s = ui.sheet;
  let inner = '';
  if (s.type==='pick'){
    const opts = state.items.filter(i => i.cat===s.slot);
    inner = `<h2>Choose ${SLOT_LABEL[s.slot].toLowerCase()}</h2>${opts.length?`<div class="grid">${opts.map(it=>`<button class="item ${it.have?'have':'need'}" data-act="set" data-v="${it.id}"><div class="pic">${pic(it)}</div><h3>${esc(it.name)}</h3><p>${it.have?esc(colorName(it.color)):'On your list'}</p></button>`).join('')}</div>`:`<div class="empty-state">No ${SLOT_LABEL[s.slot].toLowerCase()} in your wardrobe yet.</div>`}
      <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="clear" data-v="${s.slot}">Clear</button><button class="btn ghost small" data-act="close">Close</button></div>`;
  } else if (s.type==='sort'){
    const cats = s.mode==='ward' ? CATS : TAGS.map(t=>[t,t]), todo = s.items.filter(f=>!f.cat).length;
    inner = `<h2>Sort your pictures</h2>
    <div class="chips" role="group" aria-label="Where do these go"><button class="chip" aria-pressed="${s.mode==='ward'}" data-act="sortmode" data-v="ward">My wardrobe</button><button class="chip" aria-pressed="${s.mode==='insp'}" data-act="sortmode" data-v="insp">Inspiration</button></div>
    <div class="eyebrow" style="margin:10px 0 6px">Put them all in</div>
    <div class="chips" style="flex-wrap:wrap">${cats.map(c=>`<button class="chip s" data-act="sortall" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
    <div class="sortgrid" style="margin-top:14px">${s.items.map((f,i)=>`<div class="sorti ${f.cat?'':'todo'}"><img src="${f.src}" alt=""><button class="x" data-act="sortdel" data-v="${i}" aria-label="Remove picture">✕</button><div class="chips" style="flex-wrap:wrap;gap:4px">${cats.map(c=>`<button class="chip s" aria-pressed="${f.cat===c[0]}" data-act="sortcat" data-v="${i}:${c[0]}">${c[1]}</button>`).join('')}</div></div>`).join('')}</div>
    <div class="row" style="margin-top:16px"><label class="btn ghost small" style="cursor:pointer;text-transform:none;letter-spacing:0;color:var(--espresso)">Add more<input type="file" id="sortmore" accept="image/*" multiple hidden></label><button class="btn small" data-act="sortsave" ${todo?'aria-disabled="true"':''}>${todo?`Sort ${todo} more`:`Save ${s.items.length} picture${s.items.length===1?'':'s'}`}</button><button class="btn ghost small" data-act="close">Cancel</button></div>`;
  } else if (s.type==='appt'){
    const a = ui.adraft, ti = typeInfo(a.type), pics = (a.pics||[]).map(id=>(state.pics||[]).find(p=>p.id===id)).filter(Boolean);
    inner = `<h2>${s.isNew?'Add appointment':'Appointment'}</h2><div class="slots">
      <div class="chips" style="flex-wrap:wrap" role="group" aria-label="Type">${APPT_TYPES.map(t=>`<button class="chip" aria-pressed="${a.type===t[0]}" data-act="settype" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>
      <label>Title<input type="text" id="aname" value="${esc(a.title)}" maxlength="50"></label>
      <div class="row" style="gap:10px"><label style="flex:1;min-width:140px">Date<input type="date" id="adate" value="${a.date}"></label><label style="flex:1;min-width:120px">Time<input type="time" id="atime" value="${esc(a.time)}"></label></div>
      <label>Notes<input type="text" id="anotes" value="${esc(a.notes)}" placeholder="Stylist, place, style you want" maxlength="120"></label>
      ${a.type==='outfit'?`<div class="eyebrow" style="margin-top:8px">Look for this day</div>${state.looks.length?`<div class="hscroll">${state.looks.map(l=>`<button class="tile ${a.lookId===l.id?'on':''}" data-act="applook" data-v="${l.id}" aria-pressed="${a.lookId===l.id}"><span class="thumbboard">${boardParts(l).core}</span><span class="tn">${esc(l.name)}</span></button>`).join('')}</div>`:'<p class="status">No saved looks yet. Build one on the Looks tab first.</p>'}`:''}
      <div class="eyebrow" style="margin-top:8px">Prep list · ${prepDone(a)} of ${a.prep.length} done</div>
      <div class="prep">${a.prep.map((p,i)=>`<div class="chk"><input type="checkbox" id="pc${i}" data-act="preptoggle" data-v="${i}" ${p.done?'checked':''}><label for="pc${i}" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso);flex:1"><span>${esc(p.t)}<small>${esc(p.when)}</small></span></label><button class="btn small ghost" data-act="prepdel" data-v="${i}" aria-label="Remove ${esc(p.t)}">✕</button></div>`).join('')}</div>
      <div class="row" style="gap:8px;flex-wrap:nowrap"><input type="text" id="prepnew" placeholder="Add something to prep" maxlength="80" style="flex:1"><select id="prepwhen" style="width:auto"><option>Day before</option><option>Morning of</option><option>Bring</option></select><button class="btn small" data-act="prepadd">Add</button></div>
      <div class="eyebrow" style="margin-top:8px">Reference pictures</div>
      <div class="picked">${pics.map(p=>`<img src="${p.src}" alt="">`).join('')}<button class="slotbtn" style="width:auto;min-height:72px" data-act="apppics"><span class="thumb">＋</span><span><b>${pics.length?'Change pictures':'Choose pictures'}</b></span></button></div>
      <div class="row" style="margin-top:12px"><button class="btn" data-act="saveappt">Save</button><button class="btn ghost" data-act="close">Cancel</button>${s.isNew?'':`<button class="btn ghost" data-act="doneappt">${a.done?'Reopen':'Mark done'}</button><button class="btn ghost" data-act="delappt">Delete</button>`}</div></div>`;
  } else if (s.type==='apppics'){
    const all = state.pics||[], list = all.filter(p => inTag(p, s.tag)), sel = ui.adraft.pics||[];
    inner = `<h2>Reference pictures</h2>
    <div class="chips" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${s.tag===c[0]}" data-act="sheettag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
    ${list.length?`<div class="pics" style="margin-top:10px">${list.map(p=>`<button class="pic-tile ${sel.includes(p.id)?'on':''}" data-act="toggleapppic" data-v="${p.id}" aria-pressed="${sel.includes(p.id)}" aria-label="${esc(p.tag)} picture"><img src="${p.src}" alt=""><span class="check">${sel.includes(p.id)?'✓':''}</span></button>`).join('')}</div>`:`<div class="empty-state" style="margin-top:10px">No pictures here yet.</div>`}
    <div class="row" style="margin-top:16px"><label class="btn ghost small" style="cursor:pointer;text-transform:none;letter-spacing:0;color:var(--espresso)">Upload more<input type="file" id="picup" accept="image/*" multiple hidden></label><button class="btn small" data-act="backappt">Done · ${sel.length} picked</button></div>`;
  } else if (s.type==='pics'){
    const all = state.pics||[], list = all.filter(p => inTag(p, s.tag)), sel = ui.draft.pics||[];
    inner = `<h2>Choose pictures</h2>
    <div class="chips" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${s.tag===c[0]}" data-act="sheettag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
    ${list.length?`<div class="pics" style="margin-top:10px">${list.map(p=>`<button class="pic-tile ${sel.includes(p.id)?'on':''}" data-act="togglepic" data-v="${p.id}" aria-pressed="${sel.includes(p.id)}" aria-label="${esc(p.tag)} picture"><img src="${p.src}" alt=""><span class="check">${sel.includes(p.id)?'✓':''}</span></button>`).join('')}</div>`:`<div class="empty-state" style="margin-top:10px">${all.length?'No pictures with this tag.':'Your library is empty. Upload your first pictures below.'}</div>`}
    <div class="row" style="margin-top:16px"><label class="btn ghost small" style="cursor:pointer;text-transform:none;letter-spacing:0;color:var(--espresso)">Upload more<input type="file" id="picup" accept="image/*" multiple hidden></label><button class="btn small" data-act="close">Done · ${sel.length} picked</button></div>`;
  } else if (s.type==='pic'){
    const p = (state.pics||[]).find(x=>x.id===s.id);
    inner = `<img src="${p.src}" alt="" style="width:100%;max-height:60vh;object-fit:contain;border-radius:16px;background:var(--card)">
    <div class="chips" style="margin-top:14px;flex-wrap:wrap" role="group" aria-label="Tag">${TAGS.map(t=>`<button class="chip" aria-pressed="${p.tag===t}" data-act="retag" data-v="${t}">${t}</button>`).join('')}</div>
    <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="favpic" aria-pressed="${!!p.fav}">${p.fav?'♥ Favorite':'♡ Add to favorites'}</button><button class="btn ghost small" data-act="delpic">Delete picture</button><button class="btn small" data-act="close">Close</button></div>`;
  } else if (s.type==='assign'){
    inner = `<h2>${DAYS[s.day]}'s look</h2>${state.looks.length?`<div class="grid wide">${state.looks.map(l=>`<button class="card" style="text-align:left" data-act="plan" data-v="${l.id}">${board(l)}<h3 style="font-size:20px;margin-top:10px">${esc(l.name)}</h3></button>`).join('')}</div>`:`<div class="empty-state">Create a look first, then plan your week.</div>`}
      <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="plan" data-v="">Clear day</button><button class="btn ghost small" data-act="close">Close</button></div>`;
  } else if (s.type==='item'){
    const it = s.item, vi = Math.min(s.vi||0, it.variants.length-1), v = it.variants[vi];
    inner = `<h2>${s.isNew?'Add a piece':'Edit piece'}</h2><div class="slots">
      <label>Name<input type="text" id="iname" value="${esc(it.name)}" maxlength="40" placeholder="e.g. Ribbed V-neck top"></label>
      <label>Category<select id="icat" data-act="icat">${CATS.map(c=>`<option value="${c[0]}" ${it.cat===c[0]?'selected':''}>${c[1]}</option>`).join('')}</select></label>
      <label>Style<select id="istyle">${STYLES[it.cat].map(x=>`<option ${it.style===x[0]?'selected':''}>${x[0]}</option>`).join('')}</select></label>
      <div class="eyebrow" style="margin-top:8px">Colors of this piece</div>
      <div class="row" style="gap:8px">${it.variants.map((x,i)=>`<button class="vchip ${i===vi?'on':''}" data-act="vsel" data-v="${i}" aria-pressed="${i===vi}"><i style="background:${x.color}"></i>${esc(colorName(x.color))}</button>`).join('')}<button class="chip" data-act="vadd">＋ Add a color</button></div>
      <div class="card" style="display:grid;gap:12px">
        <div class="eyebrow">Pick the color · ${esc(colorName(v.color))}</div>
        <div class="swatches">${COLORS.map(c=>`<button class="sw" style="background:${c[1]}" data-act="color" data-v="${c[1]}" aria-pressed="${v.color===c[1]}" aria-label="${c[0]}${c[2]===0?' (cool)':''}"></button>`).join('')}</div>
        <label>Photo of this color (optional)<input type="file" id="iphoto" accept="image/*"></label>
        ${v.photo?`<div class="row"><img src="${v.photo}" alt="" style="width:96px;border-radius:12px"><button class="btn small ghost" data-act="vphotoclear">Remove photo</button></div>`:''}
        <div class="chk"><input type="checkbox" id="vown" data-act="vown" ${v.have?'checked':''}><label for="vown" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso)">I own this color</label></div>
        ${it.variants.length>1?`<button class="btn small ghost" style="justify-self:start" data-act="vdel">Remove this color</button>`:''}
      </div>
      <div class="row" style="margin-top:8px"><button class="btn" data-act="saveitem">Save</button><button class="btn ghost" data-act="close">Cancel</button>${s.isNew?'':`<button class="btn ghost" data-act="delitem">Delete</button>`}</div></div>`;
  }
  return `<div class="overlay" data-act="overlay"><div class="sheet" role="dialog" aria-modal="true">${inner}</div></div>`;
}

/* ---------- actions ---------- */
function readItemForm(){
  const it = ui.sheet.item, g = id => document.getElementById(id);
  if (g('iname')) it.name = g('iname').value.trim() || it.name;
  if (g('istyle')) it.style = g('istyle').value;
}
function setToast(t){ toast=t; render(); setTimeout(()=>{toast='';render();},2200); }
function logToday(){ const t=isoDay(); if(!state.log.includes(t)) state.log.push(t); }

const actions = {
  tab(v){ ui.tab=v; ui.draft=null; ui.assignDay=null; window.scrollTo(0,0); },
  cat(v){ ui.cat=v; ui.sty='all'; },
  sty(v){ ui.sty=v; },
  vpick(v){ const [id,vid]=v.split(':'); ui.vsel[id]=vid; },
  own(v){ const it=state.items.find(i=>i.id===v), c=vOf(it,ui.vsel[v]); c.have=!c.have; ui.vsel[v]=c.id; syncHave(it); save(); },
  add(){ ui.sheet={type:'item',isNew:true,item:{id:uid(),cat:'top',name:'',style:STYLES.top[0][0],have:true,variants:[{id:uid(),color:COLORS[2][1],photo:null,have:true}]},vi:0}; },
  edit(v){ ui.sheet={type:'item',item:JSON.parse(JSON.stringify(state.items.find(i=>i.id===v))),vi:Math.max(0,state.items.find(i=>i.id===v).variants.indexOf(vOf(state.items.find(i=>i.id===v),ui.vsel[v])))}; },
  icat(){ readItemForm(); const it=ui.sheet.item; it.cat=document.getElementById('icat').value; it.style=STYLES[it.cat][0][0]; },
  color(v){ readItemForm(); ui.sheet.item.variants[ui.sheet.vi||0].color=v; },
  vsel(v){ readItemForm(); ui.sheet.vi=+v; },
  vadd(){ readItemForm(); const it=ui.sheet.item, used=it.variants.map(x=>x.color), next=(COLORS.find(c=>c[2]===1&&!used.includes(c[1]))||COLORS[0])[1];
    it.variants.push({id:uid(),color:next,photo:null,have:false}); ui.sheet.vi=it.variants.length-1; },
  vdel(){ readItemForm(); const it=ui.sheet.item; it.variants.splice(ui.sheet.vi||0,1); ui.sheet.vi=0; },
  vown(){ readItemForm(); const x=ui.sheet.item.variants[ui.sheet.vi||0]; x.have=!x.have; },
  vphotoclear(){ readItemForm(); ui.sheet.item.variants[ui.sheet.vi||0].photo=null; },
  saveitem(){ readItemForm(); const it=ui.sheet.item; if(!it.name){ it.name=it.style; }
    syncHave(it);
    const i=state.items.findIndex(x=>x.id===it.id); if(i>=0) state.items[i]=it; else state.items.push(it); save(); ui.sheet=null; },
  delitem(){ const id=ui.sheet.item.id; state.items=state.items.filter(i=>i.id!==id);
    state.looks.forEach(l=>{ for(const k in l.slots) if(l.slots[k]===id) delete l.slots[k]; }); save(); ui.sheet=null; },
  close(){ ui.sheet=null; ui.adraft=null; },
  overlay(v,e){ if(e.target.classList.contains('overlay')){ ui.sheet=null; ui.adraft=null; } },
  btab(v){ ui.btab=v; },
  setmode(v){ syncDraft(); ui.omode=v; if(v==='dress'){ delete ui.draft.slots.top; delete ui.draft.slots.bottom; } else delete ui.draft.slots.dress; },
  seti(v){ const [slot,id,vid]=v.split(':'), d=ui.draft, s=d.slots; d.vars=d.vars||{}; ui.vsel[id]=vid;
    if(s[slot]===id && d.vars[slot]===vid){ delete s[slot]; delete d.vars[slot]; }
    else { s[slot]=id; d.vars[slot]=vid; if(slot==='dress'){ delete s.top; delete s.bottom; } if(slot==='top'||slot==='bottom') delete s.dress; } },
  ptoggle(v){ const d=ui.draft; d.pics=d.pics||[]; const i=d.pics.indexOf(v); if(i>=0) d.pics.splice(i,1); else d.pics.push(v); },
  shuffle(){ const s=ui.draft.slots, pick=c=>{ let l=state.items.filter(i=>i.cat===c&&rating(i)!=='neg'); const own=l.filter(i=>i.have); if(own.length) l=own; return l[Math.floor(Math.random()*l.length)]; };
    const dress = ui.omode==='dress'; const want = dress ? ['dress','outer','shoes'] : ['top','bottom','outer','shoes'];
    ['top','bottom','dress','outer','shoes'].forEach(c=>{ if(!want.includes(c)) delete s[c]; });
    ui.draft.vars=ui.draft.vars||{}; want.forEach(c=>{ const it=pick(c); if(it){ s[c]=it.id; const vs=it.variants.filter(x=>x.have); const pool=vs.length?vs:it.variants; ui.draft.vars[c]=pool[Math.floor(Math.random()*pool.length)].id; } }); },
  newlook(){ ui.btab='outfit'; ui.omode='split'; ui.assignDay=null; ui.draft={name:'',occasion:'',slots:{},vars:{},pics:[],beauty:{nails:NAILS[0][0],lips:LIPS[0][0],hair:HAIR[0]}}; window.scrollTo(0,0); },
  editlook(v){ ui.btab='outfit'; ui.draft=JSON.parse(JSON.stringify(state.looks.find(l=>l.id===v))); ui.omode=ui.draft.slots.dress?'dress':'split'; window.scrollTo(0,0); },
  cancel(){ ui.draft=null; ui.assignDay=null; },
  dellook(v){ if(!confirm('Delete this look?')) return; state.looks=state.looks.filter(l=>l.id!==v);
    for(const k in state.plan) if(state.plan[k]===v) delete state.plan[k]; save(); },
  pick(v){ syncDraft(); ui.sheet={type:'pick',slot:v}; },
  set(v){ const s=ui.sheet.slot; ui.draft.slots[s]=v;
    if(s==='dress'){ delete ui.draft.slots.top; delete ui.draft.slots.bottom; }
    if(s==='top'||s==='bottom') delete ui.draft.slots.dress; ui.sheet=null; },
  clear(v){ delete ui.draft.slots[v]; ui.sheet=null; },
  nodress(){ syncDraft(); delete ui.draft.slots.dress; },
  beauty(v,e){ syncDraft(); ui.draft.beauty[e.currentTarget.dataset.k]=v; },
  savelook(){ syncDraft(); const d=ui.draft;
    if(!Object.keys(d.slots).length && !(d.pics||[]).length){ return setToast('Pick at least one piece or picture before saving.'); }
    if(!d.name.trim()) d.name='Look '+(state.looks.length+1);
    if(d.id){ const i=state.looks.findIndex(l=>l.id===d.id); state.looks[i]=d; } else { d.id=uid(); state.looks.push(d); }
    if(ui.assignDay!==null){ state.plan[ui.assignDay]=d.id; ui.tab='today'; } else ui.tab='looks';
    ui.assignDay=null; save(); ui.draft=null; window.scrollTo(0,0); },
  assign(v){ ui.sheet={type:'assign',day:+v}; },
  plan(v){ const d=ui.sheet.day; if(v) state.plan[d]=v; else delete state.plan[d]; save(); ui.sheet=null; },
  export(){ const b=new Blob([JSON.stringify(state)],{type:'application/json'}), u=URL.createObjectURL(b), l=document.createElement('a');
    l.href=u; l.download='muse-backup-'+isoDay()+'.json'; l.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); },
  favpic(){ const p=state.pics.find(x=>x.id===ui.sheet.id); p.fav=!p.fav; save(); },
  ptag(v){ ui.ptag=v; },
  sheettag(v){ ui.sheet.tag=v; },
  picopen(v){ ui.sheet={type:'pic',id:v}; },
  retag(v){ const p=state.pics.find(x=>x.id===ui.sheet.id); p.tag=v; save(); },
  delpic(){ const id=ui.sheet.id; state.pics=state.pics.filter(p=>p.id!==id);
    state.looks.forEach(l=>{ l.pics=(l.pics||[]).filter(x=>x!==id); }); save(); ui.sheet=null; },
  pickpics(){ syncDraft(); ui.sheet={type:'pics',tag:'all'}; },
  togglepic(v){ const d=ui.draft; d.pics=d.pics||[]; const i=d.pics.indexOf(v); if(i>=0) d.pics.splice(i,1); else d.pics.push(v); },
  calprev(){ const c=ui.cal; c.m--; if(c.m<0){c.m=11;c.y--;} },
  calnext(){ const c=ui.cal; c.m++; if(c.m>11){c.m=0;c.y++;} },
  calsel(v){ ui.calSel=v; },
  newappt(v){ const t=v||'hair'; ui.adraft={id:uid(),type:t,title:defTitle(t),date:ui.calSel||isoDay(),time:'',notes:'',prep:PREP[t].map(p=>({t:p[0],when:p[1],done:false})),pics:[],edited:false,done:false};
    ui.sheet={type:'appt',isNew:true}; },
  editappt(v){ ui.adraft=JSON.parse(JSON.stringify(state.appts.find(a=>a.id===v))); ui.sheet={type:'appt'}; },
  settype(v){ const a=ui.adraft, old=typeInfo(a.type);
    if(a.title===defTitle(a.type) || !a.title.trim()) a.title=defTitle(v);
    if(!a.edited) a.prep=PREP[v].map(p=>({t:p[0],when:p[1],done:false}));
    a.type=v; },
  preptoggle(v){ ui.adraft.prep[+v].done=!ui.adraft.prep[+v].done; ui.adraft.edited=true; },
  prepdel(v){ ui.adraft.prep.splice(+v,1); ui.adraft.edited=true; },
  prepadd(){ const t=document.getElementById('prepnew').value.trim(); if(!t) return;
    ui.adraft.prep.push({t,when:document.getElementById('prepwhen').value,done:false}); ui.adraft.edited=true; },
  prepcheck(v){ const [id,i]=v.split(':'); const a=state.appts.find(x=>x.id===id); a.prep[+i].done=true; save(); },
  apppics(){ ui.sheet={type:'apppics',tag:DEFTAG[ui.adraft.type]||'all',isNew:ui.sheet.isNew}; },
  backappt(){ ui.sheet={type:'appt',isNew:ui.sheet.isNew}; },
  toggleapppic(v){ const d=ui.adraft; d.pics=d.pics||[]; const i=d.pics.indexOf(v); if(i>=0) d.pics.splice(i,1); else d.pics.push(v); },
  saveappt(){ const a=ui.adraft; if(!a.date){ return setToast('Pick a date for this appointment.'); }
    if(!a.title.trim()) a.title=defTitle(a.type);
    const i=state.appts.findIndex(x=>x.id===a.id); if(i>=0) state.appts[i]=a; else state.appts.push(a);
    const p=a.date.split('-'); ui.cal={y:+p[0],m:+p[1]-1}; ui.calSel=a.date; save(); ui.sheet=null; ui.adraft=null; },
  doneappt(){ syncAppt(); const a=ui.adraft; a.done=!a.done;
    if(a.done && ROUTINE_OF[a.type]){ state.routine[ROUTINE_OF[a.type]]=a.date; }
    if(a.done){ logToday(); }
    const i=state.appts.findIndex(x=>x.id===a.id); if(i>=0) state.appts[i]=a; else state.appts.push(a);
    save(); ui.sheet=null; ui.adraft=null; },
  delappt(){ const id=ui.adraft.id; state.appts=state.appts.filter(a=>a.id!==id); save(); ui.sheet=null; ui.adraft=null; },
  sortmode(v){ ui.sheet.mode=v; ui.sheet.items.forEach(f=>f.cat=null); },
  sortcat(v){ const [i,c]=v.split(':'); ui.sheet.items[+i].cat=c; },
  sortall(v){ ui.sheet.items.forEach(f=>{ if(!f.cat) f.cat=v; }); },
  sortdel(v){ ui.sheet.items.splice(+v,1); if(!ui.sheet.items.length) ui.sheet=null; },
  sortsave(){ const s=ui.sheet; if(s.items.some(f=>!f.cat)) return setToast('Choose a category for every picture first.');
    const cats=[...new Set(s.items.map(f=>f.cat))], one=cats.length===1?cats[0]:'all';
    [...s.items].reverse().forEach(f=>{
      if(s.mode==='ward') state.items.unshift({id:uid(),cat:f.cat,name:'New '+SLOT_LABEL[f.cat].toLowerCase(),style:STYLES[f.cat][0][0],color:f.hex,have:true,photo:null,variants:[{id:uid(),color:f.hex,photo:f.src,have:true}]});
      else (state.pics=state.pics||[]).unshift({id:uid(),src:f.src,tag:f.cat,at:isoDay(),fav:false}); });
    if(s.mode==='ward'){ ui.tab='wardrobe'; ui.cat=one; ui.sty='all'; } else { ui.tab='mood'; ui.ptag=one; }
    const n=s.items.length; save(); ui.sheet=null; window.scrollTo(0,0); setToast(n+(n===1?' picture saved.':' pictures saved.')+(s.mode==='ward'?' Tap one to name it and set its colors.':'')); },
  tsrc(v){ ui.tsrc=v; },
  newtoday(){ actions.newlook(); ui.assignDay=dow(); },
  startward(v){ const [id,vid]=v.split(':'), it=state.items.find(i=>i.id===id); actions.newlook(); ui.assignDay=dow();
    ui.draft.slots[it.cat]=id; ui.draft.vars={[it.cat]:vid}; ui.vsel[id]=vid; if(it.cat==='dress') ui.omode='dress'; ui.btab=['bag','jewel'].includes(it.cat)?'acc':'outfit'; },
  startpic(v){ const [id,src]=v.split(':'); actions.newlook(); ui.assignDay=dow(); ui.draft.pics=[id]; ui.btab=src==='nails'?'nails':'hair'; },
  cfil(v){ ui.cfil=v; },
  applook(v){ const a=ui.adraft; a.lookId = a.lookId===v ? null : v; const l=state.looks.find(x=>x.id===v);
    if(a.lookId && l && (a.title===defTitle('outfit')||!a.title.trim())) a.title='Outfit: '+l.name; },
  wore(){ logToday(); save(); setToast('Logged. Nice work showing up.'); },
  done(v){ state.routine[v]=isoDay(); logToday(); save(); }
};
function syncAppt(){
  const a=ui.adraft, g=id=>document.getElementById(id);
  if(!a || !g('aname')) return;
  a.title=g('aname').value; a.date=g('adate').value; a.time=g('atime').value; a.notes=g('anotes').value;
}
function syncDraft(){
  const n=document.getElementById('lname'), o=document.getElementById('locc');
  if(ui.draft && n){ ui.draft.name=n.value; ui.draft.occasion=o.value; }
}

let upTag = null;
document.addEventListener('click', e => {
  const up = e.target.closest && e.target.closest('label[data-tag]'); if (up) upTag = up.dataset.tag;
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = actions[el.dataset.act];
  if (!fn) return;
  if (el.tagName==='SELECT') return;
  if (ui.adraft && ui.sheet && ui.sheet.type==='appt' && el.dataset.act!=='close') syncAppt();
  if (ui.draft && !ui.sheet) syncDraft();
  fn(el.dataset.v, {target:e.target, currentTarget:el});
  render();
});
function shrink(file){
  return new Promise(res => { const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>{
    const s=Math.min(1,640/Math.max(img.width,img.height)), c=document.createElement('canvas');
    c.width=img.width*s; c.height=img.height*s; c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    res(c.toDataURL('image/jpeg',.75)); }; img.onerror=()=>res(null); img.src=fr.result; }; fr.onerror=()=>res(null); fr.readAsDataURL(file); });
}
function prepare(file){
  return new Promise(res => { const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>{
    const s=Math.min(1,640/Math.max(img.width,img.height)), c=document.createElement('canvas');
    c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); const x=c.getContext('2d'); x.drawImage(img,0,0,c.width,c.height);
    let hex=COLORS[2][1];
    try{ const d=x.getImageData(Math.round(c.width*.3),Math.round(c.height*.3),Math.max(1,Math.round(c.width*.4)),Math.max(1,Math.round(c.height*.4))).data;
      let r=0,g=0,b=0,n=0; for(let i=0;i<d.length;i+=16){ r+=d[i]; g+=d[i+1]; b+=d[i+2]; n++; } r/=n; g/=n; b/=n;
      let best=1e9; COLORS.forEach(cl=>{ const p=cl[1], dr=parseInt(p.slice(1,3),16)-r, dg=parseInt(p.slice(3,5),16)-g, db=parseInt(p.slice(5,7),16)-b, dist=dr*dr+dg*dg+db*db; if(dist<best){ best=dist; hex=p; } });
    }catch(e){}
    res({src:c.toDataURL('image/jpeg',.75),hex}); }; img.onerror=()=>res(null); img.src=fr.result; }; fr.onerror=()=>res(null); fr.readAsDataURL(file); });
}
async function startSort(files, mode){
  const prepared=[]; for(const f of files){ const p=await prepare(f); if(p) prepared.push({...p,cat:null}); }
  if(!prepared.length) return;
  if(ui.sheet && ui.sheet.type==='sort') ui.sheet.items.push(...prepared); else ui.sheet={type:'sort',mode,items:prepared};
  render();
}
async function addFiles(files, mode){
  files=[...files].filter(f=>f.type.startsWith('image/'));
  if(!files.length) return;
  const inSheet=ui.sheet && (ui.sheet.type==='pics'||ui.sheet.type==='apppics'), tgt=ui.sheet&&ui.sheet.type==='apppics'?ui.adraft:ui.draft;
  if(!inSheet && !(ui.draft && !ui.sheet)) return startSort(files, mode || (ui.tab==='wardrobe'?'ward':'insp'));
  let tag = inSheet ? ui.sheet.tag : (ui.draft && upTag) ? upTag : ui.ptag;
  if(!TAGS.includes(tag)) tag=TAGS[0];
  state.pics = state.pics||[]; let n=0;
  for (const f of files){ const src=await shrink(f); if(!src) continue;
    const p={id:uid(),src,tag,at:isoDay(),fav:false}; state.pics.unshift(p); n++;
    if(inSheet){ tgt.pics=tgt.pics||[]; tgt.pics.push(p.id); }
    else if(ui.draft && !ui.sheet){ ui.draft.pics=ui.draft.pics||[]; ui.draft.pics.push(p.id); } }
  if(n && !ui.draft && !ui.sheet) ui.tab='mood';
  save(); render();
  if(n) setToast(n+(n===1?' picture added.':' pictures added.')+(inSheet?'':' Tap one to set its tag.'));
}
document.addEventListener('paste', e => { const fs=[...(e.clipboardData?.files||[])]; if(fs.length){ e.preventDefault(); addFiles(fs); } });
document.addEventListener('dragover', e => { if([...(e.dataTransfer?.types||[])].includes('Files')) e.preventDefault(); });
document.addEventListener('drop', e => { if(e.dataTransfer?.files?.length){ e.preventDefault(); addFiles(e.dataTransfer.files); } });
document.addEventListener('change', async e => {
  if ((e.target.id==='picup'||e.target.id==='picfab') && e.target.files.length){
    const fs=[...e.target.files]; e.target.value=''; await addFiles(fs, e.target.id==='picup'&&ui.tab==='mood'?'insp':undefined); return;
  }
  if (e.target.id==='wardup' && e.target.files.length){ const fs=[...e.target.files].filter(f=>f.type.startsWith('image/')); e.target.value=''; await startSort(fs,'ward'); return; }
  if (e.target.id==='sortmore' && e.target.files.length){ const fs=[...e.target.files].filter(f=>f.type.startsWith('image/')); e.target.value=''; await startSort(fs,ui.sheet.mode); return; }
  if (e.target.id==='import' && e.target.files[0]){
    const fr=new FileReader();
    fr.onload=()=>{ try{ const s=JSON.parse(fr.result); if(!Array.isArray(s.items)||!Array.isArray(s.looks)) throw 0;
      if(!confirm('Replace what is on this device with the backup?')) return;
      state={plan:{},routine:{},log:[],pics:[],appts:[],...s}; state.items.forEach(migrate); save(); render(); setToast('Backup loaded.'); }
      catch(err){ setToast('That file is not a Muse backup.'); } };
    fr.readAsText(e.target.files[0]);
  }
  if (e.target.id==='icat'){ actions.icat(); render(); }
  if (e.target.id==='iphoto' && e.target.files[0]){
    readItemForm();
    const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => {
      const s = Math.min(1, 480/Math.max(img.width,img.height)), c = document.createElement('canvas');
      c.width = img.width*s; c.height = img.height*s; c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      ui.sheet.item.variants[ui.sheet.vi||0].photo = c.toDataURL('image/jpeg',.8); render(); };
      img.src = fr.result; };
    fr.readAsDataURL(e.target.files[0]);
  }
});
document.addEventListener('keydown', e => {
  if (e.key==='Escape' && ui.sheet){ ui.sheet=null; render(); }
  if ((e.key==='Enter'||e.key===' ') && e.target.matches('[role=button][data-act]')){ e.preventDefault(); e.target.click(); }
});

function render(){
  const a = document.activeElement, id = a && a.id;
  document.getElementById('app').innerHTML = view();
  if (id){ const n=document.getElementById(id); if(n && n.focus) n.focus(); }
}
render();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
