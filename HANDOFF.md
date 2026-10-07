# Maintaining You: Übergabe-Notiz (früher "Muse")

Maintaining You ist Esthers visueller Garderoben- und Beauty-Planer (Körperform: umgekehrtes Dreieck, warmer Unterton). Sie schreibt auf Deutsch/Englisch, direkt und locker, will keine langen Listen und findet die App schnell "zu AI" und "zu viel Information".

## Stand
- Vanilla JS, Dateien: `index.html`, `styles.css`, `app.js`, `seed-pics.js`, `seed-items.js`, `sw.js`, `manifest.webmanifest`.
- Veröffentlicht als einzelnes Artifact (CSS, Seeds und JS eingebaut): https://claude.ai/artifact/3yZPQXZBypussT8vtUbErM (zuletzt Version 41). Branch: `claude/beauty-outfit-planner-as77s8`.
- Build-Weg: `styles.css` + `seed-pics.js` + `seed-items.js` + `app.js` (mit `confirm(` -> `(()=>true)(`) in eine HTML-Datei packen und mit dem Artifact-Tool unter derselben URL neu veröffentlichen. Capabilities `db` und `user` sind deklariert und bleiben erhalten.
- Seiten: Today (Kalender oben, "Planned today" als Galerie, "Beauty upkeep", Rest hinter "More"), Wardrobe (Wunschliste mit Pipeline Wish -> Cart -> Ordered -> Own), Closet (nur Besitz), Looks, Mood, Calendar, Beauty.
- Pläne sind Datumspläne (Outfit, Hair, Nails, Lashes ...), je "At a salon" oder "At home, DIY". Alles erscheint als Bildkarten. Jede Karte hat ein ✕ zum Löschen.
- Farben: Standard ist Kaffeebraun (#2a1b16) mit Gold (#b48a4c). Über den Kreis oben rechts wählbar: 6 Presets plus eigene Farben (`applyTheme`, `THEMES` in `app.js`).
- Schriften: Bodoni Moda + Hanken Grotesk.

## Speichern (wichtig, war ein Problem)
- Lokal: IndexedDB, Fallback localStorage. Im Artifact-Viewer ging das offenbar verloren.
- Cloud: `db`-Capability, privat pro Person, Pfad `data/users/<id>` mit Dokumenten `muse_appts`, `muse_looks`, `muse_plan`, `muse_routine`, `muse_log`, `muse_wears`, `muse_theme`, `muse_shops`, `muse_vs` (Stati/Preise). Pfad war bis Version 40 falsch (4 Segmente), seit Version 41 korrigiert.
- NOCH NICHT BESTÄTIGT, dass es im echten Viewer speichert. Prüfen: Plan anlegen, App neu öffnen, dann mit dem ArtifactData-Tool `data/users/me` auflisten.
- Nicht in der Cloud: selbst hochgeladene Fotos (zu groß, nur im Browser).

## Offene Wünsche / nächste Schritte
- Wardrobe aufräumen, weniger Informationen pro Seite (Esthers größte Kritik).
- Echte Web-Adresse, damit sie die App aufs Handy installieren kann (Angebot, noch unbeantwortet).
- Skills im Projekt (`.claude/skills/`): `impeccable`, `design-taste-frontend` (Ordner `taste-skill`), `claude-design` (Warm-Stone-Stil, nur auf Ansage), die Emil-Kowalski-Skills (Animation/Design, viele React/Swift-spezifisch) und `playwright-skill` zum Testen im Browser. Keine Hooks installiert. Referenz: `design-references/claude-design.md` (nicht angewendet).
- Esthers Ziel jetzt: die App "richtig geil" gestalten, mit den Skills, aber Kaffeebraun + Gold behalten und die Seiten ruhig halten.

## Nicht wollen
- Premium-Redesign mit Look "zu AI" (wurde rückgängig gemacht), weiße/kalte Töne, viel Text, Bullet-Listen in Antworten.

## Stand Oktober 2026 (Ergänzung)
- App heißt jetzt "Maintaining You". Interne Namen (`muse_*` Dokumente, `KEY = 'muse.v1'`, `MuseDebug`) bleiben absichtlich gleich, damit gespeicherte Daten nicht verloren gehen.
- Standard-Look: Creme (#f4ece0) mit Gold (#b48a4c). 9 wählbare Farben in `THEMES` (Eintrag 5 = optionale Schriftfarbe).
- 5 Tabs: Today, Plan, Care (Routine | Inspiration), Looks (Looks | Snaps), Wardrobe (Wishlist | My closet). `NAV`/`SUBS` in `app.js`.
- Care: Routinen mit Fortschrittsring, Plan/Done, illustrierte Icons (`ART`), Produkte pro Bereich (`state.products`, Seed in `seed-products.js`, je Produkt einmal über `state.seedProd`).
- Snaps: Foto zu geplantem Look, Wochenleiste, Serie, Badges, Look der Woche, Teilen-Karte (Canvas, Speichern über `downloads`). Fotos über `assets`, Metadaten in `muse_snaps`.
- Capabilities beim Veröffentlichen: db, user, downloads, assets.
- Offen: Schrift der Überschriften (Vorschläge Cormorant Garamond, Playfair Display, Marcellus), Look-Builder und Produktansicht in Wardrobe angleichen, Shop-Links bei Produkten.
- Netzwerk der Cloud-Umgebung ist für einige Seiten freigegeben (Referenzseiten ansehen geht).

## Stand 7. Oktober 2026 (Ergänzung)
- Start-Animation (`splash.js`, Markup in `index.html`, Farben folgen dem gewählten Theme über `localStorage 'muse.splash'`, wechselnde Zeile darunter).
- Looks-Seite neu (`lookCover`, `lookMeta`, Klassen `.lk-*`): Foto- oder Teile-Cover, Beauty als kleine Chips.
- Neuer Care-Bereich "Choose your scent" (`scent`, Produkte unter "Fragrance") mit 4 Zara-Parfüms als Seed (`seed-products.js`), Icon in `icons-img.js`.
- Offen wie vorher: Überschriften-Schrift, Look-Builder/Produktansicht angleichen, Shop-Links.
- Home = Kalender (früher Plan-Tab) mit eingeklappten Bereichen (Tag, Coming up, 'What would you like to do?' mit Kacheln); Plan-Tab entfernt, `tab('calendar')` führt auf Home.
- Today-Seite entfernt (Home ist der Kalender). Bilder an Terminen werden nach Terminart getaggt (`picsFromPlan`), Care-Karten zeigen den nächsten geplanten Termin (`plannedFor`).
- Kleidungsfotos (seed-items.js) freigestellt (rembg birefnet-general-lite) auf einheitlichem Hintergrund #e9dfd3, rev 3; Blazer als Item x9.
