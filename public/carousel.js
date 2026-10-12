// Recommendations carousel: buttons, dots and arrow keys over a CSS scroll-snap track.
(function () {
  var c = document.querySelector('[data-carousel]');
  if (!c) return;
  var t = c.querySelector('.track'), s = t.children, prev = c.querySelector('[data-prev]'),
    next = c.querySelector('[data-next]'), dots = c.querySelectorAll('[data-dot]'),
    rm = matchMedia('(prefers-reduced-motion: reduce)'), raf;
  function w() { return s[1].offsetLeft - s[0].offsetLeft; }
  function n() { return Math.round((t.scrollWidth - t.clientWidth) / w()) + 1; }
  function at() { return Math.round(t.scrollLeft / w()); }
  function go(i) {
    t.scrollTo({ left: Math.max(0, Math.min(n() - 1, i)) * w(), behavior: rm.matches ? 'auto' : 'smooth' });
  }
  function upd() {
    var k = n(), i = at();
    dots.forEach(function (d, j) { d.hidden = j >= k; d.setAttribute('aria-current', j === i); });
    prev.disabled = i < 1;
    next.disabled = i >= k - 1;
  }
  function later() { cancelAnimationFrame(raf); raf = requestAnimationFrame(upd); }
  prev.onclick = function () { go(at() - 1); };
  next.onclick = function () { go(at() + 1); };
  dots.forEach(function (d, j) { d.onclick = function () { go(j); }; });
  c.onkeydown = function (e) {
    var d = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (d) { e.preventDefault(); go(at() + d); }
  };
  t.addEventListener('scroll', later, { passive: true });
  addEventListener('resize', later);
  upd();
  c.classList.add('carousel-ready');
})();
