(() => {
'use strict';

/* ---------- data ---------- */
const KEY = 'muse.v1';
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYFULL = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const CATS = [
  ['top','Tops'],['bottom','Bottoms'],['dress','Dresses'],['outer','Outerwear'],
  ['shoes','Shoes'],['bag','Bags'],['jewel','Jewelry']
];
const WCATS = [['top','Tops'],['pants','Pants'],['skirts','Skirts'],['dress','Dresses'],['outer','Outerwear'],['shoes','Shoes'],['bag','Bags'],['jewel','Jewelry']];
const SLOT_LABEL = {top:'Top',bottom:'Bottom',dress:'Dress',outer:'Outerwear',shoes:'Shoes',bag:'Bag',jewel:'Jewelry'};
// pos = balances an inverted triangle, neg = adds width up top or narrows the hip
const STYLES = {
  top:[['V-neck','pos'],['Wrap top','pos'],['Scoop neck','pos'],['Fitted knit','ok'],['Bodysuit','ok'],['Boat neck','neg'],['Puff sleeve','neg'],['Halter','neg'],['Off-shoulder','neg']],
  bottom:[['Wide-leg trousers','pos'],['A-line skirt','pos'],['Flared jeans','pos'],['Pleated skirt','pos'],['Wrap skirt','pos'],['Patch-pocket cargos','pos'],['Pants','ok'],['Skirt','ok'],['Straight jeans','ok'],['Tailored trousers','ok'],['Pencil skirt','neg'],['Skinny','neg']],
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
  ['Lavender','#b7a6d3',0],['Silver grey','#a9adb3',0],['Charcoal','#4a4845',2],['Champagne','#dccdb4',1],['Mocha brown','#5a3a22',1]
];
const ICONS = {
  lashes:'<path d="M2.5 14c3-5 6.5-7 9.500-7s6.500 2 9.500 7c-3 5-6.500 7-9.500 7s-6.500-2-9.500-7z"/><circle cx="12" cy="14" r="3"/><path d="M5 9 3.500 6.500M9 7 8.200 4M15 7l.8-3M19 9l1.500-2.500"/>',
  brows:'<path d="M3 13c3-5 9-7 18-3"/><path d="M5 18c3-3 8-4 14-2" opacity=".55"/>',
  lips:'<path d="M3 12c3-3 5-4 9-2 4-2 6-1 9 2-3 5-6 7-9 7s-6-2-9-7z" fill="currentColor" fill-opacity=".25"/><path d="M3 12c5 1.500 13 1.500 18 0"/>',
  face:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
  hair:'<path d="M6 3c3 4-3 6 0 10s-3 6 0 8M12 3c3 4-3 6 0 10s-3 6 0 8M18 3c3 4-3 6 0 10s-3 6 0 8"/>',
  body:'<rect x="8" y="9" width="8" height="12" rx="2"/><path d="M10 9V6h4v3M11 6V3.500h2V6"/>',
  polish:'<rect x="8" y="10" width="8" height="10" rx="2"/><path d="M10 10V6.500h4V10M11 6.500V3h2v3.500"/>',
  outfit:'<path d="M12 8V6.500A2 2 0 1 0 10 5M12 8l9 7.500H3L12 8z"/>',
  other:'<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/>'
};
const ROUTINE_ICON = {nails:'nails',lashes:'lashes',brows:'brows',hairwash:'hair',hairtrim:'hair',face:'face',body:'body',lips:'lips',pedi:'polish'};
const TYPE_ICON = {hair:'hair',nails:'nails',lashes:'lashes',brows:'brows',skin:'face',pedi:'polish',outfit:'outfit',other:'other'};
function ticon(name, ok){
  if(name==='nails') return `<i class="nail" style="background:${ok?'#cdd6c1':'#e6cfc5'};width:22px;height:30px;flex:none"></i>`;
  return `<span class="ticon ${ok?'ok':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.other}</svg></span>`;
}
const CART = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L20 8H6.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="19" r="1.4" fill="currentColor"/><circle cx="17" cy="19" r="1.4" fill="currentColor"/></svg>';
const SHOPS = [
  ['H&M','https://www2.hm.com/de_de/search-results.html?q={q}'],
  ['New Yorker','https://www.google.com/search?q={q}+site%3Anewyorker.de'],
  ['SHEIN','https://de.shein.com/pdsearch/{q}/'],
  ['Mango','https://www.google.com/search?q={q}+site%3Ashop.mango.com'],
  ['ASOS','https://www.asos.com/de/search/?q={q}'],
  ['About You','https://www.aboutyou.de/suche?term={q}'],
  ['Zalando','https://www.zalando.de/catalog/?q={q}'],
  ['Zara','https://www.zara.com/de/de/search?searchTerm={q}'],
  ['C&A','https://www.google.com/search?q={q}+site%3Ac-and-a.com'],
  ['Bershka','https://www.google.com/search?q={q}+site%3Abershka.com'],
  ['OTTO','https://www.otto.de/suche/{q}/'],
  ['Amazon','https://www.amazon.de/s?k={q}&i=fashion'],
  ['Vinted (second-hand)','https://www.vinted.de/catalog?search_text={q}'],
  ['All shops (Google Shopping)','https://www.google.com/search?tbm=shop&q={q}']
];
const COLOR_DE = {'Chocolate':'Schokobraun','Espresso':'Dunkelbraun','Camel':'Camel','Caramel':'Karamell','Rust':'Rostrot','Terracotta':'Terrakotta','Coral':'Koralle','Mustard':'Senfgelb','Gold':'Gold','Olive':'Oliv','Forest':'Waldgrün','Burgundy':'Bordeaux','Blush nude':'Nude','Warm cream':'Creme','Ivory':'Elfenbein','Black':'Schwarz','White':'Weiß','Denim':'Jeansblau','Navy':'Marineblau','Icy pink':'Rosa','Lavender':'Lavendel','Silver grey':'Grau','Charcoal':'Anthrazit','Champagne':'Champagner','Mocha brown':'Braun'};
const STYLE_DE = {'V-neck':'V-Ausschnitt Bluse','Wrap top':'Wickelbluse','Scoop neck':'Top mit rundem Ausschnitt','Fitted knit':'Feinstrickpullover','Bodysuit':'Body','Wide-leg trousers':'Hose mit weitem Bein','A-line skirt':'A-Linie Rock','Flared jeans':'Schlaghose Jeans','Pleated skirt':'Plisseerock','Wrap skirt':'Wickelrock','Pencil skirt':'Bleistiftrock','Straight jeans':'Straight Jeans','Tailored trousers':'Anzughose','Pants':'Hose','Skirt':'Rock','Wrap dress':'Wickelkleid','A-line dress':'A-Linien Kleid','Longline coat':'Langer Mantel','Belted trench':'Trenchcoat','Soft blazer':'Blazer','Heeled sandal':'Sandalen mit Absatz','Pointed pump':'Pumps','Ankle boot':'Stiefeletten','Clean sneaker':'Sneaker','Shoulder bag':'Umhängetasche','Mini bag':'Mini Tasche','Tote':'Shopper'};
const NOUN_DE = {top:'Bluse',bottom:'Hose',dress:'Kleid',outer:'Jacke',shoes:'Schuhe',bag:'Tasche',jewel:'Schmuck'};
function shopQuery(it, v, lang){
  const cn = colorName(v.color);
  if(lang==='de') return ((COLOR_DE[cn]||cn)+' '+(STYLE_DE[it.style]||NOUN_DE[it.cat]||it.name)+' Damen').trim();
  return (cn+' '+it.name+' women').trim();
}
const allShops = () => [...SHOPS, ...((state.shops||[]).map(s => [s.name, s.url]))];
const shopUrl = (tpl, q) => tpl.replace('{q}', encodeURIComponent(q));
const OCC = ['Casual Outing','Formal Event','Birthday Party','Special Occasion','Work','Church','Date Night','Brunch','Travel'];
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
const HAIR = ['Blowout','Braids','Silk press','Curls','Afro','Updo','Sleek bun','Ponytail','Half-up','Other'];
const HCATS = [['Wigs','Wigs'],['Braids','Braids'],['Natural','Natural & blowout']];
const hcatName = c => (HCATS.find(x=>x[0]===c)||['','Natural & blowout'])[1];
const HCOLORS = [['Jet black','#141010'],['Soft black','#2a1d1a'],['Dark brown','#3d2618'],['Chestnut','#5b3a24'],['Auburn','#7a3b22'],['Honey blonde','#b88a4a'],['Blonde','#d8bc84'],['Burgundy','#5a1f2b'],['Silver grey','#9a9a9a']];
const bottomGroup = it => /skirt/i.test(it.style) ? 'Skirts' : 'Pants';
const NOUN = {top:'top',dress:'dress',outer:'jacket',shoes:'shoes',bag:'bag',jewel:'jewelry'};
function catActive(f,c){ return c==='pants' ? f.cat==='bottom' && f.kind==='pants' : c==='skirts' ? f.cat==='bottom' && f.kind==='skirt' : f.cat===c; }
function applyCat(f,c){ if(c==='pants'){ f.cat='bottom'; f.kind='pants'; } else if(c==='skirts'){ f.cat='bottom'; f.kind='skirt'; } else f.cat=c; }
function autoName(f){ const kind = f.kind || 'pants'; const noun = f.cat==='bottom' ? (kind==='skirt'?'skirt':'pants') : (NOUN[f.cat]||'piece'); return colorName(f.hex)+' '+noun; }
const hairName = hex => (HCOLORS.find(c => c[1]===hex)||['Hair color'])[0];

const ROUTINE = [
  ['nails','Nail fill or fresh set',21],['lashes','Lash lift or fill',28],['brows','Brow shaping',21],
  ['hairwash','Wash + deep condition',7],['hairtrim','Trim or hair treatment',56],
  ['face','Exfoliate + face mask',7],['body','Body scrub + oil',7],['lips','Lip scrub + mask',7],['pedi','Pedicure',28]
];

const PCHIPS = [['all','All'],['fav','Favorites'],...TAGS.map(t=>[t,t])];
const inTag = (p,t) => t==='all' || (t==='fav' ? p.fav : p.tag===t);
const uid = () => Math.random().toString(36).slice(2,9);
const esc = s => String(s ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isoDay = (d=new Date()) => { const z = new Date(d.getTime()-d.getTimezoneOffset()*6e4); return z.toISOString().slice(0,10); };
const dow = (d=new Date()) => (d.getDay()+6)%7;
const daysSince = iso => Math.floor((new Date(isoDay())-new Date(iso))/864e5);

const vOf = (it, vid) => it.variants.find(v => v.id===vid) || it.variants.find(v => v.have) || it.variants[0];
const syncHave = it => { it.have = it.variants.some(v => v.have); };
const STAGES = [['wish','Wish list'],['cart','In cart'],['ordered','On its way'],['own','In my closet']];
const SEGL = {wish:'Wish',cart:'Cart',ordered:'Order',own:'Own'};
const money = n => n ? Number(n).toLocaleString('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0}) : '–';
function setSt(v, st){ v.status = st; v.have = st==='own'; }
function migrate(it){ it.occasions = it.occasions || []; (it.variants||[]).forEach(v => { if(!v.status) v.status = v.have ? 'own' : 'wish'; v.have = v.status==='own'; }); if(!it.variants) it.variants=[{id:uid(),color:it.color,photo:it.photo||null,have:!!it.have}]; syncHave(it); }
let state = {items:[], looks:[], plan:{}, routine:{}, log:[], pics:[], appts:[]};
let booted = false;
function init(){
  state.appts = state.appts || [];
  if(!state.seededItems && window.MUSE_SEED_ITEMS){ state.items.unshift(...JSON.parse(JSON.stringify(window.MUSE_SEED_ITEMS))); state.seededItems=true; }
  state.seedAdded = state.seedAdded || {};
if(window.MUSE_SEED_ITEMS){ window.MUSE_SEED_ITEMS.forEach(s => { if(state.seedAdded[s.id]) return; state.seedAdded[s.id] = true;
  if(!state.items.some(i => i.id===s.id)){ const c = JSON.parse(JSON.stringify(s)); c.have = false; c.variants.forEach(v => setSt(v,'wish')); state.items.unshift(c); } }); }
state.seedVars = state.seedVars || {};
if(window.MUSE_SEED_ITEMS){
  window.MUSE_SEED_ITEMS.forEach(s => { const it = state.items.find(i => i.id===s.id); if(!it) return; it.variants = it.variants || [];
    s.variants.forEach(sv => { if(state.seedVars[sv.id]) return; state.seedVars[sv.id] = true;
      const v = it.variants.find(x => x.id===sv.id);
      if(!v){ const c = JSON.parse(JSON.stringify(sv)); setSt(c,'wish'); it.variants.push(c); } else if(!v.photo && sv.photo){ v.photo = sv.photo; } }); });
}
if(!state.cleanup1){
    state.items = state.items.filter(i => !/^s\d+$/.test(i.id));
    state.items.forEach(i => { if(['x1','x2','x3'].includes(i.id) && i.variants){ const keep = i.variants.filter(v => v.photo); if(keep.length) i.variants = keep; } });
    state.cleanup1 = true;
  }
  if(!state.ownReset1){ state.items.forEach(i => { if(/^x\d+$/.test(i.id)) (i.variants||[]).forEach(v => setSt(v,'wish')); }); state.ownReset1 = true; }
  state.items.forEach(migrate);
  if(!state.seedFix){ const sp=(state.pics||[]).find(p=>p.id==='seed4'&&p.tag==='Makeup'); if(sp) sp.tag='Hair'; state.seedFix=true; }
  state.seedPics = state.seedPics || {};
if(window.MUSE_SEED){
  if(state.seeded){ ['seed0','seed1','seed2','seed3','seed4'].forEach(id => state.seedPics[id] = true); }
  state.pics = state.pics || [];
  window.MUSE_SEED.forEach(sp => { if(state.seedPics[sp.id]) return; state.seedPics[sp.id] = true; if(!state.pics.some(p => p.id===sp.id)) state.pics.unshift(JSON.parse(JSON.stringify(sp))); });
  state.seeded = true;
}
  (state.pics||[]).forEach(p => { if(p.tag==='Hair' && !p.style){ p.style = p.id==='seed4' ? 'Blowout' : 'Other'; } if(p.tag==='Hair' && !p.hcolor) p.hcolor = '#141010'; if(p.tag==='Hair' && !p.hcat){ p.hcat = p.style==='Braids' ? 'Braids' : ['seed10','seed11','seed12'].includes(p.id) ? 'Wigs' : 'Natural'; } });
}

/* ---------- storage: IndexedDB (big photos fit), autosave, and unfinished-work drafts ---------- */
const DRAFT_KEY = 'muse.draft';
let saveTimer = null, dirty = false, draftTimer = null, lastDraft = '';
function idb(){ return new Promise((res,rej) => { const r = indexedDB.open('muse',1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
async function idbGet(k){ const db = await idb(); return new Promise((res,rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); }
async function idbSet(k,v){ const db = await idb(); return new Promise((res,rej) => { const t = db.transaction('kv','readwrite'); t.objectStore('kv').put(v,k); t.oncomplete = () => res(); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); }
function flash(){ const el = document.getElementById('savedmark'); if(el){ el.classList.add('on'); clearTimeout(flash.t); flash.t = setTimeout(() => el.classList.remove('on'), 1600); } }
function save(){ dirty = true; clearTimeout(saveTimer); saveTimer = setTimeout(persist, 250); }
async function persist(){
  if(!dirty && booted) return; dirty = false; clearTimeout(saveTimer);
  try { await idbSet(KEY, state); flash(); }
  catch(e){ try { localStorage.setItem(KEY, JSON.stringify(state)); flash(); } catch(e2){ toast = 'Storage is full. Remove a photo to keep saving.'; render(); } }
}
function draftSnapshot(){
  const sh = ui.sheet && ['sort','appt','item'].includes(ui.sheet.type) ? ui.sheet : (ui.sheet && ui.sheet.type==='apppics' ? {type:'appt',isNew:ui.sheet.isNew} : null);
  if(sh && sh.type==='appt' && !ui.adraft) return null;
  if(!ui.draft && !sh) return null;
  return {tab:ui.tab, draft:ui.draft, btab:ui.btab, omode:ui.omode, assignDay:ui.assignDay, sheet:sh, adraft:ui.adraft, calSel:ui.calSel, cal:ui.cal};
}
async function flushDraft(){
  if(!booted) return; const snap = draftSnapshot(), str = snap ? JSON.stringify(snap) : '';
  if(str===lastDraft) return; lastDraft = str;
  try { await idbSet(DRAFT_KEY, snap); flash(); } catch(e){}
}
function saveDraftSoon(){ clearTimeout(draftTimer); draftTimer = setTimeout(flushDraft, 400); }
function restoreDraft(d){
  if(!d) return false;
  ui.tab = d.tab || ui.tab; ui.draft = d.draft || null; ui.btab = d.btab || 'outfit'; ui.omode = d.omode || 'split';
  ui.assignDay = d.assignDay ?? null; ui.adraft = d.adraft || null; ui.sheet = d.sheet || null;
  if(ui.sheet && ui.sheet.type==='appt' && !ui.adraft) ui.sheet = null;
  if(d.calSel) ui.calSel = d.calSel; if(d.cal) ui.cal = d.cal;
  lastDraft = JSON.stringify(d);
  return !!(ui.draft || ui.sheet);
}
async function boot(){
  let s = null, fromLocal = false;
  try { s = await idbGet(KEY); } catch(e){}
  if(!s){ try { s = JSON.parse(localStorage.getItem(KEY)); fromLocal = !!s; } catch(e){} }
  if(s && Array.isArray(s.items)) state = s;
  init(); dirty = true; await persist();
  if(fromLocal){ try { const chk = await idbGet(KEY); if(chk && chk.items && chk.items.length===state.items.length) localStorage.removeItem(KEY); } catch(e){} }
  try { if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  let restored = false; try { restored = restoreDraft(await idbGet(DRAFT_KEY)); } catch(e){}
  booted = true; render();
  if(restored) setToast('Picked up where you left off.');
}
document.addEventListener('visibilitychange', () => { if(document.visibilityState==='hidden'){ persist(); flushDraft(); } });
window.addEventListener('pagehide', () => { persist(); flushDraft(); });

let ui = {tab:'today', cat:'all', draft:null, sheet:null, ptag:'all', occ:'all', selMode:false, sel:[], hsel:{}, stage:'all', acc:{}, hc:'all', bg:'all', lightbox:null, vsel:{}, sty:'all', cal:{y:new Date().getFullYear(),m:new Date().getMonth()}, calSel:isoDay(), adraft:null, btab:'outfit', omode:'split', tsrc:'ward', cfil:'all', assignDay:null};
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
  const tabs = [['today','Today'],['wardrobe','Wardrobe'],['closet','Closet'],['looks','Looks'],['mood','Mood'],['calendar','Calendar'],['beauty','Beauty']];
  const body = ui.draft ? builder() : {today,wardrobe,closet,looks,mood,calendar,beauty}[ui.tab]();
  return `<div class="brand brand-fixed" aria-hidden="true">Muse</div>
  <main class="shell"><header class="top"><span class="saved" id="savedmark" role="status">✓ Saved</span><span class="eyebrow">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span></header>${body}</main>
  <nav class="nav" aria-label="Main"><div class="nav-in">${tabs.map(t=>`<button data-act="tab" data-v="${t[0]}" ${ui.tab===t[0]&&!ui.draft?'aria-current="page"':''}>${t[1]}</button>`).join('')}</div></nav>
  ${ui.sheet || ui.draft || ui.tab==='calendar' ? '' : `<label class="fab" title="Add pictures" aria-label="Add pictures"><span aria-hidden="true">＋</span><input type="file" id="picfab" accept="image/*" multiple hidden></label>`}${ui.sheet ? sheet() : ''}${ui.lightbox?`<div class="lightbox" data-act="lbclose" role="dialog" aria-label="Photo"><img src="${ui.lightbox}" alt=""></div>`:''}${toast?`<div role="status" class="note warn" style="position:fixed;left:16px;right:16px;bottom:80px;z-index:50;max-width:420px;margin:auto">${esc(toast)}</div>`:''}`;
}

function today(){
  const d = dow(), td = isoDay();
  const dayOutfit = state.appts.find(x => x.type==='outfit' && x.date===td && !x.done && x.lookId && state.looks.some(l => l.id===x.lookId));
  const look = dayOutfit ? state.looks.find(l => l.id===dayOutfit.lookId) : state.looks.find(l => l.id===state.plan[d]);
  const week = DAYS.map((n,i) => {
    const l = state.looks.find(x => x.id===state.plan[i]);
    return `<div class="day" ${i===d?'aria-current="date"':''}><button class="dayb" data-act="assign" data-v="${i}" aria-label="${n}: ${l?esc(l.name):'no look planned'}">
      <small>${n}</small>${l?`<div class="mini thumbboard">${boardParts(l).core}</div>`:`<span class="plus">+</span>`}</button>${l?`<button class="dayx" data-act="clearplan" data-v="${i}" aria-label="Remove ${DAYFULL[i]}'s look">✕</button>`:''}</div>`;
  }).join('');
  const due = ROUTINE.map(r => ({r, left: dueIn(r)})).sort((a,b)=>a.left-b.left).slice(0,3);
  const checked = weekLog();
  const have = state.items.reduce((n,i)=>n+i.variants.filter(v=>v.have).length,0), all = state.items.reduce((n,i)=>n+i.variants.length,0);
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
        <button class="btn ${look?'ghost':'gold'}" style="${look?'color:var(--milk);border-color:rgba(255,255,255,.4)':''}" data-act="assign" data-v="${d}">${look?'Change':'Plan today'}</button>
        ${look&&!dayOutfit?`<button class="btn ghost" style="color:var(--milk);border-color:rgba(255,255,255,.4)" data-act="clearplan" data-v="${d}">Remove</button>`:''}
      </div>
    </div>
    ${look?`<div>${board(look,true)}</div>`:''}
  </div>
  <section><div class="row between"><h2>This week</h2><span class="eyebrow">Tap a day</span></div><div class="week" style="margin-top:14px">${week}</div><div style="margin-top:14px"><button class="btn small ghost" data-act="autoweek">Plan my week from my closet</button></div></section>
  ${startRail()}
  ${prepToday()}
  ${freshNudge()}
  <section><h2>Due next</h2><div class="list" style="margin-top:14px">${due.map(x=>task(x.r)).join('')}</div></section>
  <section><div class="card"><div class="eyebrow">My closet</div><h3 style="font-size:26px;margin:6px 0">${have} of ${all} wardrobe colors owned</h3>
    <div class="progress"><i style="width:${all?have/all*100:0}%"></i></div></div></section>`;
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
    const pool = src==='hair' ? hairGroups().map(g => g.pics[0]) : (state.pics||[]).filter(p => p.tag===tag);
    rail = pool.map(p => `<button class="ptile" data-act="startpic" data-v="${p.id}:${src}" aria-label="Start a look with this ${tag.toLowerCase()} picture"><img src="${p.src}" alt=""></button>`).join('') +
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
  return `<div class="task">${ticon(ROUTINE_ICON[r[0]]||'other', left>0)}
    <div class="grow"><h3>${esc(r[1])}</h3><div class="status ${left<0?'over':''}">${txt} · every ${r[2]} days</div></div>
    <button class="btn small ${left<=0?'':'ghost'}" data-act="done" data-v="${r[0]}">Done</button></div>`;
}
function weekLog(){ let n=0; for(let i=0;i<7;i++){ const d=new Date(); d.setDate(d.getDate()-i); if(state.log.includes(isoDay(d))) n++; } return n; }

function dots(it, cur, act, key){
  return it.variants.length>1 ? `<div class="vdots" role="group" aria-label="Colors">${it.variants.map(x=>`<button class="vdot ${x.id===cur?'on':''}" style="background:${x.color}" data-act="${act}" data-v="${key}:${x.id}" aria-pressed="${x.id===cur}" aria-label="${esc(colorName(x.color))}${x.have?'':' (on list)'}"></button>`).join('')}</div>` : '';
}
function pdp(s){
  const it = state.items.find(i => i.id===s.id); if(!it) return '';
  const v = vOf(it, ui.vsel[it.id]);
  const img = v.photo ? `<img src="${v.photo}" alt="${esc(it.name)}, ${esc(colorName(v.color))}">` : `<div class="pdp-draw">${garment(it.cat,it.style,v.color)}</div>`;
  return `<div class="pdp-img">${img}${v.photo?`<button class="expand" data-act="lightbox" data-v="${it.id}" aria-label="View larger">⤢</button>`:`<label class="btn small pdp-add">Add a photo of this color<input type="file" id="pdpphoto" accept="image/*" hidden></label>`}</div>
  <div class="pdp-body"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap"><h2 class="pdp-name">${esc(it.name)}</h2><button class="pdp-x" data-act="close" aria-label="Close">✕</button></div>
    <p class="pdp-color">${esc(colorName(v.color))}${v.have?'':' · on my list'}</p>
    <div class="pdp-count">${it.variants.length} color${it.variants.length===1?'':'s'}</div>
    <div class="pdp-dots" role="group" aria-label="Colors">${it.variants.map(x=>`<button class="pdp-dot ${x.id===v.id?'on':''} ${x.have?'':'off'}" data-act="vpick" data-v="${it.id}:${x.id}" aria-pressed="${x.id===v.id}" aria-label="${esc(colorName(x.color))}${x.have?'':' (on list)'}"><i style="background:${x.color}"></i></button>`).join('')}</div>
    <div class="eyebrow" style="margin-top:22px">Where is each color?</div>
    <div class="strows">${it.variants.map(x=>`<div class="strow"><span class="stname"><i style="background:${x.color}"></i>${esc(colorName(x.color))}</span><div class="seg" role="group" aria-label="${esc(colorName(x.color))}">${STAGES.map(s=>`<button class="segb ${x.status===s[0]?'on':''}" data-act="setstatus" data-v="${it.id}:${x.id}:${s[0]}" aria-pressed="${x.status===s[0]}">${SEGL[s[0]]}</button>`).join('')}</div></div>`).join('')}</div>
    <label class="pricef">Price per piece, €<input type="number" inputmode="decimal" min="0" step="1" id="pprice" value="${it.price||''}" placeholder="0"></label>
    ${v.have&&it.price?`<p class="status" style="margin-top:8px">${(state.wears||{})[v.id]?`Worn ${(state.wears[v.id]).n}× · ${money(it.price/state.wears[v.id].n)} per wear`:'Not worn yet. Cost per wear starts after your first outfit.'}</p>`:''}
    ${(it.occasions||[]).length?`<div class="pdp-occ">${it.occasions.map(o=>`<span>${esc(o)}</span>`).join('')}</div>`:''}
    <div class="row" style="margin-top:20px"><button class="btn" data-act="own" data-v="${it.id}">${v.have?'✓ In my closet':'Add to my closet'}</button><button class="btn ghost" data-act="pdplook" data-v="${it.id}">Add to a look</button><button class="btn ghost" data-act="shop" data-v="${it.id}" aria-label="Shop this piece">${CART} Shop</button><button class="btn ghost" data-act="edit" data-v="${it.id}">Edit</button></div></div>`;
}
function stageStats(){
  const out = {}; STAGES.forEach(s => out[s[0]] = {n:0,sum:0,pics:[]});
  state.items.forEach(it => it.variants.forEach(v => { const o = out[v.status||'wish']; o.n++; o.sum += Number(it.price)||0; if(o.pics.length<4) o.pics.push({it,v}); }));
  return out;
}
function pipeline(){
  const st = stageStats(), total = STAGES.reduce((n,s)=>n+st[s[0]].n,0), toSpend = st.cart.sum + st.ordered.sum;
  return `<section class="pipe-wrap" aria-label="Wardrobe pipeline">
    <div class="pipe-head"><span class="eyebrow">Pipeline</span><span class="pipe-sum">${toSpend?`${money(toSpend)} still to spend`:`${total} colors tracked`}</span></div>
    <div class="pipe">${STAGES.map((s,i) => { const o = st[s[0]];
      return `<button class="stage ${ui.stage===s[0]?'on':''} s-${s[0]}" data-act="stage" data-v="${s[0]}" aria-pressed="${ui.stage===s[0]}">
        <span class="stbar" aria-hidden="true"></span>
        <span class="stlabel">${s[1]}</span>
        <span class="stnum">${o.n}</span>
        <span class="stmoney">${o.sum?money(o.sum):'&nbsp;'}</span>
        <span class="stthumbs" aria-hidden="true">${o.pics.map(p=>`<i>${pic(p.it,p.v)}</i>`).join('')}</span></button>`; }).join('')}</div>
  </section>`;
}
function stageVariant(it){
  if(ui.stage!=='all'){ const pick = it.variants.find(x => x.id===ui.vsel[it.id] && x.status===ui.stage) || it.variants.find(x => x.status===ui.stage); if(pick) return pick; }
  return vOf(it, ui.vsel[it.id]);
}
function wardrobe(){
  const inCat = state.items.filter(i => ui.cat==='all' || (ui.cat==='pants' ? i.cat==='bottom' && bottomGroup(i)==='Pants' : ui.cat==='skirts' ? i.cat==='bottom' && bottomGroup(i)==='Skirts' : i.cat===ui.cat));
  const styles = [...new Set(inCat.map(i=>i.style))];
  const occs = [...new Set(state.items.flatMap(i => i.occasions||[]))];
  const list = inCat.filter(i => ui.sty==='all' || i.style===ui.sty).filter(i => ui.occ==='all' || (i.occasions||[]).includes(ui.occ)).filter(i => ui.stage==='all' || i.variants.some(v => v.status===ui.stage));
  return `<h1 class="page-title">Your <em>wardrobe</em></h1>
  <p class="lede">Every piece you want, track it from wish to closet.</p>
  ${pipeline()}
  <div class="toolbar"><label class="btn small" style="cursor:pointer">Upload photos<input type="file" id="wardup" accept="image/*" multiple hidden></label><button class="btn small ghost" data-act="add">Add a piece</button><button class="btn small ghost" data-act="smart">Smart merge</button><button class="btn small ghost" data-act="selmode">${ui.selMode?'Cancel':'Select'}</button></div>
  <div class="chips" role="group" aria-label="Category">${[['all','All'],...WCATS].map(c=>`<button class="chip" aria-pressed="${ui.cat===c[0]}" data-act="cat" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${ui.cat!=='all'&&styles.length>1?`<div class="chips" role="group" aria-label="Style">${[['all','All styles'],...styles.map(s=>[s,s])].map(c=>`<button class="chip s" aria-pressed="${ui.sty===c[0]}" data-act="sty" data-v="${esc(c[0])}">${esc(c[1])}</button>`).join('')}</div>`:''}
  ${occs.length?`<div class="chips" role="group" aria-label="Occasion">${[['all','Any occasion'],...occs.map(o=>[o,o])].map(c=>`<button class="chip s" aria-pressed="${ui.occ===c[0]}" data-act="occ" data-v="${esc(c[0])}">${esc(c[1])}</button>`).join('')}</div>`:''}
  ${list.length?`<div class="grid" style="margin-top:18px">${list.map(itemCard).join('')}</div>`:`<div class="empty-state" style="margin-top:18px">${ui.stage==='all'?'Nothing here yet. Upload photos of your clothes to start.':'Nothing in this stage yet. Open a piece and move a color here.'}</div>`}
  ${ui.selMode?`<div class="selbar"><span>${ui.sel.length} selected</span><button class="btn small" data-act="mergesel">Merge as colors</button></div>`:''}`;
}
function itemCard(it){
  const v = stageVariant(it), r = rating(it), on = ui.selMode && ui.sel.includes(it.id);
  const stl = (STAGES.find(s=>s[0]===v.status)||STAGES[0])[1];
  return `<div class="item ${v.have?'have':'need'} ${on?'sel':''}"><div class="pic" data-act="${ui.selMode?'selpick':'pdp'}" data-v="${it.id}" role="button" tabindex="0" aria-label="View ${esc(it.name)}">${pic(it,v)}</div>
    <button class="cart" ${ui.selMode?'hidden':''} data-act="shop" data-v="${it.id}" aria-label="Shop ${esc(it.name)} in ${esc(colorName(v.color))}">${CART}</button>
    <button class="tick" ${ui.selMode?'hidden':''} data-act="own" data-v="${it.id}" aria-pressed="${v.have}" aria-label="${v.have?'In my closet':'Not in my closet'}: ${esc(it.name)}, ${esc(colorName(v.color))}">${v.have?'✓':''}</button>
    <h3>${esc(it.name)}</h3><p>${esc(colorName(v.color))}${it.price?' · '+money(it.price):''}</p>
    <span class="stag st-${v.status}">${stl}</span>
    ${dots(it,v.id,'vpick',it.id)}
    ${r==='pos'?'<span class="tag ok">Balances</span>':r==='neg'?'<span class="tag warn">Style with care</span>':''}</div>`;
}
function wearInfo(it, v){
  const w = (state.wears||{})[v.id], n = w ? w.n : 0;
  if(!n) return it.price ? ' · not worn yet' : '';
  return ` · worn ${n}×${it.price ? ' · '+money(it.price/n)+'/wear' : ''}`;
}
function todayLook(){
  const d = dow(), td = isoDay();
  const ao = state.appts.find(x => x.type==='outfit' && x.date===td && !x.done && x.lookId && state.looks.some(l => l.id===x.lookId));
  return ao ? state.looks.find(l => l.id===ao.lookId) : state.looks.find(l => l.id===state.plan[d]);
}
function autoWeek(){
  const owned = c => { const out = []; state.items.filter(i => i.cat===c).forEach(it => it.variants.forEach(v => { if(v.have) out.push({it,v}); })); return out; };
  const P = {top:owned('top'),bottom:owned('bottom'),dress:owned('dress'),outer:owned('outer'),shoes:owned('shoes'),bag:owned('bag'),jewel:owned('jewel')};
  const worn = v => (state.wears && state.wears[v.id]) ? state.wears[v.id].n : 0, used = {};
  const pick = list => { if(!list.length) return null; const ok = list.filter(x => rating(x.it)!=='neg'), pool = ok.length ? ok : list;
    const score = x => (used[x.v.id]||0)*3 + worn(x.v)*0.1 + Math.random();
    const x = [...pool].sort((p,q) => score(p)-score(q))[0]; used[x.v.id] = (used[x.v.id]||0)+1; return x; };
  let made = 0;
  for(let i=0; i<7; i++){
    if(state.plan[i]) continue;
    const slots = {}, vars = {};
    const useDress = P.dress.length && (!P.top.length || !P.bottom.length || Math.random()<.3);
    if(useDress){ const x = pick(P.dress); slots.dress = x.it.id; vars.dress = x.v.id; }
    else if(P.top.length && P.bottom.length){ const t = pick(P.top), b = pick(P.bottom); slots.top = t.it.id; vars.top = t.v.id; slots.bottom = b.it.id; vars.bottom = b.v.id; }
    else continue;
    ['outer','shoes','bag','jewel'].forEach(c => { const x = (P[c].length && (c==='shoes' || Math.random()<.5)) ? pick(P[c]) : null; if(x){ slots[c] = x.it.id; vars[c] = x.v.id; } });
    const look = {id:uid(),name:DAYFULL[i]+' look',occasion:'',slots,vars,pics:[],beauty:{nails:NAILS[0][0],lips:LIPS[0][0],hair:HAIR[0]},forDay:i};
    state.looks.push(look); state.plan[i] = look.id; made++;
  }
  save();
  setToast(made ? `Planned ${made} day${made===1?'':'s'} from your closet.` : (Object.keys(state.plan).length>=7 ? 'Your week is already planned.' : 'Tick colors you own first, then plan your week.'));
}
function closet(){
  const owned = []; state.items.forEach(it => it.variants.forEach(v => { if(v.have) owned.push({it,v}); }));
  const inGroup = (o,k) => k==='pants' ? o.it.cat==='bottom' && bottomGroup(o.it)==='Pants' : k==='skirts' ? o.it.cat==='bottom' && bottomGroup(o.it)==='Skirts' : o.it.cat===k;
  const groups = WCATS.map(([k,label]) => ({k,label,list:owned.filter(o => inGroup(o,k))}));
  const pieces = new Set(owned.map(o => o.it.id)).size;
  return `<h1 class="page-title">My <em>closet</em></h1>
  <p class="lede">What you own, one card per color. Tap a category to open it.</p>
  <div class="card" style="margin:20px 0 14px">${owned.length?`<b>${owned.length} color${owned.length===1?'':'s'}</b> in ${pieces} piece${pieces===1?'':'s'}`:'Nothing here yet. Open a piece in Wardrobe and tick the colors you own.'}</div>
  <div class="acc">${groups.map(g => { const open = !!ui.acc[g.k] && g.list.length>0;
    return `<section class="accitem ${open?'open':''}"><button class="acchead" data-act="acc" data-v="${g.k}" aria-expanded="${open}" ${g.list.length?'':'disabled'}>
      <span class="acctitle">${g.label}</span>
      <span class="accmeta"><span class="accdots" aria-hidden="true">${g.list.slice(0,6).map(o=>`<i style="background:${o.v.color}"></i>`).join('')}</span><b>${g.list.length}</b> color${g.list.length===1?'':'s'}<span class="chev" aria-hidden="true">⌄</span></span></button>
      ${open?`<div class="grid accbody">${g.list.map(o=>`<button class="item" data-act="closetopen" data-v="${o.it.id}:${o.v.id}" aria-label="${esc(o.it.name)}, ${esc(colorName(o.v.color))}"><div class="pic">${pic(o.it,o.v)}</div><h3>${esc(o.it.name)}</h3><p>${esc(colorName(o.v.color))}${wearInfo(o.it,o.v)}</p></button>`).join('')}</div>`:''}</section>`; }).join('')}</div>`;
}
function looks(){
  return `<div class="row between"><h1 class="page-title">Your <em>looks</em></h1><button class="btn" data-act="newlook">Create a look</button></div>
  <p class="lede">Build outfits piece by piece, add nails, lips and hair, then drop them into your week.</p>
  ${state.looks.length?`<div class="grid wide" style="margin-top:22px">${state.looks.map(l=>`<div class="card"><button style="display:block;width:100%;text-align:left" data-act="editlook" data-v="${l.id}" aria-label="Edit ${esc(l.name)}">${board(l)}</button>
    <div class="row between" style="margin-top:12px"><div><h3 style="font-size:22px">${esc(l.name)}</h3><span class="status">${esc(l.occasion||'')}</span></div><div class="row" style="gap:6px"><button class="btn small ghost" data-act="shoplook" data-v="${l.id}" aria-label="Shop this look">${CART}</button><button class="btn small ghost" data-act="dellook" data-v="${l.id}">Delete</button></div></div></div>`).join('')}</div>`
  :`<div class="empty-state" style="margin-top:22px">No looks yet. Tap “Create a look” to build your first one.</div>`}`;
}

const BTABS = [['outfit','Outfit'],['hair','Hair'],['nails','Nails & lips'],['acc','Accessories']];
function tile(it, sel, slot, d){
  const cur = vOf(it, sel ? (d.vars&&d.vars[slot]) : ui.vsel[it.id]);
  return `<div class="tile ${sel?'on':''} ${cur.have?'':'need'}"><button class="tp" data-act="seti" data-v="${slot}:${it.id}:${cur.id}" aria-pressed="${sel}" aria-label="${esc(it.name)}, ${esc(colorName(cur.color))}">${pic(it,cur)}</button><span class="tn">${esc(it.name)}</span>${dots(it,cur.id,'seti',slot+':'+it.id)}${cur.have?'':'<span class="tl">On list</span>'}</div>`;
}
function itemRow(title, slot, d, flt){
  const items = state.items.filter(i => i.cat===slot && (!flt || flt(i))).sort((a,b) => (b.have?1:0)-(a.have?1:0));
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
      ${mode==='dress' ? itemRow('Dress','dress',d) : itemRow('Top','top',d)+itemRow('Pants','bottom',d,i=>bottomGroup(i)==='Pants')+itemRow('Skirts','bottom',d,i=>bottomGroup(i)==='Skirts')}
      ${itemRow('Outerwear','outer',d)}${itemRow('Shoes','shoes',d)}${picsRow('Outfit',d,'Outfit inspiration')}`;
  } else if (ui.btab==='hair'){
    const groups = hairGroups(ui.hc), sel = d.pics||[];
    body = `<div class="chips" role="group" aria-label="Hair type">${[['all','All hair'],...HCATS].map(c=>`<button class="chip" aria-pressed="${ui.hc===c[0]}" data-act="hc" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
    <div class="brow"><div class="eyebrow">Hairstyle</div><div class="chips" style="flex-wrap:wrap">${HAIR.map(h=>`<button class="chip" data-act="beauty" data-k="hair" data-v="${esc(h)}" aria-pressed="${d.beauty.hair===h}">${esc(h)}</button>`).join('')}</div></div>
    <div class="brow"><div class="eyebrow">Your hair pictures</div><div class="hscroll">${groups.map(g=>{ const cur = g.pics.find(p=>sel.includes(p.id)) || g.pics.find(p=>p.id===ui.hsel[g.key]) || g.pics[0], on = g.pics.some(p=>sel.includes(p.id));
      return `<div class="tile ${on?'on':''}"><button class="tp hairtp" data-act="hairsel" data-v="${cur.id}" aria-pressed="${on}" aria-label="${esc(g.style)}, ${esc(hairName(cur.hcolor))}"><img src="${cur.src}" alt=""></button><span class="tn">${esc(g.style)}</span><span class="tl">${esc(hcatName(g.hcat))}</span>${hdots(g,cur.id,'hairsel')}</div>`; }).join('')}
      <label class="ptile addp" data-tag="Hair"><span>＋</span><span>Upload</span><input type="file" id="picup" accept="image/*" multiple hidden></label></div></div>`;
  } else if (ui.btab==='nails'){
    body = `<div class="brow"><div class="eyebrow">Nails</div><div class="pick">${NAILS.map(n=>`<figure><button class="nail lg" style="background:${n[1]}" data-act="beauty" data-k="nails" data-v="${esc(n[0])}" aria-pressed="${d.beauty.nails===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div></div>
      ${picsRow('Nails',d,'Nail inspiration')}
      <div class="brow"><div class="eyebrow">Lips</div><div class="pick">${LIPS.map(n=>`<figure><button class="nail lg" style="background:${n[1]};border-radius:50%;height:44px" data-act="beauty" data-k="lips" data-v="${esc(n[0])}" aria-pressed="${d.beauty.lips===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div></div>
      ${picsRow('Makeup',d,'Makeup inspiration')}`;
  } else {
    body = `${itemRow('Bag','bag',d)}${itemRow('Jewelry','jewel',d)}${picsRow('Accessories',d,'Accessories inspiration')}`;
  }
  return `<button class="back" data-act="cancel">← Back</button>
  <h1 class="page-title" style="margin-bottom:12px">${ui.assignDay!==null?`Plan <em>${DAYFULL[ui.assignDay]}</em>`:`${d.id?'Edit':'Create a'} <em>look</em>`}</h1>
  <div class="builder"><div class="pv">${parts.core}<div class="pvside">
    <input type="text" id="lname" value="${esc(d.name)}" placeholder="Name this look" maxlength="40" aria-label="Look name">
    <input type="text" id="locc" value="${esc(d.occasion)}" placeholder="Occasion" maxlength="50" aria-label="Occasion">
    <button class="btn" data-act="savelook">${ui.assignDay!==null?'Save to '+DAYS[ui.assignDay]:'Save look'}</button>${Object.keys(d.slots).length?`<button class="btn small ghost" data-act="shoplook" data-v="draft">${CART} Shop this look</button>`:''}${ui.assignDay!==null&&state.plan[ui.assignDay]?'<button class="btn small ghost" data-act="clearday">Clear this day</button>':''}${d.id?'<button class="btn small ghost" data-act="delcur">Delete this look</button>':''}${parts.strip}${parts.mood}</div></div>
  <div class="bmain">${ui.assignDay!==null&&state.looks.length?`<div class="brow"><div class="eyebrow">Or start from a saved look</div><div class="hscroll">${state.looks.map(l=>`<button class="tile" data-act="uselook" data-v="${l.id}"><span class="thumbboard">${boardParts(l).core}</span><span class="tn">${esc(l.name)}</span></button>`).join('')}</div></div>`:''}<div class="chips" role="tablist" aria-label="Look parts">${BTABS.map(t=>`<button class="chip" role="tab" aria-selected="${ui.btab===t[0]}" aria-pressed="${ui.btab===t[0]}" data-act="btab" data-v="${t[0]}">${t[1]}</button>`).join('')}</div>
    <div class="bbody">${body}</div>
    ${notes.length?`<div class="eyebrow" style="margin-top:14px">Style check</div><div class="slots" style="margin-top:8px">${notes.map(n=>`<div class="note ${n.warn?'warn':''}">${esc(n.t)}</div>`).join('')}</div>`:''}
  </div></div>`;
}

function isNew(p){ return p.at && daysSince(p.at)<=7; }
function lastAdded(){ const d=(state.pics||[]).map(p=>p.at).filter(Boolean).sort().pop(); return d ? daysSince(d) : null; }
function mood(){
  const all = state.pics||[];
  const list = all.filter(p => inTag(p, ui.ptag)).filter(p => !(ui.ptag==='Hair' && ui.hc!=='all') || (p.hcat||'Natural')===ui.hc);
  return `<div class="row between"><h1 class="page-title">Your <em>mood</em></h1>
    <label class="btn" style="display:inline-block;cursor:pointer;text-transform:none;letter-spacing:0;font-size:14px;color:var(--milk)">Upload pictures<input type="file" id="picup" accept="image/*" multiple hidden></label></div>
  <p class="lede">Hair, nails, makeup and outfit ideas you love. Pick from these when you build a look.</p>
  <div class="chips" style="margin-top:18px" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${ui.ptag===c[0]}" data-act="ptag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${ui.ptag==='Hair'?`<div class="chips" style="margin-top:6px" role="group" aria-label="Hair type">${[['all','All hair'],...HCATS].map(c=>`<button class="chip" aria-pressed="${ui.hc===c[0]}" data-act="hc" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>`:''}
  <div class="note" style="margin-top:14px" id="dropzone"><b>Add fresh looks anytime.</b> Save an image from Pinterest or take a screenshot, then upload it here. You can also drag pictures onto this page, or copy an image on your computer and paste it.</div>
  ${list.length?`<div class="pics" style="margin-top:12px">${(()=>{ const seen=new Set(); return list.map(p=>{ if(p.tag==='Hair'){ const k=(p.hcat||'Natural')+'|'+(p.style||'Other'); if(seen.has(k)) return ''; seen.add(k); const g=list.filter(x=>x.tag==='Hair'&&((x.hcat||'Natural')+'|'+(x.style||'Other'))===k); return `<button class="pic-tile" data-act="hairopen" data-v="${esc(k)}" aria-label="${esc(k.split('|')[1])}, ${esc(hcatName(k.split('|')[0]))}, ${g.length} variation${g.length===1?'':'s'}"><img src="${g[0].src}" alt=""><span class="tag">${esc(k.split('|')[1])}</span>${g.length>1?`<span class="count">${g.length}</span>`:''}${g.some(isNew)?'<span class="new">New</span>':''}</button>`; } return `<button class="pic-tile" data-act="picopen" data-v="${p.id}" aria-label="Open picture, ${esc(p.tag)}"><img src="${p.src}" alt=""><span class="tag">${esc(p.tag)}</span>${p.fav?'<span class="heart" aria-label="Favorite">♥</span>':''}${isNew(p)?'<span class="new">New</span>':''}</button>`; }).join(''); })()}</div>`
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
  return ticon(TYPE_ICON[a.type]||'other', false);
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
  ${toBook.length?`<section style="margin-top:22px"><h2>Time to book</h2><div class="list" style="margin-top:12px">${toBook.map(r=>`<div class="task">${ticon(ROUTINE_ICON[r[0]]||'other', false)}<div class="grow"><h3>${esc(r[1])}</h3><div class="status ${dueIn(r)<0?'over':''}">${dueIn(r)<0?-dueIn(r)+' days overdue':dueIn(r)===0?'Due today':'Due in '+dueIn(r)+' days'}</div></div><button class="btn small" data-act="newappt" data-v="${TYPE_OF_ROUTINE[r[0]]}">Book</button></div>`).join('')}</div></section>`:''}
  <section><div class="row between"><button class="btn small ghost" data-act="calprev" aria-label="Previous month">←</button><h2 class="monthname">${first.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</h2><button class="btn small ghost" data-act="calnext" aria-label="Next month">→</button></div>
  <div class="cal" style="margin-top:14px"><div class="cal-h">${DAYS.map(d=>`<span>${d[0]}</span>`).join('')}</div><div class="cal-g">${cells}</div></div>
  <div class="legend">${APPT_TYPES.filter(t=>t[0]!=='other').map(t=>`<span><i style="background:${t[2]}"></i>${t[1]}</span>`).join('')}<span><i class="ring"></i>Due</span></div></section>
  <section><div class="row between"><h2>${fmtDate(sel)}</h2><button class="btn small" data-act="newappt" data-v="">Add appointment</button></div>
  <div class="list" style="margin-top:12px">${dayAppts.map(apptCard).join('')}${dayDue.map(x=>`<div class="task">${ticon(TYPE_ICON[x.t]||'other', true)}<div class="grow"><h3>${esc(x.r[1])}</h3><div class="status">Due on this day</div></div><button class="btn small ghost" data-act="newappt" data-v="${x.t}">Book</button></div>`).join('')}
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
  } else if (s.type==='shop'){
    const it = state.items.find(i => i.id===s.id); if(!it){ inner=''; }
    else { const v = vOf(it, s.vid), lang = s.lang||'en', q = s.q ?? shopQuery(it,v,lang);
      inner = `<h2>Shop this piece</h2>
      <div class="row" style="flex-wrap:nowrap;gap:12px"><span class="shopthumb">${pic(it,v)}</span><div style="min-width:0"><b>${esc(it.name)}</b><div class="status">${esc(colorName(v.color))}${v.have?' · in my wardrobe':' · on my list'}</div></div></div>
      <div class="chips" style="margin:14px 0 8px" role="group" aria-label="Search language"><button class="chip s" aria-pressed="${lang==='en'}" data-act="shoplang" data-v="en">English words</button><button class="chip s" aria-pressed="${lang==='de'}" data-act="shoplang" data-v="de">Deutsche Wörter</button></div>
      <label>Search words<input type="text" id="shopq" value="${esc(q)}" maxlength="80"></label>
      <div class="shopgrid" style="margin-top:14px">${allShops().map(sh=>`<a class="shoplink" data-tpl="${esc(sh[1])}" href="${esc(shopUrl(sh[1],q))}" target="_blank" rel="noopener noreferrer">${esc(sh[0])}<span aria-hidden="true">↗</span></a>`).join('')}</div>
      <p class="status" style="margin-top:10px">Opens the shop in a new tab. Some shops search through Google.</p>
      <div class="eyebrow" style="margin-top:16px">Add another shop</div>
      <div class="row" style="gap:8px;flex-wrap:nowrap"><input type="text" id="shopname" placeholder="Shop name" maxlength="30" style="flex:1"><input type="text" id="shopurl" placeholder="Search link with {q}" style="flex:2"><button class="btn small" data-act="addshop">Add</button></div>
      ${(state.shops||[]).length?`<div class="chips" style="flex-wrap:wrap;margin-top:8px">${state.shops.map(x=>`<button class="chip s" data-act="delshop" data-v="${x.id}" aria-label="Remove ${esc(x.name)}">${esc(x.name)} ✕</button>`).join('')}</div>`:''}
      <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="close">Close</button></div>`; }
  } else if (s.type==='shoplook'){
    const l = s.look, rows = Object.entries(l.slots).map(([slot,id]) => { const it = state.items.find(i=>i.id===id); return it && {slot,it,v:vOf(it,l.vars&&l.vars[slot])}; }).filter(Boolean).sort((x,y)=>(x.v.have?1:0)-(y.v.have?1:0));
    inner = `<h2>Shop this look</h2>${rows.length?`<div class="list">${rows.map(r=>`<div class="task"><span class="shopthumb">${pic(r.it,r.v)}</span><div class="grow" style="min-width:0"><h3>${esc(r.it.name)}</h3><div class="status">${esc(colorName(r.v.color))} · ${r.v.have?'in my wardrobe':'to buy'}</div></div><button class="btn small ${r.v.have?'ghost':''}" data-act="shopv" data-v="${r.it.id}:${r.v.id}" aria-label="Shop ${esc(r.it.name)}">${CART}</button></div>`).join('')}</div>`:'<div class="empty-state">Pick some pieces first.</div>'}<div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="close">Close</button></div>`;
  } else if (s.type==='merge'){
    const nm = g => g.map(id => (state.items.find(i=>i.id===id)||{}).name).filter(Boolean).join(' · ');
    inner = `<h2>Smart merge</h2>${s.busy?'<p class="status">Looking for pieces that match…</p>':s.groups.length?`<p class="status" style="margin-bottom:12px">These look like the same piece in different colors.</p>${s.groups.map((g,gi)=>`<div class="card mgroup"><div class="mthumbs">${g.map(id=>{const it=state.items.find(i=>i.id===id);return it?`<span class="mth">${pic(it)}</span>`:''}).join('')}</div><div class="row between" style="flex-wrap:nowrap"><span class="status" style="min-width:0">${esc(nm(g))}</span><button class="btn small" data-act="mergegroup" data-v="${gi}">Merge ${g.length}</button></div></div>`).join('')}<button class="btn" style="margin-top:6px" data-act="mergeall">Merge all ${s.groups.length}</button>`:'<div class="empty-state">No matches found. Pieces that look alike will show up here.</div>'}<div class="row" style="margin-top:14px"><button class="btn ghost small" data-act="close">Close</button></div>`;
  } else if (s.type==='hair'){
    const g = hairGroups().find(x => x.key===s.key);
    if(!g) inner = '<div class="empty-state">No pictures in this style.</div>';
    else { const cur = g.pics.find(p => p.id===ui.hsel[s.key]) || g.pics[0];
      inner = `<div class="pdp-img"><img src="${cur.src}" alt="${esc(g.style)}, ${esc(hairName(cur.hcolor))}"><button class="expand" data-act="lbsrc" data-v="${cur.id}" aria-label="View larger">⤢</button></div>
      <div class="pdp-body"><div class="row between" style="align-items:flex-start;flex-wrap:nowrap"><h2 class="pdp-name">${esc(g.style)}</h2><button class="pdp-x" data-act="close" aria-label="Close">✕</button></div>
        <p class="pdp-color">${esc(hcatName(g.hcat))} · ${esc(hairName(cur.hcolor))}</p>
        <div class="pdp-count">${g.pics.length} variation${g.pics.length===1?'':'s'}</div>
        <div class="pdp-dots" role="group" aria-label="Hair colors">${g.pics.map(p=>`<button class="pdp-dot ${p.id===cur.id?'on':''}" data-act="hairpick" data-v="${esc(s.key)}:${p.id}" aria-pressed="${p.id===cur.id}" aria-label="${esc(hairName(p.hcolor))}"><i style="background:${p.hcolor||'#141010'}"></i></button>`).join('')}</div>
        <div class="row" style="margin-top:20px"><button class="btn" data-act="hairlook" data-v="${cur.id}">Use in a look</button><button class="btn ghost" data-act="picopen" data-v="${cur.id}">Edit</button></div></div>`; }
  } else if (s.type==='pdp'){
    inner = pdp(s);
  } else if (s.type==='sort'){
    const cats = s.mode==='ward' ? WCATS : TAGS.map(t=>[t,t]), todo = s.items.filter(f=>!f.cat).length;
    inner = `<h2>Sort your pictures</h2>
    <div class="chips" role="group" aria-label="Where do these go"><button class="chip" aria-pressed="${s.mode==='ward'}" data-act="sortmode" data-v="ward">My wardrobe</button><button class="chip" aria-pressed="${s.mode==='insp'}" data-act="sortmode" data-v="insp">Inspiration</button></div>
    ${s.mode==='ward'?`<div class="chk" style="margin-top:12px"><input type="checkbox" id="ownall" data-act="ownall" ${s.own?'checked':''}><label for="ownall" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso)">These are mine. Put them in my closet.</label></div>`:''}
    ${s.mode==='ward'?`<div class="chk" style="margin-top:4px"><input type="checkbox" id="autog" data-act="autog" ${s.group?'checked':''}><label for="autog" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso)">Group similar photos as colors of one piece</label></div>`:''}
    <div class="eyebrow" style="margin:10px 0 6px">Put them all in</div>
    <div class="chips" style="flex-wrap:wrap">${cats.map(c=>`<button class="chip s" data-act="sortall" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
    ${s.mode==='insp'&&s.items.some(f=>f.cat==='Hair')?`<div class="eyebrow" style="margin:12px 0 6px">Hair type for all hair pictures</div><div class="chips" style="flex-wrap:wrap">${HCATS.map(c=>`<button class="chip s" data-act="hcatall" data-v="${c[0]}">${c[1]}</button>`).join('')}</div><div class="eyebrow" style="margin:12px 0 6px">Hairstyle for all hair pictures</div><div class="chips" style="flex-wrap:wrap">${HAIR.map(h=>`<button class="chip s" data-act="hairall" data-v="${h}">${h}</button>`).join('')}</div>`:''}
    <div class="sortgrid" style="margin-top:14px">${s.items.map((f,i)=>`<div class="sorti ${f.cat?'':'todo'}"><img src="${f.src}" alt=""><button class="x" data-act="sortdel" data-v="${i}" aria-label="Remove picture">✕</button><div class="chips" style="flex-wrap:wrap;gap:4px">${cats.map(c=>`<button class="chip s" aria-pressed="${catActive(f,c[0])}" data-act="sortcat" data-v="${i}:${c[0]}">${c[1]}</button>`).join('')}</div>${s.mode==='ward'&&f.cat?`<input type="text" class="sname" data-i="${i}" value="${esc(f.name ?? autoName(f))}" maxlength="40" aria-label="Name" placeholder="Name">`:''}${s.mode==='insp'&&f.cat==='Hair'?`<div class="chips" style="flex-wrap:wrap;gap:4px" role="group" aria-label="Hair type">${HCATS.map(c=>`<button class="chip s" aria-pressed="${(f.hcat||'Natural')===c[0]}" data-act="sorthcat" data-v="${i}:${c[0]}">${c[1]}</button>`).join('')}</div><div class="eyebrow">Hairstyle · ${esc(hairName(f.hair))}</div><div class="chips" style="flex-wrap:wrap;gap:4px">${HAIR.map(h=>`<button class="chip s" aria-pressed="${(f.hstyle||'Other')===h}" data-act="sorthair" data-v="${i}:${h}">${h}</button>`).join('')}</div>`:''}</div>`).join('')}</div>
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
    ${p.tag==='Hair'?`<div class="eyebrow" style="margin-top:14px">Hair type</div><div class="chips" style="flex-wrap:wrap">${HCATS.map(c=>`<button class="chip s" aria-pressed="${(p.hcat||'Natural')===c[0]}" data-act="phcat" data-v="${c[0]}">${c[1]}</button>`).join('')}</div><div class="eyebrow" style="margin-top:14px">Hairstyle</div><div class="chips" style="flex-wrap:wrap">${HAIR.map(h=>`<button class="chip s" aria-pressed="${(p.style||'Other')===h}" data-act="pstyle" data-v="${h}">${h}</button>`).join('')}</div><div class="eyebrow" style="margin-top:14px">Hair color</div><div class="swatches">${HCOLORS.map(c=>`<button class="sw" style="background:${c[1]}" data-act="pcolor" data-v="${c[1]}" aria-pressed="${p.hcolor===c[1]}" aria-label="${c[0]}"></button>`).join('')}</div>`:''}
    <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="favpic" aria-pressed="${!!p.fav}">${p.fav?'♥ Favorite':'♡ Add to favorites'}</button><button class="btn ghost small" data-act="delpic">Delete picture</button><button class="btn small" data-act="close">Close</button></div>`;
  } else if (s.type==='assign'){
    inner = `<h2>${DAYS[s.day]}'s look</h2>${state.looks.length?`<div class="grid wide">${state.looks.map(l=>`<button class="card" style="text-align:left" data-act="plan" data-v="${l.id}">${board(l)}<h3 style="font-size:20px;margin-top:10px">${esc(l.name)}</h3></button>`).join('')}</div>`:`<div class="empty-state">Create a look first, then plan your week.</div>`}
      <div class="row" style="margin-top:16px"><button class="btn ghost small" data-act="plan" data-v="">Clear day</button><button class="btn ghost small" data-act="close">Close</button></div>`;
  } else if (s.type==='item'){
    const it = s.item, vi = Math.min(s.vi||0, it.variants.length-1), v = it.variants[vi];
    inner = `<h2>${s.isNew?'Add a piece':'Edit piece'}</h2><div class="slots">
      <label>Name<input type="text" id="iname" value="${esc(it.name)}" maxlength="40" placeholder="e.g. Ribbed V-neck top"></label>
      <label>Category<select id="icat" data-act="icat">${CATS.map(c=>`<option value="${c[0]}" ${it.cat===c[0]?'selected':''}>${c[1]}</option>`).join('')}</select></label>
      <label>Style<select id="istyle">${it.cat==='bottom'?['Pants','Skirts'].map(g=>`<optgroup label="${g}">${STYLES.bottom.filter(x=>(/skirt/i.test(x[0])?'Skirts':'Pants')===g).map(x=>`<option ${it.style===x[0]?'selected':''}>${x[0]}</option>`).join('')}</optgroup>`).join(''):STYLES[it.cat].map(x=>`<option ${it.style===x[0]?'selected':''}>${x[0]}</option>`).join('')}</select></label>
      <div class="eyebrow" style="margin-top:8px">Good for</div>
      <div class="chips" style="flex-wrap:wrap">${OCC.map(o=>`<button class="chip s" data-act="occtoggle" data-v="${esc(o)}" aria-pressed="${(it.occasions||[]).includes(o)}">${o}</button>`).join('')}</div>
      <div class="eyebrow" style="margin-top:8px">Colors of this piece</div>
      <div class="row" style="gap:8px">${it.variants.map((x,i)=>`<button class="vchip ${i===vi?'on':''}" data-act="vsel" data-v="${i}" aria-pressed="${i===vi}"><i style="background:${x.color}"></i>${esc(colorName(x.color))}</button>`).join('')}<button class="chip" data-act="vadd">＋ Add a color</button></div>
      <div class="card" style="display:grid;gap:12px">
        <div class="eyebrow">Pick the color · ${esc(colorName(v.color))}</div>
        <div class="swatches">${COLORS.map(c=>`<button class="sw" style="background:${c[1]}" data-act="color" data-v="${c[1]}" aria-pressed="${v.color===c[1]}" aria-label="${c[0]}${c[2]===0?' (cool)':''}"></button>`).join('')}</div>
        <label>Photo of this color (optional)<input type="file" id="iphoto" accept="image/*"></label>
        ${v.photo?`<div class="row"><img src="${v.photo}" alt="" style="width:96px;border-radius:12px"><button class="btn small ghost" data-act="vphotoclear">Remove photo</button></div>`:''}
        <div class="chk"><input type="checkbox" id="vown" data-act="vown" ${v.have?'checked':''}><label for="vown" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso)">I own this color</label></div>
        ${it.variants.length>1?`<div class="row"><button class="btn small ghost" data-act="vsplit">Make this its own piece</button><button class="btn small ghost" data-act="vdel">Remove this color</button></div>`:''}
      </div>
      <div class="row" style="margin-top:8px"><button class="btn" data-act="saveitem">Save</button><button class="btn ghost" data-act="close">Cancel</button>${s.isNew?'':`<button class="btn ghost" data-act="delitem">Delete</button>`}</div></div>`;
  }
  return `<div class="overlay" data-act="overlay"><div class="sheet ${s.type==='pdp'||s.type==='hair'?'pdp':''}" role="dialog" aria-modal="true">${inner}</div></div>`;
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
  cat(v){ ui.cat=v; ui.sty='all'; ui.occ='all'; ui.bg='all'; },
  bg(v){ ui.bg=v; ui.sty='all'; },
  sty(v){ ui.sty=v; },
  vpick(v){ const [id,vid]=v.split(':'); ui.vsel[id]=vid; },
  own(v){ const it=state.items.find(i=>i.id===v), c=vOf(it,ui.vsel[v]); setSt(c, c.have?'wish':'own'); ui.vsel[v]=c.id; syncHave(it); save(); },
  add(){ ui.sheet={type:'item',isNew:true,item:{id:uid(),cat:'top',name:'',style:STYLES.top[0][0],have:true,occasions:[],variants:[{id:uid(),color:COLORS[2][1],photo:null,have:true}]},vi:0}; },
  edit(v){ ui.sheet={type:'item',item:JSON.parse(JSON.stringify(state.items.find(i=>i.id===v))),vi:Math.max(0,state.items.find(i=>i.id===v).variants.indexOf(vOf(state.items.find(i=>i.id===v),ui.vsel[v])))}; },
  icat(){ readItemForm(); const it=ui.sheet.item; it.cat=document.getElementById('icat').value; it.style=STYLES[it.cat][0][0]; },
  color(v){ readItemForm(); ui.sheet.item.variants[ui.sheet.vi||0].color=v; },
  vsel(v){ readItemForm(); ui.sheet.vi=+v; },
  vadd(){ readItemForm(); const it=ui.sheet.item, used=it.variants.map(x=>x.color), next=(COLORS.find(c=>c[2]===1&&!used.includes(c[1]))||COLORS[0])[1];
    it.variants.push({id:uid(),color:next,photo:null,have:false,status:'wish'}); ui.sheet.vi=it.variants.length-1; },
  vdel(){ readItemForm(); const it=ui.sheet.item; it.variants.splice(ui.sheet.vi||0,1); ui.sheet.vi=0; },
  vown(){ readItemForm(); const x=ui.sheet.item.variants[ui.sheet.vi||0]; setSt(x, x.have?'wish':'own'); },
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
    if(ui.assignDay!==null) d.forDay=ui.assignDay;
    if(!d.name.trim()) d.name=ui.assignDay!==null ? DAYFULL[ui.assignDay]+' look' : 'Look '+(state.looks.length+1);
    if(d.id){ const i=state.looks.findIndex(l=>l.id===d.id); state.looks[i]=d; } else { d.id=uid(); state.looks.push(d); }
    if(ui.assignDay!==null){ state.plan[ui.assignDay]=d.id; ui.tab='today'; } else ui.tab='looks';
    ui.assignDay=null; save(); ui.draft=null; window.scrollTo(0,0); },
  assign(v){ const day=+v, cur=state.looks.find(l=>l.id===state.plan[day]);
    actions.newlook(); ui.assignDay=day;
    if(cur){ const c=JSON.parse(JSON.stringify(cur)); if(cur.forDay!==day) delete c.id; c.vars=c.vars||{}; c.pics=c.pics||[]; ui.draft=c; ui.omode=c.slots.dress?'dress':'split'; }
    else ui.draft.name=DAYFULL[day]+' look'; },
  uselook(v){ const l=state.looks.find(x=>x.id===v), d=ui.draft; d.slots=JSON.parse(JSON.stringify(l.slots)); d.vars=JSON.parse(JSON.stringify(l.vars||{})); d.pics=[...(l.pics||[])]; d.beauty=JSON.parse(JSON.stringify(l.beauty)); ui.omode=d.slots.dress?'dress':'split'; },
  clearplan(v){ delete state.plan[v]; save(); },
  delcur(){ const id=ui.draft.id; if(!confirm('Delete this look?')) return; state.looks=state.looks.filter(l=>l.id!==id);
    for(const k in state.plan) if(state.plan[k]===id) delete state.plan[k];
    state.appts.forEach(x=>{ if(x.lookId===id) x.lookId=null; }); save(); ui.draft=null; ui.assignDay=null; },
  clearday(){ delete state.plan[ui.assignDay]; save(); ui.draft=null; ui.assignDay=null; },
  plan(v){ const d=ui.sheet.day; if(v) state.plan[d]=v; else delete state.plan[d]; save(); ui.sheet=null; },
  export(){ const b=new Blob([JSON.stringify(state)],{type:'application/json'}), u=URL.createObjectURL(b), l=document.createElement('a');
    l.href=u; l.download='muse-backup-'+isoDay()+'.json'; l.click(); setTimeout(()=>URL.revokeObjectURL(u),1000); },
  favpic(){ const p=state.pics.find(x=>x.id===ui.sheet.id); p.fav=!p.fav; save(); },
  ptag(v){ ui.ptag=v; },
  sheettag(v){ ui.sheet.tag=v; },
  picopen(v){ ui.sheet={type:'pic',id:v}; },
  retag(v){ const p=state.pics.find(x=>x.id===ui.sheet.id); p.tag=v; if(v==='Hair'){ p.style=p.style||'Other'; p.hcolor=p.hcolor||'#141010'; p.hcat=p.hcat||'Natural'; } save(); },
  pstyle(v){ state.pics.find(x=>x.id===ui.sheet.id).style=v; save(); },
  pcolor(v){ state.pics.find(x=>x.id===ui.sheet.id).hcolor=v; save(); },
  hairopen(v){ ui.sheet={type:'hair',key:v}; },
  hc(v){ ui.hc=v; },
  phcat(v){ state.pics.find(x=>x.id===ui.sheet.id).hcat=v; save(); },
  sorthcat(v){ const [i,h]=v.split(':'); ui.sheet.items[+i].hcat=h; },
  hcatall(v){ ui.sheet.items.forEach(f=>{ if(f.cat==='Hair') f.hcat=v; }); },
  hairpick(v){ const [st,id]=v.split(/:(.+)/); ui.hsel[st]=id; },
  lbsrc(v){ ui.lightbox=state.pics.find(p=>p.id===v).src; },
  hairlook(v){ const p=state.pics.find(x=>x.id===v); ui.sheet=null; actions.newlook(); ui.draft.pics=[v]; ui.draft.beauty.hair=p.style||'Other'; ui.btab='hair'; },
  hairsel(v){ const p=state.pics.find(x=>x.id===v), d=ui.draft, hairIds=(state.pics||[]).filter(x=>x.tag==='Hair').map(x=>x.id);
    d.pics=d.pics||[]; const had=d.pics.includes(v); d.pics=d.pics.filter(id=>!hairIds.includes(id));
    if(!had){ d.pics.push(v); d.beauty.hair=p.style||'Other'; } ui.hsel[(p.hcat||'Natural')+'|'+(p.style||'Other')]=v; },
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
  sortcat(v){ const [i,c]=v.split(':'); applyCat(ui.sheet.items[+i],c); },
  sortall(v){ ui.sheet.items.forEach(f=>{ if(!f.cat) applyCat(f,v); }); },
  sortdel(v){ ui.sheet.items.splice(+v,1); if(!ui.sheet.items.length) ui.sheet=null; },
  sortkind(v){ const [i,k]=v.split(':'); ui.sheet.items[+i].kind=k; },
  sorthair(v){ const [i,h]=v.split(':'); ui.sheet.items[+i].hstyle=h; },
  hairall(v){ ui.sheet.items.forEach(f=>{ if(f.cat==='Hair') f.hstyle=v; }); },
  autog(){ ui.sheet.group=!ui.sheet.group; },
  sortsave(){ const s=ui.sheet; if(s.items.some(f=>!f.cat)) return setToast('Choose a category for every picture first.'); finishSort(s); },
  tsrc(v){ ui.tsrc=v; },
  newtoday(){ actions.newlook(); ui.assignDay=dow(); },
  startward(v){ const [id,vid]=v.split(':'), it=state.items.find(i=>i.id===id); actions.newlook(); ui.assignDay=dow();
    ui.draft.slots[it.cat]=id; ui.draft.vars={[it.cat]:vid}; ui.vsel[id]=vid; if(it.cat==='dress') ui.omode='dress'; ui.btab=['bag','jewel'].includes(it.cat)?'acc':'outfit'; },
  startpic(v){ const [id,src]=v.split(':'); actions.newlook(); ui.assignDay=dow(); ui.draft.pics=[id]; ui.btab=src==='nails'?'nails':'hair'; },
  cfil(v){ ui.cfil=v; },
  applook(v){ const a=ui.adraft; a.lookId = a.lookId===v ? null : v; const l=state.looks.find(x=>x.id===v);
    if(a.lookId && l && (a.title===defTitle('outfit')||!a.title.trim())) a.title='Outfit: '+l.name; },
  smart(){ ui.sheet={type:'merge',busy:true,groups:[]}; render(); findGroups().then(g => { if(ui.sheet && ui.sheet.type==='merge'){ ui.sheet.busy=false; ui.sheet.groups=g; render(); } }); },
  mergegroup(v){ const g=ui.sheet.groups[+v]; const t=mergeItems(g); ui.sheet.groups.splice(+v,1); save(); setToast(t?'Merged into '+t.name+'.':'Nothing to merge.'); },
  mergeall(){ const n=ui.sheet.groups.length; ui.sheet.groups.forEach(g=>mergeItems(g)); ui.sheet.groups=[]; save(); setToast('Merged '+n+' group'+(n===1?'':'s')+'.'); },
  selmode(){ ui.selMode=!ui.selMode; ui.sel=[]; },
  selpick(v){ const i=ui.sel.indexOf(v); if(i>=0) ui.sel.splice(i,1); else ui.sel.push(v); },
  mergesel(){ const its=ui.sel.map(id=>state.items.find(i=>i.id===id)).filter(Boolean);
    if(its.length<2) return setToast('Select at least two pieces to merge.');
    if(new Set(its.map(i=>i.cat)).size>1) return setToast('Pick pieces from the same category.');
    const t=mergeItems(ui.sel); ui.selMode=false; ui.sel=[]; save(); if(t) ui.vsel[t.id]=t.variants[0].id; setToast('Merged into '+t.name+'.'); },
  vsplit(){ readItemForm(); const s=ui.sheet, it=s.item, vi=s.vi||0; if(it.variants.length<2) return;
    const v=it.variants.splice(vi,1)[0]; s.vi=0;
    const orig=state.items.findIndex(x=>x.id===it.id); syncHave(it); if(orig>=0) state.items[orig]=it;
    state.items.unshift({id:uid(),cat:it.cat,name:it.name,style:it.style,color:v.color,have:v.have,photo:null,occasions:[...(it.occasions||[])],variants:[v]}); save(); setToast('Moved into its own piece.'); },
  shop(v){ ui.sheet={type:'shop',id:v,vid:ui.vsel[v],lang:'en',q:null}; },
  shopv(v){ const [id,vid]=v.split(':'); ui.sheet={type:'shop',id,vid,lang:'en',q:null}; },
  shoplang(v){ ui.sheet.lang=v; ui.sheet.q=null; },
  shoplook(v){ const l = v==='draft' ? ui.draft : state.looks.find(x=>x.id===v); ui.sheet={type:'shoplook',look:JSON.parse(JSON.stringify(l))}; },
  addshop(){ const n=document.getElementById('shopname').value.trim(), u=document.getElementById('shopurl').value.trim();
    if(!n||!/^https?:\/\//i.test(u)) return setToast('Add a shop name and a link that starts with https://');
    (state.shops=state.shops||[]).push({id:uid(),name:n,url:u}); save(); },
  delshop(v){ state.shops=(state.shops||[]).filter(x=>x.id!==v); save(); },
  ownv(v){ const [id,vid]=v.split(':'), it=state.items.find(i=>i.id===id), x=it.variants.find(y=>y.id===vid); setSt(x, x.have?'wish':'own'); ui.vsel[id]=vid; syncHave(it); save(); },
  setstatus(v){ const [id,vid,st]=v.split(':'), it=state.items.find(i=>i.id===id), x=it.variants.find(y=>y.id===vid); setSt(x,st); ui.vsel[id]=vid; syncHave(it); save(); },
  stage(v){ ui.stage = ui.stage===v ? 'all' : v; },
  autoweek(){ autoWeek(); },
  ownall(){ ui.sheet.own=!ui.sheet.own; },
  acc(v){ ui.acc[v] = !ui.acc[v]; },
  closetopen(v){ const [id,vid]=v.split(':'); ui.vsel[id]=vid; ui.sheet={type:'pdp',id}; },
  pdp(v){ ui.sheet={type:'pdp',id:v}; },
  occ(v){ ui.occ=v; },
  occtoggle(v){ readItemForm(); const it=ui.sheet.item; it.occasions=it.occasions||[]; const i=it.occasions.indexOf(v); if(i>=0) it.occasions.splice(i,1); else it.occasions.push(v); },
  lightbox(v){ const it=state.items.find(i=>i.id===v), c=vOf(it,ui.vsel[v]); ui.lightbox=c.photo; },
  lbclose(){ ui.lightbox=null; },
  pdplook(v){ const it=state.items.find(i=>i.id===v), c=vOf(it,ui.vsel[v]); ui.sheet=null; actions.newlook();
    ui.draft.slots[it.cat]=v; ui.draft.vars={[it.cat]:c.id}; if(it.cat==='dress') ui.omode='dress'; ui.btab=['bag','jewel'].includes(it.cat)?'acc':'outfit'; },
  wore(){ const look = todayLook(); state.wears = state.wears || {};
    if(look) Object.entries(look.slots).forEach(([slot,id]) => { const it = state.items.find(i => i.id===id); if(!it) return;
      const vv = vOf(it, look.vars && look.vars[slot]), w = state.wears[vv.id] = state.wears[vv.id] || {n:0,last:null};
      if(w.last!==isoDay()){ w.n++; w.last = isoDay(); } });
    logToday(); save(); setToast('Logged. Wear counts are updated.'); },
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
/* ---------- smart matching: compare garment silhouettes ---------- */
const GW = 24, GH = 30, THR = 0.72;
function silhouette(x, w, h){
  const d = x.getImageData(0,0,w,h).data, bx = [], by = [], bz = [];
  const pt = (px,py) => { const i=(py*w+px)*4; bx.push(d[i]); by.push(d[i+1]); bz.push(d[i+2]); };
  for(let px=0; px<w; px+=4){ pt(px,0); pt(px,h-1); }
  for(let py=0; py<h; py+=4){ pt(0,py); pt(w-1,py); }
  const med = arr => arr.sort((p,q)=>p-q)[arr.length>>1], br=med(bx), bg=med(by), bb=med(bz);
  const m = new Uint8Array(w*h); let x0=w, x1=0, y0=h, y1=0;
  for(let py=0; py<h; py++) for(let px=0; px<w; px++){ const i=(py*w+px)*4;
    if(Math.abs(d[i]-br)+Math.abs(d[i+1]-bg)+Math.abs(d[i+2]-bb) > 20){ m[py*w+px]=1; if(px<x0)x0=px; if(px>x1)x1=px; if(py<y0)y0=py; if(py>y1)y1=py; } }
  if(x1-x0<w*.2 || y1-y0<h*.2) return null;
  const bw=x1-x0+1, bh=y1-y0+1; let grid=new Uint8Array(GW*GH);
  for(let gy=0; gy<GH; gy++) for(let gx=0; gx<GW; gx++){
    const sx=x0+Math.floor(gx*bw/GW), ex=x0+Math.floor((gx+1)*bw/GW), sy=y0+Math.floor(gy*bh/GH), ey=y0+Math.floor((gy+1)*bh/GH);
    let on=0, n=0; for(let py=sy; py<Math.max(ey,sy+1); py++) for(let px=sx; px<Math.max(ex,sx+1); px++){ on+=m[py*w+px]; n++; }
    grid[gy*GW+gx] = on/n > .5 ? 1 : 0; }
  // keep the largest connected blob (drops shadows and noise)
  const seen=new Uint8Array(GW*GH); let best=[];
  for(let s=0; s<GW*GH; s++){ if(!grid[s]||seen[s]) continue; const st=[s], comp=[]; seen[s]=1;
    while(st.length){ const c=st.pop(); comp.push(c); const cx=c%GW, cy=(c/GW)|0;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ const nx=cx+dx, ny=cy+dy; if(nx<0||ny<0||nx>=GW||ny>=GH) return; const ni=ny*GW+nx; if(grid[ni]&&!seen[ni]){ seen[ni]=1; st.push(ni); } }); }
    if(comp.length>best.length) best=comp; }
  const out = new Uint8Array(GW*GH); best.forEach(c => out[c]=1);
  return (bw/bh).toFixed(2)+'|'+Array.from(out).join('');
}
function bottomStats(sig){
  const [asp, bits] = sig.split('|'), w = y => { let n=0; for(let x=0;x<GW;x++) if(bits[y*GW+x]==='1') n++; return n; };
  let mid = 0;
  for(let y=GH-10; y<GH; y++){ const row = bits.slice(y*GW,(y+1)*GW);
    if(row.slice(GW/2-1,GW/2+1)==='00' && row.slice(2,GW/2-1).includes('1') && row.slice(GW/2+1,GW-2).includes('1')) mid++; }
  let top = 0, hem = 0; for(let y=2; y<7; y++) top += w(y); for(let y=GH-5; y<GH; y++) hem += w(y);
  return {aspect:+asp, mid, ratio: top ? hem/top : 1};
}
function guessBottom(sig){
  if(!sig) return 'pants';
  const s = bottomStats(sig);
  if(s.mid>=6) return 'pants';
  if(s.aspect<=0.62 && s.ratio<1.15) return 'pants';
  return 'skirt';
}
function strongKind(sig){
  if(!sig) return null;
  const s = bottomStats(sig);
  if(s.mid>=8) return 'pants';
  if(s.aspect>=0.7 && s.ratio>=1.2) return 'skirt';
  return null;
}
function sim(a, b){
  if(!a || !b) return 0;
  const [ra,sa]=a.split('|'), [rb,sb]=b.split('|');
  if(Math.max(ra/rb, rb/ra) > 1.4) return 0;
  let i=0, u=0; for(let k=0; k<sa.length; k++){ const p=sa[k]==='1', q=sb[k]==='1'; if(p&&q) i++; if(p||q) u++; }
  return u ? i/u : 0;
}
function hairGroups(cat){
  const map = new Map();
  (state.pics||[]).filter(p => p.tag==='Hair' && (!cat || cat==='all' || (p.hcat||'Natural')===cat)).forEach(p => { const k = (p.hcat||'Natural')+'|'+(p.style||'Other'); if(!map.has(k)) map.set(k,[]); map.get(k).push(p); });
  return [...map.entries()].map(([key,pics]) => ({key, hcat:key.split('|')[0], style:key.split('|')[1], pics}));
}
function hdots(g, cur, act){
  return g.pics.length>1 ? `<div class="vdots" role="group" aria-label="Hair colors">${g.pics.map(p=>`<button class="vdot ${p.id===cur?'on':''}" style="background:${p.hcolor||'#141010'}" data-act="${act}" data-v="${p.id}" aria-pressed="${p.id===cur}" aria-label="${esc(hairName(p.hcolor))}"></button>`).join('')}</div>` : '';
}
function loadImg(src){ return new Promise(res => { const im=new Image(); im.onload=()=>res(im); im.onerror=()=>res(null); im.src=src; }); }
async function sigOf(src){
  const im = await loadImg(src); if(!im) return null;
  const s=Math.min(1,160/Math.max(im.width,im.height)), c=document.createElement('canvas');
  c.width=Math.round(im.width*s); c.height=Math.round(im.height*s);
  const x=c.getContext('2d'); x.drawImage(im,0,0,c.width,c.height);
  try{ return silhouette(x,c.width,c.height); }catch(e){ return null; }
}
async function ensureSig(v){ if(v.photo && v.sig===undefined){ v.sig = await sigOf(v.photo); } return v.sig; }
async function pieceSim(it, sig){
  let best=0; for(const v of it.variants){ if(!v.photo) continue; const s=await ensureSig(v); best=Math.max(best,sim(s,sig)); } return best;
}
async function findMatch(cat, sig, list, kind){
  if(!sig) return null; let top=null, ts=0;
  for(const it of list){ if(it.cat!==cat) continue; if(cat==='bottom' && kind && bottomGroup(it)!==(kind==='skirt'?'Skirts':'Pants')) continue; const s=await pieceSim(it,sig); if(s>=THR && s>ts){ top=it; ts=s; } }
  return top;
}
async function findGroups(){
  const its = state.items.filter(i => i.variants.some(v => v.photo)), par = {};
  its.forEach(i => par[i.id]=i.id);
  const find = x => par[x]===x ? x : (par[x]=find(par[x]));
  for(let i=0; i<its.length; i++) for(let j=i+1; j<its.length; j++){
    if(its[i].cat!==its[j].cat) continue;
    if(its[i].cat==='bottom' && bottomGroup(its[i])!==bottomGroup(its[j])) continue;
    let best=0; for(const v of its[i].variants){ if(!v.photo) continue; best=Math.max(best, await pieceSim(its[j], await ensureSig(v))); }
    if(best>=THR) par[find(its[i].id)] = find(its[j].id); }
  const groups = {}; its.forEach(i => (groups[find(i.id)] = groups[find(i.id)] || []).push(i.id));
  return Object.values(groups).filter(g => g.length>1);
}
function mergeItems(ids){
  const its = ids.map(id => state.items.find(i => i.id===id)).filter(Boolean); if(its.length<2) return null;
  const isDef = n => /^new /i.test(n), target = its.find(i => !isDef(i.name)) || its[0];
  its.forEach(o => { if(o===target) return;
    o.variants.forEach(v => target.variants.push(v));
    (o.occasions||[]).forEach(x => { if(!target.occasions.includes(x)) target.occasions.push(x); });
    state.looks.forEach(l => { for(const k in l.slots){ if(l.slots[k]===o.id){ l.slots[k]=target.id; l.vars=l.vars||{}; if(!o.variants.some(v => v.id===l.vars[k])) l.vars[k]=o.variants[0].id; } } });
    state.items = state.items.filter(i => i.id!==o.id); });
  syncHave(target); return target;
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
    let hair=HCOLORS[1][1]; try{ const w=c.width, h=c.height, d=x.getImageData(Math.round(w*.3),Math.round(h*.06),Math.max(1,Math.round(w*.4)),Math.max(1,Math.round(h*.24))).data, px=[];
      for(let i=0;i<d.length;i+=16) px.push([d[i],d[i+1],d[i+2]]);
      px.sort((p,q)=>(p[0]+p[1]+p[2])-(q[0]+q[1]+q[2])); const dk=px.slice(0,Math.max(1,Math.floor(px.length*.4)));
      const r=dk.reduce((s,p)=>s+p[0],0)/dk.length, g=dk.reduce((s,p)=>s+p[1],0)/dk.length, bl=dk.reduce((s,p)=>s+p[2],0)/dk.length;
      let best=1e9; HCOLORS.forEach(cl=>{ const q=cl[1], dr=parseInt(q.slice(1,3),16)-r, dg=parseInt(q.slice(3,5),16)-g, db=parseInt(q.slice(5,7),16)-bl, dist=dr*dr+dg*dg+db*db; if(dist<best){ best=dist; hair=q; } });
    }catch(e){}
    let sig=null; try{ const sc=Math.min(1,160/Math.max(c.width,c.height)), c2=document.createElement('canvas'); c2.width=Math.round(c.width*sc); c2.height=Math.round(c.height*sc); const x2=c2.getContext('2d'); x2.drawImage(c,0,0,c2.width,c2.height); sig=silhouette(x2,c2.width,c2.height); }catch(e){}
    res({src:c.toDataURL('image/jpeg',.75),hex,sig,hair}); }; img.onerror=()=>res(null); img.src=fr.result; }; fr.onerror=()=>res(null); fr.readAsDataURL(file); });
}
async function finishSort(s){
  const cats=[...new Set(s.items.map(f=>f.cat))], one=cats.length===1?cats[0]:'all', n=s.items.length;
  if(s.mode==='ward'){
    const created=[], notes=[]; let grouped=0;
    for(const f of s.items){
      const v={id:uid(),color:f.hex,photo:f.src,have:!!s.own,status:s.own?'own':'wish',sig:f.sig};
      const target = s.group ? await findMatch(f.cat, f.sig, [...created, ...state.items], f.kind) : null;
      if(target){ target.variants.push(v); syncHave(target); grouped++; if(!notes.includes(target.name)) notes.push(target.name); }
      else created.push({id:uid(),cat:f.cat,name:((f.name||'').trim()||autoName(f)),style:f.cat==='bottom'?(f.kind==='skirt'?'Skirt':'Pants'):STYLES[f.cat][0][0],color:f.hex,have:!!s.own,photo:null,occasions:[],variants:[v]});
    }
    [...created].reverse().forEach(it => state.items.unshift(it));
    ui.tab='wardrobe'; ui.cat=one; ui.sty='all'; ui.occ='all';
    save(); ui.sheet=null; window.scrollTo(0,0); render();
    setToast(grouped ? `${n} photo${n===1?'':'s'} saved. ${grouped} added as extra colors of a piece you already have.` : `${n} picture${n===1?'':'s'} saved to your wardrobe${s.own?' and your closet':''}. Tap one to rename it or add colors.`);
  } else {
    [...s.items].reverse().forEach(f => (state.pics=state.pics||[]).unshift(Object.assign({id:uid(),src:f.src,tag:f.cat,at:isoDay(),fav:false}, f.cat==='Hair' ? {style:f.hstyle||'Other',hcolor:f.hair,hcat:f.hcat||(f.hstyle==='Braids'?'Braids':'Natural')} : {})));
    ui.tab='mood'; ui.ptag=one; save(); ui.sheet=null; window.scrollTo(0,0); render();
    setToast(n+(n===1?' picture saved.':' pictures saved.'));
  }
}
async function startSort(files, mode){
  const prepared=[]; for(const f of files){ const p=await prepare(f); if(p) prepared.push({...p,cat:null,kind:guessBottom(p.sig)}); }
  if(!prepared.length) return;
  if(ui.sheet && ui.sheet.type==='sort') ui.sheet.items.push(...prepared); else ui.sheet={type:'sort',mode,items:prepared,group:true};
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
  for (const f of files){ const pr=await prepare(f); if(!pr) continue; const src=pr.src;
    const p={id:uid(),src,tag,at:isoDay(),fav:false}; if(tag==='Hair'){ p.style=(ui.draft&&ui.draft.beauty&&ui.draft.beauty.hair)||'Other'; p.hcolor=pr.hair; p.hcat=(ui.hc&&ui.hc!=='all')?ui.hc:(p.style==='Braids'?'Braids':'Natural'); } state.pics.unshift(p); n++;
    if(inSheet){ tgt.pics=tgt.pics||[]; tgt.pics.push(p.id); }
    else if(ui.draft && !ui.sheet){ ui.draft.pics=ui.draft.pics||[]; ui.draft.pics.push(p.id); } }
  if(n && !ui.draft && !ui.sheet) ui.tab='mood';
  save(); render();
  if(n) setToast(n+(n===1?' picture added.':' pictures added.')+(inSheet?'':' Tap one to set its tag.'));
}
document.addEventListener('input', e => {
  if(e.target.id==='pprice' && ui.sheet && ui.sheet.type==='pdp'){ const it = state.items.find(i => i.id===ui.sheet.id); if(it){ it.price = Math.max(0, parseFloat(e.target.value)||0); save(); } return; }
  if(e.target.id==='shopq' && ui.sheet && ui.sheet.type==='shop'){ ui.sheet.q = e.target.value; document.querySelectorAll('.shoplink').forEach(a => { a.href = shopUrl(a.dataset.tpl, e.target.value); }); return; }
  if(ui.draft && !ui.sheet && (e.target.id==='lname'||e.target.id==='locc')) syncDraft();
  if(ui.adraft && ui.sheet && ui.sheet.type==='appt') syncAppt();
  if(ui.sheet && ui.sheet.type==='item' && (e.target.id==='iname'||e.target.id==='istyle')) readItemForm();
  saveDraftSoon(); if(e.target.classList && e.target.classList.contains('sname') && ui.sheet && ui.sheet.items) ui.sheet.items[+e.target.dataset.i].name = e.target.value; });
document.addEventListener('paste', e => { const fs=[...(e.clipboardData?.files||[])]; if(fs.length){ e.preventDefault(); addFiles(fs); } });
document.addEventListener('dragover', e => { if([...(e.dataTransfer?.types||[])].includes('Files')) e.preventDefault(); });
document.addEventListener('drop', e => { if(e.dataTransfer?.files?.length){ e.preventDefault(); addFiles(e.dataTransfer.files); } });
document.addEventListener('change', async e => {
  if ((e.target.id==='picup'||e.target.id==='picfab') && e.target.files.length){
    const fs=[...e.target.files]; e.target.value=''; await addFiles(fs, e.target.id==='picup'&&ui.tab==='mood'?'insp':undefined); return;
  }
  if (e.target.id==='pdpphoto' && e.target.files[0]){ const it=state.items.find(i=>i.id===ui.sheet.id), c=vOf(it,ui.vsel[it.id]); const r=await prepare(e.target.files[0]); if(r){ c.photo=r.src; syncHave(it); save(); render(); } return; }
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
  if (e.key==='Escape' && ui.lightbox){ ui.lightbox=null; render(); } else if (e.key==='Escape' && ui.sheet){ ui.sheet=null; render(); }
  if ((e.key==='Enter'||e.key===' ') && e.target.matches('[role=button][data-act]')){ e.preventDefault(); e.target.click(); }
});

function render(){
  const a = document.activeElement, id = a && a.id;
  document.getElementById('app').innerHTML = view();
  if (id){ const n=document.getElementById(id); if(n && n.focus) n.focus(); }
  saveDraftSoon();
}
window.MuseDebug = {save, sigOf, sim, findGroups, guessBottom, strongKind, bottomStats, get state(){ return state; }, get ready(){ return booted; }, flush: async () => { await persist(); await flushDraft(); }};
boot();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
