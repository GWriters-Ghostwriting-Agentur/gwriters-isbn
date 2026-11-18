'use strict';

const { parse: parseIsbn } = require('isbn3');
const { parse: parseName } = require('@citation-js/name');

class BookLookupError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'BookLookupError';
    this.code = code;
  }
}

function compactIsbn(value) {
  return String(value).trim().replace(/^ISBN(?:-1[03])?\s*:?\s*/i, '').replace(/[\s-]/g, '').toUpperCase();
}

function normalizeIsbn(value) {
  const parsed = parseIsbn(compactIsbn(value));
  if (!parsed?.isValid) {
    throw new BookLookupError('INVALID_ISBN', 'Bitte geben Sie eine gültige ISBN-10 oder ISBN-13 ein.');
  }
  return parsed.isbn13;
}

// Die Suchmaske erkennt so auch fehlerhafte Eingaben als mögliche ISBN.
function looksLikeIsbn(value) {
  return /^[\dX]{9,}$/.test(compactIsbn(value));
}

function names(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.map(entry => entry?.name).filter(value => typeof value === 'string' && value.trim());
}

function editionIsbns(book) {
  const ids = book?.identifiers;
  const fields = [ids?.isbn_13, ids?.isbn_10].filter(Array.isArray);
  return fields.flat().map(value => parseIsbn(compactIsbn(value))?.isbn13).filter(Boolean);
}

function openLibraryEditionToCsl(book, expectedEditionKey) {
  const authors = names(book?.authors);
  const publishers = names(book?.publishers);
  if (!/^\/books\/OL\d+M$/.test(book?.key) || (expectedEditionKey && book.key !== expectedEditionKey)
      || typeof book.title !== 'string' || !book.title.trim() || !authors.length || !publishers.length) {
    throw new BookLookupError('EDITION_NOT_FOUND', 'Für diese Ausgabe fehlen eindeutige bibliografische Angaben.');
  }
  const metadata = {
    id: 'openlibrary:' + book.key.split('/').pop(),
    type: 'book',
    title: book.subtitle ? book.title + ': ' + book.subtitle : book.title,
    author: authors.map(name => parseName(name)),
    publisher: publishers.join('; '),
    'publisher-place': names(book.publish_places).join('; '),
    URL: 'https://openlibrary.org' + book.key
  };
  const [isbn] = editionIsbns(book);
  if (isbn) metadata.ISBN = isbn;
  const year = String(book.publish_date || '').match(/\b([12]\d{3})\b/);
  if (year) metadata.issued = { 'date-parts': [[Number(year[1])]] };
  if (book.number_of_pages > 0) metadata['number-of-pages'] = book.number_of_pages;
  return metadata;
}

function openLibraryToCsl(book, isbn) {
  const expected = normalizeIsbn(isbn);
  if (!editionIsbns(book).includes(expected)) {
    throw new BookLookupError('NOT_FOUND', 'Die ISBN passt zu keiner Kennung dieser Ausgabe.');
  }
  return { ...openLibraryEditionToCsl(book), id: 'isbn:' + expected, ISBN: expected };
}

module.exports = { BookLookupError, looksLikeIsbn, normalizeIsbn, openLibraryEditionToCsl, openLibraryToCsl };
