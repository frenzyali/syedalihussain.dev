// Loaded synchronously in <head> so a saved theme applies before first paint.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var system = window.matchMedia('(prefers-color-scheme: dark)');

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
    return system.matches ? 'dark' : 'light';
  }

  function opposite() {
    return current() === 'dark' ? 'light' : 'dark';
  }

  var saved = read();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    // The button holds an icon; its text label lives in [data-theme-label] (visually hidden).
    var text = button.querySelector('[data-theme-label]') || button;

    function label() {
      var next = opposite();
      text.textContent = 'Switch to ' + next + ' theme';
      button.title = 'Switch to ' + next + ' theme';
    }

    button.addEventListener('click', function () {
      var next = opposite();
      root.setAttribute('data-theme', next);
      write(next);
      label();
    });

    label();
    button.hidden = false;
    if (system.addEventListener) system.addEventListener('change', label);
  });
})();
