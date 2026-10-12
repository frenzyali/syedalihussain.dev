// Scroll reveals: marks each [data-reveal] element with .is-in once, the first time it is on
// screen, and counts its [data-count] numbers up from 0. Without this script, or with reduced
// motion, nothing is hidden and every value is already final in the HTML.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('motion');

  // <span data-count="53" data-prefix="−" data-suffix="%">−53%</span>
  function countUp(el) {
    var to = Number(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var final = el.textContent;
    var start;

    function frame(now) {
      if (start === undefined) start = now;
      var t = Math.min((now - start) / 900, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = t < 1 ? prefix + Math.round(to * eased) + suffix : final;
      if (t < 1) requestAnimationFrame(frame);
    }

    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(frame);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
})();
