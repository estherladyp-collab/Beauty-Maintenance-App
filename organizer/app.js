/* Maintaining Home: Kalender, To-dos und Haushaltsplaner. Vanilla JS, kein Build. */
let S;
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const mod = (n, m) => ((n % m) + m) % m;
const parse = d => new Date(d + 'T12:00:00');
const addDays = (d, n) => { const x = parse(d); x.setDate(x.getDate() + n); return isoOf(x); };
const mondayOf = d => mondayIso(parse(d));
const dayDiff = (a, b) => Math.round((parse(a) - parse(b)) / 864e5);
const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const DS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const dowOf = d => mod(parse(d).getDay() + 6, 7);
const fmt = (d, o) => parse(d).toLocaleDateString('de-DE', o);
const fmtShort = d => fmt(d, { day: 'numeric', month: 'short' });
const fmtLong = d => fmt(d, { weekday: 'long', day: 'numeric', month: 'long' });
const eur = n => (Number(n) || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
const num = v => parseFloat(String(v ?? '').replace(',', '.')) || 0;
const monthKey = d => d.slice(0, 7);
const quarterKey = d => d.slice(0, 4) + '-Q' + (Math.floor((+d.slice(5, 7) - 1) / 3) + 1);

const IC = {
  today: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  todo: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  home: '<path d="M4 11l8-7 8 7v8.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M10 20.5V14h4v6.5"/>',
  more: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  left: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  right: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>'
};
const icon = (n, w = 1.6) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;
const CHECK = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';

const ui = {
  tab: 'today', calMode: 'month', calMonth: isoOf().slice(0, 7), calSel: isoOf(),
  area: 'all', home: 'essen', essen: 'plan', shop: 'liste', clean: 'heute', deepV: null,
  week: mondayIso(), budgetMonth: isoOf().slice(0, 7), showDone: false
};

/* ---------- Daten-Helfer ---------- */
const area = id => S.areas.find(a => a.id === id) || S.areas.find(a => a.id === 'home');
const areaName = a => a.parent ? area(a.parent).name + ' / ' + a.name : a.name;
const weekIdx = d => Math.round((parse(mondayOf(d)) - parse(mondayOf(S.settings.start))) / 6048e5);
const rotOf = mon => mod(weekIdx(mon) + (S.settings.rotShift || 0), 4);

function occursOn(it, d) {
  if (!it.date) return false;
  if (d < it.date) return false;
  const diff = dayDiff(d, it.date);
  switch (it.repeat || 'none') {
    case 'daily': return true;
    case 'weekly': return diff % 7 === 0;
    case 'biweekly': return diff % 14 === 0;
    case 'monthly': return parse(d).getDate() === parse(it.date).getDate();
    default: return diff === 0;
  }
}
function nextOcc(it, from) {
  if (!it.date) return '';
  if ((it.repeat || 'none') === 'none') return it.date;
  for (let i = 0; i < 400; i++) { const d = addDays(from, i); if (occursOn(it, d)) return d; }
  return it.date;
}
const todoDone = (t, d) => (t.repeat || 'none') === 'none' ? !!t.done : !!(t.doneOn || {})[d];
const byTime = (a, b) => (a.time || '99').localeCompare(b.time || '99');

function deepInfo(d) {
  if (dowOf(d) !== 5) return null;
  const w = weekIdx(d);
  if (mod(w, 2) !== 0) return null;
  return mod(Math.floor(w / 2), 2) === 0 ? 'A' : 'B';
}
function deepCycle(today) {
  let s = addDays(mondayOf(today), 5);
  if (mod(weekIdx(s), 2) !== 0) s = addDays(s, 7);
  return { sat: s, v: deepInfo(s) };
}
function itemsOn(d) {
  return {
    ev: S.events.filter(e => occursOn(e, d)).sort(byTime),
    td: S.todos.filter(t => occursOn(t, d))
  };
}
function cell(wk, di, slot) {
  const o = (S.plan[wk] || {})[di];
  const rot = SEED.rotation[rotOf(wk)];
  const row = rot.days[di];
  if (o && o[slot] !== undefined) return { text: o[slot], pot: -1, own: true };
  if (slot === 0) return { text: row[0], pot: -1 };
  const text = row[slot === 1 ? 1 : 3], pot = row[slot === 1 ? 2 : 4];
  return { text, pot, koch: pot >= 0 && kochSlot(rot, pot) === di + ':' + slot };
}
function kochSlot(rot, pot) {
  for (let i = 0; i < 7; i++) for (const s of [1, 2]) { if (rot.days[i][s === 1 ? 2 : 4] === pot) return i + ':' + s; }
}
const pad = (a, n) => a.slice(0, n);

/* ---------- Rendering ---------- */
let animateNext = true;
function render() {
  const y = window.scrollY;
  const V = { today: vToday, cal: vCal, todos: vTodos, home: vHome, more: vMore }[ui.tab];
  $('#app').innerHTML = `<main class="${animateNext ? 'page' : ''}">${V()}</main>`;
  animateNext = false;
  const tabs = [['today', 'Heute', 'today'], ['cal', 'Kalender', 'cal'], ['todos', 'To-dos', 'todo'], ['home', 'Haushalt', 'home'], ['more', 'Mehr', 'more']];
  const fab = ['today', 'cal', 'todos'].includes(ui.tab) ? `<button class="fab" data-a="new" aria-label="Neu anlegen">${icon('plus', 2)}</button>` : '';
  $('#chrome').innerHTML = fab + `<nav class="nav" aria-label="Hauptmenü"><div class="nav-in">${tabs.map(t => `<button class="tab" data-a="tab" data-t="${t[0]}" ${ui.tab === t[0] ? 'aria-current="page"' : ''}>${icon(t[2])}<span>${t[1]}</span></button>`).join('')}</div></nav>`;
  window.scrollTo(0, y);
}
const commit = () => { persist(S); render(); };
const save = () => persist(S);

function chk(on, attrs) { return `<button class="chk" role="checkbox" aria-checked="${on ? 'true' : 'false'}" ${attrs}><i>${CHECK}</i></button>`; }
function sec(title, right = '') { return `<div class="sec"><h2>${title}</h2>${right}</div>`; }
const tagHtml = a => `<span class="tag" style="--c:${a.color}">${esc(areaName(a))}</span>`;

function todoRow(t, d, opts = {}) {
  const done = todoDone(t, d), a = area(t.area);
  const late = !done && t.date && (t.repeat || 'none') === 'none' && t.date < isoOf();
  const when = opts.showDate && t.date ? `<span class="${late ? 'late' : ''}">${late ? 'Überfällig seit ' : ''}${fmt(d, { weekday: 'short', day: 'numeric', month: 'short' })}${t.repeat && t.repeat !== 'none' ? ' · ' + repLabel(t.repeat) : ''}</span>` : (late ? '<span class="late">Überfällig</span>' : '');
  return `<div class="row ${done ? 'done' : ''}">${chk(done, `data-a="tg-todo" data-id="${t.id}" data-d="${d}" aria-label="${esc(t.title)} erledigt"`)}
    <button class="row-body" data-a="edit" data-k="todo" data-id="${t.id}"><span class="t">${esc(t.title)}</span><span class="m">${tagHtml(a)}${when}</span></button></div>`;
}
const repLabel = r => ({ none: 'Einmalig', daily: 'Täglich', weekly: 'Jede Woche', biweekly: 'Alle 2 Wochen', monthly: 'Jeden Monat' }[r] || '');
function eventRow(e) {
  const a = area(e.area);
  return `<div class="plain-row"><span class="time">${esc(e.time || 'Tag')}</span>
    <button class="grow" data-a="edit" data-k="event" data-id="${e.id}"><span>${esc(e.title)}</span><span class="m small muted" style="display:flex;gap:10px;margin-top:1px">${tagHtml(a)}${e.repeat && e.repeat !== 'none' ? `<span>${repLabel(e.repeat)}</span>` : ''}</span></button></div>`;
}

/* ---------- Heute ---------- */
function roundIds() { const ids = []; SEED.round.forEach((r, i) => r[2].forEach((_, j) => ids.push(`r${i}-${j}`))); return ids; }
function vToday() {
  const t = isoOf(), wk = mondayOf(t), h = new Date().getHours();
  const greet = h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  const pr = S.priorities[wk] || ['', '', ''];
  const { ev, td } = itemsOn(t);
  const over = S.todos.filter(x => (x.repeat || 'none') === 'none' && !x.done && x.date && x.date < t);
  const open = td.filter(x => !todoDone(x, t));
  const doneT = td.filter(x => todoDone(x, t));
  const empty = !ev.length && !open.length && !over.length && !doneT.length;
  const log = S.cleanLog[t] || [], ids = roundIds(), deep = deepInfo(t);
  const focus = SEED.focus[dowOf(t)];
  const di = dowOf(t), lunch = cell(wk, di, 1), dinner = cell(wk, di, 2);
  const slotLine = (k, c) => `<div class="slot p${c.pot < 0 ? 'x' : c.pot}" style="cursor:default;margin:0"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</div>`;
  return `<div class="stack">
    <header><h1 class="title">${greet}, ${esc(S.settings.name)}</h1><p class="lead">${fmtLong(t)}</p></header>
    <section>${sec('Meine 3 Prioritäten', `<span class="small muted">Woche ab ${fmtShort(wk)}</span>`)}
      <div class="stack-s">${[0, 1, 2].map(i => `<label class="prio"><span>${i + 1}.</span><input class="line-in" data-c="prio" data-i="${i}" value="${esc(pr[i])}" placeholder="${['Das Wichtigste diese Woche', 'Danach', 'Und noch eins'][i]}" enterkeyhint="done" autocomplete="off"></label>`).join('')}</div></section>
    <section>${sec('Heute')}
      ${empty ? `<div class="empty"><b>Heute ist frei.</b>Nichts geplant. Tippe auf das Plus, wenn doch etwas dazukommt.</div>` : ''}
      ${ev.map(eventRow).join('')}
      ${over.map(x => todoRow(x, x.date, { showDate: true })).join('')}
      ${open.map(x => todoRow(x, t)).join('')}
      ${doneT.map(x => todoRow(x, t)).join('')}
    </section>
    <section>${sec('Im Haus', `<button class="more" data-a="goto" data-t="home" data-sub="essen">Haushalt</button>`)}
      <div class="stack-s">
        <button class="card today-card" data-a="goto" data-t="home" data-sub="clean">
          <h3>${deep ? `Deep Clean, Woche ${deep}` : esc(focus[0])}</h3>
          <span class="muted small" style="margin-top:-8px">${deep ? esc(SEED.deep[deep].title) : esc(focus[1])}</span>
          <span class="bar" aria-hidden="true"><i style="--p:${log.length / ids.length}"></i></span>
          <span class="small muted">Tägliche Runde: ${log.length} von ${ids.length} erledigt</span></button>
        <div class="stack-s">${slotLine('Mittag', lunch)}${slotLine('Abend', dinner)}</div>
      </div></section></div>`;
}

/* ---------- Kalender ---------- */
function dotsFor(d) {
  const { ev, td } = itemsOn(d); const seen = new Set(), out = [];
  [...ev, ...td].forEach(x => { if (!seen.has(x.area) && out.length < 3) { seen.add(x.area); out.push(`<i style="--c:${area(x.area).color}"></i>`); } });
  if (deepInfo(d)) out.push('<i class="ring"></i>');
  return out.join('');
}
function dayAgenda(d, compact) {
  const { ev, td } = itemsOn(d), deep = deepInfo(d);
  const body = [
    deep ? `<div class="plain-row"><span class="time">Tag</span><span class="grow">Deep Clean, Woche ${deep}<span class="small muted" style="display:block">${esc(SEED.deep[deep].title)}</span></span></div>` : '',
    ev.map(eventRow).join(''), td.map(x => todoRow(x, d)).join('')
  ].join('');
  if (body) return body;
  return compact ? `<p class="muted small" style="padding:6px 0 0">Nichts geplant</p>` : `<div class="empty"><b>Nichts an diesem Tag.</b>Tippe auf Hinzufügen.</div>`;
}
function vCal() {
  const t = isoOf();
  let head, body;
  if (ui.calMode === 'month') {
    const first = ui.calMonth + '-01', start = mondayOf(first);
    const label = fmt(first, { month: 'long', year: 'numeric' });
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = addDays(start, i), out = d.slice(0, 7) !== ui.calMonth;
      if (i >= 35 && out) break;
      cells.push(`<button class="day" data-a="pick-day" data-d="${d}" data-out="${out ? 1 : 0}" aria-pressed="${ui.calSel === d}" ${d === t ? 'aria-current="date"' : ''} aria-label="${fmtLong(d)}"><span class="n">${+d.slice(8)}</span><span class="dots">${dotsFor(d)}</span></button>`);
    }
    head = `<div class="cal-head"><button class="icon-btn" data-a="cal-prev" aria-label="Vorheriger Monat">${icon('left')}</button><h2>${label}</h2><button class="icon-btn" data-a="cal-next" aria-label="Nächster Monat">${icon('right')}</button></div>`;
    body = `<div class="dow">${DS.map(d => `<span>${d}</span>`).join('')}</div><div class="grid7">${cells.join('')}</div>
      <section style="margin-top:26px">${sec(ui.calSel === t ? 'Heute' : fmtLong(ui.calSel), `<button class="more" data-a="new" data-d="${ui.calSel}">Hinzufügen</button>`)}${dayAgenda(ui.calSel)}</section>`;
  } else {
    const mon = mondayOf(ui.calSel);
    head = `<div class="cal-head"><button class="icon-btn" data-a="cal-prev" aria-label="Vorherige Woche">${icon('left')}</button><h2>${fmtShort(mon)} bis ${fmtShort(addDays(mon, 6))}</h2><button class="icon-btn" data-a="cal-next" aria-label="Nächste Woche">${icon('right')}</button></div>`;
    body = Array.from({ length: 7 }, (_, i) => { const d = addDays(mon, i); return `<div class="week-day ${d === t ? 'today' : ''}"><h3>${DAYS[i]}<small>${fmtShort(d)} <button class="more" style="color:var(--gold);padding:6px 0 6px 10px;font-weight:600" data-a="new" data-d="${d}" aria-label="Hinzufügen am ${fmtLong(d)}">+ Neu</button></small></h3>${dayAgenda(d, true)}</div>`; }).join('');
  }
  return `<div class="stack"><header style="display:flex;justify-content:space-between;align-items:end;gap:12px"><h1 class="title">Kalender</h1><button class="btn ghost small" data-a="cal-today">Heute</button></header>
    <div class="seg" role="group" aria-label="Ansicht"><button data-a="cal-mode" data-m="month" aria-pressed="${ui.calMode === 'month'}">Monat</button><button data-a="cal-mode" data-m="week" aria-pressed="${ui.calMode === 'week'}">Woche</button></div>
    <div>${head}${body}</div></div>`;
}

/* ---------- To-dos ---------- */
function inFilter(a) {
  if (ui.area === 'all') return true;
  if (ui.area === 'church') return a === 'church' || area(a).parent === 'church';
  return a === ui.area;
}
const LEAD_ST = ['neu', 'gespräch', 'angebot', 'gewonnen', 'verloren'];
function vTodos() {
  const t = isoOf(), top = S.areas.filter(a => !a.parent);
  const list = S.todos.filter(x => inFilter(x.area));
  const open = list.filter(x => !todoDone(x, nextOcc(x, t)) || (x.repeat && x.repeat !== 'none'));
  const dated = open.filter(x => x.date).map(x => ({ x, d: nextOcc(x, t) })).sort((a, b) => a.d.localeCompare(b.d));
  const late = dated.filter(o => o.d < t && (o.x.repeat || 'none') === 'none' && !o.x.done);
  const today = dated.filter(o => o.d === t && !todoDone(o.x, t));
  const soon = dated.filter(o => o.d > t);
  const nodate = open.filter(x => !x.date && !x.done);
  const done = list.filter(x => (x.repeat || 'none') === 'none' && x.done);
  const group = (title, arr, showDate) => arr.length ? `<section>${sec(title)}${arr.map(o => todoRow(o.x || o, o.d || t, { showDate })).join('')}</section>` : '';
  const none = !late.length && !today.length && !soon.length && !nodate.length;
  const leads = ui.area === 'vf' ? `<section>${sec('Leads', `<button class="more" data-a="lead-new">Neuer Lead</button>`)}${S.leads.length ? S.leads.map(l => `<div class="plain-row"><button class="grow" data-a="lead-edit" data-id="${l.id}"><b style="font-weight:600">${esc(l.name)}</b>${l.note ? `<span class="small muted" style="display:block">${esc(l.note)}</span>` : ''}</button><button class="status" data-s="${l.status}" data-a="lead-next" data-id="${l.id}" aria-label="Status ${l.status}, ändern">${l.status[0].toUpperCase() + l.status.slice(1)}</button></div>`).join('') : '<div class="empty"><b>Noch keine Leads.</b>Trag ein, wen du als Nächstes anrufst.</div>'}</section>` : '';
  return `<div class="stack"><header><h1 class="title">To-dos</h1></header>
    <div class="stack-s"><div class="chips" role="group" aria-label="Bereich"><button class="chip" data-a="area" data-id="all" aria-pressed="${ui.area === 'all'}">Alle</button>${top.map(a => `<button class="chip" data-a="area" data-id="${a.id}" aria-pressed="${ui.area === a.id}"><i class="dot" style="--c:${a.color}"></i>${esc(a.name)}</button>`).join('')}</div>
    ${ui.area === 'church' || area(ui.area).parent === 'church' && ui.area !== 'home' ? `<div class="chips" role="group" aria-label="Church Gruppe"><button class="chip" data-a="area" data-id="church" aria-pressed="${ui.area === 'church'}">Alle Church</button>${S.areas.filter(a => a.parent === 'church').map(a => `<button class="chip" data-a="area" data-id="${a.id}" aria-pressed="${ui.area === a.id}"><i class="dot" style="--c:${a.color}"></i>${esc(a.name)}</button>`).join('')}</div>` : ''}</div>
    ${none && !(ui.area === 'vf' && S.leads.length) ? `<div class="empty"><b>Alles erledigt.</b>Nichts offen in diesem Bereich.</div>` : ''}
    ${group('Überfällig', late, true)}${group('Heute', today, false)}${group('Demnächst', soon, true)}${group('Ohne Datum', nodate, false)}
    ${leads}
    ${done.length ? `<section>${sec(`Erledigt (${done.length})`, `<button class="more" data-a="toggle-done">${ui.showDone ? 'Ausblenden' : 'Anzeigen'}</button>`)}${ui.showDone ? done.map(x => todoRow(x, x.date || t, { showDate: true })).join('') + `<button class="btn ghost small" style="margin-top:12px" data-a="clear-done">Erledigte löschen</button>` : ''}</section>` : ''}</div>`;
}

/* ---------- Haushalt ---------- */
const seg = (key, opts, attr = 'sub') => `<div class="seg" role="group">${opts.map(o => `<button data-a="seg" data-key="${key}" data-v="${o[0]}" aria-pressed="${ui[key] === o[0]}">${o[1]}</button>`).join('')}</div>`;
function vHome() {
  const body = { essen: vEssen, shop: vShop, clean: vClean, budget: vBudget }[ui.home]();
  return `<div class="stack"><header><h1 class="title">Haushalt</h1></header>${seg('home', [['essen', 'Essen'], ['shop', 'Einkauf'], ['clean', 'Reinigung'], ['budget', 'Budget']])}${body}</div>`;
}

function vEssen() {
  const t = isoOf();
  const sub = seg('essen', [['plan', 'Kochplan'], ['gerichte', 'Gerichte']]);
  if (ui.essen === 'gerichte') {
    const own = `<div class="card">${sec('Meine eigenen Ideen')}${S.myMeals.map((m, i) => `<div class="plain-row"><span class="grow">${esc(m)}</span><button class="icon-btn" data-a="del-idea" data-i="${i}" aria-label="${esc(m)} löschen">${icon('x')}</button></div>`).join('')}<div style="display:flex;gap:8px;margin-top:8px"><input class="in" id="idea" placeholder="Neues Gericht" enterkeyhint="done" autocomplete="off"><button class="btn" data-a="add-idea">Hinzufügen</button></div></div>`;
    return sub + `<div class="stack-s">${SEED.meals.map(m => `<div class="card"><h3 class="group-title">${m[0]}</h3>${m[1].map(x => `<div class="plain-row" style="min-height:40px;padding:6px 0">${esc(x)}</div>`).join('')}${m[2] ? `<p class="serif-i" style="margin-top:8px">${m[2]}</p>` : ''}</div>`).join('')}${own}</div>`;
  }
  const wk = ui.week, r = rotOf(wk), rot = SEED.rotation[r];
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(wk, i);
    const row = (k, s) => { const c = cell(wk, i, s); return `<button class="slot p${c.pot < 0 ? 'x' : c.pot} ${c.text ? '' : 'empty-slot'}" data-a="edit-meal" data-i="${i}" data-s="${s}"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</button>`; };
    return `<div class="meal-day ${d === t ? 'today' : ''}"><h3>${DAYS[i]}<small class="small muted" style="font-family:var(--sans);font-weight:400;font-size:13px">${fmtShort(d)}</small></h3>${row('Früh', 0)}${row('Mittag', 1)}${row('Abend', 2)}</div>`;
  }).join('');
  return sub + `<div class="week-nav"><button class="icon-btn" data-a="week" data-n="-1" aria-label="Vorherige Woche">${icon('left')}</button><h2>Woche vom ${fmtShort(wk)}<small>Rotation ${r + 1} von 4 <button style="color:var(--gold);font-weight:600;padding:6px 4px" data-a="rot-pick">ändern</button></small></h2><button class="icon-btn" data-a="week" data-n="1" aria-label="Nächste Woche">${icon('right')}</button></div>
    <div class="card"><div class="pots">${rot.pots.map((p, i) => `<div class="pot"><i style="--b:var(--pot${i});--l:var(--pot${i}-line)"></i><div><b>${esc(p[0])}</b><span>${p[1]}</span></div></div>`).join('')}</div></div>
    <div class="meals-grid stack-s">${days}</div>`;
}

function vShop() {
  const sub = seg('shop', [['liste', 'Liste'], ['vorrat', 'Vorräte'], ['prep', 'Sonntag Prep']]);
  if (ui.shop === 'vorrat') {
    const miss = Object.values(S.pantry).filter(v => v === 'fehlt').length;
    return sub + `<p class="serif-i">Einmal im Monat komplett durchgehen, donnerstags kurz prüfen. Nur noch 1 übrig? Ab auf die Einkaufsliste.</p>
      ${miss ? `<p class="small"><b>${miss}</b> ${miss === 1 ? 'fehlt' : 'fehlen'} und ${miss === 1 ? 'steht' : 'stehen'} auf der Einkaufsliste.</p>` : ''}
      <div class="stack-s">${SEED.pantry.map((g, gi) => `<div class="card"><h3 class="group-title">${g[0]}</h3>${g[2].map((x, xi) => { const id = `${gi}-${xi}`, s = S.pantry[id]; return `<div class="pantry-row"><span class="grow">${esc(x)}</span><div class="mini-seg"><button class="da" data-a="pantry" data-id="${id}" data-v="da" aria-pressed="${s === 'da'}">Da</button><button class="fehlt" data-a="pantry" data-id="${id}" data-v="fehlt" aria-pressed="${s === 'fehlt'}">Fehlt</button></div></div>`; }).join('')}</div>`).join('')}</div>`;
  }
  if (ui.shop === 'prep') {
    const wk = mondayOf(isoOf()), log = S.prepLog[wk] || [];
    return sub + `<p class="serif-i">Sonntag vorbereiten, unter der Woche entspannen.</p>
      <div class="card">${SEED.prep.map((p, i) => `<div class="row ${log.includes(i) ? 'done' : ''}">${chk(log.includes(i), `data-a="prep" data-i="${i}" aria-label="${esc(p)}"`)}<span class="row-body"><span class="t">${esc(p)}</span></span></div>`).join('')}</div>`;
  }
  const items = S.shopping, doneN = items.filter(i => i.done).length;
  return sub + `<form class="card form" data-a="shop-add" style="gap:10px"><div style="display:flex;gap:8px"><input class="in" id="shop-t" placeholder="Was brauchst du?" enterkeyhint="done" autocomplete="off"><button class="btn" type="submit">Dazu</button></div>
      <select class="in" id="shop-c" aria-label="Kategorie">${SEED.shopCats.map(c => `<option>${c}</option>`).join('')}</select></form>
    ${items.length ? '' : '<div class="empty"><b>Liste ist leer.</b>Alles da, oder du hast noch nichts aufgeschrieben.</div>'}
    ${SEED.shopCats.filter(c => items.some(i => i.cat === c)).map(c => `<div class="card"><h3 class="group-title">${c}</h3>${items.filter(i => i.cat === c).map(i => `<div class="row ${i.done ? 'done' : ''}">${chk(i.done, `data-a="shop-tg" data-id="${i.id}" aria-label="${esc(i.text)}"`)}<span class="row-body"><span class="t">${esc(i.text)}</span></span><button class="icon-btn" data-a="shop-del" data-id="${i.id}" aria-label="${esc(i.text)} entfernen">${icon('x')}</button></div>`).join('')}</div>`).join('')}
    ${doneN ? `<button class="btn ghost" data-a="shop-clear">${doneN} erledigte entfernen</button>` : ''}`;
}

function vClean() {
  const sub = seg('clean', [['heute', 'Heute'], ['deep', 'Deep Clean'], ['monat', 'Monatlich']]);
  const t = isoOf();
  if (ui.clean === 'deep') {
    const cy = deepCycle(t), v = ui.deepV || cy.v, d = SEED.deep[v], key = cy.sat + v, log = S.deepLog[key] || [];
    const total = d.tasks.reduce((a, x) => a + x[1], 0);
    return sub + `<div class="card"><h3 style="font-size:24px">Nächster Deep Clean: ${fmt(cy.sat, { weekday: 'long', day: 'numeric', month: 'long' })}</h3><p class="muted small">Alle 2 Wochen am Samstag, im Wechsel Woche A und B. Das ersetzt an diesem Samstag deine ganze Putzstunde. Schaffst du nicht alles, macht der nächste Samstag weiter.</p></div>
      <div class="seg" role="group">${['A', 'B'].map(x => `<button data-a="deepv" data-v="${x}" aria-pressed="${v === x}">Woche ${x}${x === cy.v ? ' (diese)' : ''}</button>`).join('')}</div>
      <div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 class="group-title">${d.title}</h3><span class="serif-i">${total} Min</span></div>
        ${d.tasks.map((x, i) => `<div class="row ${log.includes(i) ? 'done' : ''}">${chk(log.includes(i), `data-a="deep" data-k="${key}" data-i="${i}" aria-label="${esc(x[0])}"`)}<span class="row-body"><span class="t">${esc(x[0])}</span></span><span class="small muted num" style="padding:12px 4px 0;white-space:nowrap">${x[1]} Min</span></div>`).join('')}
        <button class="btn block" style="margin-top:14px" data-a="deep-finish" data-v="${v}" data-d="${cy.sat}">Deep Clean abgeschlossen</button></div>
      <div class="card"><h3 class="group-title">Bonus, wenn Zeit übrig ist</h3>${SEED.deep.bonus.map(b => `<div class="plain-row" style="min-height:40px">${b}</div>`).join('')}</div>
      <div class="card"><h3 class="group-title">Mein Deep Clean Tracker</h3>${S.deepDone.length ? S.deepDone.slice(-8).reverse().map(x => `<div class="plain-row"><span class="grow">${fmt(x.date, { day: 'numeric', month: 'long', year: 'numeric' })}</span><span class="status">Woche ${x.v}</span></div>`).join('') : '<p class="muted small">Noch kein Deep Clean eingetragen.</p>'}</div>`;
  }
  if (ui.clean === 'monat') {
    const mk = monthKey(t), qk = quarterKey(t), ml = S.monthLog[mk] || [], ql = S.quarterLog[qk] || [];
    let n = 0;
    return sub + `<div class="stack-s"><h2 style="font-size:26px">Monatlich</h2><p class="serif-i" style="margin-top:-6px">Zusätzlich zum Deep Clean, wenn es passt. Setzt sich jeden Monat zurück.</p>
      ${SEED.monthly.map((g, gi) => `<div class="card"><h3 class="group-title">${g[0]}</h3>${g[1].map((x, xi) => { const id = `${gi}-${xi}`; return `<div class="row ${ml.includes(id) ? 'done' : ''}">${chk(ml.includes(id), `data-a="mq" data-l="month" data-id="${id}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`; }).join('')}</div>`).join('')}
      <h2 style="font-size:26px;margin-top:14px">Quartal</h2>
      <div class="card">${SEED.quarterly.map((x, i) => `<div class="row ${ql.includes(String(i)) ? 'done' : ''}">${chk(ql.includes(String(i)), `data-a="mq" data-l="quarter" data-id="${i}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`).join('')}</div></div>`;
  }
  const log = S.cleanLog[t] || [], deep = deepInfo(t), f = SEED.focus[dowOf(t)];
  const all = roundIds().length, pct = Math.round(log.length / all * 100);
  return sub + `<div class="card"><h3 style="font-size:24px">${deep ? `Heute: Deep Clean, Woche ${deep}` : 'Schwerpunkt heute: ' + esc(f[0])}</h3>
      <p class="muted small" style="margin-top:4px">${deep ? '' : '15 Min extra. '}${deep ? esc(SEED.deep[deep].title) + '. Mehr dazu im Tab Deep Clean.' : esc(f[1])}</p></div>
    <div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span class="small muted">45 Min Runde plus 15 Min Schwerpunkt</span><span class="small num">${log.length} von ${all}</span></div><div class="bar"><i style="--p:${pct / 100}"></i></div></div>
    ${SEED.round.map((r, i) => `<div class="card"><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 class="group-title">${r[0]}</h3><span class="serif-i">${r[1]} Min</span></div>${r[2].map((x, j) => { const id = `r${i}-${j}`, on = log.includes(id); return `<div class="row ${on ? 'done' : ''}">${chk(on, `data-a="round" data-id="${id}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`; }).join('')}</div>`).join('')}
    <p class="note">${SEED.roundTip}</p><p class="note">${SEED.roundPanic}</p>
    <div class="card"><h3 class="group-title">Schwerpunkt der Woche</h3>${SEED.focus.map((x, i) => `<div class="plain-row ${i === dowOf(t) ? '' : ''}" style="align-items:flex-start"><b style="width:30px;color:var(--gold);flex:none">${DS[i]}</b><span class="grow"><b style="font-weight:600">${x[0]}</b><span class="small muted" style="display:block">${x[1]}</span></span></div>`).join('')}</div>`;
}

function budgetOf(mk) { return S.budget[mk] || (S.budget[mk] = { budget: '', goal: '', weeks: ['', '', '', '', ''], planned: {}, save: '' }); }
const wom = d => Math.min(5, Math.ceil(+d.slice(8) / 7));
function vBudget() {
  const mk = ui.budgetMonth, b = budgetOf(mk), first = mk + '-01';
  const pu = S.purchases.filter(p => p.date.startsWith(mk)).sort((x, y) => y.date.localeCompare(x.date));
  const spent = pu.reduce((a, p) => a + num(p.amount), 0), left = num(b.budget) - spent;
  const wspent = [1, 2, 3, 4, 5].map(w => pu.filter(p => wom(p.date) === w).reduce((a, p) => a + num(p.amount), 0));
  const cspent = c => pu.filter(p => p.cat === c).reduce((a, p) => a + num(p.amount), 0);
  const inp = (path, v, ph = '0,00') => `<input inputmode="decimal" data-c="budget" data-p="${path}" value="${esc(v)}" placeholder="${ph}" aria-label="${path}">`;
  return `<div class="week-nav"><button class="icon-btn" data-a="bmonth" data-n="-1" aria-label="Vorheriger Monat">${icon('left')}</button><h2>${fmt(first, { month: 'long', year: 'numeric' })}</h2><button class="icon-btn" data-a="bmonth" data-n="1" aria-label="Nächster Monat">${icon('right')}</button></div>
    <div class="stat-grid"><label class="stat"><span class="k">Monatsbudget (€)</span>${inp('budget', b.budget)}</label><label class="stat"><span class="k">Sparziel (€)</span>${inp('goal', b.goal)}</label>
      <div class="stat"><span class="k">Ausgegeben</span><div class="v">${eur(spent)}</div></div><div class="stat"><span class="k">Übrig</span><div class="v ${left < 0 ? 'neg' : ''}">${eur(left)}</div></div></div>
    <section>${sec('Pro Woche')}<table class="tbl"><thead><tr><th>Woche</th><th class="r">Budget</th><th class="r">Ausgegeben</th><th class="r">Differenz</th></tr></thead><tbody>${[0, 1, 2, 3, 4].map(i => `<tr><td>Woche ${i + 1}</td><td>${inp('w' + i, b.weeks[i])}</td><td class="r">${eur(wspent[i])}</td><td class="r ${num(b.weeks[i]) - wspent[i] < 0 ? 'late' : ''}">${b.weeks[i] === '' ? 'n/a' : eur(num(b.weeks[i]) - wspent[i])}</td></tr>`).join('')}</tbody></table></section>
    <section>${sec('Wohin geht das Geld')}<table class="tbl"><thead><tr><th>Kategorie</th><th class="r">Geplant</th><th class="r">Tatsächlich</th></tr></thead><tbody>${SEED.budgetCats.map((c, i) => `<tr><td>${c}</td><td>${inp('c' + i, b.planned['c' + i] ?? '')}</td><td class="r">${eur(cspent(c))}</td></tr>`).join('')}</tbody></table></section>
    <section>${sec('Einkaufsprotokoll', `<button class="more" data-a="buy-new">Einkauf eintragen</button>`)}
      ${pu.length ? pu.map(p => `<div class="plain-row"><span class="small muted num" style="width:48px;flex:none">${fmtShort(p.date)}</span><button class="grow" data-a="buy-edit" data-id="${p.id}"><b style="font-weight:600">${esc(p.store || 'Einkauf')}</b><span class="small muted" style="display:block">${esc(p.cat)}${p.note ? ', ' + esc(p.note) : ''}</span></button><span class="num">${eur(p.amount)}</span></div>`).join('') + `<div class="plain-row" style="justify-content:flex-end;gap:16px"><span class="muted small">Summe Monat</span><b class="num" style="font-size:18px">${eur(spent)}</b></div>` : '<div class="empty"><b>Noch kein Bon.</b>2 Minuten am Abend, jeden Bon eintragen.</div>'}</section>
    <section>${sec('Was spare ich nächsten Monat?')}<p class="serif-i" style="margin-bottom:8px">Ideen: Angebote nutzen, Eigenmarken, Großpackung Reis, Reste Tag, Wochenmarkt, Lieferdienst streichen.</p><textarea class="in" rows="3" data-c="budget" data-p="save" aria-label="Was spare ich nächsten Monat">${esc(b.save)}</textarea></section>`;
}

/* ---------- Mehr ---------- */
function vMore() {
  const st = S.settings;
  return `<div class="stack"><header><h1 class="title">Mehr</h1></header>
    <section>${sec('Du')}<div class="form"><label class="field"><span>Name</span><input class="in" data-c="set" data-k="name" value="${esc(st.name)}" autocomplete="off"></label>
      <label class="field"><span>Startdatum des Planers</span><input class="in" type="date" data-c="set" data-k="start" value="${st.start}"></label>
      <p class="small muted">Vom Startdatum aus zählen Kochrotation und Deep Clean A und B.</p></div></section>
    <section>${sec('Darstellung')}${`<div class="seg" role="group">${[['auto', 'Automatisch'], ['light', 'Hell'], ['dark', 'Dunkel']].map(o => `<button data-a="theme" data-v="${o[0]}" aria-pressed="${st.theme === o[0]}">${o[1]}</button>`).join('')}</div>`}</section>
    <section>${sec('Backup')}<p class="small muted" style="margin-bottom:10px">Alles bleibt auf diesem Gerät. Mit der Datei kannst du auf ein anderes Gerät umziehen.</p>
      <div class="stack-s"><button class="btn block" data-a="export">Backup speichern</button><button class="btn ghost block" data-a="import">Backup laden</button><input type="file" id="file" accept="application/json,.json" hidden></div></section>
    <section>${sec('Aufräumen')}<button class="btn danger block" data-a="reset">Alles zurücksetzen</button></section></div>`;
}

/* ---------- Sheets ---------- */
function openSheet(html) {
  $('#sheets').innerHTML = '';
  $('#sheets').insertAdjacentHTML('beforeend', `<div class="backdrop" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`);
  const f = $('#sheets .sheet input:not([type=hidden]), #sheets .sheet select');
  if (f && !matchMedia('(pointer: coarse)').matches) f.focus();
}
function closeSheet() {
  const ch = $('#sheets'); if (!$('.sheet', ch)) return;
  ch.classList.add('closing');
  setTimeout(() => { ch.classList.remove('closing'); ch.innerHTML = ''; }, 190);
}
const areaOptions = sel => S.areas.map(a => `<option value="${a.id}" ${a.id === sel ? 'selected' : ''}>${esc(areaName(a))}</option>`).join('');
const repOptions = sel => ['none', 'daily', 'weekly', 'biweekly', 'monthly'].map(r => `<option value="${r}" ${r === sel ? 'selected' : ''}>${repLabel(r)}</option>`).join('');

function itemSheet(o) {
  const it = o.id ? (o.kind === 'todo' ? S.todos : S.events).find(x => x.id === o.id) : null;
  const kind = o.kind, d = it ? it.date : (o.date ?? ''), ar = it ? it.area : (o.area || (ui.area !== 'all' && !['church'].includes(ui.area) ? ui.area : 'home'));
  openSheet(`<h2>${it ? (kind === 'todo' ? 'Aufgabe' : 'Termin') : 'Neu'}</h2>
    <form class="form" data-a="save-item" data-k="${kind}" data-id="${o.id || ''}">
      ${it ? '' : `<div class="seg" role="group"><button type="button" data-a="sheet-kind" data-k="todo" aria-pressed="${kind === 'todo'}">Aufgabe</button><button type="button" data-a="sheet-kind" data-k="event" aria-pressed="${kind === 'event'}">Termin</button></div>`}
      <label class="field"><span>Titel</span><input class="in" id="f-title" value="${esc(it ? it.title : (o.title || ''))}" required autocomplete="off" enterkeyhint="done"></label>
      <label class="field"><span>Bereich</span><select class="in" id="f-area">${areaOptions(ar)}</select></label>
      <div class="two"><label class="field"><span>${kind === 'todo' ? 'Fällig am' : 'Datum'}</span><input class="in" type="date" id="f-date" value="${d}"></label>
      ${kind === 'event' ? `<label class="field"><span>Uhrzeit</span><input class="in" type="time" id="f-time" value="${it ? it.time || '' : ''}"></label>` : `<label class="field"><span>Wiederholen</span><select class="in" id="f-rep">${repOptions(it ? it.repeat : 'none')}</select></label>`}</div>
      ${kind === 'event' ? `<label class="field"><span>Wiederholen</span><select class="in" id="f-rep">${repOptions(it ? it.repeat : 'none')}</select></label>` : ''}
      <button class="btn block" type="submit">Speichern</button>
      ${it ? `<button class="btn danger block" type="button" data-a="del-item" data-k="${kind}" data-id="${it.id}">Löschen</button>` : ''}</form>`);
}

/* ---------- Aktionen ---------- */
const toastEl = () => $('#toast');
let toastT;
function toast(m) { const e = toastEl(); e.textContent = m; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('on'), 2200); }
function toggleIn(map, key, id) { const a = map[key] || (map[key] = []); const i = a.indexOf(id); i >= 0 ? a.splice(i, 1) : a.push(id); }

const A = {
  tab: d => { ui.tab = d.t; animateNext = true; commit(); window.scrollTo(0, 0); },
  goto: d => { ui.tab = d.t; if (d.sub) ui.home = d.sub; animateNext = true; commit(); window.scrollTo(0, 0); },
  seg: d => { ui[d.key] = d.v; commit(); },
  area: d => { ui.area = d.id; commit(); },
  'toggle-done': () => { ui.showDone = !ui.showDone; commit(); },
  'clear-done': () => { S.todos = S.todos.filter(t => !((t.repeat || 'none') === 'none' && t.done)); commit(); },
  new: d => itemSheet({ kind: ui.tab === 'cal' || d.d ? 'event' : 'todo', date: d.d || (ui.tab === 'cal' ? ui.calSel : ''), area: undefined }),
  edit: d => itemSheet({ kind: d.k, id: d.id }),
  'sheet-kind': d => itemSheet({ kind: d.k, title: $('#f-title')?.value, date: $('#f-date')?.value, area: $('#f-area')?.value }),
  'tg-todo': d => {
    const t = S.todos.find(x => x.id === d.id); if (!t) return;
    if ((t.repeat || 'none') === 'none') t.done = !t.done; else { t.doneOn = t.doneOn || {}; t.doneOn[d.d] ? delete t.doneOn[d.d] : (t.doneOn[d.d] = 1); }
    commit();
  },
  'del-item': d => { if (d.k === 'todo') S.todos = S.todos.filter(x => x.id !== d.id); else S.events = S.events.filter(x => x.id !== d.id); closeSheet(); commit(); toast('Gelöscht'); },
  close: () => closeSheet(),
  'pick-day': d => { ui.calSel = d.d; if (d.d.slice(0, 7) !== ui.calMonth) ui.calMonth = d.d.slice(0, 7); commit(); },
  'cal-mode': d => { ui.calMode = d.m; commit(); },
  'cal-prev': () => calMove(-1), 'cal-next': () => calMove(1),
  'cal-today': () => { ui.calSel = isoOf(); ui.calMonth = ui.calSel.slice(0, 7); commit(); },
  week: d => { ui.week = addDays(ui.week, 7 * +d.n); commit(); },
  'rot-pick': () => {
    const cur = rotOf(ui.week);
    openSheet(`<h2>Welche Rotation?</h2><p class="muted small" style="margin-bottom:12px">Für die Woche vom ${fmtShort(ui.week)}. Die anderen Wochen zählen von da aus weiter.</p><div class="stack-s">${[0, 1, 2, 3].map(i => `<button class="btn ${i === cur ? '' : 'ghost'} block" data-a="rot-set" data-i="${i}">Rotation ${i + 1}: ${esc(SEED.rotation[i].pots.map(p => p[0]).join(', '))}</button>`).join('')}</div>`);
  },
  'rot-set': d => { S.settings.rotShift = mod(S.settings.rotShift + (+d.i - rotOf(ui.week)), 4); closeSheet(); commit(); },
  'edit-meal': d => {
    const i = +d.i, s = +d.s, c = cell(ui.week, i, s);
    const pool = SEED.meals.filter(m => (s === 0) === (m[0] === 'Frühstück')).flatMap(m => m[1]).concat(S.myMeals);
    openSheet(`<h2>${DAYS[i]}, ${['Frühstück', 'Mittag', 'Abend'][s]}</h2><form class="form" data-a="save-meal" data-i="${i}" data-s="${s}"><label class="field"><span>Gericht</span><input class="in" id="m-t" value="${esc(c.text)}" autocomplete="off" enterkeyhint="done"></label>
      <div class="suggest">${pool.map(x => `<button type="button" class="chip" data-a="pick-meal" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <button class="btn block" type="submit">Speichern</button>${c.own ? `<button class="btn ghost block" type="button" data-a="reset-meal" data-i="${i}" data-s="${s}">Zurück zur Rotation</button>` : ''}</form>`);
  },
  'pick-meal': d => { $('#m-t').value = d.v; },
  'reset-meal': d => { const p = S.plan[ui.week]; if (p && p[d.i]) delete p[d.i][d.s]; closeSheet(); commit(); },
  'add-idea': () => { const v = $('#idea').value.trim(); if (!v) return; S.myMeals.push(v); commit(); },
  'del-idea': d => { S.myMeals.splice(+d.i, 1); commit(); },
  pantry: d => {
    const [gi, xi] = d.id.split('-').map(Number), name = SEED.pantry[gi][2][xi], cat = SEED.pantry[gi][1], src = 'p' + d.id;
    if (S.pantry[d.id] === d.v) delete S.pantry[d.id]; else S.pantry[d.id] = d.v;
    const now = S.pantry[d.id];
    S.shopping = S.shopping.filter(x => !(x.src === src && !x.done));
    if (now === 'fehlt' && !S.shopping.some(x => x.src === src)) S.shopping.push({ id: uid(), text: name, cat, done: false, src });
    commit();
  },
  prep: d => { toggleIn(S.prepLog, mondayOf(isoOf()), +d.i); commit(); },
  'shop-tg': d => { const x = S.shopping.find(i => i.id === d.id); x.done = !x.done; commit(); },
  'shop-del': d => { S.shopping = S.shopping.filter(i => i.id !== d.id); commit(); },
  'shop-clear': () => { S.shopping = S.shopping.filter(i => !i.done); commit(); },
  round: d => { toggleIn(S.cleanLog, isoOf(), d.id); commit(); },
  deepv: d => { ui.deepV = d.v; commit(); },
  deep: d => { toggleIn(S.deepLog, d.k, +d.i); commit(); },
  'deep-finish': d => { if (!S.deepDone.some(x => x.date === d.d && x.v === d.v)) S.deepDone.push({ date: d.d, v: d.v }); commit(); toast('Deep Clean eingetragen'); },
  mq: d => { toggleIn(d.l === 'month' ? S.monthLog : S.quarterLog, d.l === 'month' ? monthKey(isoOf()) : quarterKey(isoOf()), d.id); commit(); },
  bmonth: d => { const x = parse(ui.budgetMonth + '-15'); x.setMonth(x.getMonth() + +d.n); ui.budgetMonth = isoOf(x).slice(0, 7); commit(); },
  'buy-new': () => buySheet(),
  'buy-edit': d => buySheet(d.id),
  'del-buy': d => { S.purchases = S.purchases.filter(p => p.id !== d.id); closeSheet(); commit(); },
  'lead-new': () => leadSheet(),
  'lead-edit': d => leadSheet(d.id),
  'lead-next': d => { const l = S.leads.find(x => x.id === d.id); l.status = LEAD_ST[(LEAD_ST.indexOf(l.status) + 1) % LEAD_ST.length]; commit(); },
  'del-lead': d => { S.leads = S.leads.filter(x => x.id !== d.id); closeSheet(); commit(); },
  theme: d => { S.settings.theme = d.v; applyTheme(true); commit(); },
  export: async () => {
    try { const dl = window.claude && await window.claude.use('downloads'); if (dl) { await dl.save({ filename: 'maintaining-home-backup-' + isoOf() + '.json', data: JSON.stringify(S, null, 2) }); return; } } catch (e) { return; }
    exportBackup(S);
  },
  import: () => $('#file').click(),
  reset: () => {
    openSheet(`<h2>Wirklich alles löschen?</h2><p class="muted" style="margin-bottom:16px">Aufgaben, Termine, Pläne und Budget gehen verloren. Speichere vorher ein Backup, wenn du unsicher bist.</p><div class="stack-s"><button class="btn danger block" data-a="reset-yes">Ja, alles löschen</button><button class="btn ghost block" data-a="close">Abbrechen</button></div>`);
  },
  'reset-yes': () => { S = freshState(); closeSheet(); applyTheme(); commit(); toast('Zurückgesetzt'); }
};
function calMove(n) {
  if (ui.calMode === 'month') { const x = parse(ui.calMonth + '-15'); x.setMonth(x.getMonth() + n); ui.calMonth = isoOf(x).slice(0, 7); ui.calSel = ui.calMonth + '-01'; }
  else { ui.calSel = addDays(ui.calSel, 7 * n); ui.calMonth = ui.calSel.slice(0, 7); }
  commit();
}
function buySheet(id) {
  const p = id ? S.purchases.find(x => x.id === id) : null;
  openSheet(`<h2>${p ? 'Einkauf' : 'Einkauf eintragen'}</h2><form class="form" data-a="save-buy" data-id="${id || ''}">
    <label class="field"><span>Laden</span><input class="in" id="b-store" value="${esc(p ? p.store : '')}" autocomplete="off"></label>
    <div class="two"><label class="field"><span>Betrag (€)</span><input class="in" id="b-amt" inputmode="decimal" value="${p ? p.amount : ''}" required></label><label class="field"><span>Datum</span><input class="in" type="date" id="b-date" value="${p ? p.date : isoOf()}"></label></div>
    <label class="field"><span>Kategorie</span><select class="in" id="b-cat">${SEED.budgetCats.map(c => `<option ${p && p.cat === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
    <label class="field"><span>Wofür, Notiz</span><input class="in" id="b-note" value="${esc(p ? p.note : '')}" autocomplete="off"></label>
    <button class="btn block" type="submit">Speichern</button>${p ? `<button class="btn danger block" type="button" data-a="del-buy" data-id="${p.id}">Löschen</button>` : ''}</form>`);
}
function leadSheet(id) {
  const l = id ? S.leads.find(x => x.id === id) : null;
  openSheet(`<h2>${l ? 'Lead' : 'Neuer Lead'}</h2><form class="form" data-a="save-lead" data-id="${id || ''}">
    <label class="field"><span>Firma oder Name</span><input class="in" id="l-name" value="${esc(l ? l.name : '')}" required autocomplete="off"></label>
    <label class="field"><span>Status</span><select class="in" id="l-st">${LEAD_ST.map(s => `<option value="${s}" ${l && l.status === s ? 'selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></label>
    <label class="field"><span>Nächster Schritt</span><input class="in" id="l-note" value="${esc(l ? l.note : '')}" autocomplete="off"></label>
    <button class="btn block" type="submit">Speichern</button>${l ? `<button class="btn danger block" type="button" data-a="del-lead" data-id="${l.id}">Löschen</button>` : ''}</form>`);
}

/* Formulare */
const SUBMIT = {
  'save-item': (f, d) => {
    const title = $('#f-title').value.trim(); if (!title) return;
    const base = { title, area: $('#f-area').value, date: $('#f-date').value, repeat: $('#f-rep').value };
    if (d.k === 'event') {
      if (!base.date) base.date = ui.calSel || isoOf();
      base.time = $('#f-time').value;
      const e = S.events.find(x => x.id === d.id);
      e ? Object.assign(e, base) : S.events.push({ id: uid(), ...base });
    } else {
      const t = S.todos.find(x => x.id === d.id);
      t ? Object.assign(t, base) : S.todos.push({ id: uid(), ...base, done: false, doneOn: {} });
    }
    closeSheet(); commit(); toast('Gespeichert');
  },
  'save-meal': (f, d) => { const p = S.plan[ui.week] || (S.plan[ui.week] = {}); (p[d.i] || (p[d.i] = {}))[d.s] = $('#m-t').value.trim(); closeSheet(); commit(); },
  'shop-add': () => { const t = $('#shop-t').value.trim(); if (!t) return; S.shopping.push({ id: uid(), text: t, cat: $('#shop-c').value, done: false }); commit(); $('#shop-t')?.focus(); },
  'save-buy': (f, d) => {
    const v = { store: $('#b-store').value.trim(), amount: num($('#b-amt').value), date: $('#b-date').value || isoOf(), cat: $('#b-cat').value, note: $('#b-note').value.trim() };
    const p = S.purchases.find(x => x.id === d.id); p ? Object.assign(p, v) : S.purchases.push({ id: uid(), ...v });
    closeSheet(); commit();
  },
  'save-lead': (f, d) => {
    const v = { name: $('#l-name').value.trim(), status: $('#l-st').value, note: $('#l-note').value.trim() }; if (!v.name) return;
    const l = S.leads.find(x => x.id === d.id); l ? Object.assign(l, v) : S.leads.push({ id: uid(), ...v });
    closeSheet(); commit();
  }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.tagName === 'FORM') return;
  if (el.closest('form') && el.type === 'submit') return;
  const fn = A[el.dataset.a]; if (fn) fn(el.dataset, el, e);
});
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-a]'); if (!f) return;
  e.preventDefault(); const fn = SUBMIT[f.dataset.a]; if (fn) fn(f, f.dataset);
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.id === 'file') {
    const r = new FileReader();
    r.onload = () => { try { S = migrate(JSON.parse(r.result)); applyTheme(); commit(); toast('Backup geladen'); } catch (x) { toast('Datei passt nicht'); } };
    if (el.files[0]) r.readAsText(el.files[0]); return;
  }
  const c = el.dataset.c; if (!c) return;
  if (c === 'prio') { const wk = mondayOf(isoOf()); const p = S.priorities[wk] || (S.priorities[wk] = ['', '', '']); p[+el.dataset.i] = el.value.trim(); save(); }
  if (c === 'set') { S.settings[el.dataset.k] = el.value; if (el.dataset.k === 'start' && !el.value) S.settings.start = mondayIso(); save(); if (el.dataset.k === 'start') render(); }
  if (c === 'budget') {
    const b = budgetOf(ui.budgetMonth), p = el.dataset.p;
    if (p === 'budget' || p === 'goal' || p === 'save') b[p] = el.value; else if (p[0] === 'w') b.weeks[+p.slice(1)] = el.value; else b.planned[p] = el.value;
    save(); render();
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

function applyTheme(force) {
  const t = S.settings.theme;
  if (t === 'auto') { if (force) delete document.documentElement.dataset.theme; } else document.documentElement.dataset.theme = t;
}

(async function boot() {
  S = await loadState(); applyTheme(); render();
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* egal */ }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
