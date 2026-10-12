// Packets moving along the CSS grid (.bg, 64px cells). 1x canvas, clears only last frame's dots,
// 30fps cap, paused in hidden tabs, off under reduced motion (the grid stays).
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var cv = document.querySelector('.bg canvas');
  if (!cv || !cv.getContext) return;
  var X = cv.getContext('2d'), C = 64, R = 10, M = Math, rnd = M.random, el = document.documentElement,
    W, H, rgb, A, S, P = [], Q = [], raf, last = 0, tm;
  function c(a) { return 'rgba(' + rgb + ',' + a + ')'; }
  function n(k) { return M.floor(rnd() * k); }
  function theme() {
    if (!W) return;
    var cs = getComputedStyle(el), h = cs.getPropertyValue('--accent').trim().slice(1), r = R;
    rgb = [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); }).join();
    A = parseFloat(cs.getPropertyValue('--packet-alpha')) || 0.35;
    S = document.createElement('canvas'); S.width = S.height = 2 * r;
    var g = S.getContext('2d'), gr = g.createRadialGradient(r, r, 0, r, r, r);
    [[0, 1], [0.2, 1], [0.35, 0.35], [1, 0]].forEach(function (s) { gr.addColorStop(s[0], c(s[1])); });
    g.fillStyle = gr; g.fillRect(0, 0, 2 * r, 2 * r);
  }
  function spawn() {
    var d = n(4);
    return { x: C * n(M.ceil(W / C) + 1), y: C * n(M.ceil(H / C) + 1), dx: [1, -1, 0, 0][d], dy: [0, 0, 1, -1][d],
      left: C, v: 28 + rnd() * 28, age: 0, life: 4 + rnd() * 6 };
  }
  function size() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    theme(); P = [];
    for (var i = W < 640 ? 5 : 11; i--; ) P.push(spawn());
  }
  function step(p, dt) {
    var mv = p.v * dt, m, s, t;
    p.age += dt;
    while (mv > 0) {
      m = M.min(mv, p.left); p.x += p.dx * m; p.y += p.dy * m; p.left -= m; mv -= m;
      if (p.left) continue;
      p.left = C;
      if (rnd() < 0.33) { s = rnd() < 0.5 ? 1 : -1; t = p.dx; p.dx = p.dy * s; p.dy = t * s; }
    }
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 32) return;
    var dt = M.min((t - last) / 1000, 0.1);
    last = t;
    Q.forEach(function (q) { X.clearRect(q[0] - 1, q[1] - 1, 2 * R + 2, 2 * R + 2); });
    Q = [];
    P.forEach(function (p, i) {
      step(p, dt);
      if (p.age > p.life || p.x < -C || p.y < -C || p.x > W + C || p.y > H + C) p = P[i] = spawn();
      X.globalAlpha = A * M.max(0, M.min(1, p.age / 0.6, (p.life - p.age) / 0.8));
      var x = p.x + 0.5 - R, y = p.y + 0.5 - R;
      X.drawImage(S, x, y, 2 * R, 2 * R);
      Q.push([x, y]);
    });
  }
  function go() {
    cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame);
  }
  addEventListener('load', function () { requestAnimationFrame(function () { size(); go(); }); });
  addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(size, 200); });
  document.addEventListener('visibilitychange', function () { document.hidden ? cancelAnimationFrame(raf) : go(); });
  new MutationObserver(theme).observe(el, { attributes: true, attributeFilter: ['data-theme'] });
})();
