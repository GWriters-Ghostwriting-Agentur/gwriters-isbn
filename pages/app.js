const { normalizeIsbn } = require('../index.js');

const form = document.querySelector('#isbn-form');
const field = form.elements.isbn;
const result = document.querySelector('#result');
const status = document.querySelector('#status');
const output = document.querySelector('#normalized');
const example = '0-8044-2957-X';

function reset() {
  field.removeAttribute('aria-invalid');
  result.hidden = true;
  status.textContent = '';
  output.textContent = '';
}

function check() {
  reset();
  try {
    const isbn = normalizeIsbn(field.value);
    output.textContent = isbn;
    result.hidden = false;
    status.textContent = 'Gültige ISBN. ISBN-13: ' + isbn + '.';
  } catch (error) {
    if (error.code !== 'INVALID_ISBN') throw error;
    field.setAttribute('aria-invalid', 'true');
    status.textContent = field.value.trim()
      ? 'Die ISBN ist ungültig. Prüfe Länge, Ziffern und Prüfziffer.'
      : 'Bitte gib eine ISBN-10 oder ISBN-13 ein.';
    field.focus();
  }
}

form.addEventListener('submit', event => { event.preventDefault(); check(); });
field.addEventListener('input', reset);
document.querySelector('#example').addEventListener('click', () => {
  field.value = example;
  check();
});
document.querySelector('#mobile-tool').addEventListener('click', event => {
  event.preventDefault();
  form.scrollIntoView({ block: 'center' });
  field.focus({ preventScroll: true });
});
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('tool-above', !entry.isIntersecting && entry.boundingClientRect.bottom < 0);
  }).observe(form);
}
form.querySelector('button[type=submit]').disabled = false;
document.querySelector('#example').disabled = false;
