#!/usr/bin/env python3
"""Packt die App in eine einzelne HTML-Datei fürs Artifact (Schriften von Google Fonts, kein Service Worker)."""
import sys, os
here = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[1] if len(sys.argv) > 1 else '/tmp/maintaining-home.html'
css = open(os.path.join(here, 'styles.css')).read().replace('calc(env(safe-area-inset-top) + 22px)', '22px')
js = ''.join(open(os.path.join(here, f)).read() + '\n' for f in ['seed.js', 'store.js', 'app.js'])
html = f'''<title>Maintaining Home</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
<style>
{css}
</style>
<div id="app" class="app"></div>
<div id="chrome"></div>
<div id="sheets"></div>
<div id="toast" class="toast" role="status" aria-live="polite"></div>
<script>
{js}
</script>
'''
open(out, 'w').write(html)
print(out, len(html) // 1024, 'KB')
