// Recommendations strip: the Pause button, the full-text dialog, and prev/next for the
// reduced-motion row. The CSS loop runs (and pauses on hover and focus) without this script.
(function () {
  var m = document.querySelector('[data-marquee]');
  if (!m) return;
  var vp = m.querySelector('.viewport'), dlg = m.querySelector('dialog'),
    body = dlg.querySelector('[data-body]'), pause = m.querySelector('[data-pause]'), opener;

  pause.onclick = function () {
    var on = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', on);
    m.classList.toggle('is-paused', on);
  };

  m.querySelectorAll('[data-dir]').forEach(function (b) {
    b.onclick = function () {
      var li = vp.querySelector('li');
      vp.scrollBy({ left: b.dataset.dir * (li.offsetWidth + parseFloat(getComputedStyle(li).marginRight)) });
    };
  });

  // The dialog shows a copy of the card's quote, full text and author.
  m.querySelectorAll('[data-open]').forEach(function (b) {
    b.onclick = function () {
      var card = b.closest('li');
      body.replaceChildren();
      ['.mark', '.pull', '.text', '.who'].forEach(function (s) {
        body.appendChild(card.querySelector(s).cloneNode(true));
      });
      body.querySelector('.name').id = 'rec-dialog-name';
      opener = b;
      dlg.showModal();
    };
  });
  dlg.querySelector('[data-close]').onclick = function () { dlg.close(); };
  dlg.onclick = function (e) {
    var r = dlg.getBoundingClientRect();
    if (e.target === dlg && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dlg.close();
  };
  dlg.onclose = function () { if (opener) opener.focus(); };

  m.classList.add('marquee-ready');
})();
