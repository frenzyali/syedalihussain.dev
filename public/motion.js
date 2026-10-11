// Scroll reveals: marks each [data-reveal] element with .is-in once, the first time it is on
// screen, and counts results readings down from their "before" value. Without this script,
// or with reduced motion, nothing is hidden and every value is already final in the HTML.
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('motion');

  // <span data-from="425" data-to="200" data-prefix="~$">~$200</span>
  function countDown(el) {
    var from = Number(el.getAttribute('data-from'));
    var to = Number(el.getAttribute('data-to'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var final = el.textContent;
    var start;

    function frame(now) {
      if (start === undefined) start = now;
      var t = Math.min((now - start) / 800, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = t < 1 ? prefix + Math.round(from + (to - from) * eased) + suffix : final;
      if (t < 1) requestAnimationFrame(frame);
    }

    el.textContent = prefix + from + suffix;
    requestAnimationFrame(frame);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        entry.target.querySelectorAll('[data-from]').forEach(function (el) {
          if (el.closest('[data-reveal]') === entry.target) countDown(el);
        });
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    observer.observe(el);
  });
})();
