// The link-preview image (/og.png, 1200×630), drawn at build time with sharp, which Astro already
// uses for images. src/pages/og.png.ts serves it and Base.astro links it as /og.png?v=<hash of these
// bytes>, so a changed image gets a new URL and link previews don't keep the old one. It shows the
// same illustrated portrait as the hero avatar, cropped the same way.
// Text is set by Pango from the Geist TTFs in assets-src/fonts/, so it matches the site. The
// portrait and the name sit inside the centre 630×630, which WhatsApp sometimes crops to;
// everything else stays inside a 60px margin.
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { site } from '../data/site';

const W = 1200;
const H = 630;
const MARGIN = 60;

// Light-theme tokens from src/styles/global.css.
const BG = '#f5f3ee';
const INK = '#1b1a17';
const INK_2 = '#5e5a52';
const RING = '#cfc9bc';
const ACCENT = '#1f5bd1';

const root = process.cwd();
const fonts = {
  semibold: join(root, 'assets-src/fonts/Geist-SemiBold.ttf'),
  medium: join(root, 'assets-src/fonts/Geist-Medium.ttf'),
  regular: join(root, 'assets-src/fonts/Geist-Regular.ttf'),
};

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** One line of text as a transparent PNG; size in px, tracking in em. */
async function line(text: string, font: keyof typeof fonts, size: number, color: string, tracking = 0) {
  const family = { semibold: 'Geist SemiBold', medium: 'Geist Medium', regular: 'Geist' }[font];
  const spacing = Math.round(tracking * size * 1024);
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}" letter_spacing="${spacing}">${escape(text)}</span>`,
      font: `${family} ${size}`,
      fontfile: fonts[font],
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { input: data, width: info.width, height: info.height };
}

/** The hero avatar (src/assets/img/ali.jpg) as a circle with a ring, cropped like `.avatar img`
    in Hero.astro: the 580px square at (110,167) of the 843×843 portrait, so the eyes sit on the
    upper third and the face fills about 70%. Re-measure with Hero.astro if the image changes. */
async function avatar(d: number, ring: number) {
  const src = join(root, 'src/assets/img/ali.jpg');
  const meta = await sharp(src).metadata();
  const scale = meta.width! / 843;
  const side = Math.round(580 * scale);
  const left = Math.round(110 * scale);
  const top = Math.round(167 * scale);
  const inner = d - 2 * ring;
  const mask = Buffer.from(`<svg width="${inner}" height="${inner}"><circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="#fff"/></svg>`);
  const photo = await sharp(src)
    .extract({ left, top, width: side, height: side })
    .resize(inner, inner)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const disc = Buffer.from(`<svg width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="${RING}"/></svg>`);
  return sharp(disc)
    .composite([{ input: photo, left: ring, top: ring }])
    .png()
    .toBuffer();
}

async function draw() {
  const D = 280;
  const photoX = 252;
  const textX = photoX + D + 44;

  const [first, last] = [site.name.split(' ').slice(0, -1).join(' '), site.name.split(' ').at(-1)!];
  const name1 = await line(first, 'semibold', 84, INK, -0.035);
  const name2 = await line(last, 'semibold', 84, INK, -0.035);
  const role = await line(site.title, 'medium', 34, INK_2, -0.01);
  const tags = await line('AWS · CI/CD · Kubernetes · Terraform', 'regular', 28, INK_2);
  const domain = await line(new URL(site.url).host, 'medium', 26, ACCENT);

  // Name, role and tags as one block, centred on the photo; the domain sits on the bottom margin.
  const blocks = [
    { img: name1, gap: 0 },
    { img: name2, gap: -10 },
    { img: role, gap: 24 },
    { img: tags, gap: 22 },
  ];
  const blockH = blocks.reduce((h, b) => h + b.gap + b.img.height, 0);
  let y = Math.round((H - blockH) / 2) - 10;
  const layers = blocks.map((b) => {
    y += b.gap;
    const layer = { input: b.img.input, left: textX, top: y };
    y += b.img.height;
    return layer;
  });

  for (const l of [...blocks.map((b) => b.img), domain]) {
    if (textX + l.width > W - MARGIN) throw new Error('og.png: a text line runs into the right margin');
  }

  const png = await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      { input: await avatar(D, 2), left: photoX, top: Math.round((H - D) / 2) - 10 },
      ...layers,
      { input: domain.input, left: textX, top: H - MARGIN - domain.height },
    ])
    .png({ compressionLevel: 9, palette: false })
    .toBuffer();

  return png;
}

// Drawn once per build, so the endpoint and the hash in the meta tags use the same bytes.
let png: Promise<Buffer> | undefined;
export const ogPng = () => (png ??= draw());

/** First 8 hex digits of the image's SHA-256, for the ?v= cache-buster. */
export const ogVersion = async () => createHash('sha256').update(await ogPng()).digest('hex').slice(0, 8);
