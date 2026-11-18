'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeIsbn, looksLikeIsbn, openLibraryEditionToCsl, openLibraryToCsl } = require('..');

// Erfundenes Beispiel für die nach dem Datenabruf angereicherte Datensatzform.
const book = {
  key: '/books/OL123M', title: 'Beispielbuch', subtitle: 'Ein Test',
  authors: [{ name: 'Ada Beispiel' }], publishers: [{ name: 'Testverlag' }],
  publish_places: [{ name: 'Bern' }], publish_date: 'April 2020', number_of_pages: 123,
  identifiers: { isbn_10: ['ungültig', '080442957X'] }
};

test('ISBN-10, kleine Prüfziffer x sowie ISBN-13 mit Präfix und Trennzeichen', () => {
  for (const input of ['ISBN-10: 0-8044-2957-x', 'ISBN 978-0-8044-2957-3', ' 9780804429573 ']) {
    assert.equal(normalizeIsbn(input), '9780804429573');
  }
  assert.equal(normalizeIsbn('979-10-91146-13-5'), '9791091146135');
});

test('Prüfzifferfehler und ISBN-fremde Angaben', () => {
  for (const input of ['9780804429572', '0804429571', '0378-5955', '10.1234/demo', '', null]) {
    assert.throws(() => normalizeIsbn(input), { code: 'INVALID_ISBN' });
  }
  assert.equal(looksLikeIsbn('9780804429572'), true);
  assert.equal(looksLikeIsbn('0378-5955'), false);
});

test('liefert die bibliografischen Angaben der passenden Ausgabe', () => {
  assert.deepEqual(openLibraryToCsl(book, '0-8044-2957-X'), {
    id: 'isbn:9780804429573', type: 'book', title: 'Beispielbuch: Ein Test',
    author: [{ given: 'Ada', family: 'Beispiel' }], publisher: 'Testverlag',
    'publisher-place': 'Bern', URL: 'https://openlibrary.org/books/OL123M',
    issued: { 'date-parts': [[2020]] }, 'number-of-pages': 123, ISBN: '9780804429573'
  });
});

test('verwirft eine abweichende ISBN, Ausgabe oder unvollständige Metadaten', () => {
  assert.throws(() => openLibraryToCsl(book, '9791091146135'), { code: 'NOT_FOUND' });
  assert.throws(() => openLibraryEditionToCsl(book, '/books/OL456M'), { code: 'EDITION_NOT_FOUND' });
  for (const entry of [null, { ...book, authors: [{}] }, { ...book, publishers: null }]) {
    assert.throws(() => openLibraryEditionToCsl(entry), { code: 'EDITION_NOT_FOUND' });
  }
});

test('erhält Ausgaben ohne ISBN und erfindet kein Erscheinungsjahr', () => {
  const entry = openLibraryEditionToCsl({ ...book, identifiers: {}, publish_date: 'unbekannt' });
  assert.equal(entry.id, 'openlibrary:OL123M');
  assert.equal('ISBN' in entry, false);
  assert.equal('issued' in entry, false);
});
