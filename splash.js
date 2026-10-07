/* start animation: logo, "Maintaining" from the left, "You" from the right, tagline already there */
(function(){
  var el = document.getElementById('splash'); if(!el) return;
  var t0 = Date.now(), tGo = 0, HOLD = 1800, MAX = 5000, gone = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function start(){ if(tGo) return; tGo = Date.now(); el.classList.add('go'); }
  var wait = new Promise(function(r){ setTimeout(r, 450); });
  var fp = (document.fonts && document.fonts.load) ? Promise.race([document.fonts.load('italic 400 40px "Bodoni Moda"'), wait]) : wait;
  fp.then(start, start);
  function leave(){ if(gone) return; gone = true; el.classList.add('out'); setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 520); }
  el.addEventListener('click', leave);
  (function tick(){ var now = Date.now(); if(now - t0 >= MAX || (tGo && now - tGo >= (reduce ? 800 : HOLD) && window.MUSE_BOOTED)) leave(); else setTimeout(tick, 80); })();
})();
