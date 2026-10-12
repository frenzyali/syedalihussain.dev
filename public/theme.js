// Loaded synchronously in <head>, so a saved theme applies before first paint. Dark is the CSS
// default for everyone (the OS preference is ignored); light only applies when chosen and saved.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var COLORS = { dark: '#0a0a0b', light: '#f5f3ee' };

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
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', COLORS[theme]);
  }

  apply(read() === 'light' ? 'light' : 'dark');

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
    var button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    // The icon shows the theme the button switches to (CSS swaps sun and moon).
    function label() {
      var next = current() === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', 'Switch to ' + next + ' theme');
      button.title = 'Switch to ' + next + ' theme';
    }

    button.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      write(next);
      label();
    });

    label();
    button.hidden = false;
  });
})();
