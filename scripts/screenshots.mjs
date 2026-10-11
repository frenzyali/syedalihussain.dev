// Screenshots every section at 360px and 1280px, in light and dark, for a visual check before
// pushing. No dependencies: it drives a Chrome/Chromium binary over the DevTools protocol.
//
//   npm run build && npx astro preview --port 4322
//   CHROME=/path/to/chrome node scripts/screenshots.mjs http://localhost:4322 shots
//
// Writes <outdir>/<section>-<width>-<theme>.png and prints, per page, whether it scrolls
// sideways and its layout shift. Motion is reduced, so bars and readings are in their final state.
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const [base = 'http://localhost:4322', outdir = 'shots'] = process.argv.slice(2);
if (!process.env.CHROME) throw new Error('Set CHROME to a Chrome or Chromium binary.');
mkdirSync(outdir, { recursive: true });

const port = 9335;
const chrome = spawn(
  process.env.CHROME,
  ['--headless', '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${port}`, 'about:blank'],
  { stdio: 'ignore' }
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let version;
for (let i = 0; i < 50 && !version; i++) {
  try {
    version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  } catch {
    await sleep(200);
  }
}

const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let nextId = 0;
const pending = new Map();
const listeners = new Set();
ws.addEventListener('message', (e) => {
  const msg = JSON.parse(e.data);
  if (pending.has(msg.id)) {
    pending.get(msg.id)(msg.result);
    pending.delete(msg.id);
  } else listeners.forEach((fn) => fn(msg));
});
const send = (method, params = {}, sessionId) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
const once = (method, sessionId) =>
  new Promise((resolve) => {
    const fn = (msg) => {
      if (msg.method === method && msg.sessionId === sessionId) {
        listeners.delete(fn);
        resolve(msg);
      }
    };
    listeners.add(fn);
  });

for (const width of [360, 1280]) {
  for (const theme of ['light', 'dark']) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 }, sessionId);
    await send('Emulation.setEmulatedMedia', { features: [
      { name: 'prefers-color-scheme', value: theme },
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ] }, sessionId);
    await send('Page.addScriptToEvaluateOnNewDocument', { source: `
      try { localStorage.removeItem('theme'); } catch (e) {}
      window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; })
        .observe({ type: 'layout-shift', buffered: true });
    ` }, sessionId);
    const loaded = once('Page.loadEventFired', sessionId);
    await send('Page.navigate', { url: base + '/' }, sessionId);
    await loaded;
    await sleep(800);

    const { result } = await send('Runtime.evaluate', { returnByValue: true, expression: `({
      cls: window.__cls,
      overflow: document.documentElement.scrollWidth > ${width},
      sections: [...document.querySelectorAll('#top, main section[id]')].map((el) => {
        const r = el.getBoundingClientRect();
        return { id: el.id, y: r.top + scrollY, height: r.height };
      }),
    })` }, sessionId);
    const page = result.value;
    console.log(`${width}px ${theme}: overflow ${page.overflow}, CLS ${page.cls.toFixed(4)}`);

    for (const s of page.sections) {
      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        clip: { x: 0, y: s.y, width, height: s.height, scale: 1 },
      }, sessionId);
      const name = `${s.id === 'top' ? 'hero' : s.id}-${width}-${theme}.png`;
      writeFileSync(`${outdir}/${name}`, Buffer.from(shot.data, 'base64'));
    }
    await send('Target.closeTarget', { targetId });
  }
}

ws.close();
chrome.kill();
