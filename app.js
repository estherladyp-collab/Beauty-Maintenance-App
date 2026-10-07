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
/* illustrated icons: filled shapes with soft gloss, same spirit as the nail swatch */
const G = (id,a,b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
const SV = (inner,defs) => `<svg viewBox="0 0 32 32" aria-hidden="true">${defs?`<defs>${defs}</defs>`:''}${inner}</svg>`;
const GL = '<ellipse cx="11" cy="10" rx="2" ry="3.6" fill="#fff" opacity=".55" transform="rotate(12 11 10)"/>';
const ART = {
  lashes: SV('<path d="M3 18c3.500-5 8-7.500 13-7.500S25.500 13 29 18c-3.500 5-8 7.500-13 7.500S6.500 23 3 18z" fill="#fbf4ee" stroke="#9a6f55" stroke-width="1.200"/><circle cx="16" cy="18" r="5" fill="url(#ei)"/><circle cx="16" cy="18" r="2.100" fill="#2a1b16"/><circle cx="17.700" cy="16.300" r="1.200" fill="#fff" opacity=".9"/><path d="M5.500 14.500 3.300 11.500M9.500 12.200 8.200 8.600M14 10.700 13.600 7M18.500 10.700 19.300 7M22.600 12.200 24.200 8.600M26.500 14.500 28.800 11.500" stroke="#2a1b16" stroke-width="1.600" stroke-linecap="round" fill="none"/>', G('ei','#b98462','#5a3a2a')),
  brows: SV('<path d="M3.500 21C7 11 17 7.500 28.500 12.500 19.500 12 11 14.500 3.500 21z" fill="url(#bw)"/><path d="M9 15.500C14 12 20 11.500 25 12.700" stroke="#fff" stroke-opacity=".35" stroke-width="1" fill="none" stroke-linecap="round"/><path d="M5 25.500c5-3 12-4.200 21-2.800" stroke="#c9a98f" stroke-width="1.400" stroke-linecap="round" fill="none" opacity=".6"/>', G('bw','#7a4f38','#2e1d16')),
  hair: SV('<g transform="rotate(-28 16 16)"><rect x="13" y="16" width="6" height="14" rx="3" fill="url(#hbh)"/><rect x="8" y="2" width="16" height="18" rx="8" fill="url(#hbp)"/><g fill="#fbf1e6"><circle cx="12.500" cy="7" r="1.300"/><circle cx="16" cy="7" r="1.300"/><circle cx="19.500" cy="7" r="1.300"/><circle cx="12.500" cy="11" r="1.300"/><circle cx="16" cy="11" r="1.300"/><circle cx="19.500" cy="11" r="1.300"/><circle cx="12.500" cy="15" r="1.300"/><circle cx="16" cy="15" r="1.300"/><circle cx="19.500" cy="15" r="1.300"/></g><rect x="10" y="4" width="2" height="9" rx="1" fill="#fff" opacity=".35"/><rect x="13" y="19" width="6" height="2" fill="#6b4a2f" opacity=".4"/></g>', G('hbp','#e4c07e','#a2763a')+G('hbh','#7a5240','#3a2620')),
  wash: SV('<path d="M15 3c5.500 7 8.500 11 8.500 15.200a8.500 8.500 0 0 1-17 0C6.500 14 9.500 10 15 3z" fill="url(#wd)"/><ellipse cx="11.300" cy="17" rx="1.700" ry="3.600" fill="#fff" opacity=".6" transform="rotate(14 11.300 17)"/><circle cx="26" cy="9" r="2.600" fill="#fff" stroke="#8fb7be" stroke-width="1"/><circle cx="23.200" cy="4.800" r="1.400" fill="#fff" stroke="#8fb7be" stroke-width=".9"/><circle cx="27.500" cy="14.500" r="1.200" fill="#fff" stroke="#8fb7be" stroke-width=".9"/>', G('wd','#d6e8ea','#7fa9b2')),
  scissors: SV('<path d="M11.500 20 23 4.500" stroke="url(#sm)" stroke-width="2.800" stroke-linecap="round" fill="none"/><path d="M20.500 20 9 4.500" stroke="url(#sm)" stroke-width="2.800" stroke-linecap="round" fill="none"/><circle cx="9" cy="24.500" r="4.200" fill="none" stroke="url(#sg)" stroke-width="2.600"/><circle cx="23" cy="24.500" r="4.200" fill="none" stroke="url(#sg)" stroke-width="2.600"/><circle cx="16" cy="14" r="1.400" fill="#8d6a3a"/>', G('sm','#e4dfd8','#a39a90')+G('sg','#d9b472','#9c7435')),
  face: SV('<rect x="5.500" y="14" width="21" height="14" rx="4.500" fill="url(#jb)"/><rect x="4.500" y="8" width="23" height="7" rx="3" fill="url(#jl)"/><rect x="8" y="17" width="3" height="8" rx="1.500" fill="#fff" opacity=".5"/><path d="M25 3.500l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" fill="#d9b472"/>', G('jb','#fbf1e8','#e5cfbf')+G('jl','#e2c07f','#a67c3c')),
  body: SV('<rect x="13" y="3" width="6" height="7" rx="2.500" fill="#3a2a22"/><rect x="14.500" y="9" width="3" height="4" fill="#caa86a"/><rect x="8" y="12" width="16" height="17" rx="5" fill="url(#ob)"/><rect x="11" y="15.500" width="3" height="10" rx="1.500" fill="#fff" opacity=".4"/><rect x="11.500" y="19" width="9.500" height="5" rx="2" fill="#fff" opacity=".55"/>', G('ob','#e9b66a','#a8652a')),
  lips: SV('<path d="M3 17.500C6.500 12.500 10 11 13 12.700c1.200.7 4.800.7 6 0 3-1.700 6.500-.2 10 4.800-3.700 5.700-8.500 8.300-13 8.300S6.700 23.200 3 17.500z" fill="url(#lp)"/><path d="M3.500 17.500c4 1.700 8.500 2.300 12.500 2.300s8.500-.6 12.500-2.300" stroke="#7a2f3a" stroke-width="1.200" fill="none" stroke-linecap="round"/><ellipse cx="11" cy="21.500" rx="3.400" ry="1.300" fill="#fff" opacity=".4"/>', G('lp','#d0707f','#9b3b4d')),
  polish: SV('<rect x="12" y="3" width="8" height="9" rx="2" fill="url(#pc)"/><rect x="7.500" y="11" width="17" height="18" rx="5.500" fill="url(#pb)"/><rect x="10.500" y="14" width="3" height="11" rx="1.500" fill="#fff" opacity=".45"/>', G('pc','#4a3a32','#1e1511')+G('pb','#d98a74','#a4503a')),
  outfit: SV('<path d="M12.500 3.500c.5 2.700 2 4 3.500 4s3-1.300 3.500-4l3.200 2.800-2.600 5.700L23.500 28H8.500l2.900-16-2.600-5.700z" fill="url(#dr)"/><path d="M12.500 3.500c.5 2.700 2 4 3.500 4s3-1.300 3.500-4" stroke="#8d6a3a" stroke-width="1" fill="none"/><path d="M13 14.500c-.8 4-1 8-1.500 12" stroke="#fff" stroke-opacity=".55" stroke-width="1.400" fill="none" stroke-linecap="round"/><rect x="11.500" y="12.200" width="9" height="1.800" rx=".9" fill="#c79a4e"/>', G('dr','#ecd9bd','#c9a273')),
  other: SV('<path d="M16 3l3.200 9.300L28.500 16l-9.300 3.200L16 29l-3.200-9.800L3.500 16l9.300-3.700z" fill="url(#sp)"/><path d="M13.500 12.500 16 6" stroke="#fff" stroke-opacity=".6" stroke-width="1.400" stroke-linecap="round"/>', G('sp','#ecd08e','#b48a4c'))
};
const ROUTINE_ICON = {nails:'nails',lashes:'lashes',brows:'brows',hairwash:'wash',hairtrim:'scissors',face:'face',body:'body',lips:'lips',pedi:'polish'};
const TYPE_ICON = {hair:'hair',nails:'nails',lashes:'lashes',brows:'brows',skin:'face',pedi:'polish',outfit:'outfit',other:'other'};
function ticon(name, ok){
  const IM = window.MUSE_ICONS||{}; if(IM[name]) return `<span class="ticon photo"><img src="${IM[name]}" alt=""></span>`;
  if(name==='nails') return `<i class="nail" style="background:${ok?'#cdd6c1':'#e6cfc5'};width:22px;height:30px;flex:none"></i>`;
  if(ART[name]) return `<span class="ticon art">${ART[name]}</span>`;
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
const LIPS = [['Brown gloss','#7b4a3c','Gloss'],['Mocha','#5a3328','Colour'],['Nude rosewood','#a86a5c','Colour'],['Terracotta','#b5573f','Colour'],['Plum brown','#5b2c33','Colour'],['Clear gloss','#c98f7a','Gloss'],
  ['Peach gloss','#e39a82','Gloss'],['Cherry gloss','#a8323f','Gloss'],['Honey gloss','#c58a48','Gloss'],
  ['Clear balm','#ecd2c2','Balm'],['Rosé balm','#d98f86','Balm'],['Berry balm','#a64a5e','Balm'],['Nude balm','#d3a68f','Balm']];
const LIP_GROUPS = ['Colour','Gloss','Balm'];
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
const PREP_HOME = {
  hair:[['Gather products, comb, clips and a towel','Day before'],['Wash and detangle first, or set up your braiding spot','Day before'],['Pick reference pictures from your Mood tab','Day before'],['Put on a show or podcast for the long sit','Morning of']],
  nails:[['Gather polish or gel, base and top coat, files, cuticle oil','Day before'],['Remove old polish and push cuticles back gently','Day before'],['Pick 2 or 3 reference pictures from your Mood tab','Day before'],['Lay out a towel and good light, phone on silent','Morning of']],
  lashes:[['Gather lashes or clusters, glue, tweezers and mirror','Day before'],['Wash your face and lids clean','Morning of'],['Check you have good light and a steady spot','Morning of']],
  brows:[['Gather tweezers, brow razor, spoolie and pencil','Day before'],['Skip retinol and exfoliating acids for 3 days','Day before'],['Wash your face and set up good light','Morning of']],
  skin:[['Gather your mask, scrub or oil and a clean towel','Day before'],['Tie your hair back and clear your sink','Morning of'],['Drink plenty of water','Day before']],
  pedi:[['Gather polish, foot soak, file and towel','Day before'],['Remove old polish and soak your feet','Morning of'],['Pick a shade from your Mood tab','Day before']],
  outfit:PREP.outfit,
  other:[['Write down what you want done','Day before'],['Gather what you need','Day before']]
};
const prepFor = (t,w) => ((w==='home' ? PREP_HOME : PREP)[t]||PREP.other).map(p=>({t:p[0],when:p[1],done:false}));
const defTitle = (t,w) => t==='outfit' ? 'Outfit' : (APPT_TYPES.find(x=>x[0]===t)||APPT_TYPES[7])[1]+(w==='home'?' at home':' appointment');
const isDefTitle = a => !a.title.trim() || a.title===defTitle(a.type,'salon') || a.title===defTitle(a.type,'home');
const DEFTAG = {hair:'Hair',nails:'Nails',pedi:'Nails',lashes:'Makeup',brows:'Makeup',skin:'Skincare',outfit:'Outfit'};
const CFIL = [['all','All'],['hair','Hair'],['nails','Nails'],['outfit','Outfit'],['other','More']];
const typeInfo = t => APPT_TYPES.find(x => x[0]===t) || APPT_TYPES[6];
const addDays = (iso,n) => { const d=new Date(iso+'T12:00:00'); d.setDate(d.getDate()+n); return isoDay(d); };
const fmtDate = iso => new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short'});
const TAGS = ['Outfit','Hair','Nails','Makeup','Skincare','Accessories'];
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
/* ---------- colors / themes ---------- */
const THEMES = [['cream','Cream & gold','#f4ece0','#b48a4c'],['champagne','Champagne','#f5efe4','#b9976a','#2b211b'],['creamgreen','Cream & green','#f2eee3','#b9976a','#1f2e27'],['blush','Blush & rosé gold','#f6e9e4','#b98a78','#3a2622'],['taupe','Greige & bronze','#e9e1d6','#a9825a','#2b2420'],['coffee','Coffee & gold','#2a1b16','#b48a4c'],['forest','Forest & champagne','#1f2e27','#c8a97a'],['noir','Noir & champagne','#151413','#c9a97c'],['midnight','Midnight','#1b2233','#c9a45c']];
const hx = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
const mixc = (a,b,t) => '#'+hx(a).map((v,i)=>Math.round(v+(hx(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
function themeNow(){ const t = (state && state.theme) || {}; const p = THEMES.find(x => x[0]===t.id) || THEMES[0];
  return {id: t.id==='custom' ? 'custom' : p[0], bg: t.bg || p[2], accent: t.accent || p[3], ink: t.id==='custom' ? undefined : p[4]}; }
function applyTheme(t){
  t = t || themeNow(); const bg = /^#[0-9a-f]{6}$/i.test(t.bg) ? t.bg : '#f4ece0', ac = /^#[0-9a-f]{6}$/i.test(t.accent) ? t.accent : '#b48a4c';
  const [r,g,b] = hx(bg), dark = (0.299*r+0.587*g+0.114*b) < 120, ink = /^#[0-9a-f]{6}$/i.test(t.ink) ? t.ink : dark ? '#f3e8df' : '#241713', R = document.documentElement.style;
  const set = (k,v) => R.setProperty(k,v), rgb = h => hx(h).join(',');
  set('--milk',bg); set('--espresso',ink); set('--gold',ac); set('--goldtxt', dark ? ac : mixc(ac,'#241713',.32));
  if(dark){ set('--card',mixc(bg,'#ffffff',.06)); set('--blush',mixc(bg,'#ffffff',.14)); set('--mocha',mixc(ink,bg,.18)); set('--cocoa',mixc(ink,bg,.35)); set('--hero',mixc(bg,'#ffffff',.07)); }
  else { set('--card',mixc(bg,'#ffffff',.5)); set('--blush',mixc(bg,'#7a5240',.14)); set('--mocha','#4a3128'); set('--cocoa','#7a5240'); set('--hero','#241713'); }
  set('--line',`rgba(${rgb(ink)},.16)`); set('--muted',`rgba(${rgb(ink)},.62)`); set('--navbg',`rgba(${rgb(bg)},.93)`);
  document.documentElement.dataset.mode = dark ? 'dark' : 'light';
  const m = document.querySelector('meta[name=theme-color]'); if(m) m.content = bg;
}
/* ---------- cloud backup of plans/looks/status (private per person, survives cleared browser data) ---------- */
const LIGHT = ['order','appts','looks','plan','routine','log','wears','theme','shops','snaps','products','series'];
let dbc = null, lastSent = {}, upTimer = null, cloudOk = false, assetsNs = null, dlNs = null;
const withTimeout = (p,ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);
async function dbInit(){
  try { if(!window.claude || !claude.use) return;
    const db = await withTimeout(claude.use('db'), 5000), user = await withTimeout(claude.use('user'), 5000);
    if(!db || !user || !user.id) return; const id = await user.id();
    dbc = db.collection('data/users/'+id); } catch(e){ dbc = null; }
  try { if(window.claude && claude.use){ assetsNs = await withTimeout(claude.use('assets'), 3000); dlNs = await withTimeout(claude.use('downloads'), 3000); } } catch(e){}
}
function lightOf(){
  const o = {}; LIGHT.forEach(k => { if(state[k]!==undefined) o[k] = k==='snaps' ? state.snaps.map(x => ({...x, photo:undefined})) : state[k]; });
  o.vs = {}; state.items.forEach(i => { o.vs[i.id] = {p:i.price||0, v:Object.fromEntries((i.variants||[]).map(v => [v.id, v.status || (v.have?'own':'wish')]))}; });
  return o;
}
async function syncDown(){
  if(!dbc) return;
  try { for(const k of [...LIGHT,'vs']){
      const snap = await withTimeout(dbc.doc('muse_'+k).get(), 6000); if(!snap || !snap.exists) continue;
      const str = snap.data().j; let val; try { val = JSON.parse(str); } catch(e){ continue; }
      lastSent[k] = str;
      if(k==='vs'){ state.items.forEach(it => { const r = val[it.id]; if(!r) return; if(r.p) it.price = r.p; (it.variants||[]).forEach(v => { if(r.v && r.v[v.id]) setSt(v, r.v[v.id]); }); syncHave(it); }); }
      else if(k==='snaps'){ const have = state.snaps||[]; val.forEach(c => { if(!have.some(x => x.id===c.id)) have.push(c); }); state.snaps = have; }
      else state[k] = val; }
    cloudOk = true; } catch(e){}
}
function syncUpSoon(){ if(!dbc) return; clearTimeout(upTimer); upTimer = setTimeout(syncUp, 1200); }
async function syncUp(){
  if(!dbc) return; const l = lightOf();
  for(const k of Object.keys(l)){ const str = JSON.stringify(l[k]); if(str===lastSent[k] || str.length>240000) continue;
    try { await dbc.doc('muse_'+k).set({j:str}); lastSent[k] = str; } catch(e){} }
}
let state = {items:[], looks:[], plan:{}, routine:{}, log:[], pics:[], appts:[], snaps:[], products:[], series:{}, order:{}};
let booted = false;
function init(){
  state.appts = state.appts || []; state.snaps = state.snaps || []; state.products = state.products || []; state.series = state.series || {}; state.order = state.order || {};
  if(window.MUSE_PRODUCTS){ state.seedProd = state.seedProd || {}; if(state.seedProd1) state.seedProd['prod-bq-venus'] = true; window.MUSE_PRODUCTS.forEach(p => { if(state.seedProd[p.id]) return; state.seedProd[p.id] = true; if(!state.products.some(x => x.id===p.id)) state.products.push({...p}); }); }
  if(!state.seededItems && window.MUSE_SEED_ITEMS){ state.items.unshift(...JSON.parse(JSON.stringify(window.MUSE_SEED_ITEMS))); state.seededItems=true; }
  state.seedAdded = state.seedAdded || {};
if(window.MUSE_SEED_ITEMS){ window.MUSE_SEED_ITEMS.forEach(s => { if(state.seedAdded[s.id]) return; state.seedAdded[s.id] = true;
  if(!state.items.some(i => i.id===s.id)){ const c = JSON.parse(JSON.stringify(s)); c.have = false; c.variants.forEach(v => setSt(v,'wish')); state.items.unshift(c); } }); }
state.seedVars = state.seedVars || {};
if(window.MUSE_SEED_ITEMS){
  window.MUSE_SEED_ITEMS.forEach(s => { const it = state.items.find(i => i.id===s.id); if(!it) return; it.variants = it.variants || [];
    s.variants.forEach(sv => { const v0 = it.variants.find(x => x.id===sv.id); if(v0 && sv.rev && (v0.rev||0) < sv.rev){ v0.photo = sv.photo; v0.rev = sv.rev; }
      if(state.seedVars[sv.id]) return; state.seedVars[sv.id] = true;
      const v = it.variants.find(x => x.id===sv.id);
      if(!v){ const c = JSON.parse(JSON.stringify(sv)); setSt(c,'wish'); it.variants.push(c); } else if(!v.photo && sv.photo){ v.photo = sv.photo; } }); });
}
if(!state.cleanup1){
    state.items = state.items.filter(i => !/^s\d+$/.test(i.id));
    state.items.forEach(i => { if(['x1','x2','x3'].includes(i.id) && i.variants){ const keep = i.variants.filter(v => v.photo); if(keep.length) i.variants = keep; } });
    state.cleanup1 = true;
  }
  if(!state.ownReset1){ state.items.forEach(i => { if(/^x\d+$/.test(i.id)) (i.variants||[]).forEach(v => setSt(v,'wish')); }); state.ownReset1 = true; }
  if(!state.planMig){ state.planMig = true;
    Object.keys(state.plan||{}).forEach(k => { const lid = state.plan[k]; if(!state.looks.some(l=>l.id===lid)) return;
      const t = new Date(); t.setHours(12); const n = ((+k - ((t.getDay()+6)%7)) + 7) % 7; const iso = isoDay(new Date(t.getTime()+n*864e5));
      if(!state.appts.some(x=>x.type==='outfit'&&x.date===iso&&x.lookId===lid)) state.appts.push({id:uid(),type:'outfit',title:(state.looks.find(l=>l.id===lid)||{}).name||'Outfit',where:'salon',date:iso,time:'',notes:'',prep:prepFor('outfit'),pics:[],edited:false,done:false,lookId:lid}); });
  }
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
  if(!dirty && booted) return; dirty = false; clearTimeout(saveTimer); syncUpSoon();
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
  init(); await dbInit(); await syncDown(); init(); extendSeries(); dirty = true; await persist();
  if(fromLocal){ try { const chk = await idbGet(KEY); if(chk && chk.items && chk.items.length===state.items.length) localStorage.removeItem(KEY); } catch(e){} }
  try { if(navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  let restored = false; try { restored = restoreDraft(await idbGet(DRAFT_KEY)); } catch(e){}
  applyTheme(); booted = true; render();
  if(restored) setToast('Picked up where you left off.');
}
document.addEventListener('visibilitychange', () => { if(document.visibilityState==='hidden'){ persist(); flushDraft(); syncUp(); } });
window.addEventListener('pagehide', () => { persist(); flushDraft(); syncUp(); });

let ui = {fold:{}, tab:'today', cat:'all', draft:null, sheet:null, ptag:'all', occ:'all', selMode:false, sel:[], hsel:{}, stage:'all', acc:{}, hc:'all', bg:'all', lightbox:null, vsel:{}, sty:'all', cal:{y:new Date().getFullYear(),m:new Date().getMonth()}, calSel:isoDay(), adraft:null, btab:'outfit', omode:'split', tsrc:'ward', cfil:'all', assignDay:null};
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
const NAV = [
  ['today','Today',['today'],'<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4"/>'],
  ['plan','Plan',['calendar'],'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M8 3v4M16 3v4"/>'],
  ['care','Care',['beauty','mood'],'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M18.5 16.5v3M17 18h3"/>'],
  ['looks','Looks',['looks','snaps'],'<path d="M12 7.5a2.3 2.3 0 1 0-2.3-2.3M12 7.5V10l8 5.2a1 1 0 0 1-.6 1.8H4.6a1 1 0 0 1-.6-1.8L12 10"/>'],
  ['wardrobe','Wardrobe',['wardrobe','closet'],'<path d="M8.5 4L3 7l2 4 3-1.5V20h8v-10.5l3 1.5 2-4-5.5-3a3.5 3.5 0 0 1-7 0z"/>']
];
const SUBS = {care:[['beauty','Routine'],['mood','Inspiration']], wardrobe:[['wardrobe','Wishlist'],['closet','My closet']], looks:[['looks','Looks'],['snaps','Snaps']]};
function seg(tab){ const g = NAV.find(n => n[2].includes(tab)); const subs = g && SUBS[g[0]]; if(!subs) return '';
  return `<div class="segc" role="tablist">${subs.map(x=>`<button role="tab" aria-selected="${tab===x[0]}" data-act="tab" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`; }
function view(){
  const body = ui.draft ? builder() : seg(ui.tab) + {today,wardrobe,closet,looks,snaps,mood,calendar,beauty}[ui.tab]();
  return `<div class="brand brand-fixed" aria-hidden="true"><img class="medal" src="${(window.MUSE_LOGO||{}).medal||''}" alt="">Maintaining You</div>
  <main class="shell ${ui.enter?'enter':''}"><header class="top"><span class="saved" id="savedmark" role="status">✓ Saved</span><span class="eyebrow">${new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}</span><button class="themebtn" data-act="themes" aria-label="Choose app colors"><i></i></button></header>${body}</main>
  <nav class="nav" aria-label="Main"><div class="nav-in">${NAV.map(g=>`<button data-act="tab" data-v="${(ui.last&&ui.last[g[0]])||g[2][0]}" ${g[2].includes(ui.tab)&&!ui.draft?'aria-current="page"':''}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${g[3]}</svg><span>${g[1]}</span></button>`).join('')}</div></nav>
  ${true ? '' : `<label class="fab" title="Add pictures" aria-label="Add pictures"><span aria-hidden="true">＋</span><input type="file" id="picfab" accept="image/*" multiple hidden></label>`}${ui.sheet ? sheet() : ''}${ui.lightbox?`<div class="lightbox" data-act="lbclose" role="dialog" aria-label="Photo"><img src="${ui.lightbox}" alt=""></div>`:''}${toast?`<div role="status" class="note warn" style="position:fixed;left:16px;right:16px;bottom:80px;z-index:50;max-width:420px;margin:auto">${esc(toast)}</div>`:''}`;
}

function calGrid(){
  const {y,m} = ui.cal, first = new Date(y,m,1), off = (first.getDay()+6)%7, dim = new Date(y,m+1,0).getDate();
  const due = dueDates(), td = isoDay();
  let cells = '';
  for(let i=0;i<off;i++) cells += '<span class="cd blank"></span>';
  for(let d=1; d<=dim; d++){
    const iso = isoDay(new Date(y,m,d)), as = state.appts.filter(a=>a.date===iso && !a.done);
    const dots = as.slice(0,3).map(a=>`<i style="background:${typeInfo(a.type)[2]}"></i>`).join('');
    cells += `<button class="cd ${iso===td?'today':''} ${iso===ui.calSel?'sel':''} ${due[iso]?'due':''}" data-act="calsel" data-v="${iso}" aria-label="${fmtDate(iso)}${as.length?', '+as.length+' plan'+(as.length>1?'s':''):''}"><span>${d}</span><span class="dots">${dots}</span></button>`;
  }
  return `<div class="row between"><button class="btn small ghost" data-act="calprev" aria-label="Previous month">←</button><h2 class="monthname">${first.toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</h2><button class="btn small ghost" data-act="calnext" aria-label="Next month">→</button></div>
  <div class="cal" style="margin-top:14px"><div class="cal-h">${DAYS.map(d=>`<span>${d[0]}</span>`).join('')}</div><div class="cal-g">${cells}</div></div>
  <div class="legend">${APPT_TYPES.filter(t=>t[0]!=='other').map(t=>`<span><i style="background:${t[2]}"></i>${t[1]}</span>`).join('')}</div>`;
}
const QUICK = [['hair','Hair'],['nails','Nails'],['outfit','Outfit'],['lashes','Lashes'],['brows','Brows'],['skin','Skin']];
function quickPlan(msg){ return `<div class="quickplan"><span class="status">${msg}</span><div class="qprow">${QUICK.map(q => `<button class="qp" data-act="newappt" data-v="${q[0]}" aria-label="Plan ${q[1]}"><span class="qpc">${ticon(TYPE_ICON[q[0]]||'other', false)}</span><small>${q[1]}</small></button>`).join('')}</div></div>`; }

/* ---------- repeating plans: weekly or every 2 weeks, planned 12 weeks ahead ---------- */
const SERIES_AHEAD = 84;
const repeatLabel = n => n===7 ? 'Weekly' : n===14 ? 'Every 2 weeks' : '';
function seriesOccurrence(sr, id, date){ const t = sr.tpl;
  return {id:uid(), type:t.type, title:t.title, where:t.where, date, time:t.time||'', notes:t.notes||'', prep:(t.prep||[]).map(p => ({t:p.t, when:p.when, done:false})), pics:[], edited:false, done:false, lookId:t.lookId||undefined, seriesId:id}; }
function extendSeries(){
  const limit = addDays(isoDay(), SERIES_AHEAD); let added = 0;
  Object.keys(state.series||{}).forEach(id => { const sr = state.series[id]; if(!sr || sr.stopped) return;
    let next = addDays(sr.last, sr.every), guard = 0;
    while(next <= limit && guard++ < 60){ if(!state.appts.some(a => a.seriesId===id && a.date===next)) state.appts.push(seriesOccurrence(sr, id, next)); sr.last = next; next = addDays(next, sr.every); added++; } });
  return added;
}

/* ---------- arrange plan cards of a day ---------- */
function orderPlans(list, date){
  const ord = (state.order||{})[date] || [];
  return [...list].sort((x,y) => { const i = ord.indexOf(x.id), j = ord.indexOf(y.id);
    if(i>=0 && j>=0) return i-j; if(i>=0) return -1; if(j>=0) return 1; return (x.time||'').localeCompare(y.time||''); });
}
function weekStrip(){
  const sel = ui.calSel || isoDay(), td = isoDay();
  const base = new Date(sel+'T12:00:00'); base.setDate(base.getDate() - ((base.getDay()+6)%7));
  const days = DAYS.map((n,i) => { const d = new Date(base); d.setDate(base.getDate()+i); const iso = isoDay(d), as = state.appts.filter(a => a.date===iso && !a.done);
    const dots = as.slice(0,3).map(a => `<i style="background:${typeInfo(a.type)[2]}"></i>`).join('');
    return `<button class="wd ${iso===sel?'sel':''} ${iso===td?'now':''}" data-act="calsel" data-v="${iso}" aria-label="${fmtDate(iso)}${as.length?', '+as.length+' plan'+(as.length>1?'s':''):''}" ${iso===sel?'aria-current="date"':''}><small>${n[0]}</small><b>${d.getDate()}</b><span class="dots">${dots}</span></button>`; }).join('');
  const m = base.toLocaleDateString('en-GB',{month:'long'});
  return `<div class="weekbar"><button class="wnav" data-act="weekshift" data-v="-7" aria-label="Previous week">‹</button><span class="eyebrow">${m}</span><button class="wnav" data-act="weekshift" data-v="7" aria-label="Next week">›</button></div><div class="wstrip">${days}</div>`;
}
function today(){
  const td = isoDay(), sel = ui.calSel || td, isToday = sel===td;
  const dt = new Date(sel+'T12:00:00');
  const plans = orderPlans(state.appts.filter(a => a.date===sel && !a.done), sel); ui.arr = plans.map(a=>a.id);
  return `
  <header class="dayhead"><span class="eyebrow">${isToday?'Today':dt.toLocaleDateString('en-GB',{weekday:'long'})}</span><h1 class="page-title">${dt.toLocaleDateString('en-GB',{day:'numeric'})} <em>${dt.toLocaleDateString('en-GB',{month:'long'})}</em></h1></header>
  <section class="tight">${weekStrip()}</section>
  ${isToday?snapPrompt():''}
  <section class="plans"><div class="row between"><h2>${plans.length?(plans.length===1?'One plan':plans.length+' plans'):'Free day'}</h2><div class="row" style="gap:8px;flex-wrap:nowrap">${plans.length>1?`<button class="btn small ghost" data-act="arrange">${ui.arrange?'Done':'Arrange'}</button>`:''}<button class="btn small" data-act="newappt" data-v="">＋ Plan</button></div></div>
    ${plans.length?`<div class="gallery big" style="margin-top:16px">${plans.map(apptGCard).join('')}</div>`:quickPlan('Nothing planned yet. What is next?')}
  </section>
  ${stayReady()}`;
}
function apptGCard(a){
  const td = isoDay();
  const l = a.lookId && state.looks.find(x => x.id===a.lookId), p = (a.pics||[]).map(id => (state.pics||[]).find(x => x.id===id)).find(Boolean);
  const art = l ? `<div class="gboard thumbboard">${boardParts(l).core}</div>` : p ? `<img src="${p.src}" alt="">` : `<div class="gico">${ticon(TYPE_ICON[a.type]||'other', false)}</div>`;
  const open = (a.prep||[]).filter(x=>!x.done).length, tot = (a.prep||[]).length;
  const when = a.date!==td && a.date!==ui.calSel ? fmtDate(a.date) : '';
  const meta = [when, a.time, a.seriesId?repeatLabel((state.series[a.seriesId]||{}).every):'', a.where==='home'?'At home':'', tot?(open?`${open} to prep`:'Prepped'):''].filter(Boolean).map(esc).join(' · ');
  return `<button class="gcard" data-act="editappt" data-v="${a.id}"><span class="gart ${p?'photo':'plain'}">${art}${ui.arrange?`<span class="mvb"><span class="mv" role="button" aria-label="Move earlier" data-act="mvplan" data-v="${a.id}:-1">‹</span><span class="mv" role="button" aria-label="Move later" data-act="mvplan" data-v="${a.id}:1">›</span></span>`:`<span class="gx" role="button" aria-label="Delete this plan" data-act="delplan" data-v="${a.id}">✕</span>`}<span class="gcap"><b>${esc(a.title)}</b>${meta?`<span class="status">${meta}</span>`:''}</span></span></button>`;
}
function prepToday(){
  const td = isoDay(), lim = addDays(td,14);
  const soon = state.appts.filter(a=>!a.done && a.date>td && a.date<=lim).sort((x,y)=>(x.date+(x.time||'')).localeCompare(y.date+(y.time||'')));
  const cards = soon.map(apptGCard).join('');
  return `<section><div class="row between"><h2>Coming up</h2><button class="btn small ghost" data-act="newappt" data-v="">＋ Add</button></div><div class="gallery" style="margin-top:14px">${cards}<button class="gcard gadd" data-act="newappt" data-v=""><span class="gart"><span style="font-size:34px;color:var(--gold)">＋</span></span><b>Plan something</b><span class="status">Salon or at home</span></button></div></section>`;
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
  return `<section style="margin:0"><div class="row between"><span class="status">Choose a source</span><button class="btn small ghost" data-act="newtoday">Start blank</button></div>
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
function careState(r){ const last = state.routine[r[0]], left = last ? r[2]-daysSince(last) : null;
  const txt = left===null ? 'Not tracked yet' : left<0 ? `${-left} day${left===-1?'':'s'} overdue` : left===0 ? 'Due today' : `Due in ${left} day${left===1?'':'s'}`;
  const pct = left===null ? 0 : Math.max(0, Math.min(1, (r[2]-left)/r[2]));
  return {left, txt, pct, over: left!==null && left<0, soon: left!==null && left<=7}; }
function ringIcon(r,c){ return `<span class="ringw ${c.over?'over':''} ${c.left===null?'idle':''}" style="--p:${Math.round((c.over?1:c.pct)*100)}">${ticon(ROUTINE_ICON[r[0]]||'other', false)}</span>`; }
function task(r){
  const c = careState(r), t = TYPE_OF_ROUTINE[r[0]];
  return `<div class="task">${ringIcon(r,c)}
    <div class="grow"><h3>${esc(r[1])}</h3><div class="status ${c.over?'over':''}">${c.txt}</div></div>
    <div class="row" style="gap:14px;flex-wrap:nowrap">${t?`<button class="linkbtn" data-act="newappt" data-v="${t}">Plan</button>`:''}<button class="btn small ${c.soon?'':'ghost'}" data-act="done" data-v="${r[0]}">Done</button></div></div>`;
}
function stayReady(){
  const rows = ROUTINE.map(r => ({r, c: careState(r)})).filter(x => x.c.soon).sort((a,b) => a.c.left-b.c.left).slice(0,3);
  if(!rows.length) return `<section class="tight"><button class="blank slim" data-act="tab" data-v="beauty"><span>✦</span>Set up your care routine so nothing slips</button></section>`;
  return `<section class="ready"><div class="row between"><h2>Stay ready</h2><button class="linkbtn" data-act="tab" data-v="beauty">All care</button></div><div class="rrow">${rows.map(x => `<button class="rcard ${x.c.over?'over':''}" data-act="tab" data-v="beauty">${ringIcon(x.r,x.c)}<b>${esc(x.r[1])}</b><span>${x.c.txt}</span></button>`).join('')}</div></section>`;
}

/* ---------- snaps: accountability for planned looks ---------- */
const LOOK_TYPES = ['outfit','hair','nails'];
function mondayOf(iso){ const d = new Date(iso+'T12:00:00'); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return isoDay(d); }
function snapSrc(sn){ return sn.photo || (sn.aid ? '/_blob/'+sn.aid : ''); }
function weekInfo(mon){
  const td = isoDay(), days = DAYS.map((n,i) => { const iso = addDays(mon,i);
    const plans = state.appts.filter(a => a.date===iso && LOOK_TYPES.includes(a.type));
    const snap = (state.snaps||[]).filter(x => x.date===iso).sort((a,b)=>(b.at||'').localeCompare(a.at||''))[0];
    return {n, iso, plans, snap, isToday: iso===td, future: iso>td}; });
  const planned = days.filter(d => d.plans.length || d.snap), snapped = days.filter(d => d.snap);
  return {mon, days, planned: planned.length, snapped: snapped.length, complete: planned.length>0 && snapped.length>=planned.length && !days.some(d => d.plans.length && !d.snap)};
}
function streakInfo(){
  const sn = state.snaps||[]; if(!sn.length) return {cur:0,best:0};
  const first = mondayOf(sn.map(x=>x.date).sort()[0]), nowMon = mondayOf(isoDay());
  let run = 0, best = 0, mon = first;
  while(mon <= nowMon){ const w = weekInfo(mon); if(w.complete){ run++; best = Math.max(best,run); } else if(mon !== nowMon) run = 0; mon = addDays(mon,7); }
  return {cur: run, best};
}
const BADGES = [
  ['first','First snap','One look on record',(c)=>c.total>=1],
  ['hat','Hat trick','Three snaps in one week',(c)=>c.maxWeek>=3],
  ['full','Full week','Every planned look snapped',(c)=>c.fullWeeks>=1],
  ['streak','3 weeks running','Three full weeks in a row',(c)=>c.best>=3]
];
function badgeCtx(){
  const sn = state.snaps||[], by = {}; sn.forEach(x => { const m = mondayOf(x.date); by[m] = (by[m]||0)+1; });
  const mons = Object.keys(by); let full = 0; mons.forEach(m => { if(weekInfo(m).complete) full++; });
  return {total: sn.length, maxWeek: Math.max(0,...Object.values(by)), fullWeeks: full, best: streakInfo().best};
}
function earnedIds(){ const c = badgeCtx(); return BADGES.filter(b => b[3](c)).map(b => b[0]); }
const CAM = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.4"/></svg>';
const STAR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8z" fill="currentColor"/></svg>';
function snapTags(sn){ return [...new Set((sn.apptIds||[]).map(id => state.appts.find(a=>a.id===id)).filter(Boolean).map(a => typeInfo(a.type)[1]))]; }
function dayLabel(iso){ return new Date(iso+'T12:00:00').toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'}); }
function snapPrompt(){
  const td = isoDay(), w = weekInfo(mondayOf(td)), today = w.days.find(d => d.iso===td);
  if(!today || today.snap || !today.plans.length) return '';
  return `<button class="snapcta" data-act="opensnap" data-v="${td}"><span class="snapcta-i">${CAM}</span><span><b>Snap today's look</b><small>${w.snapped} of ${w.planned} snapped this week</small></span><i aria-hidden="true">›</i></button>`;
}
function snaps(){
  const td = isoDay(), mon = mondayOf(td), w = weekInfo(mon), st = streakInfo(), earned = earnedIds();
  const all = [...(state.snaps||[])].sort((a,b) => b.date.localeCompare(a.date) || (b.at||'').localeCompare(a.at||''));
  const thisWeek = all.filter(x => mondayOf(x.date)===mon);
  const best = thisWeek.find(x => x.fav) || thisWeek[0];
  const weeks = {}; all.forEach(x => { const m = mondayOf(x.date); (weeks[m] = weeks[m]||[]).push(x); });
  const wl = m => { const a = new Date(m+'T12:00:00'), b = new Date(addDays(m,6)+'T12:00:00'); const f = d => d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}); return f(a)+' to '+f(b); };
  const cells = w.days.map(d => { const src = d.snap ? snapSrc(d.snap) : '';
    const cls = d.snap ? 'got' : d.plans.length ? 'plan' : ''; const can = d.iso<=td;
    return `<button class="sd ${cls} ${d.isToday?'now':''}" data-act="${d.snap?'viewsnap':can?'opensnap':'newapptday'}" data-v="${d.snap?d.snap.id:d.iso}" aria-label="${dayLabel(d.iso)}${d.snap?', snapped':d.plans.length?', planned':''}"><small>${d.n[0]}</small><span class="sdc">${src?`<img src="${src}" alt="">`:d.plans.length?`<i class="sdp"></i>`:''}</span></button>`; }).join('');
  const msg = !w.planned ? 'Plan an outfit, hair or nails this week, then snap it.' : w.complete ? 'Full week. Every planned look is on record.' : `${w.snapped} of ${w.planned} planned look${w.planned===1?'':'s'} snapped`;
  return `<header class="dayhead"><span class="eyebrow">Week of ${new Date(mon+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long'})}</span><div class="row between" style="flex-wrap:nowrap"><h1 class="page-title">Snaps</h1><button class="roundbtn" data-act="opensnap" data-v="${td}" aria-label="Snap a look">${CAM}</button></div></header>
  <section class="tight"><div class="weekcard"><div class="sweek">${cells}</div><div class="row between" style="margin-top:14px;flex-wrap:nowrap"><span class="smsg">${msg}</span>${st.cur?`<span class="streak">${st.cur} week${st.cur===1?'':'s'} running</span>`:''}</div></div></section>
  <section><div class="row between"><h2>Look of the week</h2>${best?`<button class="linkbtn" data-act="sharesnap" data-v="${best.id}">Save to share</button>`:''}</div>
    ${best?`<button class="lotw" data-act="viewsnap" data-v="${best.id}" aria-label="Open look of the week"><img src="${snapSrc(best)}" alt=""><span class="lotw-c"><b>${best.fav?'Your pick':'Latest'}</b><small>${dayLabel(best.date)}</small></span></button>`:`<button class="blank" data-act="opensnap" data-v="${td}"><span>＋</span>No snap yet this week. Show me the look you planned.</button>`}</section>
  <section><h2>Badges</h2><div class="badges">${BADGES.map(b => { const on = earned.includes(b[0]); return `<div class="badge ${on?'on':''}"><span class="bi">${STAR}</span><b>${b[1]}</b><small>${b[2]}</small></div>`; }).join('')}</div></section>
  ${Object.keys(weeks).sort().reverse().map(m => `<section class="wgroup"><h2>${wl(m)}</h2><div class="sgrid">${weeks[m].map(x => `<button class="sth" data-act="viewsnap" data-v="${x.id}" aria-label="${dayLabel(x.date)}"><img src="${snapSrc(x)}" alt="">${x.fav?`<span class="sfav">${STAR}</span>`:''}</button>`).join('')}</div></section>`).join('')}`;
}
async function renderCard(sn, withFrame){
  const src = snapSrc(sn); const img = await loadImg(src); if(!img) return null;
  try { await Promise.all([document.fonts.load('italic 400 56px "Bodoni Moda"'), document.fonts.load('400 30px "Hanken Grotesk"')]); } catch(e){}
  const t = themeNow(), W = 1080, H = withFrame ? 1350 : Math.round(1080*img.height/img.width), c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  if(!withFrame){ g.drawImage(img,0,0,W,H); return new Promise(r => c.toBlob(r,'image/jpeg',.92)); }
  g.fillStyle = t.bg; g.fillRect(0,0,W,H);
  const x = 70, y = 70, w = W-140, h = 1010, r = 26;
  g.save(); g.beginPath(); g.roundRect(x,y,w,h,r); g.clip();
  const sc = Math.max(w/img.width, h/img.height), dw = img.width*sc, dh = img.height*sc; g.drawImage(img, x+(w-dw)/2, y+(h-dh)/2, dw, dh); g.restore();
  g.strokeStyle = t.accent; g.lineWidth = 2; g.beginPath(); g.roundRect(x-14,y-14,w+28,h+28,r+10); g.stroke();
  const ink = t.ink || (isDarkHex(t.bg) ? '#f3e8df' : '#241713'); g.fillStyle = ink; g.textAlign = 'left';
  g.font = 'italic 400 64px "Bodoni Moda", Didot, serif'; g.fillText(sn.fav ? 'Look of the week' : 'My look', x, 1190);
  g.font = '400 28px "Hanken Grotesk", system-ui, sans-serif'; g.globalAlpha = .7;
  const tags = snapTags(sn).join('  ·  '); g.fillText(dayLabel(sn.date).toUpperCase() + (tags ? '   ' + tags.toUpperCase() : ''), x, 1250);
  g.globalAlpha = 1; const mi = await loadImg((window.MUSE_LOGO||{}).medal||''); if(mi) g.drawImage(mi, W-x-84, 1160, 84, 84); g.textAlign = 'right'; g.fillStyle = t.accent; g.font = 'italic 400 40px "Bodoni Moda", Didot, serif'; g.fillText('Maintaining You', W-x-100, 1214);
  return new Promise(r => c.toBlob(r,'image/jpeg',.92));
}
function isDarkHex(h){ const [r,g,b] = hx(h); return (0.299*r+0.587*g+0.114*b) < 120; }
async function saveBlob(blob, filename){
  if(!blob) return setToast('Could not make the picture.');
  try { if(dlNs){ const r = await dlNs.save({filename, data: blob}); if(r && r.status==='saved') setToast('Saved. Open it from your photos or downloads.'); return; } } catch(e){ if(e && e.code==='declined') return; if(e && e.code && e.code!=='unavailable') return setToast('Saving was not possible here.'); }
  try { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000); } catch(e){ setToast('Saving is not available in this view.'); }
}
function snapSheet(s){
  const day = s.date || isoDay(), plans = state.appts.filter(a => a.date===day && LOOK_TYPES.includes(a.type));
  const sel = s.sel || plans.filter(a=>!a.done).map(a=>a.id).concat(plans.filter(a=>a.done).map(a=>a.id)).slice(0,6);
  return `<span class="eyebrow" style="color:var(--goldtxt)">${dayLabel(day)}</span><h2 style="margin-top:4px">Snap your look</h2><div class="apptform">
    ${s.photo?`<div class="snapprev"><img src="${s.photo}" alt="Your look"><label class="linkbtn retake">Change photo<input type="file" id="snapfile" accept="image/*" hidden></label></div>`
    :`<div class="snappick"><label class="snapbtn gold" tabindex="0">${CAM}<span>Take a photo</span><input type="file" id="snapcam" accept="image/*" capture="user" hidden></label><label class="snapbtn" tabindex="0"><span class="plusc">＋</span><span>Choose from photos</span><input type="file" id="snapfile" accept="image/*" hidden></label></div>`}
    ${plans.length?`<div><div class="eyebrow" style="margin-bottom:8px">This look includes</div><div class="chips" style="flex-wrap:wrap">${plans.map(a => `<button class="chip s" aria-pressed="${sel.includes(a.id)}" data-act="snapplan" data-v="${a.id}">${esc(typeInfo(a.type)[1])}</button>`).join('')}</div></div>`:''}
    <label>Date<input type="date" id="sndate" value="${day}" max="${isoDay()}"></label>
    <label>Caption<input type="text" id="snnote" value="${esc(s.note||'')}" placeholder="Hair, nails, how it felt" maxlength="100"></label>
    <div class="row" style="margin-top:8px;gap:10px"><button class="btn" data-act="savesnap" style="flex:1" ${s.photo?'':'aria-disabled="true"'}>Save snap</button><button class="btn ghost" data-act="close">Cancel</button></div></div>`;
}
function snapView(s){
  const sn = state.snaps.find(x => x.id===s.id); if(!sn) return '<div class="empty-state">This snap is gone.</div>';
  const tags = snapTags(sn);
  return `<div class="snapbig"><img src="${snapSrc(sn)}" alt="Your look on ${dayLabel(sn.date)}"></div>
  <div class="snapmeta"><span class="eyebrow" style="color:var(--goldtxt)">${dayLabel(sn.date)}</span>${sn.note?`<p style="margin-top:6px">${esc(sn.note)}</p>`:''}${tags.length?`<div class="chips" style="margin-top:8px;flex-wrap:wrap">${tags.map(t=>`<span class="chip s">${esc(t)}</span>`).join('')}</div>`:''}
  <div class="row" style="margin-top:16px;gap:10px"><button class="btn" data-act="sharesnap" data-v="${sn.id}" style="flex:1">Save to share</button><button class="btn ghost" data-act="savephoto" data-v="${sn.id}">Photo only</button></div>
  <div class="row" style="gap:18px;margin-top:14px"><button class="linkbtn" data-act="favsnap" data-v="${sn.id}">${sn.fav?'Not my pick':'Make it look of the week'}</button><button class="linkbtn" data-act="delsnap" data-v="${sn.id}" style="color:#a4462b;border-color:rgba(164,70,43,.4)">Delete</button><button class="linkbtn" data-act="close">Close</button></div></div>`;
}
const eur = n => Number(n).toLocaleString('de-DE',{style:'currency',currency:'EUR'});
const PROD_AREAS = [['lashes','Lashes'],['nails','Nails'],['brows','Brows'],['hairwash','Hair care'],['hairtrim','Hair trim'],['face','Skincare'],['body','Body care'],['lips','Lips'],['pedi','Feet']];
const areaName = id => (PROD_AREAS.find(a => a[0]===id)||[0,'Other'])[1];
function prodCard(p){ return `<button class="prodc" data-act="editprod" data-v="${p.id}" aria-label="${esc(p.name)}">${p.photo?`<img src="${p.photo}" alt="">`:`<span class="prodph">${ticon(ROUTINE_ICON[p.area]||'other',false)}</span>`}<span class="prodt"><b>${esc(p.name)}</b><small>${p.price?eur(p.price)+' · ':''}${esc(p.shop||'')}</small></span></button>`; }
function prodStrip(rid){ const l = (state.products||[]).filter(p => p.area===rid); return l.length ? `<div class="prodstrip">${l.map(prodCard).join('')}</div>` : ''; }
function taskP(r){ return `<div class="taskw">${task(r)}${prodStrip(r[0])}</div>`; }
function prodSheet(s){
  const p = ui.pdraft, isNew = !!s.isNew;
  return `<span class="eyebrow" style="color:var(--goldtxt)">${isNew?'New product':'Product'}</span><h2 style="margin-top:4px">${esc(areaName(p.area))}</h2><div class="apptform">
    ${p.photo?`<div class="snapprev"><img src="${p.photo}" alt="${esc(p.name)}" style="max-height:34vh;object-fit:contain;background:#fff"><label class="linkbtn retake">Change photo<input type="file" id="prodphoto" accept="image/*" hidden></label></div>`:`<label class="snapbtn" tabindex="0"><span class="plusc">＋</span><span>Add a photo</span><input type="file" id="prodphoto" accept="image/*" hidden></label>`}
    <div class="typerow" role="group" aria-label="Area">${PROD_AREAS.map(a => `<button class="chip s" aria-pressed="${p.area===a[0]}" data-act="prodarea" data-v="${a[0]}" style="flex:none">${a[1]}</button>`).join('')}</div>
    <label>Name<input type="text" id="prodname" value="${esc(p.name)}" maxlength="80" placeholder="What is it?"></label>
    <div class="row" style="gap:10px;flex-wrap:nowrap"><label style="flex:1;min-width:0">Price in €<input type="number" id="prodprice" step="0.01" min="0" value="${p.price||''}" inputmode="decimal"></label><label style="flex:1.4;min-width:0">Shop<input type="text" id="prodshop" value="${esc(p.shop||'')}" maxlength="60"></label></div>
    <label>Note<input type="text" id="prodnote" value="${esc(p.note||'')}" maxlength="140" placeholder="Size, colour, delivery"></label>
    <div class="row" style="margin-top:8px;gap:10px"><button class="btn" data-act="saveprod" style="flex:1">Save</button><button class="btn ghost" data-act="close">Cancel</button></div>
    ${isNew?'':`<div class="row"><button class="linkbtn" data-act="delprod" style="color:#a4462b;border-color:rgba(164,70,43,.4)">Delete</button></div>`}</div>`;
}
function syncProd(){ const p=ui.pdraft, g=id=>document.getElementById(id); if(!p||!g('prodname')) return; p.name=g('prodname').value; p.price=parseFloat(g('prodprice').value)||0; p.shop=g('prodshop').value; p.note=g('prodnote').value; }
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
  const st = stageStats(), toSpend = st.cart.sum + st.ordered.sum;
  return `<nav class="pipe" aria-label="Wardrobe stages">${STAGES.map(s => { const o = st[s[0]];
    return `<button class="stage s-${s[0]} ${ui.stage===s[0]?'on':''}" data-act="stage" data-v="${s[0]}" aria-pressed="${ui.stage===s[0]}"><b>${o.n}</b><span>${SEGL2[s[0]]}</span></button>`; }).join('')}</nav>${toSpend?`<p class="spend">${money(toSpend)} still to spend</p>`:''}`;
}
const SEGL2 = {wish:'Wish',cart:'Cart',ordered:'On its way',own:'Own'};
function stageVariant(it){
  if(ui.stage!=='all'){ const pick = it.variants.find(x => x.id===ui.vsel[it.id] && x.status===ui.stage) || it.variants.find(x => x.status===ui.stage); if(pick) return pick; }
  return vOf(it, ui.vsel[it.id]);
}
function wardrobe(){
  const inCat = state.items.filter(i => ui.cat==='all' || (ui.cat==='pants' ? i.cat==='bottom' && bottomGroup(i)==='Pants' : ui.cat==='skirts' ? i.cat==='bottom' && bottomGroup(i)==='Skirts' : i.cat===ui.cat));
  const styles = [...new Set(inCat.map(i=>i.style))];
  const occs = [...new Set(state.items.flatMap(i => i.occasions||[]))];
  const list = inCat.filter(i => ui.sty==='all' || i.style===ui.sty).filter(i => ui.occ==='all' || (i.occasions||[]).includes(ui.occ)).filter(i => ui.stage==='all' || i.variants.some(v => v.status===ui.stage));
  const filt = (ui.sty!=='all'?1:0)+(ui.occ!=='all'?1:0);
  const chips = (label, key, opts, act) => `<div class="chips" role="group" aria-label="${label}">${opts.map(c=>`<button class="chip s" aria-pressed="${ui[key]===c[0]}" data-act="${act}" data-v="${esc(c[0])}">${esc(c[1])}</button>`).join('')}</div>`;
  return `<header class="dayhead"><span class="eyebrow">${state.items.length} pieces</span><div class="row between" style="flex-wrap:nowrap"><h1 class="page-title">Wardrobe</h1><label class="roundbtn" aria-label="Upload photos" title="Upload photos">＋<input type="file" id="wardup" accept="image/*" multiple hidden></label></div></header>
  ${pipeline()}
  <div class="chips catrow" role="group" aria-label="Category">${[['all','All'],...WCATS].map(c=>`<button class="chip" aria-pressed="${ui.cat===c[0]}" data-act="cat" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div class="wtools-bar"><button class="morebtn" data-act="wtools" aria-expanded="${!!ui.wtools}">${ui.wtools?'Hide filters':'Filters & tools'}${filt&&!ui.wtools?` · ${filt} filter${filt>1?'s':''}`:''}</button></div>
  ${ui.wtools?`<div class="wtools"><div class="row" style="gap:8px"><button class="btn small ghost" data-act="add">Add a piece</button><button class="btn small ghost" data-act="smart">Smart merge</button><button class="btn small ghost" data-act="selmode">${ui.selMode?'Cancel':'Select'}</button></div>
    ${ui.cat!=='all'&&styles.length>1?chips('Style','sty',[['all','All styles'],...styles.map(s=>[s,s])],'sty'):''}
    ${occs.length?chips('Occasion','occ',[['all','Any occasion'],...occs.map(o=>[o,o])],'occ'):''}</div>`:''}
  ${list.length?`<div class="grid wgrid">${list.map(itemCard).join('')}</div>`:`<div class="empty-state" style="margin-top:18px">${ui.stage==='all'?'Nothing here yet. Upload photos of your clothes to start.':'Nothing in this stage yet. Open a piece and move a color here.'}</div>`}
  ${ui.selMode?`<div class="selbar"><span>${ui.sel.length} selected</span><button class="btn small" data-act="mergesel">Merge as colors</button></div>`:''}`;
}
function itemCard(it){
  const v = stageVariant(it), on = ui.selMode && ui.sel.includes(it.id);
  const stl = (STAGES.find(s=>s[0]===v.status)||STAGES[0])[1];
  return `<div class="item ${v.have?'have':'need'} ${on?'sel':''}"><div class="pic" data-act="${ui.selMode?'selpick':'pdp'}" data-v="${it.id}" role="button" tabindex="0" aria-label="View ${esc(it.name)}">${pic(it,v)}</div>
    <button class="cart" ${ui.selMode?'hidden':''} data-act="shop" data-v="${it.id}" aria-label="Shop ${esc(it.name)} in ${esc(colorName(v.color))}">${CART}</button>
    <button class="tick" ${ui.selMode?'hidden':''} data-act="own" data-v="${it.id}" aria-pressed="${v.have}" aria-label="${v.have?'In my closet':'Not in my closet'}: ${esc(it.name)}, ${esc(colorName(v.color))}">${v.have?'✓':''}</button>
    <h3>${esc(it.name)}</h3><p>${esc(colorName(v.color))}${it.price?' · '+money(it.price):''}${ui.stage==='all'&&v.status!=='wish'?` · <span class="st-${v.status}">${stl}</span>`:''}</p>
    ${dots(it,v.id,'vpick',it.id)}</div>`;
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
  return `<header class="dayhead"><span class="eyebrow">${owned.length?`${owned.length} color${owned.length===1?'':'s'} in ${pieces} piece${pieces===1?'':'s'}`:'Nothing yet'}</span><h1 class="page-title">My closet</h1></header>
  ${owned.length?'':'<p class="lede" style="margin-top:14px">Open a piece in the wishlist and tick the colors you own.</p>'}<div style="height:18px"></div>
  <div class="acc">${groups.map(g => { const open = !!ui.acc[g.k] && g.list.length>0;
    return `<section class="accitem ${open?'open':''}"><button class="acchead" data-act="acc" data-v="${g.k}" aria-expanded="${open}" ${g.list.length?'':'disabled'}>
      <span class="acctitle">${g.label}</span>
      <span class="accmeta"><span class="accdots" aria-hidden="true">${g.list.slice(0,6).map(o=>`<i style="background:${o.v.color}"></i>`).join('')}</span><b>${g.list.length}</b> color${g.list.length===1?'':'s'}<span class="chev" aria-hidden="true">⌄</span></span></button>
      ${open?`<div class="grid accbody">${g.list.map(o=>`<button class="item" data-act="closetopen" data-v="${o.it.id}:${o.v.id}" aria-label="${esc(o.it.name)}, ${esc(colorName(o.v.color))}"><div class="pic">${pic(o.it,o.v)}</div><h3>${esc(o.it.name)}</h3><p>${esc(colorName(o.v.color))}${wearInfo(o.it,o.v)}</p></button>`).join('')}</div>`:''}</section>`; }).join('')}</div>`;
}
function foldBox(k,label,inner){ return `<div class="fold"><button class="foldh" data-act="fold" data-v="${k}" aria-expanded="${!!ui.fold[k]}"><span>${label}</span><i aria-hidden="true">${ui.fold[k]?'−':'+'}</i></button>${ui.fold[k]?`<div class="foldb">${inner}</div>`:''}</div>`; }
function looks(){
  return `<header class="dayhead"><span class="eyebrow">${state.looks.length} saved</span><div class="row between" style="flex-wrap:nowrap"><h1 class="page-title">Looks</h1><button class="roundbtn" data-act="newlook" aria-label="Create a look">＋</button></div></header>
  ${state.looks.length?`<div class="grid wgrid looksgrid">${state.looks.map(l=>`<div class="lookc"><button class="lookb" data-act="editlook" data-v="${l.id}" aria-label="Edit ${esc(l.name)}">${board(l)}</button>
    <div class="row between" style="flex-wrap:nowrap;margin-top:12px;gap:6px"><div style="min-width:0"><h3 class="lname">${esc(l.name)}</h3>${l.occasion?`<span class="status">${esc(l.occasion)}</span>`:''}</div><div class="row" style="gap:2px;flex-wrap:nowrap"><button class="iconb" data-act="shoplook" data-v="${l.id}" aria-label="Shop this look">${CART}</button><button class="iconb" data-act="dellook" data-v="${l.id}" aria-label="Delete ${esc(l.name)}">✕</button></div></div></div>`).join('')}</div>`
  :`<button class="blank" data-act="newlook"><span>＋</span>Build your first look. Pick pieces, nails, lips and hair.</button>`}
  <section class="folds">${foldBox('rail','Start from a picture',startRail())}</section>`;
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
      <div class="brow"><div class="eyebrow">Lips</div>${LIP_GROUPS.map(g => `<div class="lipgrp"><small>${g==='Colour'?'Lipstick and stain':g==='Gloss'?'Lip gloss':'Lip balm'}</small><div class="pick">${LIPS.filter(n=>(n[2]||'Colour')===g).map(n=>`<figure><button class="nail lg lip-${g.toLowerCase()}" style="background:${n[1]};border-radius:50%;height:44px" data-act="beauty" data-k="lips" data-v="${esc(n[0])}" aria-pressed="${d.beauty.lips===n[0]}" aria-label="${esc(n[0])}"></button>${esc(n[0])}</figure>`).join('')}</div></div>`).join('')}</div>
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
  return `<header class="dayhead"><span class="eyebrow">Hair, nails, makeup, outfits</span><div class="row between" style="flex-wrap:nowrap"><h1 class="page-title">Inspiration</h1><label class="roundbtn" aria-label="Upload pictures" title="Upload pictures">＋<input type="file" id="picup" accept="image/*" multiple hidden></label></div></header>
  <div class="chips catrow" role="group" aria-label="Filter">${PCHIPS.map(c=>`<button class="chip" aria-pressed="${ui.ptag===c[0]}" data-act="ptag" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  ${ui.ptag==='Hair'?`<div class="chips" style="margin-top:2px" role="group" aria-label="Hair type">${[['all','All hair'],...HCATS].map(c=>`<button class="chip s" aria-pressed="${ui.hc===c[0]}" data-act="hc" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>`:''}
  <div id="dropzone" style="height:6px"></div>
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
    <span class="grow"><b>${esc(a.title)}</b><span class="status">${fmtDate(a.date)}${a.time?' · '+esc(a.time):''}${a.where==='home'?' · At home':''}${a.done?' · Done':''}</span></span>
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
    cells += `<button class="cd ${iso===td?'today':''} ${iso===ui.calSel?'sel':''} ${due[iso]?'due':''}" data-act="calsel" data-v="${iso}" aria-label="${fmtDate(iso)}${as.length?', '+as.length+' plan'+(as.length>1?'s':''):''}"><span>${d}</span><span class="dots">${dots}</span></button>`;
  }
  const sel = ui.calSel, dayAppts = orderPlans(state.appts.filter(a=>a.date===sel && inFil(a)), sel); ui.arr = dayAppts.map(a=>a.id);
  const dayDue = due[sel] || [];
  const upcoming = state.appts.filter(a=>!a.done && a.date>=td && inFil(a)).sort((x,y)=>(x.date+(x.time||'')).localeCompare(y.date+(y.time||''))).slice(0,5);
  const mname = first.toLocaleDateString('en-GB',{month:'long'});
  return `<header class="dayhead"><span class="eyebrow">${y}</span><div class="row between" style="flex-wrap:nowrap"><h1 class="page-title">${mname}</h1><div class="row" style="gap:4px;flex-wrap:nowrap"><button class="roundbtn ghost" data-act="calprev" aria-label="Previous month">‹</button><button class="roundbtn ghost" data-act="calnext" aria-label="Next month">›</button></div></div></header>
  <div class="chips catrow" role="group" aria-label="Category">${CFIL.map(c=>`<button class="chip" aria-pressed="${ui.cfil===c[0]}" data-act="cfil" data-v="${c[0]}">${c[1]}</button>`).join('')}</div>
  <div class="cal" style="margin-top:18px"><div class="cal-h">${DAYS.map(d=>`<span>${d[0]}</span>`).join('')}</div><div class="cal-g">${cells}</div></div>
  <section class="plans"><div class="row between"><h2>${fmtDate(sel)}</h2><div class="row" style="gap:8px;flex-wrap:nowrap">${dayAppts.length>1?`<button class="btn small ghost" data-act="arrange">${ui.arrange?'Done':'Arrange'}</button>`:''}<button class="btn small" data-act="newappt" data-v="">＋ Plan</button></div></div>
  ${dayAppts.length?`<div class="gallery big" style="margin-top:16px">${dayAppts.map(apptGCard).join('')}</div>`:''}
  <div class="list" style="margin-top:14px">${dayDue.map(x=>`<div class="task">${ticon(TYPE_ICON[x.t]||'other', true)}<div class="grow"><h3>${esc(x.r[1])}</h3><div class="status">Due on this day</div></div><button class="btn small ghost" data-act="newappt" data-v="${x.t}">Book</button></div>`).join('')}</div>
  ${!dayAppts.length&&!dayDue.length?quickPlan('Nothing planned for this day.'):''}</section>
  ${upcoming.length?`<section><h2>Coming up</h2><div class="list" style="margin-top:14px">${upcoming.map(apptCard).join('')}</div></section>`:''}`;
}

function beauty(){
  const warm = COLORS.filter(c => c[2]===1);
  const rows = ROUTINE.map(r => ({r, c: careState(r)}));
  const soon = rows.filter(x => x.c.soon).sort((a,b) => a.c.left-b.c.left), rest = rows.filter(x => !x.c.soon);
  const open = (k, label, inner) => `<div class="fold"><button class="foldh" data-act="fold" data-v="${k}" aria-expanded="${!!ui.fold[k]}"><span>${label}</span><i aria-hidden="true">${ui.fold[k]?'−':'+'}</i></button>${ui.fold[k]?`<div class="foldb">${inner}</div>`:''}</div>`;
  return `<header class="dayhead"><span class="eyebrow">Grooming</span><h1 class="page-title">Care</h1></header>
  ${soon.length?`<section class="tight"><h2>Coming due</h2><div class="list" style="margin-top:14px">${soon.map(x=>taskP(x.r)).join('')}</div></section>`:`<section class="tight"><div class="blank slim"><span>✦</span>Tap Done on anything below once. After that I keep count and tell you when it is due.</div></section>`}
  <section><h2>${soon.length?'Everything else':'Your routine'}</h2><div class="list" style="margin-top:14px">${rest.map(x=>taskP(x.r)).join('')}</div></section>
  <section class="folds">${open('prod','My products',`${(state.products||[]).length?`<div class="prodlist">${state.products.map(p=>`<div><span class="eyebrow">${esc(areaName(p.area))}</span>${prodCard(p)}</div>`).join('')}</div>`:'<p class="lede">Nothing saved yet.</p>'}<div style="margin-top:14px"><button class="btn small" data-act="addprod">＋ Add product</button></div>`)}
  ${open('guide','Style guide',`<div class="guide"><div><div class="eyebrow">Inverted triangle</div><h3>Balance the shoulders</h3><ul><li>V-necks, wraps and scoop necks open up the top.</li><li>Wide-leg trousers, A-line and pleated skirts add volume below.</li><li>Belt at the waist, keep detail on the bottom half.</li><li>Go easy on boat necks, puff sleeves and halters.</li></ul></div><div><div class="eyebrow">Warm undertone</div><h3>Gold, earth and glow</h3><ul><li>Gold jewelry over silver.</li><li>Bronze, terracotta and coral blush. Brown and rosewood lips.</li><li>Milky nude and sheer pink nails.</li></ul></div></div><div class="palette" style="margin-top:18px">${warm.map(c=>`<div class="pal"><i style="background:${c[1]}"></i>${c[0]}</div>`).join('')}</div>`)}
  ${open('backup','Backup',`<p class="lede" style="margin-bottom:14px">Your plans are saved to your account. This file is an extra copy, or a way to move to another device.</p><div class="row"><button class="btn small" data-act="export">Save backup</button><label class="btn small ghost" style="cursor:pointer">Load backup<input type="file" id="import" accept="application/json" hidden></label></div>`)}</section>`;
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
  } else if (s.type==='theme'){
    const t = themeNow();
    inner = `<h2>App colors</h2><p class="status" style="margin-bottom:12px">Pick a look for the whole app.</p>
    <div class="themes">${THEMES.map(p=>`<button class="themeopt" data-act="settheme" data-v="${p[0]}" aria-pressed="${t.id===p[0]}" aria-label="${esc(p[1])}"><span class="swatch" style="background:${p[2]};color:${p[4]||((hx(p[2]).reduce((a,v,i)=>a+v*[.299,.587,.114][i],0)<120)?'#f3e8df':'#241713')}"><b>Aa</b><i style="background:${p[3]}"></i></span><small>${esc(p[1])}</small></button>`).join('')}</div>
    <div class="eyebrow" style="margin:18px 0 8px">Your own colors</div>
    <div class="row" style="gap:18px"><label class="colorpick">Background<input type="color" id="thbg" value="${t.bg}"></label><label class="colorpick">Accent<input type="color" id="thac" value="${t.accent}"></label></div>
    <div class="row" style="margin-top:18px"><button class="btn ghost small" data-act="close">Close</button></div>`;
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
    const openN = a.prep.filter(p=>!p.done).length;
    inner = `<span class="eyebrow" style="color:var(--goldtxt)">${s.isNew?'New plan':'Your plan'}</span><h2 style="margin-top:4px">${esc(ti[1])}</h2><div class="slots apptform">
      <div class="typerow" role="group" aria-label="Type">${APPT_TYPES.map(t=>`<button class="typeb" aria-pressed="${a.type===t[0]}" data-act="settype" data-v="${t[0]}">${ticon(TYPE_ICON[t[0]]||'other', false)}<span>${t[1]}</span></button>`).join('')}</div>
      ${a.type==='outfit'?'':`<div class="segc" role="group" aria-label="Where" style="margin:0"><button aria-selected="${a.where!=='home'}" data-act="setwhere" data-v="salon">At a salon</button><button aria-selected="${a.where==='home'}" data-act="setwhere" data-v="home">At home, DIY</button></div>`}
      ${a.type==='outfit'?`<div><div class="eyebrow" style="margin-bottom:8px">Look for this day</div>${state.looks.length?`<div class="hscroll">${state.looks.map(l=>`<button class="tile ${a.lookId===l.id?'on':''}" data-act="applook" data-v="${l.id}" aria-pressed="${a.lookId===l.id}"><span class="thumbboard">${boardParts(l).core}</span><span class="tn">${esc(l.name)}</span></button>`).join('')}</div>`:'<p class="status">No saved looks yet. Build one on the Looks tab first.</p>'}</div>`:''}
      <label>Title<input type="text" id="aname" value="${esc(a.title)}" maxlength="50"></label>
      <div class="row" style="gap:10px;flex-wrap:nowrap"><label style="flex:1;min-width:0">Date<input type="date" id="adate" value="${a.date}"></label><label style="flex:1;min-width:0">Time<input type="time" id="atime" value="${esc(a.time)}"></label></div>
      ${a.seriesId?`<div class="repnote"><span class="status">Repeats ${esc((repeatLabel((state.series[a.seriesId]||{}).every)||'').toLowerCase())}</span><button class="linkbtn" data-act="stoprepeat">Stop repeating</button></div>`
      :`<div><div class="eyebrow" style="margin-bottom:8px">Repeat</div><div class="segc" role="group" aria-label="Repeat" style="margin:0"><button aria-selected="${!a.repeat}" data-act="setrepeat" data-v="">Once</button><button aria-selected="${a.repeat==='weekly'}" data-act="setrepeat" data-v="weekly">Weekly</button><button aria-selected="${a.repeat==='biweekly'}" data-act="setrepeat" data-v="biweekly">Every 2 weeks</button></div>${a.repeat?`<p class="status" style="margin-top:8px">I plan the next 12 weeks and keep adding more.</p>`:''}</div>`}
      <label>Notes<input type="text" id="anotes" value="${esc(a.notes)}" placeholder="${a.where==='home'?'Products, style, how long it takes':'Stylist, place, style you want'}" maxlength="120"></label>
      <div class="folds" style="margin:6px 0 0">
      ${foldBox('ap_prep',`${a.where==='home'?'Get ready':'Prep list'}<small>${a.prep.length?` ${openN} to do`:''}</small>`,`<div class="prep">${a.prep.map((p,i)=>`<div class="chk"><input type="checkbox" id="pc${i}" data-act="preptoggle" data-v="${i}" ${p.done?'checked':''}><label for="pc${i}" style="display:block;text-transform:none;letter-spacing:0;font-size:14px;color:var(--espresso);flex:1"><span>${esc(p.t)}<small>${esc(p.when)}</small></span></label><button class="iconb" data-act="prepdel" data-v="${i}" aria-label="Remove ${esc(p.t)}">✕</button></div>`).join('')}</div>
      <div class="row" style="gap:8px;flex-wrap:nowrap;margin-top:10px"><input type="text" id="prepnew" placeholder="Add something to prep" maxlength="80" style="flex:1"><select id="prepwhen" style="width:auto"><option>Day before</option><option>Morning of</option><option>Bring</option></select><button class="btn small" data-act="prepadd">Add</button></div>`)}
      ${foldBox('ap_pics',`Reference pictures<small>${pics.length?` ${pics.length}`:''}</small>`,`<div class="picked">${pics.map((p,i)=>`<span class="pk"><img src="${p.src}" alt="">${pics.length>1?`<span class="pkb"><button data-act="mvapppic" data-v="${i}:-1" aria-label="Move earlier" ${i===0?'disabled':''}>‹</button><button data-act="mvapppic" data-v="${i}:1" aria-label="Move later" ${i===pics.length-1?'disabled':''}>›</button></span>`:''}${i===0&&pics.length>1?'<small class="cover">Cover</small>':''}</span>`).join('')}<button class="slotbtn" style="width:auto;min-height:72px" data-act="apppics"><span class="thumb">＋</span><span><b>${pics.length?'Change pictures':'Choose pictures'}</b></span></button></div>`)}
      </div>
      <div class="row" style="margin-top:14px;gap:10px"><button class="btn" data-act="saveappt" style="flex:1">Save</button><button class="btn ghost" data-act="close">Cancel</button></div>
      ${s.isNew?'':`<div class="row" style="gap:18px"><button class="linkbtn" data-act="doneappt">${a.done?'Reopen':'Mark done'}</button><button class="linkbtn" data-act="delappt" style="color:#a4462b;border-color:rgba(164,70,43,.4)">Delete</button></div>`}</div>`;
  } else if (s.type==='snap'){ inner = snapSheet(s);
  } else if (s.type==='snapview'){ inner = snapView(s);
  } else if (s.type==='prod'){ inner = prodSheet(s);
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
  tab(v){ ui.arrange=false; ui.enter=true; ui.tab=v; const g=NAV.find(n=>n[2].includes(v)); if(g){ ui.last=ui.last||{}; ui.last[g[0]]=v; } ui.draft=null; ui.assignDay=null; window.scrollTo(0,0); },
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
  calsel(v){ ui.calSel=v; ui.arrange=false; },
  newappt(v,el){ const t=v||'hair'; ui.adraft={id:uid(),type:t,title:defTitle(t,'salon'),where:'salon',date:(el&&el.currentTarget&&el.currentTarget.dataset.today)?isoDay():(ui.calSel||isoDay()),time:'',notes:'',prep:prepFor(t,'salon'),pics:[],edited:false,done:false};
    ui.sheet={type:'appt',isNew:true}; },
  editappt(v){ ui.adraft=JSON.parse(JSON.stringify(state.appts.find(a=>a.id===v))); ui.sheet={type:'appt'}; },
  settype(v){ const a=ui.adraft;
    if(isDefTitle(a)) a.title=defTitle(v,a.where);
    if(!a.edited) a.prep=prepFor(v,a.where);
    a.type=v; },
  setwhere(v){ const a=ui.adraft;
    if(isDefTitle(a)) a.title=defTitle(a.type,v);
    if(!a.edited) a.prep=prepFor(a.type,v);
    a.where=v; },
  preptoggle(v){ ui.adraft.prep[+v].done=!ui.adraft.prep[+v].done; ui.adraft.edited=true; },
  prepdel(v){ ui.adraft.prep.splice(+v,1); ui.adraft.edited=true; },
  prepadd(){ const t=document.getElementById('prepnew').value.trim(); if(!t) return;
    ui.adraft.prep.push({t,when:document.getElementById('prepwhen').value,done:false}); ui.adraft.edited=true; },
  prepcheck(v){ const [id,i]=v.split(':'); const a=state.appts.find(x=>x.id===id); a.prep[+i].done=true; save(); },
  apppics(){ ui.sheet={type:'apppics',tag:DEFTAG[ui.adraft.type]||'all',isNew:ui.sheet.isNew}; },
  backappt(){ ui.sheet={type:'appt',isNew:ui.sheet.isNew}; },
  toggleapppic(v){ const d=ui.adraft; d.pics=d.pics||[]; const i=d.pics.indexOf(v); if(i>=0) d.pics.splice(i,1); else d.pics.push(v); },
  saveappt(){ const a=ui.adraft; if(!a.date){ return setToast('Pick a date for this plan.'); }
    if(!a.title.trim()) a.title=defTitle(a.type,a.where);
    const every = a.repeat==='weekly' ? 7 : a.repeat==='biweekly' ? 14 : 0; delete a.repeat;
    if(every && !a.seriesId){ const sid = uid(); a.seriesId = sid; state.series[sid] = {every, last:a.date, stopped:false, tpl:{type:a.type, title:a.title, where:a.where, time:a.time, notes:a.notes, prep:a.prep.map(p=>({t:p.t,when:p.when})), lookId:a.lookId}}; }
    const i=state.appts.findIndex(x=>x.id===a.id); if(i>=0) state.appts[i]=a; else state.appts.push(a);
    if(every) extendSeries();
    const p=a.date.split('-'); ui.cal={y:+p[0],m:+p[1]-1}; ui.calSel=a.date; save(); ui.sheet=null; ui.adraft=null; },
  doneappt(){ syncAppt(); const a=ui.adraft; a.done=!a.done;
    if(a.done && ROUTINE_OF[a.type]){ state.routine[ROUTINE_OF[a.type]]=a.date; }
    if(a.done){ logToday(); }
    const i=state.appts.findIndex(x=>x.id===a.id); if(i>=0) state.appts[i]=a; else state.appts.push(a);
    save(); ui.sheet=null; ui.adraft=null; },
  delplan(v){ state.appts=state.appts.filter(a=>a.id!==v); save(); },
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
  more(){ ui.more=!ui.more; },
  arrange(){ ui.arrange = !ui.arrange; },
  mvplan(v){ const [id,d] = v.split(':'), ids = [...(ui.arr||[])], i = ids.indexOf(id), j = i + (+d); if(i<0 || j<0 || j>=ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]]; const date = (state.appts.find(a=>a.id===id)||{}).date; if(!date) return; state.order[date] = ids; save(); },
  mvapppic(v){ const [i,d] = v.split(':').map(Number), p = ui.adraft.pics, j = i + d; if(j<0 || j>=p.length) return; [p[i], p[j]] = [p[j], p[i]]; ui.adraft.edited = true; },

  setrepeat(v){ ui.adraft.repeat = v; },
  stoprepeat(){ const a=ui.adraft, sid=a.seriesId; if(!sid) return; const sr=state.series[sid]; if(sr) sr.stopped = true;
    state.appts = state.appts.filter(x => !(x.seriesId===sid && x.date>a.date && !x.done)); save(); ui.sheet=null; ui.adraft=null; setToast('Stopped repeating.'); },

  addprod(){ ui.pdraft = {id:uid(), area:'lashes', name:'', price:0, shop:'', note:'', photo:null}; ui.sheet = {type:'prod', isNew:true}; },
  editprod(v){ ui.pdraft = JSON.parse(JSON.stringify(state.products.find(p=>p.id===v))); ui.sheet = {type:'prod'}; },
  prodarea(v){ ui.pdraft.area = v; },
  saveprod(){ syncProd(); const p=ui.pdraft; if(!p.name.trim()) return setToast('Give the product a name.');
    const i = state.products.findIndex(x=>x.id===p.id); if(i>=0) state.products[i]=p; else state.products.push(p); save(); ui.sheet=null; ui.pdraft=null; setToast('Product saved.'); },
  delprod(){ state.products = state.products.filter(p=>p.id!==ui.pdraft.id); save(); ui.sheet=null; ui.pdraft=null; },

  opensnap(v){ ui.sheet = {type:'snap', date: v||isoDay(), photo:null, sel:null, note:''}; },
  newapptday(v){ ui.calSel = v; ui.tab='today'; },
  snapplan(v){ const s=ui.sheet, day=s.date, plans=state.appts.filter(a=>a.date===day&&LOOK_TYPES.includes(a.type)); const cur = s.sel || plans.map(a=>a.id); s.sel = cur.includes(v) ? cur.filter(x=>x!==v) : [...cur, v]; },
  viewsnap(v){ ui.sheet = {type:'snapview', id:v}; },
  favsnap(v){ const sn=state.snaps.find(x=>x.id===v), m=mondayOf(sn.date), on=!sn.fav; state.snaps.forEach(x => { if(mondayOf(x.date)===m) x.fav=false; }); sn.fav=on; save(); },
  delsnap(v){ const sn=state.snaps.find(x=>x.id===v); if(sn && sn.aid && assetsNs){ assetsNs.delete(sn.aid).catch(()=>{}); } state.snaps=state.snaps.filter(x=>x.id!==v); ui.sheet=null; save(); setToast('Snap deleted.'); },
  async sharesnap(v){ const sn=state.snaps.find(x=>x.id===v); setToast('Making your card…'); const b = await renderCard(sn,true); await saveBlob(b, 'muse-look-'+sn.date+'.jpg'); },
  async savephoto(v){ const sn=state.snaps.find(x=>x.id===v); const b = await renderCard(sn,false); await saveBlob(b, 'muse-photo-'+sn.date+'.jpg'); },
  savesnap(){ const s=ui.sheet; if(!s.photo) return setToast('Add a photo first.');
    const day = s.date || isoDay(), plans=state.appts.filter(a=>a.date===day&&LOOK_TYPES.includes(a.type));
    const note = (document.getElementById('snnote')||{}).value || s.note || '';
    const before = new Set(earnedIds()); const sn = {id:uid(), date:day, note, apptIds:(s.sel||plans.map(a=>a.id)), photo:s.photo, at:new Date().toISOString(), fav:false};
    state.snaps.push(sn); const wk = mondayOf(day);
    plans.filter(a=>sn.apptIds.includes(a.id)).forEach(a => { a.done = true; if(ROUTINE_OF[a.type]) state.routine[ROUTINE_OF[a.type]] = a.date; });
    logToday(); save(); ui.sheet=null; ui.celebrate = true;
    const w = weekInfo(wk), gained = BADGES.filter(b => b[3](badgeCtx()) && !before.has(b[0]));
    setToast(gained.length ? 'New badge: '+gained[0][1] : w.complete ? 'Full week. Nice.' : `Snapped. ${w.snapped} of ${w.planned||w.snapped} this week.`);
    if(assetsNs){ fetch(sn.photo).then(r=>r.blob()).then(b=>assetsNs.upload(b)).then(r=>{ sn.aid = r.id; save(); }).catch(()=>{}); } },

  fold(v){ ui.fold[v]=!ui.fold[v]; },
  wtools(){ ui.wtools=!ui.wtools; },
  weekshift(v){ const d=new Date((ui.calSel||isoDay())+'T12:00:00'); d.setDate(d.getDate()+(+v)); ui.calSel=isoDay(d); },
  themes(){ ui.sheet={type:'theme'}; },
  settheme(v){ state.theme={id:v}; applyTheme(); save(); },
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
  /* never re-render while a file picker is opening: a render would remove the file input before its change event */
  const fl = e.target.closest && e.target.closest('label');
  if ((fl && fl.querySelector('input[type=file]')) || (e.target.tagName==='INPUT' && e.target.type==='file')) return;
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.dataset.act==='overlay' && !e.target.classList.contains('overlay')) return;
  const fn = actions[el.dataset.act];
  if (!fn) return;
  if (el.tagName==='SELECT') return;
  if (ui.adraft && ui.sheet && ui.sheet.type==='appt' && el.dataset.act!=='close') syncAppt();
  if (ui.sheet && ui.sheet.type==='prod') syncProd();
  if (ui.sheet && ui.sheet.type==='snap'){ const n=document.getElementById('snnote'); if(n) ui.sheet.note=n.value; }
  if (ui.draft && !ui.sheet) syncDraft();
  fn(el.dataset.v, {target:e.target, currentTarget:el});
  render();
});
function shrink(file, max){
  return new Promise(res => { const fr=new FileReader(); fr.onload=()=>{ const img=new Image(); img.onload=()=>{
    const s=Math.min(1,(max||640)/Math.max(img.width,img.height)), c=document.createElement('canvas');
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
  if(e.target.id==='thbg'||e.target.id==='thac'){ const t = themeNow(); const n = {id:'custom', bg:t.bg, accent:t.accent}; if(e.target.id==='thbg') n.bg=e.target.value; else n.accent=e.target.value; state.theme=n; applyTheme(); save(); return; }
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
  if ((e.target.id==='snapfile'||e.target.id==='snapcam') && e.target.files[0] && ui.sheet && ui.sheet.type==='snap'){ const f=e.target.files[0]; e.target.value=''; const n=document.getElementById('snnote'); if(n) ui.sheet.note=n.value; const d = await shrink(f, 1000); if(d){ ui.sheet.photo=d; render(); } else setToast('That picture would not open.'); return; }
  if (e.target.id==='sndate' && ui.sheet && ui.sheet.type==='snap'){ ui.sheet.date = e.target.value || isoDay(); ui.sheet.sel=null; const n=document.getElementById('snnote'); if(n) ui.sheet.note=n.value; render(); return; }
  if (e.target.id==='prodphoto' && e.target.files[0] && ui.pdraft){ const f=e.target.files[0]; e.target.value=''; syncProd(); const d = await shrink(f, 700); if(d){ ui.pdraft.photo=d; render(); } else setToast('That picture would not open.'); return; }
  if (e.target.id==='wardup' && e.target.files.length){ const fs=[...e.target.files].filter(f=>f.type.startsWith('image/')); e.target.value=''; await startSort(fs,'ward'); return; }
  if (e.target.id==='sortmore' && e.target.files.length){ const fs=[...e.target.files].filter(f=>f.type.startsWith('image/')); e.target.value=''; await startSort(fs,ui.sheet.mode); return; }
  if (e.target.id==='import' && e.target.files[0]){
    const fr=new FileReader();
    fr.onload=()=>{ try{ const s=JSON.parse(fr.result); if(!Array.isArray(s.items)||!Array.isArray(s.looks)) throw 0;
      if(!confirm('Replace what is on this device with the backup?')) return;
      state={plan:{},routine:{},log:[],pics:[],appts:[],...s}; state.items.forEach(migrate); save(); render(); setToast('Backup loaded.'); }
      catch(err){ setToast('That file is not a Maintaining You backup.'); } };
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
  const hadSheet = !!document.querySelector('.overlay');
  document.getElementById('app').innerHTML = view(); ui.enter = false;
  const ov = document.querySelector('.overlay'); if(ov && !hadSheet) ov.classList.add('in');
  if(ui.celebrate){ ui.celebrate=false; const c=document.createElement('div'); c.className='sparkle'; c.setAttribute('aria-hidden','true'); c.innerHTML=Array.from({length:14},(_,i)=>`<i style="--a:${i*26}deg;--d:${60+(i%4)*22}px;animation-delay:${(i%5)*40}ms"></i>`).join(''); document.body.appendChild(c); setTimeout(()=>c.remove(),1400); }
  if (id){ const n=document.getElementById(id); if(n && n.focus) n.focus(); }
  saveDraftSoon();
}
window.MuseDebug = {save, sigOf, sim, findGroups, guessBottom, strongKind, bottomStats, get state(){ return state; }, get ready(){ return booted; }, flush: async () => { await persist(); await flushDraft(); }};
boot();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
