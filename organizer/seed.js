/* Daten aus dem Haushaltsplaner (PDF). Texte bleiben so, wie sie im PDF stehen. */
const SEED = {
  areas: [
    { id: 'vf', name: 'Victory Family', color: '#6f8a5e', parent: null },
    { id: 'church', name: 'Church', color: '#b4786b', parent: null },
    { id: 'vomi', name: 'VOMI', color: '#b4786b', parent: 'church' },
    { id: 'gls', name: 'GLS', color: '#9b6a86', parent: 'church' },
    { id: 'choir', name: 'Choir', color: '#c28a4e', parent: 'church' },
    { id: 'home', name: 'Home', color: '#8b6b43', parent: null }
  ],

  meals: [
    ['Plain Reisgerichte', ['Oilreis mit Erdnussbutter Soße', 'Reis mit Tunfischsoße', 'Reis mit Chickenwings Stew', 'Reis mit Fischstew (Gravy)', 'Reis mit Spinatstew', 'Reis mit Chicken Gemüse Pfannensoße', 'Oilreis mit Meko, Fried Eggs, Avocado'], 'Zu allem optional: Plantain'],
    ['Besondere Reisgerichte', ['Waakye mit Eiern, Salat und Stew', 'Fried Rice mit Salat und Chicken', 'Jollof mit Salat und Chicken']],
    ['Nudelgerichte', ['Spaghetti Bolognese', 'Spaghetti mit Spinatsoße', 'Tortellini Sahne Cremesoße']],
    ['Kartoffelgerichte', ['Kartoffel mit Spinatsoße', 'Süßkartoffel Bowl mit Hackfleisch']],
    ['Fufugerichte', ['Fufu mit Lightsoup und Okro', 'Fufu mit Erdnusssoße', 'Fufu mit Palmoil Soße']],
    ['Griessgerichte', ['Grieß mit Okrosoße', 'Grieß mit Meko und Sardinen']],
    ['Yamgerichte', ['Gekochte Yam mit Spinatsoße', 'Gekochte Yam mit Erdnuss Gardeneggsoße', 'Gekochte Yam mit Stew und Ei']],
    ['Sonstige Gerichte', ['Tozafi mit Okro Soße', 'Burger', 'Wraps mit Hackfleisch', 'Home made Döner']],
    ['Frühstück', ['Toastbrot mit Schwarztee und Milch', 'Haferbrei mit Obst', 'Joghurt mit Obst', 'Pfannkuchen mit Tee', 'Rührei mit Toast']]
  ],

  /* Koch Rotation 1 bis 4. Tag = [Frühstück, Mittag, Topf, Abend, Topf]. Topf: 0 Salbei, 1 Sand, 2 Rosé, -1 kein Topf */
  rotation: [
    {
      pots: [['Spinatstew', 'Mo kochen, reicht bis Mi'], ['Fufu mit Erdnusssoße', 'Fr kochen, reicht bis So'], ['Chickenwings Stew', 'Do kochen, reicht bis Fr']],
      days: [
        ['Toastbrot, Schwarztee, Milch', 'Reis mit Spinatstew', 0, 'Kartoffel mit Spinatstew', 0],
        ['Pfannkuchen mit Tee', 'Gekochte Yam mit Spinatstew', 0, 'Reis mit Spinatstew', 0],
        ['Haferbrei mit Obst', 'Kartoffel mit Spinatstew', 0, 'Fried Rice mit Salat und Chicken', -1],
        ['Rührei mit Toast', 'Reis mit Chickenwings Stew', 2, 'Reis mit Chickenwings Stew', 2],
        ['Joghurt mit Obst', 'Reis mit Chickenwings Stew (Plantain)', 2, 'Fufu mit Erdnusssoße', 1],
        ['Toastbrot, Schwarztee, Milch', 'Reis mit Erdnusssoße', 1, 'Wraps mit Hackfleisch', -1],
        ['Pfannkuchen mit Tee', 'Fufu mit Erdnusssoße', 1, 'Reis mit Erdnusssoße', 1]
      ]
    },
    {
      pots: [['Erdnussbuttersoße', 'Mo kochen, reicht bis Mi'], ['Fufu mit Light Soup und Okro', 'Fr kochen, reicht bis So'], ['Fischstew (Gravy)', 'Do kochen, reicht bis Fr']],
      days: [
        ['Pfannkuchen mit Tee', 'Oilreis mit Erdnussbuttersoße', 0, 'Oilreis mit Erdnussbuttersoße (Plantain)', 0],
        ['Haferbrei mit Obst', 'Reis mit Erdnussbuttersoße', 0, 'Oilreis mit Erdnussbuttersoße', 0],
        ['Rührei mit Toast', 'Reis mit Erdnussbuttersoße', 0, 'Jollof mit Salat und Chicken', -1],
        ['Joghurt mit Obst', 'Reis mit Fischstew', 2, 'Reis mit Fischstew', 2],
        ['Toastbrot, Schwarztee, Milch', 'Reis mit Fischstew', 2, 'Fufu mit Light Soup und Okro', 1],
        ['Pfannkuchen mit Tee', 'Reis mit Light Soup', 1, 'Burger', -1],
        ['Toastbrot, Schwarztee, Milch', 'Fufu mit Light Soup und Okro', 1, 'Reis mit Light Soup', 1]
      ]
    },
    {
      pots: [['Tunfischsoße', 'Mo kochen, reicht bis Mi'], ['Fufu mit Palmoil Soße', 'Fr kochen, reicht bis So'], ['Yam mit Spinatsoße', 'Do kochen, reicht bis Fr']],
      days: [
        ['Haferbrei mit Obst', 'Reis mit Tunfischsoße', 0, 'Reis mit Tunfischsoße (Plantain)', 0],
        ['Rührei mit Toast', 'Reis mit Tunfischsoße', 0, 'Reis mit Tunfischsoße', 0],
        ['Joghurt mit Obst', 'Reis mit Tunfischsoße', 0, 'Süßkartoffel Bowl mit Hackfleisch', -1],
        ['Toastbrot, Schwarztee, Milch', 'Gekochte Yam mit Spinatsoße', 2, 'Gekochte Yam mit Spinatsoße', 2],
        ['Pfannkuchen mit Tee', 'Kartoffel mit Spinatsoße', 2, 'Fufu mit Palmoil Soße', 1],
        ['Toastbrot, Schwarztee, Milch', 'Reis mit Palmoil Soße', 1, 'Home made Döner', -1],
        ['Pfannkuchen mit Tee', 'Fufu mit Palmoil Soße', 1, 'Reis mit Palmoil Soße', 1]
      ]
    },
    {
      pots: [['Chicken Gemüse Pfannensoße', 'Mo kochen, reicht bis Mi'], ['Fufu mit Erdnusssoße', 'Fr kochen, reicht bis So'], ['Grieß mit Okrosoße', 'Do kochen, reicht bis Fr']],
      days: [
        ['Rührei mit Toast', 'Reis mit Chicken Gemüse Pfannensoße', 0, 'Reis mit Chicken Gemüse Pfannensoße', 0],
        ['Joghurt mit Obst', 'Reis mit Chicken Gemüse Pfannensoße', 0, 'Reis mit Chicken Gemüse Pfannensoße', 0],
        ['Toastbrot, Schwarztee, Milch', 'Reis mit Chicken Gemüse Pfannensoße', 0, 'Spaghetti Bolognese', -1],
        ['Pfannkuchen mit Tee', 'Grieß mit Okrosoße', 2, 'Grieß mit Okrosoße', 2],
        ['Toastbrot, Schwarztee, Milch', 'Grieß mit Okrosoße', 2, 'Fufu mit Erdnusssoße', 1],
        ['Pfannkuchen mit Tee', 'Reis mit Erdnusssoße', 1, 'Tortellini Sahne', -1],
        ['Haferbrei mit Obst', 'Fufu mit Erdnusssoße', 1, 'Reis mit Erdnusssoße', 1]
      ]
    }
  ],

  prep: ['Reis vorkochen und portionieren', 'Soßen und Stews vorkochen', 'Suppenbasis ansetzen', 'Hähnchen würzen oder marinieren', 'Gemüse waschen und schneiden', 'Bowl Zutaten vorbereiten', 'Cremesoße für Tortellini', 'Portionen einfrieren und beschriften', 'Snacks und Obst vorbereiten', 'Kinderessen vorbereiten'],

  shopCats: ['Obst & Gemüse', 'Fleisch & Fisch', 'Milch & Kühlung', 'Reis, Bohnen, Trockenes', 'Gewürze & Soßenzutaten', 'Haushalt & Drogerie', 'Sonstiges'],

  /* Vorräte: [Gruppe, Einkaufskategorie, Artikel] */
  pantry: [
    ['Reis, Nudeln, Getreide', 'Reis, Bohnen, Trockenes', ['Reis (weiß)', 'Nudeln, Spaghetti', 'Haferflocken', 'Mehl', 'Gari oder Fufu Mehl', 'Brot oder Toast', 'Kartoffeln']],
    ['Öl, Salz, Gewürze', 'Gewürze & Soßenzutaten', ['Pflanzenöl', 'Olivenöl', 'Palmöl', 'Salz', 'Pfeffer', 'Brühwürfel oder Brühpulver', 'Currypulver', 'Paprikapulver', 'Thymian', 'Knoblauchpulver', 'Chili oder Scotch Bonnet', 'Zucker']],
    ['Dosen und Gläser', 'Reis, Bohnen, Trockenes', ['Tomatenmark', 'Passierte Tomaten', 'Tomaten in der Dose', 'Tunfisch', 'Bohnen', 'Mais', 'Kokosmilch', 'Erdnusspaste', 'Palmnuss Creme (Banga)']],
    ['Frisch und lagerfähig', 'Obst & Gemüse', ['Zwiebeln', 'Knoblauch', 'Ingwer', 'Eier', 'Zitronen', 'Süßkartoffeln oder Yam']],
    ['Tiefkühler', 'Fleisch & Fisch', ['Hähnchen', 'Fisch oder Garnelen', 'Gemüse gemischt', 'Tortellini', 'Beeren oder Obst', 'Fertige Portionen (Prep)']],
    ['Kinder', 'Haushalt & Drogerie', ['Windeln', 'Feuchttücher', 'Windelcreme', 'Gläschen oder Quetschies', 'Milch oder Milchpulver', 'Hausapotheke Basics']],
    ['Haushalt', 'Haushalt & Drogerie', ['Spülmittel', 'Spülmaschinentabs', 'Allzweckreiniger', 'WC Reiniger', 'Entkalker', 'Müllbeutel', 'Küchenpapier', 'Toilettenpapier', 'Waschmittel', 'Duschgel und Seife']]
  ],

  budgetCats: ['Grundnahrung: Reis, Nudeln, Öl', 'Obst und Gemüse', 'Fleisch und Fisch', 'Milch, Eier, Brot', 'Kinder: Essen und Snacks', 'Getränke', 'Auswärts essen, Lieferdienst', 'Sonstiges'],

  /* Tägliche Runde: [Bereich, Minuten, Aufgaben] */
  round: [
    ['Wohnzimmer', 10, ['Oberflächen freiräumen, alles an seinen Platz', 'Spielzeug in die Kiste', 'Couch ordnen: Kissen, Decken glätten', 'Boden fegen oder saugen']],
    ['Küche', 10, ['Geschirr spülen oder Maschine an, ausräumen', 'Arbeitsflächen und Herd abwischen', 'Spüle sauber, Müll prüfen', 'Krümel vom Boden aufnehmen']],
    ['Flur und Schlafzimmer', 5, ['Schuhe und Jacken ordnen', 'Bett machen', 'Kleidung vom Boden einsammeln']],
    ['Bad und WC', 10, ['Glasreiniger über Waschbecken und Spiegel', 'WC innen mit der Bürste schrubben', 'WC Sitz und Außenseite abwischen', 'Handtücher glätten oder tauschen', 'Müll leeren, wenn voll']],
    ['Wäsche', 10, ['Maschine anstellen oder ausräumen', 'Trockene Wäsche abnehmen', 'Falten und wegräumen']]
  ],
  roundTip: 'Tipp: Timer pro Bereich stellen. Klingelt er, gehst du weiter, auch wenn nicht alles fertig ist. Zuerst Wohnzimmer: der erste Blick wirkt sofort ordentlich.',
  roundPanic: 'Notfallplan, wenn nur 20 Min bleiben: Wohnzimmer 5, Küche 5, Bad und WC 5, Wäsche 5.',

  /* Schwerpunkt des Tages, Montag bis Sonntag */
  focus: [
    ['Küche tiefer', 'Kühlschrank auswischen und Altes raus, Mikrowelle innen, Schränke außen'],
    ['Bad tiefer', 'Dusche oder Wanne schrubben, Armaturen entkalken, Badematten wechseln'],
    ['Böden', 'Ganze Wohnung nass wischen'],
    ['Vorräte prüfen', 'Einkaufsliste schreiben, Putzmittel nachkaufen'],
    ['Betten', 'Bettwäsche wechseln (Eltern und Kinder)'],
    ['Wohnzimmer tiefer', 'Staub wischen, Sofa absaugen, Müll, Glas, Pfand'],
    ['Planung', 'Wochenmenü, Einkaufsliste, Prioritäten, Prep Plan']
  ],

  deep: {
    A: { title: 'Küche und Bäder tief', tasks: [['Backofen innen reinigen', 15], ['Kühlschrank Fächer, Dichtungen', 10], ['Dunstabzug Fettfilter', 5], ['Einen Küchenschrank innen', 5], ['Duschfugen und Kalk entfernen', 10], ['WC Spülrand, Boden hinter dem WC', 5], ['Spiegel und Glasflächen', 5], ['Abflüsse und Duschvorhang', 5]] },
    B: { title: 'Wohnen, Schlafen, Kinder', tasks: [['Fenster innen, ein Raum', 10], ['Unter Sofa und Betten saugen', 10], ['Matratzen absaugen und wenden', 10], ['Spielzeug aussortieren, säubern', 10], ['Wände, Türen, Flecken abwischen', 5], ['Heizkörper und Lüftung abstauben', 5], ['Polsterfugen und Teppich', 5], ['Kinderkleidung nach Größe prüfen', 5]] },
    bonus: ['Gefrierfach abtauen oder sortieren', 'Vorratsschrank ausmisten', 'Handtücher und Bettwäsche prüfen', 'Putzmittel Vorrat auffüllen', 'Etwas spenden oder verkaufen']
  },

  monthly: [
    ['Küche', ['Gewürze und Dosen: Haltbarkeit', 'Vorratsschrank ausmisten', 'Gefrierfach sortieren', 'Küchenschwämme und Lappen tauschen']],
    ['Ganze Wohnung', ['Lüftungsschlitze abstauben', 'Unter Möbeln saugen', 'Decken und Kissen waschen', 'Wände und Türen abwischen']],
    ['Bäder', ['Kosmetik und Pflege aussortieren', 'Zahnbürsten wechseln', 'Medikamentenschrank prüfen', 'Handtuchvorrat prüfen']],
    ['Kinder', ['Matratzen drehen', 'Spielzeug aussortieren und spenden', 'Kleidung zu klein? Aussortieren', 'Spielzeug desinfizieren', 'Kinderzeichnungen sortieren']]
  ],
  quarterly: ['Fenster innen und außen', 'Wohnung entrümpeln', 'Abstellraum oder Keller ordnen', 'Heizung oder Klimagerät prüfen', 'Rauchmelder testen', 'Spendenrunde', 'Außenmöbel oder Balkon tief reinigen', 'Kleiderschrank Saisonwechsel', 'Gefrierschrank abtauen', 'Teppich oder Sofa reinigen']
};
