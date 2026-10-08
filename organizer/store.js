/* Speicher: IndexedDB mit localStorage als Spiegel. Alles bleibt auf dem Gerät. */
const KEY = 'organizer.v1';
const VERSION = 1;

const isoOf = (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 6e4); return z.toISOString().slice(0, 10); };
const mondayIso = (d = new Date()) => { const x = new Date(d); x.setHours(12, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return isoOf(x); };

function freshState() {
  return {
    version: VERSION,
    settings: { name: 'Esther', start: mondayIso(), rotShift: 0, theme: 'auto' },
    areas: SEED.areas.map(a => ({ ...a })),
    todos: [], events: [], leads: [],
    priorities: {},
    myMeals: [],
    plan: {},
    shopping: [],
    pantry: {},
    prepLog: {},
    cleanLog: {},
    deepLog: {}, deepDone: [],
    monthLog: {}, quarterLog: {},
    budget: {},
    purchases: []
  };
}

function migrate(s) {
  const f = freshState();
  const out = { ...f, ...s, settings: { ...f.settings, ...(s.settings || {}) } };
  out.version = VERSION;
  return out;
}

function idbOpen() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('organizer', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function idbGet() {
  try {
    const db = await idbOpen();
    return await new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(KEY); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  } catch (e) { return null; }
}
async function idbSet(v) {
  try {
    const db = await idbOpen();
    await new Promise((res, rej) => { const t = db.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, KEY); t.oncomplete = res; t.onerror = () => rej(t.error); });
  } catch (e) { /* localStorage-Spiegel reicht */ }
}

async function loadState() {
  let raw = await idbGet();
  if (!raw) { try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; } }
  return raw ? migrate(raw) : freshState();
}

let saveT = null;
function persist(state) {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    idbSet(state);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* voll oder gesperrt */ }
  }, 200);
}

function exportBackup(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'planer-backup-' + isoOf() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
