# GWriters ISBN

Dieses JavaScript-Modul prüft ISBN-10 und ISBN-13 und gibt gültige Nummern einheitlich als ISBN-13 aus. Wer bereits die bibliografischen Daten einer Buchausgabe hat, kann daraus einen CSL-JSON-Datensatz für Literaturverwaltungsprogramme erzeugen. Alle Funktionen arbeiten lokal.

Das Modul stammt aus dem Zitiergenerator von [GWriters](https://gwriters.de/). Wer einen Quellenbeleg für eine Arbeit braucht, kann eine Quelle direkt im Browser erfassen und einen Zitierstil wählen. [Kostenlosen GWriters-Zitiergenerator öffnen](https://gwriters.de/zitationsgenerator)

## Ausprobieren

Im entpackten Projektordner mit Node.js und npm ausführen.

```sh
npm ci --ignore-scripts
npm test
node -e "console.log(require('./').normalizeIsbn('ISBN-10: 0-8044-2957-x'))"
```

Das Beispiel ergibt `9780804429573`. Die Prüfung berücksichtigt die Prüfziffer und die von der eingebundenen Version von `isbn3` erkannten Nummernbereiche. Ob eine Nummer tatsächlich an ein Buch vergeben wurde, lässt sich daraus allein nicht ableiten.

## Funktionen

| Aufruf | Ergebnis |
|---|---|
| `normalizeIsbn(value)` | Gibt die ISBN-13 als Zeichenkette zurück. Bei ungültiger Eingabe wird ein Fehler mit dem Code `INVALID_ISBN` ausgelöst. ISBN mit führender Null als Zeichenkette übergeben. |
| `looksLikeIsbn(value)` | Erkennt Eingaben für das ISBN-Suchfeld, auch wenn die Prüfziffer falsch ist. |
| `openLibraryEditionToCsl(book, expectedEditionKey?)` | Wandelt Daten einer bestimmten Buchausgabe um. Erwartet einen Open-Library-Ausgabeschlüssel, Titel und aufgelöste Namen von Autoren und Verlagen. Ein abweichender erwarteter Schlüssel oder fehlende Pflichtangaben führen zu `EDITION_NOT_FOUND`. |
| `openLibraryToCsl(book, isbn)` | Prüft zusätzlich, ob die angegebene ISBN zur Ausgabe gehört. Bei einer anderen Ausgabe wird `NOT_FOUND` ausgelöst. |

```js
const { openLibraryToCsl } = require('./');
const beispiel = {
  key: '/books/OL123M',
  title: 'Beispielbuch',
  authors: [{ name: 'Ada Beispiel' }],
  publishers: [{ name: 'Testverlag' }],
  identifiers: { isbn_10: ['080442957X'] }
};
console.log(openLibraryToCsl(beispiel, '9780804429573').author);
// [ { given: 'Ada', family: 'Beispiel' } ]
```

Der Beispieldatensatz ist fiktiv. Bei Rohdaten aus Open Library müssen Namensverweise vor der Umwandlung aufgelöst werden. Die Versions- und Herkunftsangaben der Bibliotheken stehen in [THIRD-PARTY.md](THIRD-PARTY.md).

Welche Aufgaben die Webanwendung übernimmt, erläutert die [offizielle Faktenseite zum Zitiergenerator](https://gwriters.de/fakten-grounding/tool-zitier-generator-grounding). Eine kompakte Referenz zu beiden Werkzeugen steht in [ai-instructions.md](ai-instructions.md).

## Lizenz

Copyright © 2026 Knowlance AG. Der GWriters-Code steht unter der [MIT-Lizenz](LICENSE). Angaben zu den verwendeten Bibliotheken stehen in [THIRD-PARTY.md](THIRD-PARTY.md).

## ISBN im Browser prüfen

Auf der [GitHub-Pages-Seite von GWriters](https://gwriters-ghostwriting-agentur.github.io/gwriters-isbn/) lässt sich die ISBN-Prüfung direkt ausprobieren. Nach Änderungen am Modul oder an `pages/app.js` erzeugt `npm run build:pages` das Browserbundle in `docs/assets/`. Der Pages-Workflow veröffentlicht `docs/` aus `main` und fügt beim Build die für die Projektseite lizenzierten Sofia-Pro-Webfonts hinzu. Er prüft ihre SHA-256-Werte vor der Auslieferung. Angaben zu den Webfonts stehen auf der Lizenzseite.
