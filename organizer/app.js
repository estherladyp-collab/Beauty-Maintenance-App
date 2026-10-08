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

const IC = {"today": "<path d=\"M240,154H197.28a70.91,70.91,0,0,0,.72-10,70,70,0,0,0-140,0,70.91,70.91,0,0,0,.72,10H16a6,6,0,0,0,0,12H240a6,6,0,0,0,0-12ZM70,144a58,58,0,1,1,115.13,10H70.87A58.63,58.63,0,0,1,70,144Zm144,56a6,6,0,0,1-6,6H48a6,6,0,0,1,0-12H208A6,6,0,0,1,214,200ZM74.63,42.69a6,6,0,0,1,10.74-5.37l8,16a6,6,0,0,1-10.74,5.36Zm-56,50.63a6,6,0,0,1,8.05-2.69l16,8a6,6,0,0,1-5.36,10.74l-16-8A6,6,0,0,1,18.63,93.32Zm192,13.36a6,6,0,0,1,2.69-8.05l16-8a6,6,0,1,1,5.36,10.74l-16,8a6,6,0,0,1-8.05-2.69Zm-48-53.36,8-16a6,6,0,0,1,10.74,5.37l-8,16a6,6,0,1,1-10.74-5.36Z\"/>", "cal": "<path d=\"M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Z\"/>", "week": "<path d=\"M208,34H182V24a6,6,0,0,0-12,0V34H86V24a6,6,0,0,0-12,0V34H48A14,14,0,0,0,34,48V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V48A14,14,0,0,0,208,34ZM48,46H74V56a6,6,0,0,0,12,0V46h84V56a6,6,0,0,0,12,0V46h26a2,2,0,0,1,2,2V82H46V48A2,2,0,0,1,48,46ZM208,210H48a2,2,0,0,1-2-2V94H210V208A2,2,0,0,1,208,210Zm-70-78a10,10,0,1,1-10-10A10,10,0,0,1,138,132Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,132ZM94,172a10,10,0,1,1-10-10A10,10,0,0,1,94,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,138,172Zm44,0a10,10,0,1,1-10-10A10,10,0,0,1,182,172Z\"/>", "todo": "<path d=\"M222,128a6,6,0,0,1-6,6H128a6,6,0,0,1,0-12h88A6,6,0,0,1,222,128ZM128,70h88a6,6,0,0,0,0-12H128a6,6,0,0,0,0,12Zm88,116H128a6,6,0,0,0,0,12h88a6,6,0,0,0,0-12ZM83.76,43.76,56,71.51,44.24,59.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Zm0,64L56,135.51,44.24,123.76a6,6,0,1,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Zm0,64L56,199.51,44.24,187.76a6,6,0,0,0-8.48,8.48l16,16a6,6,0,0,0,8.48,0l32-32a6,6,0,0,0-8.48-8.48Z\"/>", "home": "<path d=\"M240,210H222V131.17l5.76,5.76a6,6,0,0,0,8.48-8.49L137.9,30.09a14,14,0,0,0-19.8,0L19.76,128.44a6,6,0,0,0,8.48,8.49L34,131.17V210H16a6,6,0,0,0,0,12H240a6,6,0,0,0,0-12ZM46,119.17l80.58-80.59a2,2,0,0,1,2.84,0L210,119.17V210H158V152a6,6,0,0,0-6-6H104a6,6,0,0,0-6,6v58H46ZM146,210H110V158h36Z\"/>", "more": "<path d=\"M40,86H74.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12H133.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12Zm64-24A18,18,0,1,1,86,80,18,18,0,0,1,104,62ZM216,170H197.4a30,30,0,0,0-58.8,0H40a6,6,0,0,0,0,12h98.6a30,30,0,0,0,58.8,0H216a6,6,0,0,0,0-12Zm-48,24a18,18,0,1,1,18-18A18,18,0,0,1,168,194Z\"/>", "dots": "<path d=\"M138,128a10,10,0,1,1-10-10A10,10,0,0,1,138,128ZM60,118a10,10,0,1,0,10,10A10,10,0,0,0,60,118Zm136,0a10,10,0,1,0,10,10A10,10,0,0,0,196,118Z\"/>", "plus": "<path d=\"M222,128a6,6,0,0,1-6,6H134v82a6,6,0,0,1-12,0V134H40a6,6,0,0,1,0-12h82V40a6,6,0,0,1,12,0v82h82A6,6,0,0,1,222,128Z\"/>", "left": "<path d=\"M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z\"/>", "right": "<path d=\"M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z\"/>", "down": "<path d=\"M212.24,100.24l-80,80a6,6,0,0,1-8.48,0l-80-80a6,6,0,0,1,8.48-8.48L128,167.51l75.76-75.75a6,6,0,0,1,8.48,8.48Z\"/>", "x": "<path d=\"M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z\"/>", "flag": "<path d=\"M237.07,52.8A6,6,0,0,0,232,50H40a6,6,0,0,0-4.24,10.24L79.51,104,35.76,147.76A6,6,0,0,0,40,158H176.78l-30.2,63.42a6,6,0,0,0,10.84,5.16l80-168A6,6,0,0,0,237.07,52.8ZM182.5,146h-128l37.75-37.76a6,6,0,0,0,0-8.48L54.49,62h168Z\"/>", "food": "<path d=\"M74,88V40a6,6,0,0,1,12,0V88a6,6,0,0,1-12,0ZM214,40V224a6,6,0,0,1-12,0V174H152a6,6,0,0,1-6-6c0-4.41.68-108.25,59.64-133.51A6,6,0,0,1,214,40ZM202,50c-36.79,24.29-42.82,91.48-43.81,112H202ZM117.92,39a6,6,0,1,0-11.84,2L114,88.48a34,34,0,0,1-68,0L53.92,41a6,6,0,0,0-11.84-2l-8,48A6.61,6.61,0,0,0,34,88a46.06,46.06,0,0,0,40,45.6V224a6,6,0,0,0,12,0V133.6A46.06,46.06,0,0,0,126,88a6.61,6.61,0,0,0-.08-1Z\"/>", "cart": "<path d=\"M236.78,68.37A6,6,0,0,0,232,66H55.67L45.78,30.39A6,6,0,0,0,40,26H16a6,6,0,0,0,0,12H35.44L71,165.89A22.08,22.08,0,0,0,92.16,182H191a22.08,22.08,0,0,0,21.2-16.11l25.63-92.28A6,6,0,0,0,236.78,68.37Zm-36.2,94.31A10,10,0,0,1,191,170H92.16a10,10,0,0,1-9.63-7.32L59,78H224.11ZM102,216a14,14,0,1,1-14-14A14,14,0,0,1,102,216Zm104,0a14,14,0,1,1-14-14A14,14,0,0,1,206,216Z\"/>", "sparkle": "<path d=\"M196.89,130.94,144.4,111.6,125.06,59.11a13.92,13.92,0,0,0-26.12,0L79.6,111.6,27.11,130.94a13.92,13.92,0,0,0,0,26.12L79.6,176.4l19.34,52.49a13.92,13.92,0,0,0,26.12,0L144.4,176.4l52.49-19.34a13.92,13.92,0,0,0,0-26.12Zm-4.15,14.86-55.08,20.3a6,6,0,0,0-3.56,3.56l-20.3,55.08a1.92,1.92,0,0,1-3.6,0L89.9,169.66a6,6,0,0,0-3.56-3.56L31.26,145.8a1.92,1.92,0,0,1,0-3.6l55.08-20.3a6,6,0,0,0,3.56-3.56l20.3-55.08a1.92,1.92,0,0,1,3.6,0l20.3,55.08a6,6,0,0,0,3.56,3.56l55.08,20.3a1.92,1.92,0,0,1,0,3.6ZM146,40a6,6,0,0,1,6-6h18V16a6,6,0,0,1,12,0V34h18a6,6,0,0,1,0,12H182V64a6,6,0,0,1-12,0V46H152A6,6,0,0,1,146,40ZM246,88a6,6,0,0,1-6,6H230v10a6,6,0,0,1-12,0V94H208a6,6,0,0,1,0-12h10V72a6,6,0,0,1,12,0V82h10A6,6,0,0,1,246,88Z\"/>", "wallet": "<path d=\"M216,66H56a10,10,0,0,1,0-20H192a6,6,0,0,0,0-12H56A22,22,0,0,0,34,56V184a22,22,0,0,0,22,22H216a14,14,0,0,0,14-14V80A14,14,0,0,0,216,66Zm2,126a2,2,0,0,1-2,2H56a10,10,0,0,1-10-10V75.59A21.84,21.84,0,0,0,56,78H216a2,2,0,0,1,2,2Zm-28-60a10,10,0,1,1-10-10A10,10,0,0,1,190,132Z\"/>", "vf": "<path d=\"M106,112a6,6,0,0,1,6-6h32a6,6,0,0,1,0,12H112A6,6,0,0,1,106,112ZM230,72V200a14,14,0,0,1-14,14H40a14,14,0,0,1-14-14V72A14,14,0,0,1,40,58H82V48a22,22,0,0,1,22-22h48a22,22,0,0,1,22,22V58h42A14,14,0,0,1,230,72ZM94,58h68V48a10,10,0,0,0-10-10H104A10,10,0,0,0,94,48ZM38,72v42.79A186,186,0,0,0,128,138a185.91,185.91,0,0,0,90-23.22V72a2,2,0,0,0-2-2H40A2,2,0,0,0,38,72ZM218,200V128.37A198.12,198.12,0,0,1,128,150a198.05,198.05,0,0,1-90-21.62V200a2,2,0,0,0,2,2H216A2,2,0,0,0,218,200Z\"/>", "church": "<path d=\"M227.09,146.86,190,124.6V104a6,6,0,0,0-3-5.21L134,68.52V46h18a6,6,0,0,0,0-12H134V16a6,6,0,0,0-12,0V34H104a6,6,0,0,0,0,12h18V68.52L69,98.79A6,6,0,0,0,66,104v20.6L28.91,146.86A6,6,0,0,0,26,152v64a6,6,0,0,0,6,6h80a6,6,0,0,0,6-6V168a10,10,0,0,1,20,0v48a6,6,0,0,0,6,6h80a6,6,0,0,0,6-6V152A6,6,0,0,0,227.09,146.86ZM38,155.4l28-16.8V210H38Zm90-9.4a22,22,0,0,0-22,22v42H78V107.48l50-28.57,50,28.57V210H150V168A22,22,0,0,0,128,146Zm90,64H190V138.6l28,16.8Z\"/>", "homei": "<path d=\"M217.9,110.1l-80-80a14,14,0,0,0-19.8,0l-80,80A13.92,13.92,0,0,0,34,120v96a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V158h36v58a6,6,0,0,0,6,6h64a6,6,0,0,0,6-6V120A13.92,13.92,0,0,0,217.9,110.1ZM210,210H158V152a6,6,0,0,0-6-6H104a6,6,0,0,0-6,6v58H46V120a2,2,0,0,1,.58-1.42l80-80a2,2,0,0,1,2.84,0l80,80A2,2,0,0,1,210,120Z\"/>", "trash": "<path d=\"M216,50H174V40a22,22,0,0,0-22-22H104A22,22,0,0,0,82,40V50H40a6,6,0,0,0,0,12H50V208a14,14,0,0,0,14,14H192a14,14,0,0,0,14-14V62h10a6,6,0,0,0,0-12ZM94,40a10,10,0,0,1,10-10h48a10,10,0,0,1,10,10V50H94ZM194,208a2,2,0,0,1-2,2H64a2,2,0,0,1-2-2V62H194ZM110,104v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Zm48,0v64a6,6,0,0,1-12,0V104a6,6,0,0,1,12,0Z\"/>"};
const icon = n => `<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${IC[n]}</svg>`;
const CHECK = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.8"/></svg>';

const ui = {
  tab: 'today', calMode: 'month', calMonth: isoOf().slice(0, 7), calSel: isoOf(),
  area: 'all', home: null, open: new Set(['d-vf', 'd-church', 'd-home']), mealDay: null, cleanTouched: false, essen: 'plan', shop: 'liste', clean: 'heute', deepV: null,
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
  const ae = document.activeElement; if (ae && ae !== document.body && ae.blur && $('#app').contains(ae)) ae.blur();
  const V = { today: vToday, cal: vCal, todos: vTodos, home: vHome, more: vMore }[ui.tab];
  const bg = $('#bg'); if (bg) bg.className = 't-' + ui.tab;
  $('#app').innerHTML = `<main class="${animateNext ? 'page' : ''}">${V()}</main>`;
  animateNext = false;
  const tabs = [['today', 'Start', 'today'], ['cal', 'Kalender', 'week'], ['todos', 'To-dos', 'todo'], ['home', 'Haushalt', 'home'], ['more', 'Mehr', 'more']];
  const fab = ['today', 'cal', 'todos'].includes(ui.tab) ? `<button class="fab" data-a="new" aria-label="Neu anlegen">${icon('plus')}</button>` : '';
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

/* ---------- Schnell notieren (Quick Add) ---------- */
const WDN = ['montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag', 'sonntag'];
const AREA_WORDS = [['vf', /^(vf|victory|work|arbeit)$/i], ['vomi', /^vomi$/i], ['gls', /^gls$/i], ['choir', /^(choir|chor)$/i], ['church', /^(church|kirche)$/i], ['home', /^(home|haus|zuhause)$/i]];
function parseQuick(raw) {
  let s = ' ' + raw.trim() + ' ', date = '', time = '', repeat = 'none', areaId = null;
  const today = isoOf();
  const take = (re, fn) => { const m = s.match(re); if (m) { fn(m); s = s.replace(re, ' '); } };
  take(/\s(übermorgen)\s/i, () => date = addDays(today, 2));
  take(/\s(morgen)\s/i, () => date = addDays(today, 1));
  take(/\s(heute)\s/i, () => date = today);
  take(/\s(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\s/i, m => { const i = WDN.indexOf(m[1].toLowerCase()); date = addDays(today, ((i - dowOf(today) + 7) % 7) || 7); });
  take(/\s(\d{1,2})\.(\d{1,2})\.(\d{4})?\s/, m => { const y = m[3] || today.slice(0, 4); let d = `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`; if (!m[3] && d < today) d = `${+y + 1}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`; if (!isNaN(parse(d))) date = d; });
  take(/\s(?:um\s)?(\d{1,2}):(\d{2})(?:\s?uhr)?\s/i, m => time = `${m[1].padStart(2, '0')}:${m[2]}`);
  if (!time) take(/\sum\s(\d{1,2})(?:\s?uhr)?\s/i, m => time = `${m[1].padStart(2, '0')}:00`);
  take(/\s(alle 2 wochen|zweiwöchentlich)\s/i, () => repeat = 'biweekly');
  take(/\s(wöchentlich|jede woche)\s/i, () => repeat = 'weekly');
  take(/\s(täglich|jeden tag)\s/i, () => repeat = 'daily');
  take(/\s(monatlich|jeden monat)\s/i, () => repeat = 'monthly');
  const words = s.trim().split(/\s+/).filter(w => w);
  const rest = words.filter(w => { const k = w.replace(/^#/, ''); const hit = AREA_WORDS.find(x => x[1].test(k)); if (hit && words.length > 1 && !areaId) { areaId = hit[0]; return false; } return true; });
  let title = rest.join(' '); title = title.charAt(0).toUpperCase() + title.slice(1);
  const kind = time ? 'event' : 'todo';
  if ((kind === 'event' || repeat !== 'none') && !date) date = today;
  return { title, date, time, repeat, area: areaId, kind };
}
const quickLabel = q => q.title ? `${q.kind === 'event' ? 'Termin' : 'Aufgabe'}${q.date ? ', ' + fmt(q.date, { weekday: 'short', day: 'numeric', month: 'short' }) : ''}${q.time ? ' ' + q.time : ''}${q.repeat !== 'none' ? ', ' + repLabel(q.repeat).toLowerCase() : ''}, ${areaName(area(q.area || defaultArea()))}` : '';
const defaultArea = () => (ui.area !== 'all' && ui.area !== 'church') ? ui.area : 'home';

function streak() {
  const ok = x => (S.cleanLog[x] || []).length >= 10; let d = isoOf(), n = 0;
  if (!ok(d)) d = addDays(d, -1);
  while (ok(d)) { n++; d = addDays(d, -1); }
  return n;
}

/* ---------- Heute ---------- */
function roundIds() { const ids = []; SEED.round.forEach((r, i) => r[2].forEach((_, j) => ids.push(`r${i}-${j}`))); return ids; }
function openFor(pred) {
  const t = isoOf();
  return S.todos.filter(x => pred(x.area)).map(x => ({ x, d: nextOcc(x, t) })).filter(o => !todoDone(o.x, o.d || t)).sort((p, q) => (p.d || '9').localeCompare(q.d || '9'));
}
function listCard(key, title, img, pred, areaId) {
  const t = isoOf(), sel = ui.calSel, items = openFor(pred), late = items.filter(o => o.d && o.d < t && (o.x.repeat || 'none') === 'none').length;
  const shown = items.slice(0, 6);
  const sub = !items.length ? 'Alles erledigt' : `${items.length} offen${late ? ', ' + late + ' überfällig' : ''}`;
  const form = `<form class="inline-add" data-a="inline-add" data-area="${areaId}"><input class="in" id="ia-${areaId}" type="text" placeholder="Neu für ${sel === t ? 'heute' : DAYS[dowOf(sel)]}" enterkeyhint="send" autocomplete="off" aria-label="Neue Aufgabe ${esc(title)}"><button class="btn" type="submit" aria-label="Hinzufügen">${icon('plus')}</button></form>`;
  const body = form + (shown.length ? shown.map(o => todoRow(o.x, o.d || t, { showDate: true })).join('') : '<p class="muted" style="margin-top:10px">Nichts offen.</p>') +
    (items.length ? `<div class="card-actions"><button class="btn ghost small" data-a="todos-for" data-area="${areaId}">${items.length > 6 ? `Alle ${items.length} ansehen` : 'In To-dos öffnen'}</button></div>` : '');
  return fold(key, title, '', body, { img, sub });
}
function vToday() {
  const t = isoOf(), h = new Date().getHours(), sel = ui.calSel, mon = mondayOf(sel), di = dowOf(sel);
  const greet = h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  const slot = (k, s) => { const c = cell(mon, di, s); return `<button class="slot p${c.pot < 0 ? 'x' : c.pot} ${c.text ? '' : 'empty-slot'}" data-a="edit-meal" data-wk="${mon}" data-i="${di}" data-s="${s}"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</button>`; };
  const strip = DS.map((n, i) => { const d = addDays(mon, i); return `<button class="dsb" data-a="pick-day" data-d="${d}" aria-pressed="${d === sel}" ${d === t ? 'aria-current="date"' : ''} aria-label="${fmtLong(d)}"><small>${n}</small><b>${+d.slice(8)}</b><span class="dots">${dotsFor(d)}</span></button>`; }).join('');
  const essen = `<div class="stack-s">${slot('Früh', 0)}${slot('Mittag', 1)}${slot('Abend', 2)}</div>`;
  const wkNow = mondayOf(t), sun = addDays(wkNow, 6);
  const pr = S.priorities[wkNow] || [], pd = (S.prioDone || {})[wkNow] || [];
  const prios = [0, 1, 2].filter(i => pr[i]).map(i => `<div class="prio-row ${pd[i] ? 'done' : ''}"><span class="pn">${i + 1}</span><span class="pt">${esc(pr[i])}</span>${chk(!!pd[i], `data-a="prio-tg" data-wk="${wkNow}" data-i="${i}" aria-label="${esc(pr[i])} erledigt"`)}</div>`).join('');
  const dl = S.todos.map(x => ({ x, d: nextOcc(x, t) })).filter(o => o.d && o.d <= sun && !todoDone(o.x, o.d)).sort((p, q) => p.d.localeCompare(q.d));
  const dlShown = dl.slice(0, 6);
  return `<div class="dash">
    <header class="top-row"><div><h1 class="title">${greet}, ${esc(S.settings.name)}</h1><p class="lead">${fmtLong(t)}</p></div><button class="themebtn" data-a="themes" aria-label="Farben wählen"><i></i></button></header>
    <section><div class="sec"><h2>Top 3 diese Woche</h2><button class="more" data-a="prio-edit" data-wk="${wkNow}">${prios ? 'Ändern' : 'Festlegen'}</button></div>
      <div class="card list">${prios || `<p class="muted">Was sind deine drei wichtigsten Dinge diese Woche?</p>`}</div></section>
    <section><div class="sec"><h2>Deadlines diese Woche</h2>${dl.length > 6 ? `<button class="more" data-a="goto-todos">Alle ${dl.length}</button>` : ''}</div>
      <div class="card list">${dlShown.length ? dlShown.map(o => todoRow(o.x, o.d, { showDate: true })).join('') : `<p class="muted">Keine Deadlines diese Woche.</p>`}</div></section>
    <div class="week-bar"><button class="icon-btn" data-a="wk-prev" aria-label="Vorherige Woche">${icon('left')}</button><span>${fmtShort(mon)} bis ${fmtShort(addDays(mon, 6))}</span><button class="icon-btn" data-a="wk-next" aria-label="Nächste Woche">${icon('right')}</button></div>
    <div class="daystrip" role="group" aria-label="Tag wählen">${strip}</div>
    <section><div class="sec"><h2>${sel === t ? 'Heute' : DAYS[di]}</h2>${sel !== t ? `<button class="more" data-a="cal-today">Zu heute</button>` : ''}</div><div class="card list">${dayAgenda(sel, true)}</div></section>
    ${fold('d-essen', 'Essen', '', essen, { img: 'essen', sub: esc(cell(mon, di, 1).text) || 'Nichts geplant' })}
    <h2 class="dash-h">Meine Listen</h2>
    ${listCard('d-vf', 'Victory Family', 'vf', a => a === 'vf', 'vf')}
    ${listCard('d-church', 'Church', 'church', a => a === 'church' || area(a).parent === 'church', 'church')}
    ${listCard('d-home', 'Home', 'homeroom', a => a === 'home', 'home')}
  </div>`;
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
  if (ui.calMode === 'agenda') {
    const late = S.todos.filter(x => (x.repeat || 'none') === 'none' && !x.done && x.date && x.date < t);
    const days = Array.from({ length: 21 }, (_, i) => addDays(t, i)).map(d => ({ d, i: itemsOn(d), deep: deepInfo(d) })).filter(o => o.i.ev.length || o.i.td.length || o.deep);
    head = '';
    body = (late.length ? `<section>${sec('Überfällig')}${late.map(x => todoRow(x, x.date, { showDate: true })).join('')}</section>` : '') +
      days.map(o => `<section style="margin-top:22px">${sec(o.d === t ? 'Heute' : o.d === addDays(t, 1) ? 'Morgen' : fmt(o.d, { weekday: 'long', day: 'numeric', month: 'long' }))}${dayAgenda(o.d)}</section>`).join('') +
      (!late.length && !days.length ? `<div class="empty"><b>Die nächsten 3 Wochen sind frei.</b>Tippe auf das Plus, um etwas einzutragen.</div>` : '');
  } else if (ui.calMode === 'month') {
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
    const mon = mondayOf(ui.calSel), sel = ui.calSel, di = dowOf(sel);
    const pr = (S.priorities[mon] || []).filter(x => x);
    const slot = (k, s) => { const c = cell(mon, di, s); return `<button class="slot p${c.pot < 0 ? 'x' : c.pot} ${c.text ? '' : 'empty-slot'}" data-a="edit-meal" data-wk="${mon}" data-i="${di}" data-s="${s}"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</button>`; };
    head = `<div class="cal-head"><button class="icon-btn" data-a="cal-prev" aria-label="Vorherige Woche">${icon('left')}</button><h2>${fmtShort(mon)} bis ${fmtShort(addDays(mon, 6))}</h2><button class="icon-btn" data-a="cal-next" aria-label="Nächste Woche">${icon('right')}</button></div>`;
    body = `<div class="daystrip" role="group" aria-label="Tag wählen">${DS.map((n, i) => { const d = addDays(mon, i); return `<button class="dsb" data-a="pick-day" data-d="${d}" aria-pressed="${d === sel}" ${d === t ? 'aria-current="date"' : ''} aria-label="${fmtLong(d)}"><small>${n}</small><b>${+d.slice(8)}</b><span class="dots">${dotsFor(d)}</span></button>`; }).join('')}</div>
      <section style="margin-top:22px"><div class="sec"><h2>${sel === t ? 'Heute' : DAYS[di]}</h2><button class="more" data-a="new" data-d="${sel}">Hinzufügen</button></div><div class="card list">${dayAgenda(sel, true)}</div></section>
      <section style="margin-top:22px"><div class="sec"><h2>Essen</h2></div><div class="stack-s">${slot('Früh', 0)}${slot('Mittag', 1)}${slot('Abend', 2)}</div></section>
      <div style="margin-top:22px">${fold('d-week', 'Prioritäten der Woche', pr.length ? '' : 'offen', pr.length ? `<ol class="prio-list">${pr.map(x => `<li>${esc(x)}</li>`).join('')}</ol><button class="btn ghost small" style="margin-top:12px" data-a="prio-edit" data-wk="${mon}">Ändern</button>` : `<p class="muted">Was sind deine 3 Prioritäten?</p><button class="btn small" style="margin-top:12px" data-a="prio-edit" data-wk="${mon}">Festlegen</button>`)}</div>`;
  }
  return `<div class="stack"><header style="display:flex;justify-content:space-between;align-items:end;gap:12px"><h1 class="title">Kalender</h1><button class="btn ghost small" data-a="cal-today">Heute</button></header>
    <div class="seg" role="group" aria-label="Ansicht"><button data-a="cal-mode" data-m="month" aria-pressed="${ui.calMode === 'month'}">Monat</button><button data-a="cal-mode" data-m="week" aria-pressed="${ui.calMode === 'week'}">Woche</button><button data-a="cal-mode" data-m="agenda" aria-pressed="${ui.calMode === 'agenda'}">Agenda</button></div>
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
  const group = (title, arr, showDate) => arr.length ? `<section><h3 class="group-title">${title}</h3><div class="card list">${arr.map(o => todoRow(o.x || o, o.d || t, { showDate })).join('')}</div></section>` : '';
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

/* ---------- Haushalt: Übersicht und Unterseiten ---------- */
const seg = (key, opts) => `<div class="seg" role="group">${opts.map(o => `<button data-a="seg" data-key="${key}" data-v="${o[0]}" aria-pressed="${ui[key] === o[0]}">${o[1]}</button>`).join('')}</div>`;
const IMGOF = { flag: 'week', today: 'today', food: 'essen', cart: 'shop', sparkle: 'clean', wallet: 'budget' };
function fold(k, title, meta, body, o = {}) {
  const open = ui.open.has(k);
  const img = o.img || IMGOF[o.icon];
  const card = o.sub !== undefined;
  const text = `<span class="ft"><b>${title}</b><span class="fs">${o.sub}</span></span>`;
  const head = !card ? `<span class="ft">${title}</span><span class="fm">${meta || ''}</span>` : img ? text : `<span class="ico">${icon(o.icon)}</span>${text}`;
  const cls = `fold ${card ? 'card' : ''} ${card && img ? 'hero' : ''} ${open ? 'open' : ''}`;
  return `<div class="${cls}"><button class="foldh ${card && img ? 'photo i-' + img : ''}" data-a="fold" data-k="${k}" aria-expanded="${open}">${head}<span class="chev">${icon('down')}</span></button><div class="foldw"><div class="foldb"><div class="foldi">${body}</div></div></div></div>`;
}
const slotLine = (k, c) => `<div class="slot p${c.pot < 0 ? 'x' : c.pot}" style="cursor:default"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</div>`;
const HUBT = { essen: 'Essen', shop: 'Einkauf', clean: 'Reinigung', budget: 'Budget' };
function vHome() {
  if (!ui.home) return vHub();
  const body = { essen: vEssen, shop: vShop, clean: vClean, budget: vBudget }[ui.home]();
  return `<div class="stack"><header><button class="back" data-a="hub-go" data-v="">${icon('left')}Haushalt</button><h1 class="title">${HUBT[ui.home]}</h1></header>${body}</div>`;
}
function vHub() {
  const t = isoOf(), wk = mondayOf(t), di = dowOf(t), lunch = cell(wk, di, 1).text;
  const open = S.shopping.filter(x => !x.done), miss = Object.values(S.pantry).filter(v => v === 'fehlt').length;
  const log = S.cleanLog[t] || [], all = roundIds().length, f = SEED.focus[di], deep = deepInfo(t);
  const mk = monthKey(t), b = S.budget[mk], bud = b ? num(b.budget) : 0, spent = S.purchases.filter(p => p.date.startsWith(mk)).reduce((a, p) => a + num(p.amount), 0);
  const go = (v, label) => `<button class="btn ghost block" style="margin-top:14px" data-a="hub-go" data-v="${v}">${label}</button>`;
  const essen = `<div class="stack-s">${slotLine('Früh', cell(wk, di, 0))}${slotLine('Mittag', cell(wk, di, 1))}${slotLine('Abend', cell(wk, di, 2))}</div>${go('essen', 'Kochplan öffnen')}`;
  const shop = `${open.length ? open.slice(0, 6).map(i => `<div class="row">${chk(false, `data-a="shop-tg" data-id="${i.id}" aria-label="${esc(i.text)}"`)}<span class="row-body"><span class="t">${esc(i.text)}</span></span></div>`).join('') + (open.length > 6 ? `<p class="small muted" style="margin-top:6px">und ${open.length - 6} weitere</p>` : '') : '<p class="muted">Die Liste ist leer.</p>'}${go('shop', 'Einkaufsliste öffnen')}`;
  const clean = `<p class="muted small">${deep ? esc(SEED.deep[deep].title) : esc(f[1])}</p><div class="bar" style="margin:12px 0"><i style="--p:${log.length / all}"></i></div><div class="pills">${SEED.round.map((r, i) => `<span class="pill">${r[0]} ${r[2].filter((_, j) => log.includes(`r${i}-${j}`)).length}/${r[2].length}</span>`).join('')}</div>${go('clean', 'Runde öffnen')}`;
  const budget = bud ? `<div class="bigfig"><span class="muted small">Übrig</span><div class="v ${bud - spent < 0 ? 'neg' : ''}">${eur(bud - spent)}</div><div class="bar"><i style="--p:${Math.min(1, spent / bud)}"></i></div><span class="small muted">${eur(spent)} von ${eur(bud)} ausgegeben</span></div>${go('budget', 'Budget öffnen')}` : `<p class="muted">Noch kein Budget. ${spent ? eur(spent) + ' ausgegeben.' : ''}</p>${go('budget', 'Budget öffnen')}`;
  return `<div class="dash"><header><h1 class="title">Haushalt</h1></header>
    ${fold('h-essen', 'Essen', '', essen, { icon: 'food', sub: lunch ? 'Heute Mittag: ' + esc(lunch) : 'Heute nichts geplant' })}
    ${fold('h-shop', 'Einkauf', '', shop, { icon: 'cart', sub: open.length ? `${open.length} auf der Liste${miss ? ', ' + miss + ' im Vorrat fehlen' : ''}` : 'Liste ist leer' })}
    ${fold('h-clean', 'Reinigung', '', clean, { icon: 'sparkle', sub: `${esc(deep ? 'Deep Clean' : f[0])}, Runde ${log.length} von ${all}` })}
    ${fold('h-budget', 'Budget', '', budget, { icon: 'wallet', sub: bud ? `${eur(bud - spent)} übrig im ${fmt(mk + '-01', { month: 'long' })}` : 'Noch kein Budget' })}
  </div>`;
}

function vEssen() {
  const t = isoOf(), sub = seg('essen', [['plan', 'Kochplan'], ['gerichte', 'Gerichte']]);
  if (ui.essen === 'gerichte') {
    const own = `${S.myMeals.map((m, i) => `<div class="plain-row"><span class="grow">${esc(m)}</span><button class="icon-btn" data-a="del-idea" data-i="${i}" aria-label="${esc(m)} löschen">${icon('x')}</button></div>`).join('')}<div style="display:flex;gap:8px;margin-top:8px"><input class="in" id="idea" placeholder="Neues Gericht" enterkeyhint="done" autocomplete="off"><button class="btn" data-a="add-idea">Dazu</button></div>`;
    return sub + `<div>${SEED.meals.map((m, i) => fold('m' + i, m[0], String(m[1].length), m[1].map(x => `<div class="plain-row" style="min-height:40px;padding:6px 0">${esc(x)}</div>`).join('') + (m[2] ? `<p class="serif-i" style="margin-top:8px">${m[2]}</p>` : ''))).join('')}${fold('own', 'Meine eigenen Ideen', String(S.myMeals.length), own)}</div>`;
  }
  const wk = ui.week, r = rotOf(wk), rot = SEED.rotation[r];
  const di = ui.mealDay != null ? ui.mealDay : (wk === mondayOf(t) ? dowOf(t) : 0);
  const row = (k, s) => { const c = cell(wk, di, s); return `<button class="slot p${c.pot < 0 ? 'x' : c.pot} ${c.text ? '' : 'empty-slot'}" data-a="edit-meal" data-i="${di}" data-s="${s}"><span class="k">${k}</span><span class="v">${esc(c.text) || 'Nichts geplant'}</span>${c.koch ? '<span class="kt">Kochtag</span>' : ''}</button>`; };
  return sub + `<div class="week-nav"><button class="icon-btn" data-a="week" data-n="-1" aria-label="Vorherige Woche">${icon('left')}</button><h2>Woche vom ${fmtShort(wk)}<small>Rotation ${r + 1} von 4 <button style="color:var(--gold-text);font-weight:600;padding:6px 4px" data-a="rot-pick">ändern</button></small></h2><button class="icon-btn" data-a="week" data-n="1" aria-label="Nächste Woche">${icon('right')}</button></div>
    <div class="daystrip" role="group" aria-label="Tag wählen">${DS.map((n, i) => `<button class="dsb" data-a="mealday" data-i="${i}" aria-pressed="${i === di}" ${addDays(wk, i) === t ? 'aria-current="date"' : ''} aria-label="${DAYS[i]}"><small>${n}</small><b>${+addDays(wk, i).slice(8)}</b></button>`).join('')}</div>
    <div class="stack-s"><h2 style="font-size:26px">${DAYS[di]}</h2>${row('Früh', 0)}${row('Mittag', 1)}${row('Abend', 2)}</div>
    <div class="potline">${rot.pots.map((p, i) => `<span class="potpill"><i style="--b:var(--pot${i});--l:var(--pot${i}-line)"></i>${esc(p[0])}</span>`).join('')}</div>
    <div>${fold('pots', 'Töpfe und Kochtage', '', `<div class="pots">${rot.pots.map((p, i) => `<div class="pot"><i style="--b:var(--pot${i});--l:var(--pot${i}-line)"></i><div><b>${esc(p[0])}</b><span>${p[1]}</span></div></div>`).join('')}</div>`)}</div>
    <button class="btn ghost block" data-a="plan-ingr">Zutaten für die Woche</button>`;
}

function guessCat(text) {
  const n = norm(text); if (n.length < 3) return 'Sonstiges';
  for (const g of SEED.pantry) for (const x of g[2]) { const m = norm(x); if (m && (n.includes(m) || m.includes(n))) return g[1]; }
  for (const [, list] of INGR) for (const [name, cat] of list) { const m = norm(name); if (m === n || (m.length > 3 && n.includes(m))) return cat; }
  return 'Sonstiges';
}
function vShop() {
  const sub = seg('shop', [['liste', 'Liste'], ['vorrat', 'Vorräte'], ['prep', 'Sonntag Prep']]);
  if (ui.shop === 'vorrat') {
    const miss = Object.values(S.pantry).filter(v => v === 'fehlt').length;
    return sub + `<p class="serif-i">Einmal im Monat durchgehen, donnerstags kurz prüfen. Fehlt etwas, kommt es auf die Einkaufsliste.</p>
      <div>${SEED.pantry.map((g, gi) => { const m = g[2].filter((_, xi) => S.pantry[`${gi}-${xi}`] === 'fehlt').length; return fold('p' + gi, g[0], m ? `${m} fehlt` : '', g[2].map((x, xi) => { const id = `${gi}-${xi}`, s = S.pantry[id]; return `<div class="pantry-row"><span class="grow">${esc(x)}</span><div class="mini-seg"><button class="da" data-a="pantry" data-id="${id}" data-v="da" aria-pressed="${s === 'da'}">Da</button><button class="fehlt" data-a="pantry" data-id="${id}" data-v="fehlt" aria-pressed="${s === 'fehlt'}">Fehlt</button></div></div>`; }).join('')); }).join('')}</div>`;
  }
  if (ui.shop === 'prep') {
    const wk = mondayOf(isoOf()), log = S.prepLog[wk] || [];
    return sub + `<p class="serif-i">Sonntag vorbereiten, unter der Woche entspannen.</p>
      <div>${SEED.prep.map((p, i) => `<div class="row ${log.includes(i) ? 'done' : ''}">${chk(log.includes(i), `data-a="prep" data-i="${i}" aria-label="${esc(p)}"`)}<span class="row-body"><span class="t">${esc(p)}</span></span></div>`).join('')}</div>`;
  }
  const items = S.shopping, doneN = items.filter(i => i.done).length;
  return sub + `<form class="qa" data-a="shop-add"><div class="qa-row"><input class="in" id="shop-t" placeholder="Was brauchst du?" enterkeyhint="done" autocomplete="off" aria-label="Neuer Artikel"><button class="btn" type="submit">Dazu</button></div></form>
    ${items.length ? '' : '<div class="empty"><b>Liste ist leer.</b>Schreib auf, was fehlt, oder hol die Zutaten aus dem Wochenplan.</div>'}
    ${SEED.shopCats.filter(c => items.some(i => i.cat === c)).map(c => `<div><h3 class="group-title">${c}</h3>${items.filter(i => i.cat === c).map(i => `<div class="row ${i.done ? 'done' : ''}">${chk(i.done, `data-a="shop-tg" data-id="${i.id}" aria-label="${esc(i.text)}"`)}<span class="row-body"><span class="t">${esc(i.text)}</span></span><button class="icon-btn" data-a="shop-del" data-id="${i.id}" aria-label="${esc(i.text)} entfernen">${icon('x')}</button></div>`).join('')}</div>`).join('')}
    <div class="stack-s"><button class="btn ghost block" data-a="plan-ingr">Zutaten aus dem Wochenplan holen</button>${doneN ? `<button class="btn ghost block" data-a="shop-clear">${doneN} erledigte entfernen</button>` : ''}</div>`;
}

function vClean() {
  const sub = seg('clean', [['heute', 'Heute'], ['deep', 'Deep Clean'], ['monat', 'Monatlich']]);
  const t = isoOf();
  if (ui.clean === 'deep') {
    const cy = deepCycle(t), v = ui.deepV || cy.v, d = SEED.deep[v], key = cy.sat + v, log = S.deepLog[key] || [];
    const total = d.tasks.reduce((a, x) => a + x[1], 0);
    return sub + `<div><h2 style="font-size:26px">${fmt(cy.sat, { weekday: 'long', day: 'numeric', month: 'long' })}</h2><p class="muted small">Alle 2 Wochen am Samstag, im Wechsel Woche A und B. Schaffst du nicht alles, macht der nächste Samstag weiter.</p></div>
      <div class="seg" role="group">${['A', 'B'].map(x => `<button data-a="deepv" data-v="${x}" aria-pressed="${v === x}">Woche ${x}${x === cy.v ? ' (diese)' : ''}</button>`).join('')}</div>
      <div><div style="display:flex;justify-content:space-between;align-items:baseline"><h3 class="group-title">${d.title}</h3><span class="serif-i">${total} Min</span></div>
        ${d.tasks.map((x, i) => `<div class="row ${log.includes(i) ? 'done' : ''}">${chk(log.includes(i), `data-a="deep" data-k="${key}" data-i="${i}" aria-label="${esc(x[0])}"`)}<span class="row-body"><span class="t">${esc(x[0])}</span></span><span class="small muted num" style="padding:12px 4px 0;white-space:nowrap">${x[1]} Min</span></div>`).join('')}</div>
      <button class="btn block" data-a="deep-finish" data-v="${v}" data-d="${cy.sat}">Deep Clean abgeschlossen</button>
      <div>${fold('bonus', 'Bonus, wenn Zeit übrig ist', '', SEED.deep.bonus.map(b => `<div class="plain-row" style="min-height:40px">${b}</div>`).join(''))}${fold('tracker', 'Mein Deep Clean Tracker', String(S.deepDone.length || ''), S.deepDone.length ? S.deepDone.slice(-8).reverse().map(x => `<div class="plain-row"><span class="grow">${fmt(x.date, { day: 'numeric', month: 'long', year: 'numeric' })}</span><span class="status">Woche ${x.v}</span></div>`).join('') : '<p class="muted small">Noch kein Deep Clean eingetragen.</p>')}</div>`;
  }
  if (ui.clean === 'monat') {
    const mk = monthKey(t), qk = quarterKey(t), ml = S.monthLog[mk] || [], ql = S.quarterLog[qk] || [];
    return sub + `<p class="serif-i">Zusätzlich zum Deep Clean, wenn es passt. Setzt sich jeden Monat zurück.</p>
      <div>${SEED.monthly.map((g, gi) => { const n = g[1].filter((_, xi) => ml.includes(`${gi}-${xi}`)).length; return fold('mo' + gi, g[0], `${n} von ${g[1].length}`, g[1].map((x, xi) => { const id = `${gi}-${xi}`; return `<div class="row ${ml.includes(id) ? 'done' : ''}">${chk(ml.includes(id), `data-a="mq" data-l="month" data-id="${id}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`; }).join('')); }).join('')}
      ${fold('qq', 'Quartal', `${ql.length} von ${SEED.quarterly.length}`, SEED.quarterly.map((x, i) => `<div class="row ${ql.includes(String(i)) ? 'done' : ''}">${chk(ql.includes(String(i)), `data-a="mq" data-l="quarter" data-id="${i}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`).join(''))}</div>`;
  }
  const log = S.cleanLog[t] || [], deep = deepInfo(t), f = SEED.focus[dowOf(t)];
  const all = roundIds().length, st = streak();
  const doneIn = i => SEED.round[i][2].filter((_, j) => log.includes(`r${i}-${j}`)).length;
  if (!ui.cleanTouched) { const first = SEED.round.findIndex((r, i) => doneIn(i) < r[2].length); if (first >= 0) ui.open.add('c' + first); ui.cleanTouched = true; }
  return sub + `<div><h2 style="font-size:26px">${deep ? `Deep Clean, Woche ${deep}` : esc(f[0])}</h2><p class="muted small">${deep ? esc(SEED.deep[deep].title) : esc(f[1]) + '. 15 Min extra.'}</p></div>
    <div><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span class="small muted">Tägliche Runde</span><span class="small num">${log.length} von ${all}${st >= 2 ? `, ${st} Tage in Folge` : ''}</span></div><div class="bar"><i style="--p:${log.length / all}"></i></div></div>
    <div>${SEED.round.map((r, i) => fold('c' + i, r[0], `${doneIn(i)} von ${r[2].length}, ${r[1]} Min`, r[2].map((x, j) => { const id = `r${i}-${j}`, on = log.includes(id); return `<div class="row ${on ? 'done' : ''}">${chk(on, `data-a="round" data-id="${id}" aria-label="${esc(x)}"`)}<span class="row-body"><span class="t">${esc(x)}</span></span></div>`; }).join(''))).join('')}
    ${fold('tips', 'Tipp und Notfallplan', '', `<p class="note">${SEED.roundTip}</p><p class="note" style="margin-top:10px">${SEED.roundPanic}</p>`)}
    ${fold('wfocus', 'Schwerpunkt der Woche', '', SEED.focus.map((x, i) => `<div class="plain-row" style="align-items:flex-start"><b style="width:30px;color:var(--gold-text);flex:none">${DS[i]}</b><span class="grow"><b style="font-weight:600">${x[0]}</b><span class="small muted" style="display:block">${x[1]}</span></span></div>`).join(''))}</div>`;
}

function budgetOf(mk) { return S.budget[mk] || (S.budget[mk] = { budget: '', goal: '', weeks: ['', '', '', '', ''], planned: {}, save: '' }); }
const wom = d => Math.min(5, Math.ceil(+d.slice(8) / 7));
function vBudget() {
  const mk = ui.budgetMonth, b = budgetOf(mk), first = mk + '-01';
  const pu = S.purchases.filter(p => p.date.startsWith(mk)).sort((x, y) => y.date.localeCompare(x.date));
  const spent = pu.reduce((a, p) => a + num(p.amount), 0), bud = num(b.budget), left = bud - spent;
  const wspent = [1, 2, 3, 4, 5].map(w => pu.filter(p => wom(p.date) === w).reduce((a, p) => a + num(p.amount), 0));
  const cspent = c => pu.filter(p => p.cat === c).reduce((a, p) => a + num(p.amount), 0);
  const inp = (path, v, ph = '0,00') => `<input inputmode="decimal" data-c="budget" data-p="${path}" value="${esc(v)}" placeholder="${ph}" aria-label="${path}">`;
  return `<div class="week-nav"><button class="icon-btn" data-a="bmonth" data-n="-1" aria-label="Vorheriger Monat">${icon('left')}</button><h2>${fmt(first, { month: 'long', year: 'numeric' })}</h2><button class="icon-btn" data-a="bmonth" data-n="1" aria-label="Nächster Monat">${icon('right')}</button></div>
    ${bud ? `<div class="bigfig"><span class="muted small">Übrig</span><div class="v ${left < 0 ? 'neg' : ''}">${eur(left)}</div><div class="bar"><i style="--p:${Math.min(1, spent / bud)}"></i></div><span class="small muted">${eur(spent)} von ${eur(bud)} ausgegeben</span></div>` : `<div class="bigfig"><span class="muted small">Ausgegeben</span><div class="v">${eur(spent)}</div><span class="small muted">Setz unten ein Monatsbudget, dann siehst du, was übrig bleibt.</span></div>`}
    <section>${sec('Einkäufe', `<button class="more" data-a="buy-new">Eintragen</button>`)}
      ${pu.length ? pu.map(p => `<div class="plain-row"><span class="small muted num" style="width:48px;flex:none">${fmtShort(p.date)}</span><button class="grow" data-a="buy-edit" data-id="${p.id}"><b style="font-weight:600">${esc(p.store || 'Einkauf')}</b><span class="small muted" style="display:block">${esc(p.cat)}${p.note ? ', ' + esc(p.note) : ''}</span></button><span class="num">${eur(p.amount)}</span></div>`).join('') : '<p class="muted">Noch kein Bon. 2 Minuten am Abend, jeden Bon eintragen.</p>'}</section>
    <div>${fold('bset', 'Budget und Sparziel', bud ? eur(bud) : '', `<div class="two"><label class="field"><span>Monatsbudget (€)</span><div class="stat" style="padding:0;background:none">${inp('budget', b.budget)}</div></label><label class="field"><span>Sparziel (€)</span><div class="stat" style="padding:0;background:none">${inp('goal', b.goal)}</div></label></div>`)}
    ${fold('bweek', 'Pro Woche', '', `<table class="tbl"><thead><tr><th>Woche</th><th class="r">Budget</th><th class="r">Ausgegeben</th><th class="r">Differenz</th></tr></thead><tbody>${[0, 1, 2, 3, 4].map(i => `<tr><td>Woche ${i + 1}</td><td>${inp('w' + i, b.weeks[i])}</td><td class="r">${eur(wspent[i])}</td><td class="r ${num(b.weeks[i]) - wspent[i] < 0 ? 'late' : ''}">${b.weeks[i] === '' ? 'n/a' : eur(num(b.weeks[i]) - wspent[i])}</td></tr>`).join('')}</tbody></table>`)}
    ${fold('bcat', 'Wohin geht das Geld', '', `<table class="tbl"><thead><tr><th>Kategorie</th><th class="r">Geplant</th><th class="r">Tatsächlich</th></tr></thead><tbody>${SEED.budgetCats.map((c, i) => `<tr><td>${c}</td><td>${inp('c' + i, b.planned['c' + i] ?? '')}</td><td class="r">${eur(cspent(c))}</td></tr>`).join('')}</tbody></table>`)}
    ${fold('bsave', 'Was spare ich nächsten Monat?', '', `<p class="serif-i" style="margin-bottom:8px">Ideen: Angebote nutzen, Eigenmarken, Großpackung Reis, Reste Tag, Wochenmarkt, Lieferdienst streichen.</p><textarea class="in" rows="3" data-c="budget" data-p="save" aria-label="Was spare ich nächsten Monat">${esc(b.save)}</textarea>`)}</div>`;
}

/* ---------- Mehr ---------- */
function vMore() {
  const st = S.settings;
  return `<div class="stack"><header><h1 class="title">Mehr</h1></header>
    <section>${sec('Du')}<div class="form"><label class="field"><span>Name</span><input class="in" data-c="set" data-k="name" value="${esc(st.name)}" autocomplete="off"></label>
      <label class="field"><span>Startdatum des Planers</span><input class="in" type="date" data-c="set" data-k="start" value="${st.start}"></label>
      <p class="small muted">Vom Startdatum aus zählen Kochrotation und Deep Clean A und B.</p></div></section>
    <section>${sec('Farben')}${themeOptions()}</section>
    <section>${sec('Startbildschirm')}<div class="toggle-row"><span>Beim Öffnen zeigen</span><button class="chip" data-a="cover-tg" aria-pressed="${st.cover !== false}">${st.cover !== false ? 'An' : 'Aus'}</button></div><button class="btn ghost block" style="margin-top:10px" data-a="cover-show">Jetzt ansehen</button></section>
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

const themeSheet = () => `<h2>Farben</h2>${themeOptions()}<button class="btn block" style="margin-top:20px" data-a="close">Fertig</button>`;

/* ---------- Zutaten aus dem Wochenplan ---------- */
function ingredientsFor(text) {
  const out = new Map(); const t = text.toLowerCase();
  INGR.forEach(([re, list]) => { if (new RegExp(re, 'i').test(t)) list.forEach(([n, c]) => out.set(n, c)); });
  return out;
}
function weekIngredients(wk) {
  const all = new Map();
  for (let i = 0; i < 7; i++) for (let s = 0; s < 3; s++) { const c = cell(wk, i, s); if (c.text) ingredientsFor(c.text).forEach((cat, n) => all.set(n, cat)); }
  return all;
}
const norm = s => s.toLowerCase().replace(/\(.*?\)/g, '').trim();
let ingrSel = new Set(), ingrList = [];
function ingrSheet() {
  const wk = ui.week, all = weekIngredients(wk);
  const onList = new Set(S.shopping.filter(x => !x.done).map(x => norm(x.text)));
  const daNames = SEED.pantry.flatMap((g, gi) => g[2].map((x, xi) => [norm(x), S.pantry[`${gi}-${xi}`]])).filter(p => p[1] === 'da').map(p => p[0]);
  ingrList = []; ingrSel = new Set();
  const groups = SEED.shopCats.map(cat => ({ cat, items: [...all].filter(([n, c]) => c === cat && !onList.has(norm(n))).map(([n]) => n) })).filter(g => g.items.length);
  groups.forEach(g => g.items.forEach(n => { const da = daNames.some(d => d && (norm(n).includes(d) || d.includes(norm(n)))); ingrList.push({ n, cat: g.cat, da }); if (!da) ingrSel.add(n); }));
  const skipped = [...all].filter(([n]) => onList.has(norm(n))).length;
  const body = groups.length ? groups.map(g => `<div class="card" style="margin-bottom:10px"><h3 class="group-title">${g.cat}</h3>${g.items.map(n => { const it = ingrList.find(x => x.n === n); return `<div class="row">${chk(!it.da, `data-a="ingr-tg" data-n="${esc(n)}" aria-label="${esc(n)}"`)}<span class="row-body"><span class="t">${esc(n)}</span>${it.da ? '<span class="m">Vorrat ist da</span>' : ''}</span></div>`; }).join('')}</div>`).join('') : `<div class="empty"><b>Nichts Neues.</b>Alles aus diesem Plan steht schon auf deiner Liste.</div>`;
  return `<h2>Zutaten für die Woche</h2><p class="muted small" style="margin-bottom:14px">Aus deinem Kochplan, Woche vom ${fmtShort(wk)} Nimm raus, was du schon hast.${skipped ? ` ${skipped} stehen schon auf der Liste.` : ''}</p>${body}${groups.length ? `<button class="btn block" style="margin-top:6px" id="ingr-go" data-a="ingr-add">${ingrSel.size} auf die Einkaufsliste</button>` : `<button class="btn ghost block" data-a="close">Zu</button>`}`;
}

/* ---------- Aktionen ---------- */
const toastEl = () => $('#toast');
let toastT;
function toast(m) { const e = toastEl(); e.textContent = m; e.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('on'), 2200); }
function toggleIn(map, key, id) { const a = map[key] || (map[key] = []); const i = a.indexOf(id); i >= 0 ? a.splice(i, 1) : a.push(id); }

const A = {
  tab: d => { if (d.t === 'home' && ui.tab === 'home') ui.home = null; ui.tab = d.t; animateNext = true; commit(); window.scrollTo(0, 0); },
  goto: d => { ui.tab = d.t; if (d.sub) ui.home = d.sub; animateNext = true; commit(); window.scrollTo(0, 0); },
  seg: d => { ui[d.key] = d.v; commit(); },
  'new-in': d => itemSheet({ kind: 'todo', area: d.area === 'church' ? 'church' : d.area }),
  'todos-for': d => { ui.area = d.area; ui.tab = 'todos'; animateNext = true; commit(); window.scrollTo(0, 0); },
  'wk-prev': () => { ui.calSel = addDays(ui.calSel, -7); ui.calMonth = ui.calSel.slice(0, 7); commit(); },
  'wk-next': () => { ui.calSel = addDays(ui.calSel, 7); ui.calMonth = ui.calSel.slice(0, 7); commit(); },
  'prio-tg': d => { S.prioDone = S.prioDone || {}; const arr = S.prioDone[d.wk] || (S.prioDone[d.wk] = [false, false, false]); arr[+d.i] = !arr[+d.i]; commit(); },
  'goto-todos': () => { ui.area = 'all'; ui.tab = 'todos'; animateNext = true; commit(); window.scrollTo(0, 0); },
  'hub-go': d => { ui.home = d.v || null; commit(); window.scrollTo(0, 0); },
  fold: (d, el) => { const f = el.closest('.fold'), on = !ui.open.has(d.k); on ? ui.open.add(d.k) : ui.open.delete(d.k); f.classList.toggle('open', on); el.setAttribute('aria-expanded', on); },
  mealday: d => { ui.mealDay = +d.i; commit(); },
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
  week: d => { ui.week = addDays(ui.week, 7 * +d.n); ui.mealDay = null; commit(); },
  'prio-edit': d => { const wk = d.wk || mondayOf(isoOf()); const p = S.priorities[wk] || ['', '', '']; openSheet(`<h2>Diese Woche</h2><form class="form" data-a="prio-save" data-wk="${wk}">${[0, 1, 2].map(i => `<label class="field"><span>Priorität ${i + 1}</span><input class="in" id="pr${i}" value="${esc(p[i] || '')}" autocomplete="off" placeholder="${['Das Wichtigste', 'Danach', 'Und noch eins'][i]}"></label>`).join('')}<button class="btn block" type="submit">Speichern</button></form>`); },
  'plan-ingr': () => openSheet(ingrSheet()),
  'ingr-tg': (d, el) => { const on = el.getAttribute('aria-checked') !== 'true'; el.setAttribute('aria-checked', on ? 'true' : 'false'); on ? ingrSel.add(d.n) : ingrSel.delete(d.n); const b = $('#ingr-go'); if (b) { b.textContent = `${ingrSel.size} auf die Einkaufsliste`; b.disabled = !ingrSel.size; } },
  'ingr-add': () => { ingrList.filter(x => ingrSel.has(x.n)).forEach(x => S.shopping.push({ id: uid(), text: x.n, cat: x.cat, done: false, src: 'plan' })); const n = ingrSel.size; closeSheet(); commit(); toast(`${n} Zutaten auf der Liste`); },
  'rot-pick': () => {
    const cur = rotOf(ui.week);
    openSheet(`<h2>Welche Rotation?</h2><p class="muted small" style="margin-bottom:12px">Für die Woche vom ${fmtShort(ui.week)}. Die anderen Wochen zählen von da aus weiter.</p><div class="stack-s">${[0, 1, 2, 3].map(i => `<button class="btn ${i === cur ? '' : 'ghost'} block" data-a="rot-set" data-i="${i}">Rotation ${i + 1}: ${esc(SEED.rotation[i].pots.map(p => p[0]).join(', '))}</button>`).join('')}</div>`);
  },
  'rot-set': d => { S.settings.rotShift = mod(S.settings.rotShift + (+d.i - rotOf(ui.week)), 4); closeSheet(); commit(); },
  'edit-meal': d => {
    const wk = d.wk || ui.week, i = +d.i, s = +d.s, c = cell(wk, i, s);
    const pool = SEED.meals.filter(m => (s === 0) === (m[0] === 'Frühstück')).flatMap(m => m[1]).concat(S.myMeals);
    openSheet(`<h2>${DAYS[i]}, ${['Frühstück', 'Mittag', 'Abend'][s]}</h2><form class="form" data-a="save-meal" data-wk="${wk}" data-i="${i}" data-s="${s}"><label class="field"><span>Gericht</span><input class="in" id="m-t" value="${esc(c.text)}" autocomplete="off" enterkeyhint="done"></label>
      <div class="suggest">${pool.map(x => `<button type="button" class="chip" data-a="pick-meal" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div>
      <button class="btn block" type="submit">Speichern</button>${c.own ? `<button class="btn ghost block" type="button" data-a="reset-meal" data-wk="${wk}" data-i="${i}" data-s="${s}">Zurück zur Rotation</button>` : ''}</form>`);
  },
  'pick-meal': d => { $('#m-t').value = d.v; },
  'reset-meal': d => { const p = S.plan[d.wk || ui.week]; if (p && p[d.i]) delete p[d.i][d.s]; closeSheet(); commit(); },
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
  settheme: d => { const p = THEMES.find(x => x[0] === d.v); S.settings.theme = { id: p[0], bg: p[2], accent: p[3] }; applyTheme(); commit(); if ($('#sheets .sheet')) openSheet(themeSheet()); },
  themes: () => openSheet(themeSheet()),
  'cover-go': () => hideCover(),
  'cover-show': () => showCover(),
  'cover-tg': () => { S.settings.cover = S.settings.cover === false; commit(); },
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
  'inline-add': (f, d) => {
    const inp = $('#ia-' + d.area); const q = parseQuick(inp.value); if (!q.title) return;
    const base = { title: q.title, area: q.area || d.area, date: q.date || ui.calSel, repeat: q.repeat };
    if (q.kind === 'event') S.events.push({ id: uid(), ...base, time: q.time }); else S.todos.push({ id: uid(), ...base, done: false, doneOn: {} });
    commit(); toast(q.kind === 'event' ? 'Termin angelegt' : 'Aufgabe angelegt');
    const n = $('#ia-' + d.area); if (n) n.focus();
  },
  'prio-save': (f, d) => { S.priorities[d.wk || mondayOf(isoOf())] = [0, 1, 2].map(i => $('#pr' + i).value.trim()); closeSheet(); commit(); },
  qa: () => {
    const q = parseQuick($('#qa').value); if (!q.title) return;
    const base = { title: q.title, area: q.area || defaultArea(), date: q.date, repeat: q.repeat };
    if (q.kind === 'event') S.events.push({ id: uid(), ...base, time: q.time }); else S.todos.push({ id: uid(), ...base, done: false, doneOn: {} });
    commit(); toast(`${q.kind === 'event' ? 'Termin' : 'Aufgabe'} angelegt`);
  },
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
  'save-meal': (f, d) => { const wk = d.wk || ui.week; const p = S.plan[wk] || (S.plan[wk] = {}); (p[d.i] || (p[d.i] = {}))[d.s] = $('#m-t').value.trim(); closeSheet(); commit(); },
  'shop-add': () => { const t = $('#shop-t').value.trim(); if (!t) return; S.shopping.push({ id: uid(), text: t, cat: guessCat(t), done: false }); commit(); $('#shop-t')?.focus(); },
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
  if (c === 'themecolor') { const t = themeNow(); S.settings.theme = { ...t, id: 'custom', [el.dataset.k]: el.value }; applyTheme(); save(); render(); return; }
  if (c === 'prio') { const wk = mondayOf(isoOf()); const p = S.priorities[wk] || (S.priorities[wk] = ['', '', '']); p[+el.dataset.i] = el.value.trim(); save(); }
  if (c === 'set') { S.settings[el.dataset.k] = el.value; if (el.dataset.k === 'start' && !el.value) S.settings.start = mondayIso(); save(); if (el.dataset.k === 'start') render(); }
  if (c === 'budget') {
    const b = budgetOf(ui.budgetMonth), p = el.dataset.p;
    if (p === 'budget' || p === 'goal' || p === 'save') b[p] = el.value; else if (p[0] === 'w') b.weeks[+p.slice(1)] = el.value; else b.planned[p] = el.value;
    save(); render();
  }
});
document.addEventListener('input', e => { if (e.target.id === 'qa') { const p = $('#qa-prev'); if (p) p.textContent = quickLabel(parseQuick(e.target.value)); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

/* Farben: gleiche sechs Themes wie bei Maintaining You, dazu eigene Farben */
const THEMES = [['coffee', 'Coffee & gold', '#2a1b16', '#b48a4c'], ['cream', 'Cream', '#f1e6de', '#b48a4c'], ['rose', 'Rosé', '#f3dfdb', '#b4675c'], ['sage', 'Sage', '#1f2a24', '#c8a96a'], ['midnight', 'Midnight', '#1b2233', '#c9a45c'], ['plum', 'Plum', '#2e1a2a', '#d8a28f'], ['noir', 'Noir & Champagne', '#121110', '#e6d3a8']];
const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixc = (a, b, t) => '#' + hx(a).map((v, i) => Math.round(v + (hx(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
const lum = h => { const [r, g, b] = hx(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const HEX = /^#[0-9a-f]{6}$/i;
function themeNow() {
  const t = S.settings.theme; const o = (t && typeof t === 'object') ? t : {};
  const p = THEMES.find(x => x[0] === o.id) || THEMES[0];
  return { id: o.id === 'custom' ? 'custom' : p[0], bg: HEX.test(o.bg) ? o.bg : p[2], accent: HEX.test(o.accent) ? o.accent : p[3] };
}
function applyTheme() {
  const t = themeNow(), bg = t.bg, ac = t.accent, [r, g, b] = hx(bg);
  const dark = (.299 * r + .587 * g + .114 * b) < 120, ink = dark ? '#f3e8df' : '#241713';
  const R = document.documentElement.style, set = (k, v) => R.setProperty(k, v), rgb = h => hx(h).join(',');
  set('--bg', bg); set('--ink', ink); set('--gold', ac);
  set('--gold-text', dark ? ac : mixc(ac, ink, .42));
  set('--gold-ink', contrast(ac, '#241713') >= contrast(ac, '#ffffff') ? '#241713' : '#ffffff');
  set('--gold-soft', `rgba(${rgb(ac)},.16)`);
  set('--card', dark ? mixc(bg, '#ffffff', .06) : mixc(bg, '#ffffff', .5));
  set('--card-2', dark ? mixc(bg, '#ffffff', .11) : mixc(bg, '#7a5240', .1));
  set('--line', `rgba(${rgb(ink)},.16)`); set('--muted', `rgba(${rgb(ink)},.64)`);
  set('--nav-bg', `rgba(${rgb(bg)},.93)`);
  set('--danger', dark ? '#e08a7a' : '#a34a3d');
  set('--shadow', dark ? '0 8px 24px rgba(0,0,0,.35)' : '0 1px 2px rgba(60,40,20,.06), 0 8px 24px rgba(60,40,20,.08)');
  if (dark) { set('--pot0', 'rgba(154,168,138,.22)'); set('--pot1', 'rgba(196,161,95,.22)'); set('--pot2', 'rgba(196,154,143,.22)'); set('--pot0-line', '#8a9a7b'); set('--pot1-line', '#b8955a'); set('--pot2-line', '#b08b80'); }
  else { set('--pot0', '#e3e8d8'); set('--pot1', '#f0e2c8'); set('--pot2', '#f0dfd9'); set('--pot0-line', '#9aa88a'); set('--pot1-line', '#c4a15f'); set('--pot2-line', '#c49a8f'); }
  R.colorScheme = dark ? 'dark' : 'light';
  let m = document.querySelector('meta[name=theme-color]');
  if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.appendChild(m); }
  m.content = bg;
}
const themeOptions = () => { const t = themeNow(); return `<div class="themes">${THEMES.map(p => `<button class="themeopt" data-a="settheme" data-v="${p[0]}" aria-pressed="${t.id === p[0]}" aria-label="${esc(p[1])}"><span class="swatch" style="background:${p[2]}"><i style="background:${p[3]}"></i></span><small>${esc(p[1])}</small></button>`).join('')}</div>
  <div class="two" style="margin-top:16px"><label class="colorpick">Hintergrund<input type="color" data-c="themecolor" data-k="bg" value="${t.bg}"></label><label class="colorpick">Akzent<input type="color" data-c="themecolor" data-k="accent" value="${t.accent}"></label></div>`; };

/* Startbildschirm */
const SAYINGS = ['Rich people stay organized.', 'A calm home is a rich home.', 'Plan it. Cook it. Clean it. Done.', 'Your home runs on your habits.', 'Maintain your home. Maintain your peace.'];
let coverT;
function showCover() {
  if ($('.cover')) return;
  const h = new Date().getHours(), greet = h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';
  document.body.insertAdjacentHTML('beforeend', `<div class="cover" role="dialog" aria-label="Maintaining Home"><div class="cover-mid"><h1><span class="w1">Maintaining</span><em class="w2">Home</em></h1><div class="rule" aria-hidden="true"><i></i></div><div class="sayings" aria-live="off">${SAYINGS.map((s, i) => `<span class="${i === 0 ? 'on' : ''}">${s}</span>`).join('')}</div></div><div><p class="hello">${greet}, ${esc(S.settings.name)}</p><button class="btn block" data-a="cover-go">Los geht's</button></div></div>`);
  let i = 0; clearInterval(coverT);
  coverT = setInterval(() => { const sp = document.querySelectorAll('.sayings span'); if (!sp.length) return clearInterval(coverT); sp[i].classList.remove('on'); i = (i + 1) % sp.length; sp[i].classList.add('on'); }, 3200);
}
function hideCover() { const c = $('.cover'); if (!c) return; clearInterval(coverT); c.classList.add('out'); setTimeout(() => c.remove(), 500); try { sessionStorage.setItem('mh.cover', '1'); } catch (e) { /* egal */ } }

(async function boot() {
  S = await loadState(); applyTheme(); render();
  let seen = false; try { seen = sessionStorage.getItem('mh.cover') === '1'; } catch (e) { /* egal */ }
  if (S.settings.cover !== false && !seen) showCover();
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { /* egal */ }
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
