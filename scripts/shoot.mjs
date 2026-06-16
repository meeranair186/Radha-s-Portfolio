import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL || 'http://localhost:5173/';
const OUT = 'shots';
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome-stable',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--force-prefers-reduced-motion=false'],
});

const page = await browser.newPage();
await page.emulateMediaFeatures([
  { name: 'prefers-reduced-motion', value: 'no-preference' },
]);
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
// give loader + fonts + ScrollTrigger time to settle
await new Promise((r) => setTimeout(r, 2500));

const maxScroll = await page.evaluate(
  () => document.documentElement.scrollHeight - window.innerHeight
);

const points = [0, 0.13, 0.24, 0.4, 0.5, 0.62, 0.72, 0.8, 0.9, 1];
for (let i = 0; i < points.length; i += 1) {
  const p = points[i];
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(maxScroll * p));
  // let scrub animation catch up
  await new Promise((r) => setTimeout(r, 900));
  const name = `${OUT}/shot-${String(i).padStart(2, '0')}-${Math.round(p * 100)}.png`;
  await page.screenshot({ path: name });
  console.log('saved', name);
}

await browser.close();
console.log('done');
