import { expect, test } from 'vitest';
import { monthYear } from '../../src/lib/format';
import { allHtml, buildLog, exists, html, read } from './helpers';

test('without a CV, every CV link is hidden and the build says so', () => {
  expect(html('nocv', '404.html').querySelectorAll('nav a').map((a) => a.text.trim())).toEqual(['Research']);
  for (const { path, root } of allHtml('nocv')) {
    expect(root.querySelectorAll('a[href="/cv.pdf"]'), path).toHaveLength(0);
  }
  expect(buildLog('nocv')).toContain('[site] No public/cv.pdf yet, so CV links are hidden.');
});

test('a link to a file the site does not have stops the build', () => {
  expect(buildLog('badlink')).toContain(
    'papers/broken.md: links.pdf is "/papers/missing.pdf", but there is no file public/papers/missing.pdf');
});

test('404 page uses the shell', () => {
  const d = html('default', '404.html');
  expect(d.querySelector('html')?.getAttribute('lang')).toBe('en');
  expect(d.querySelector('title')?.text).toBe('Page not found | Yetong Liu');
  expect(d.querySelector('a.skip-link')?.getAttribute('href')).toBe('#main');
  expect(d.querySelector('header a.site-name')?.getAttribute('href')).toBe('/');
  expect(d.querySelectorAll('nav a').map((a) => a.text.trim())).toEqual(['Research', 'CV']);
  expect(d.querySelectorAll('h1').map((h) => h.text.trim())).toEqual(['Page not found']);
  expect(d.querySelector('main a[href="/"]')).toBeTruthy();
  expect(d.querySelector('footer a[href="mailto:yetong.liu@mail.utoronto.ca"]')).toBeTruthy();
  expect(d.querySelector('footer')?.text).toContain(`Updated ${monthYear(new Date())}`);
});

test('browser chrome and translation hints', () => {
  const d = html('default', '404.html');
  expect(d.querySelector('meta[name="theme-color"]')?.getAttribute('content')).toBe('#FFFFFF');
  expect(d.querySelector('header .site-name')?.getAttribute('translate')).toBe('no');
  expect(d.querySelector('footer a[href^="mailto:"]')?.getAttribute('translate')).toBe('no');
});

test('market menu shows Teaching and CV', () => {
  expect(html('market', '404.html').querySelectorAll('nav a').map((a) => [a.text.trim(), a.getAttribute('href')]))
    .toEqual([['Research', '/research/'], ['Teaching', '/teaching/'], ['CV', '/cv.pdf']]);
});

test('no third-party resources and no client scripts', () => {
  for (const s of ['default', 'market'] as const) {
    for (const { path, root } of allHtml(s)) {
      for (const el of root.querySelectorAll('link[href], script[src], img[src], source[srcset]')) {
        const url = el.getAttribute('href') ?? el.getAttribute('src') ?? el.getAttribute('srcset')!;
        expect(url, `${s}/${path}`).toMatch(/^(\/|https:\/\/yetongliu\.com\/)/);
      }
      expect(root.querySelectorAll('script:not([type="application/ld+json"])'), `${s}/${path}`).toHaveLength(0);
    }
  }
});

test('static files and CV presence', () => {
  expect(read('default', 'CNAME').trim()).toBe('yetongliu.com');
  expect(read('default', 'robots.txt')).toContain('Sitemap: https://yetongliu.com/sitemap-index.xml');
  expect(read('default', 'cv.pdf').startsWith('%PDF-')).toBe(true);
  expect(exists('market', 'cv.pdf')).toBe(true);
});
