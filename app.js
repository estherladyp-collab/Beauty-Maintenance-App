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
const TAGS = ['Outfit','Hair','Nails','Makeup','Accessories'];
const HAIR = ['Big blowout','Sleek low bun','Half-up','Silk press','Braids','Wash-and-go curls'];

const ROUTINE = [
  ['nails','Nail fill or fresh set',21],['lashes','Lash lift or fill',28],['brows','Brow shaping',21],
  ['hairwash','Wash + deep condition',7],['hairtrim','Trim or hair treatment',56],
  ['face','Exfoliate + face mask',7],['body','Body scrub + oil',7],['lips','Lip scrub + mask',7],['pedi','Pedicure',28]
];

const SEED = [
  ['top','Fitted V-neck knit','V-neck','#efe1cf'],['top','Wrap top','Wrap top','#a5502e'],['top','Bodysuit','Bodysuit','#2a1b16'],
  ['top','Scoop-neck tee','Scoop neck','#fbf8f3'],['top','Silk camisole','V-neck','#b98a5a'],
  ['bottom','Wide-leg trousers','Wide-leg trousers','#4b2e22'],['bottom','Wide-leg trousers','Wide-leg trousers','#efe1cf'],
  ['bottom','A-line midi skirt','A-line skirt','#6b6a3a'],['bottom','Flared jeans','Flared jeans','#4c6280'],
  ['bottom','Pleated skirt','Pleated skirt','#b98a5a'],['bottom','Straight jeans','Straight jeans','#161110'],
  ['dress','Wrap dress','Wrap dress','#a5502e'],['dress','Little black dress','A-line dress','#161110'],['dress','Fit-and-flare dress','Fit-and-flare','#3f5238'],
  ['outer','Longline camel coat','Longline coat','#b98a5a'],['outer','Belted trench','Belted trench','#c39a4d'],['outer','Soft blazer','Soft blazer','#4b2e22'],
  ['shoes','Nude heeled sandal','Heeled sandal','#e2c0b0'],['shoes','Black pointed pump','Pointed pump','#161110'],['shoes','Clean white sneaker','Clean sneaker','#fbf8f3'],['shoes','Chocolate ankle boot','Ankle boot','#4b2e22'],
  ['bag','Everyday shoulder bag','Shoulder bag','#a86b3c'],['bag','Evening mini bag','Mini bag','#161110'],
  ['jewel','Gold hoops','Gold hoops','#c39a4d'],['jewel','Layered gold chains','Layered chains','#c39a4d'],['jewel','Statement earrings','Statement earrings','#c39a4d']
].map((s,i) => ({id:'s'+i,cat:s[0],name:s[1],style:s[2],color:s[3],have:false,photo:null}));

const PCHIPS = [['all','All'],['fav','Favorites'],...TAGS.map(t=>[t,t])];
const inTag = (p,t) => t==='all' || (t==='fav' ? p.fav : p.tag===t);
const uid = () => Math.random().toString(36).slice(2,9);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isoDay = (d=new Date()) => { const z = new Date(d.getTime()-d.getTimezoneOffset()*6e4); return z.toISOString().slice(0,10); };
const dow = (d=new Date()) => (d.getDay()+6)%7;
const daysSince = iso => Math.floor((new Date(isoDay())-new Date(iso))/864e5);

let state = load();
if (!state.seeded && window.MUSE_SEED){ state.pics=[...window.MUSE_SEED,...(state.pics||[])]; state.seeded=true; save(); }
function load(){
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.items) return s; } catch(e){}
  return {items:SEED, looks:[], plan:{}, routine:{}, log:[], pics:[]};
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){ toast = 'Storage is full. Remove a photo to keep saving.'; } }

let ui = {tab:'today', cat:'all', draft:null, sheet:null, ptag:'all'};
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
function pic(it){ return it.photo ? `<img src="${it.photo}" alt="${esc(it.name)}">` : garment(it.cat, it.style, it.color); }
const colorName = hex => (COLORS.find(c => c[1]===hex)||[hex])[0];
const rating = it => (STYLES[it.cat].find(s => s[0]===it.style)||[])[1] || 'ok';

/* ---------- look board ---------- */
function board(look, dark){
  const order = look.slots.dress ? ['outer','dress','jewel','bag','shoes'] : ['outer','top','bottom','jewel','bag','shoes'];
  const cells = order.map(s => {
    const it = state.items.find(i => i.id===look.slots[s]);
    return it ? `<div class="slot s-${s}">${pic(it)}</div>` : `<div class="slot s-${s} empty">${SLOT_LABEL[s]}</div>`;
  }).join('');
  const pics = (look.pics||[]).map(id => (state.pics||[]).find(p => p.id===id)).filter(Boolean);
  const hasSlots = Object.keys(look.slots).length > 0;
  if (!hasSlots && pics.length) return `<div class="collage n${Math.min(pics.length,4)}">${pics.slice(0,4).map(p=>`<img src="${p.src}" alt="">`).join('')}</div>${beautyStrip(look.beauty)}`;
  const mood = pics.length ? `<div class="mood">${pics.slice(0,4).map(p=>`<img src="${p.src}" alt="">`).join('')}</div>` : '';
  return `<div class="board" role="img" aria-label="Look board">${cells}</div>${mood}${beautyStrip(look.beauty)}`;
}
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
  const its = Object.values(look.slots).map(id => state.items.find(i => i.id===id)).filter(Boolean);
  if (!its.length) return [];
  const out = [];
  const neg = its.filter(i => rating(i)==='neg'), pos = its.filter(i => rating(i)==='pos');
  const upperNeg = neg.filter(i => ['top','dress','outer'].includes(i.cat));
  const lowerNeg = neg.filter(i => i.cat==='bottom');
  if (upperNeg.length) out.push({warn:1,t:`${upperNeg.map(i=>i.style).join(' + ')} adds width at the shoulders. Pair it with a wide-leg or A-line bottom, or swap for a V-neck.`});
  if (lowerNeg.length) out.push({warn:1,t:`${lowerNeg[0].style} narrows your hips and makes shoulders look broader. Try wide-leg or flared instead.`});
  if (!neg.length && pos.length) out.push({t:`Balanced. ${pos.map(i=>i.style).join(', ')} keeps the eye moving down and softens the shoulder line.`});
  const cool = its.filter(i => { const c = COLORS.find(x => x[1]===i.color); return c && c[2]===0 && !i.photo; });
  if (cool.length) out.push({warn:1,t:`${cool.map(i=>colorName(i.color)).join(', ')} reads cool against your warm undertone. Keep it away from your face or swap for camel, rust or olive.`});
  else if (its.some(i => (COLORS.find(x => x[1]===i.color)||[])[2]===1)) out.push({t:'Colors sit warm. Good with your undertone.'});
  const missing = its.filter(i => !i.have);
  if (missing.length) out.push({warn:1,t:`Still on your list: ${missing.map(i=>i.name).join(', ')}.`});
  return out;
}

/* ---------- views ---------- */
function view(){
  const tabs = [['today','Today'],['wardrobe','Wardrobe'],['looks','Looks'],['mood','Mood'],['beauty','Beauty']];
  const body = ui.draft ? builder() : {today,wardrobe,looks,mood,beauty}[ui.tab]();
  return `<div class="brand brand-fixed" aria-hidden="true">Muse</div>
  <main class="shell"><header class="top"><span class="eyebrow">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span></header>${body}</main>
  <nav class="nav" aria-label="Main"><div class="nav-in">${tabs.map(t=>`<button data-act="tab" data-v="${t[0]}" ${ui.tab===t[0]&&!ui.draft?'aria-current="page"':''}>${t[1]}</button>`).join('')}</div></nav>
  ${ui.sheet || ui.draft ? '' : `<label class="fab" title="Add pictures" aria-label="Add pictures"><span aria-hidden="true">＋</span><input type="file" id="picfab" accept="image/*" multiple hidden></label>`}${ui.sheet ? sheet() : ''}${toast?`<div role="status" class="note warn" style="position:fixed;left:16px;right:16px;bottom:80px;z-index:50;max-width:420px;margin:auto">${esc(toast)}</div>`:''}`;
}

function today(){
  const d = dow(), look = state.looks.find(l => l.id===state.plan[d]);
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
  <div class="hero">
    <div>
      <div class="eyebrow">Today's look</div>
      <h2>${look?esc(look.name):'Nothing planned yet'}</h2>
      <p style="opacity:.75;margin-bottom:16px">${look?esc(look.occasion||''):'Pick a look for today so you are not deciding in front of the mirror.'}</p>
      <div class="row">
        ${look?`<button class="btn gold" data-act="wore" data-v="${d}">I wore this</button>`:''}
        <button class="btn ${look?'ghost':'gold'}" style="${look?'color:var(--milk);border-color:rgba(255,255,255,.4)':''}" data-act="assign" data-v="${d}">${look?'Change':'Choose a look'}</button>
      </div>
    </div>
    ${look?`<div>${board(look,true)}</div>`:`<div class="board" style="background:transparent;border:1px dashed rgba(255,255,255,.25);place-items:center;display:grid;aspect-ratio:auto;min-height:180px"><span class="eyebrow">No look yet</span></div>`}
  </div>
  ${freshNudge()}
  <section><div class="row between"><h2>This week</h2><span class="eyebrow">Tap a day to plan it</span></div><div class="week" style="margin-top:14px">${week}</div></section>
  <section><h2>Due next</h2><div class="list" style="margin-top:14px">${due.map(x=>task(x.r)).join('')}</div></section>
  <section><div class="card"><div class="eyebrow">Wardrobe</div><h3 style="font-size:26px;margin:6px 0">${have} of ${state.items.length} pieces owned</h3>
    <div class="progress"><i style="width:${state.items.length?have/state.items.length*100:0}%"></i></div></div></section>`;
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
  const its = ['top','dress','bottom'].map(s => state.items.find(i=>i.id===l.slots[s])).filter(Boolean);
  if (!its.length) return '<span class="plus" style="border-style:solid">·</span>';
  return its.map(i => garment(i.cat,i.style,i.color)).join('').replace(/<svg /g,'<svg style="display:block;width:34px;height:'+(its.length>1?'24':'40')+'px" ');
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

function wardrobe(){
  const have = state.items.filter(i=>i.have).length;
  const list = state.items.filter(i => ui.cat==='all' || i.cat===ui.cat);
  return `<h1 class="page-title">Your <em>wardrobe</em></h1>
  <p class="lede">Tick what you own. What is left unticked is your shopping list, and every piece is picked for an inverted triangle and warm undertone.</p>
  <div class="card" style="margin:20px 0 14px"><div class="row between"><b>${have} of ${state.items.length} owned</b><button class="btn small" data-act="add">Add a piece</button></div><div class="progress"><i style="width:${state.items.length?have/state.items.length*100:0}%"></i></div></div>
  <div class="chips" role="group" aria-label="Filter">${[['all','All'],...CATS].map(c=>`<button class="chip" aria-pressed="${ui.cat===c[0]}" data-act="cat" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${list.length?`<div class="grid" style="margin-top:12px">${list.map(itemCard).join('')}</div>`:`<div class="empty-state" style="margin-top:12px">Nothing here yet. Add your first piece.</div>`}`;
}
function itemCard(it){
  const r = rating(it);
  return `<div class="item ${it.have?'have':'need'}"><div class="pic" data-act="edit" data-v="${it.id}" role="button" tabindex="0" aria-label="Edit ${esc(it.name)}">${pic(it)}</div>
    <button class="tick" data-act="own" data-v="${it.id}" aria-pressed="${it.have}" aria-label="${it.have?'Owned':'Not owned'}: ${esc(it.name)}">${it.have?'✓':''}</button>
    <h3>${esc(it.name)}</h3><p>${esc(it.style)} · ${esc(colorName(it.color))}</p>
    ${r==='pos'?'<span class="tag ok">Balances</span>':r==='neg'?'<span class="tag warn">Style with care</span>':''}</div>`;
}

function looks(){
  return `<div class="row between"><h1 class="page-title">Your <em>looks</em></h1><button class="btn" data-act="newlook">Create a look</button></div>
  <p class="lede">Build outfits piece by piece, add nails, lips and hair, then drop them into your week.</p>
  ${state.looks.length?`<div class="grid wide" style="margin-top:22px">${state.looks.map(l=>`<div class="card"><button style="display:block;width:100%;text-align:left" data-act="editlook" data-v="${l.id}" aria-label="Edit ${esc(l.name)}">${board(l)}</button>
    <div class="row between" style="margin-top:12px"><div><h3 style="font-size:22px">${esc(l.name)}</h3><span class="status">${esc(l.occasion||'')}</span></div><button class="btn small ghost" data-act="dellook" data-v="${l.id}">Delete</button></div></div>`).join('')}</div>`
  :`<div class="empty-state" style="margin-top:22px">No looks yet. Tap “Create a look” to build your first one.</div>`}`;
}

function builder(){
  const d = ui.draft;
  const slots = d.slots.dress ? ['outer','dress','shoes','bag','jewel'] : ['outer','top','bottom','shoes','bag','jewel'];
  const notes = lookNotes(d);
  return `<button class="back" data-act="cancel">← Back</button>
  <h1 class="page-title" style="margin-bottom:18px">${d.id?'Edit':'Create a'} <em>look</em></h1>
  <div class="builder"><div>${board(d)}</div><div class="slots">
    <label>Name<input type="text" id="lname" value="${esc(d.name)}" placeholder="e.g. Sunday brunch" maxlength="40"></label>
    <label>Occasion<input type="text" id="locc" value="${esc(d.occasion)}" placeholder="e.g. Brunch, church, meetings" maxlength="50"></label>
    <div class="eyebrow" style="margin-top:8px">Inspiration pictures</div>
    <div class="picked">${(d.pics||[]).map(id=>(state.pics||[]).find(p=>p.id===id)).filter(Boolean).map(p=>`<img src="${p.src}" alt="">`).join('')}
      <button class="slotbtn" style="width:auto;min-height:72px" data-act="pickpics"><span class="thumb">＋</span><span><b>${(d.pics||[]).length?'Change pictures':'Choose pictures'}</b></span></button></div>
    <div class="eyebrow" style="margin-top:8px">Outfit</div>
    ${slots.map(s => { const it = state.items.find(i=>i.id===d.slots[s]);
      return `<button class="slotbtn" data-act="pick" data-v="${s}"><span class="thumb">${it?pic(it):'＋'}</span><span><b>${SLOT_LABEL[s]}</b><span>${it?esc(it.name):'Choose'}</span></span></button>`; }).join('')}
    ${d.slots.dress?`<button class="slotbtn" data-act="nodress"><span class="thumb">↺</span><span><b>Switch to top + bottom</b></span></button>`:`<button class="slotbtn" data-act="pick" data-v="dress"><span class="thumb">＋</span><span><b>Wear a dress instead</b></span></button>`}
    <div class="eyebrow" style="margin-top:12px">Nails</div>
    <div class="pick">${NAILS.map(n=>`<figure><button class="nail lg" style="background:${n[1]}" data-act="beauty" data-k="nails" data-v="${esc(n[0])}" aria-pressed="${d.beauty.nails===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div>
    <div class="eyebrow" style="margin-top:12px">Lips</div>
    <div class="pick">${LIPS.map(n=>`<figure><button class="nail lg" style="background:${n[1]};border-radius:50%;height:44px" data-act="beauty" data-k="lips" data-v="${esc(n[0])}" aria-pressed="${d.beauty.lips===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div>
    <div class="eyebrow" style="margin-top:12px">Hair</div>
    <div class="chips" style="flex-wrap:wrap">${HAIR.map(h=>`<button class="chip" data-act="beauty" data-k="hair" data-v="${esc(h)}" aria-pressed="${d.beauty.hair===h}">${esc(h)}</button>`).join('')}</div>
    ${notes.length?`<div class="eyebrow" style="margin-top:12px">Style check</div>${notes.map(n=>`<div class="note ${n.warn?'warn':''}">${esc(n.t)}</div>`).join('')}`:''}
    <button class="btn" style="margin-top:14px" data-act="savelook">Save look</button>
  </div></div>`;
}

function isNew(p){ return p.at && daysSince(p.at)<=7; }
function lastAdded(){ const d=(state.pics||[]).map(p=>p.at).filter(Boolean).sort().pop(); return d ? daysSince(d) : null; }
function mood(){
  const all = state.pics||[];
  const list = all.filter(p => inTag(p, ui.ptag));
  return `<div class="row between"><h1 class="page-title">Your <em>mood</em></h1>
    <label class="btn" style="display:inline-block;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px;color:var(--milk)">Upload pictures<input type="file" id="picup" accept="image/*" multiple hidden></label></div>
  <p class="lede">Save the outfits, hair, nails and makeup you love. When you build a look, pick from these to see your week.</p>
  <div class="chips" style="margin-top:18px" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${ui.ptag===c[0]}" data-act="ptag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div class="note" style="margin-top:14px" id="dropzone"><b>Add fresh looks anytime.</b> Save an image from Pinterest or take a screenshot, then upload it here. You can also drag pictures onto this page, or copy an image on your computer and paste it.</div>
  ${list.length?`<div class="pics" style="margin-top:12px">${list.map(p=>`<button class="pic-tile" data-act="picopen" data-v="${p.id}" aria-label="Open picture, ${esc(p.tag)}"><img src="${p.src}" alt=""><span class="tag">${esc(p.tag)}</span>${p.fav?'<span class="heart" aria-label="Favorite">♥</span>':''}${isNew(p)?'<span class="new">New</span>':''}</button>`).join('')}</div>`
  :`<div class="empty-state" style="margin-top:12px">${all.length?'No pictures here yet.':'No pictures yet. Tap “Upload pictures” and pick as many as you like.'}</div>`}`;
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
    const it = s.item;
    inner = `<h2>${s.isNew?'Add a piece':'Edit piece'}</h2><div class="slots">
      <label>Name<input type="text" id="iname" value="${esc(it.name)}" maxlength="40"></label>
      <label>Category<select id="icat" data-act="icat">${CATS.map(c=>`<option value="${c[0]}" ${it.cat===c[0]?'selected':''}>${c[1]}</option>`).join('')}</select></label>
      <label>Style<select id="istyle">${STYLES[it.cat].map(x=>`<option ${it.style===x[0]?'selected':''}>${x[0]}</option>`).join('')}</select></label>
      <div class="eyebrow">Color · ${esc(colorName(it.color))}</div>
      <div class="swatches">${COLORS.map(c=>`<button class="sw" style="background:${c[1]}" data-act="color" data-v="${c[1]}" aria-pressed="${it.color===c[1]}" aria-label="${c[0]}${c[2]===0?' (cool)':''}"></button>`).join('')}</div>
      <label>Photo (optional)<input type="file" id="iphoto" accept="image/*"></label>
      ${it.photo?`<img src="${it.photo}" alt="" style="width:120px;border-radius:12px">`:''}
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
  tab(v){ ui.tab=v; ui.draft=null; window.scrollTo(0,0); },
  cat(v){ ui.cat=v; },
  own(v){ const it=state.items.find(i=>i.id===v); it.have=!it.have; save(); },
  add(){ ui.sheet={type:'item',isNew:true,item:{id:uid(),cat:'top',name:'',style:STYLES.top[0][0],color:COLORS[2][1],have:true,photo:null}}; },
  edit(v){ ui.sheet={type:'item',item:{...state.items.find(i=>i.id===v)}}; },
  icat(){ readItemForm(); const it=ui.sheet.item; it.cat=document.getElementById('icat').value; it.style=STYLES[it.cat][0][0]; },
  color(v){ readItemForm(); ui.sheet.item.color=v; ui.sheet.item.photo=ui.sheet.item.photo; },
  saveitem(){ readItemForm(); const it=ui.sheet.item; if(!it.name){ it.name=it.style; }
    const i=state.items.findIndex(x=>x.id===it.id); if(i>=0) state.items[i]=it; else state.items.push(it); save(); ui.sheet=null; },
  delitem(){ const id=ui.sheet.item.id; state.items=state.items.filter(i=>i.id!==id);
    state.looks.forEach(l=>{ for(const k in l.slots) if(l.slots[k]===id) delete l.slots[k]; }); save(); ui.sheet=null; },
  close(){ ui.sheet=null; },
  overlay(v,e){ if(e.target.classList.contains('overlay')) ui.sheet=null; },
  newlook(){ ui.draft={name:'',occasion:'',slots:{},pics:[],beauty:{nails:NAILS[0][0],lips:LIPS[0][0],hair:HAIR[0]}}; window.scrollTo(0,0); },
  editlook(v){ ui.draft=JSON.parse(JSON.stringify(state.looks.find(l=>l.id===v))); window.scrollTo(0,0); },
  cancel(){ ui.draft=null; },
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
    save(); ui.draft=null; ui.tab='looks'; },
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
  wore(){ logToday(); save(); setToast('Logged. Nice work showing up.'); },
  done(v){ state.routine[v]=isoDay(); logToday(); save(); }
};
function syncDraft(){
  const n=document.getElementById('lname'), o=document.getElementById('locc');
  if(ui.draft && n){ ui.draft.name=n.value; ui.draft.occasion=o.value; }
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  const fn = actions[el.dataset.act];
  if (!fn) return;
  if (el.tagName==='SELECT') return;
  fn(el.dataset.v, {target:e.target, currentTarget:el});
  render();
});
function shrink(file){
  return new Promise(res => { const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>{
    const s=Math.min(1,640/Math.max(img.width,img.height)), c=document.createElement('canvas');
    c.width=img.width*s; c.height=img.height*s; c.getContext('2d').drawImage(img,0,0,c.width,c.height);
    res(c.toDataURL('image/jpeg',.75)); }; img.onerror=()=>res(null); img.src=fr.result; }; fr.onerror=()=>res(null); fr.readAsDataURL(file); });
}
async function addFiles(files){
  files=[...files].filter(f=>f.type.startsWith('image/'));
  if(!files.length) return;
  const inSheet=ui.sheet && ui.sheet.type==='pics';
  let tag = inSheet ? ui.sheet.tag : ui.ptag;
  if(!TAGS.includes(tag)) tag=TAGS[0];
  state.pics = state.pics||[]; let n=0;
  for (const f of files){ const src=await shrink(f); if(!src) continue;
    const p={id:uid(),src,tag,at:isoDay(),fav:false}; state.pics.unshift(p); n++;
    if(inSheet){ ui.draft.pics=ui.draft.pics||[]; ui.draft.pics.push(p.id); } }
  if(n && !ui.draft && !ui.sheet) ui.tab='mood';
  save(); render();
  if(n) setToast(n+(n===1?' picture added.':' pictures added.')+(inSheet?'':' Tap one to set its tag.'));
}
document.addEventListener('paste', e => { const fs=[...(e.clipboardData?.files||[])]; if(fs.length){ e.preventDefault(); addFiles(fs); } });
document.addEventListener('dragover', e => { if([...(e.dataTransfer?.types||[])].includes('Files')) e.preventDefault(); });
document.addEventListener('drop', e => { if(e.dataTransfer?.files?.length){ e.preventDefault(); addFiles(e.dataTransfer.files); } });
document.addEventListener('change', async e => {
  if ((e.target.id==='picup'||e.target.id==='picfab') && e.target.files.length){
    const fs=[...e.target.files]; e.target.value=''; await addFiles(fs); return;
  }
  if (e.target.id==='import' && e.target.files[0]){
    const fr=new FileReader();
    fr.onload=()=>{ try{ const s=JSON.parse(fr.result); if(!Array.isArray(s.items)||!Array.isArray(s.looks)) throw 0;
      if(!confirm('Replace what is on this device with the backup?')) return;
      state={plan:{},routine:{},log:[],pics:[],...s}; save(); render(); setToast('Backup loaded.'); }
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
      ui.sheet.item.photo = c.toDataURL('image/jpeg',.8); render(); };
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
