/* start animation: logo, "Maintaining" from the left, "You" from the right, tagline already there */
(function(){
  var el = document.getElementById('splash'); if(!el) return;
  function paint(c){ if(!c || !c.bg) return; el.style.background = c.bg; el.style.setProperty('--sp-ink', c.ink); el.style.setProperty('--sp-ac', c.ac); el.classList.toggle('dark', !!c.dark); }
  window.MUSE_SPLASH = function(c){ paint(c); try { localStorage.setItem('muse.splash', JSON.stringify(c)); } catch(e){} };
  try { paint(JSON.parse(localStorage.getItem('muse.splash'))); } catch(e){}
  var LINES = ['Give yourself a lift','Looking good for your purpose','Because you are worth it','Polished on purpose','Show up as the woman you are','Your glow, your plan','Well groomed, well booked','Be ready before you need to be'];
  try { var tg = el.querySelector('.sw-tag'), last = parseInt(localStorage.getItem('muse.tag'), 10), i;
    do { i = Math.floor(Math.random() * LINES.length); } while (i === last && LINES.length > 1);
    tg.textContent = LINES[i]; localStorage.setItem('muse.tag', i); } catch(e){}
  var t0 = Date.now(), tGo = 0, HOLD = 3200, MAX = 7000, gone = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){ if(tGo) return; tGo = Date.now(); el.classList.add('go'); }
  var wait = new Promise(function(r){ setTimeout(r, 450); });
  var fp = (document.fonts && document.fonts.load) ? Promise.race([document.fonts.load('italic 400 40px "Bodoni Moda"'), wait]) : wait;
  fp.then(start, start);
  function leave(){ if(gone) return; gone = true; el.classList.add('out'); setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 520); }
  el.addEventListener('click', leave);
  (function tick(){ var now = Date.now(); if(now - t0 >= MAX || (tGo && now - tGo >= (reduce ? 800 : HOLD) && window.MUSE_BOOTED)) leave(); else setTimeout(tick, 80); })();
})();
