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

/* Cloud (nur im Artifact): privates Dokument pro Person. Ohne Cloud läuft alles lokal weiter. */
const withTimeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);
async function cloudRef() {
  try {
    if (!window.claude || !window.claude.use) return null;
    const [db, user] = await withTimeout(Promise.all([window.claude.use('db'), window.claude.use('user')]), 4000) || [];
    if (!db || !user) return null;
    const id = await user.id(); if (!id) return null;
    return db.collection('data/users/' + id).doc('state');
  } catch (e) { return null; }
}
async function loadState() {
  let raw = await idbGet();
  if (!raw) { try { raw = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { raw = null; } }
  try {
    const ref = await cloudRef();
    if (ref) {
      const snap = await withTimeout(ref.get(), 4000);
      const d = snap && snap.exists ? snap.data() : null;
      if (d && d.json) { const c = JSON.parse(d.json); if (!raw || (c.savedAt || 0) >= (raw.savedAt || 0)) raw = c; }
      cloudReady = ref;
    }
  } catch (e) { /* lokal weiter */ }
  return raw ? migrate(raw) : freshState();
}
let cloudReady = null, cloudT = null;

let saveT = null;
function persist(state) {
  clearTimeout(saveT);
  saveT = setTimeout(() => {
    state.savedAt = Date.now();
    idbSet(state);
    clearTimeout(cloudT);
    if (cloudReady) cloudT = setTimeout(() => { cloudReady.set({ json: JSON.stringify(state), savedAt: state.savedAt }).catch(() => { }); }, 1500);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* voll oder gesperrt */ }
  }, 200);
}

function exportBackup(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'maintaining-home-backup-' + isoOf() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
