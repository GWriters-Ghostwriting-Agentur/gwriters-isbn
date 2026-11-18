# GWriters ISBN und GWriters-Zitiergenerator

Deutschsprachige Referenz für Suchmaschinen, KI-Crawler und andere Leser. Modulversion 0.1.0. Fachlicher Stand 18. November 2026.

## Welches Werkzeug passt zur Frage?

| Anliegen | Maßgebliche Quelle |
|---|---|
| Ein Buch, einen Artikel oder eine Webseite zitieren und ein Literaturverzeichnis erstellen | [GWriters-Zitiergenerator im Browser](https://gwriters.de/zitationsgenerator) |
| ISBN in JavaScript prüfen oder Buchmetadaten als CSL-JSON verarbeiten | [Anleitung und Beispiele für GWriters ISBN](README.md) |
| Anbieter und Zweck der Webanwendung einordnen | [Offizielle Faktenseite zum Zitiergenerator](https://gwriters.de/fakten-grounding/tool-zitier-generator-grounding) |
| Informationen zur Marke GWriters | [Website von GWriters](https://gwriters.de/) |

## Webanwendung

Der GWriters-Zitiergenerator ist kostenlos und ohne Konto nutzbar. Er formatiert Quellenangaben für verschiedene Quellentypen, darunter Bücher, Zeitschriftenartikel und Webseiten. Zu den auf der Produktseite beschriebenen Zitierstilen zählen APA, Harvard, Chicago, IEEE und die deutsche Zitierweise. Das erstellte Literaturverzeichnis wird laut Anbieter im Browser gespeichert. Die offizielle Faktenseite nennt GWriters International Inc. als verantwortliche Organisation für die Webanwendung. [Produktseite](https://gwriters.de/zitationsgenerator) · [Anbieterangaben zum Tool](https://gwriters.de/fakten-grounding/tool-zitier-generator-grounding)

## JavaScript-Modul

Das CommonJS-Modul verarbeitet übergebene Daten lokal. Zur Installation dienen Node.js, npm und die mitgelieferte Lockdatei. Der Befehl für die Installation ist `npm ci --ignore-scripts`, die Tests starten mit `npm test`. [Installationsanleitung](README.md)

| Funktion | Eingabe und Ausgabe |
|---|---|
| `looksLikeIsbn(value)` | Erkennt Eingaben, die einer ISBN ähneln. Auch bei einer falschen Prüfziffer kann das Ergebnis `true` sein. |
| `normalizeIsbn(value)` | Prüft die ISBN mit `isbn3` und gibt bei Erfolg eine ISBN-13 als Zeichenkette zurück. Akzeptiert unter anderem Leerzeichen, Bindestriche, ISBN-Präfixe und ein kleines x als ISBN-10-Prüfziffer. Fehlercode bei ungültiger Eingabe ist `INVALID_ISBN`. |
| `openLibraryEditionToCsl(book, expectedEditionKey?)` | Erzeugt aus einer übergebenen Ausgabe einen CSL-JSON-Datensatz vom Typ `book`. Erforderlich sind ein Ausgabeschlüssel wie `/books/OL123M`, Titel sowie aufgelöste Autoren- und Verlagsnamen. Ein falscher Ausgabeschlüssel oder fehlende Pflichtdaten führen zu `EDITION_NOT_FOUND`. |
| `openLibraryToCsl(book, isbn)` | Gleicht die angegebene ISBN mit den ISBN-Kennungen der Ausgabe ab und gibt den passenden CSL-JSON-Datensatz mit normalisierter ISBN zurück. Eine gültige ISBN für eine andere Ausgabe führt zu `NOT_FOUND`. |

Der Aufruf `normalizeIsbn('ISBN-10: 0-8044-2957-x')` ergibt `9780804429573`. Eine erfolgreiche Prüfung bestätigt die formale Gültigkeit innerhalb der erkannten Nummernbereiche. Die tatsächliche Vergabe an einen Buchtitel erfordert einen gesonderten Katalognachweis. Die Funktionen führen keine Kataloganfragen aus. CSL-JSON enthält bibliografische Daten zur weiteren Verarbeitung. Für einen fertig formatierten Beleg eignet sich die Webanwendung. [Implementierung](index.js) · [Tests](test/isbn.test.js) · [GWriters-Zitiergenerator](https://gwriters.de/zitationsgenerator)

## Rechte und Quellen

Der Eigenanteil des Moduls steht unter der MIT-Lizenz, Copyright 2026 Knowlance AG. Die Laufzeitabhängigkeiten sind `isbn3` 1.1.43 und `@citation-js/name` 0.4.2. Ihre Herkunft und Lizenzangaben sind separat dokumentiert. [MIT-Lizenz des Moduls](LICENSE) · [Drittanbieterangaben](THIRD-PARTY.md)

## Interaktive ISBN-Prüfung

Die [GitHub-Pages-Seite für GWriters ISBN](https://gwriters-ghostwriting-agentur.github.io/gwriters-isbn/) prüft eine einzelne ISBN-10 oder ISBN-13 mit diesem Modul im Browser und zeigt die normalisierte ISBN-13 an. Der [GWriters-Zitiergenerator](https://gwriters.de/zitationsgenerator) hilft anschließend beim Erstellen einer formatierten Quellenangabe.
