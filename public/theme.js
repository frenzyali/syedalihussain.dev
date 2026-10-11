// Loaded synchronously in <head> so a saved theme applies before first paint.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function write(value) {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      // Storage blocked (private mode, disabled cookies): the choice lasts for this page view only.
    }
  }

  function current() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  var saved = read();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    function label() {
      var next = current() === 'dark' ? 'light' : 'dark';
      button.textContent = next === 'dark' ? 'Dark theme' : 'Light theme';
      button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
    }

    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      write(next);
      label();
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', label);
    label();
    button.hidden = false;
  });
})();
