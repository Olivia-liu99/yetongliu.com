import type { HTMLElement } from 'node-html-parser';
import { expect, test } from 'vitest';
import { allHtml, exists, html, labels, titles } from './helpers';

const section = (d: HTMLElement, id: string) => d.querySelector(`section[aria-labelledby="${id}"]`)!;
const linkText = (a: HTMLElement) => a.text.replace(/ for “.*”$/, '').trim();

test("Yetong's home page", () => {
  const d = html('default', 'index.html');
  expect(d.querySelectorAll('h1').map((h) => h.text.trim())).toEqual(['Yetong Liu']);
  expect(d.querySelector('title')?.text).toBe('Yetong Liu');
  expect(d.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://yetongliu.com/');
  expect(d.querySelector('.position')?.text).toContain('PhD Student in Strategic Management');
  expect(d.querySelector('.market-line')).toBeNull();
  expect(d.querySelector('picture img')?.getAttribute('alt')).toBe('Portrait of Yetong Liu');
  expect(d.querySelector('.bio')?.text).toContain('I study innovation and how organizations adopt new technologies.');
  expect(d.querySelectorAll('.profile-links a').map(linkText))
    .toEqual(['yetong.liu@mail.utoronto.ca', 'CV', 'Google Scholar', 'LinkedIn']);
  expect(labels(d)).toEqual(['Research interests', 'Current research']);
  expect(section(d, 'research-interests').querySelector('.row-body')?.text.trim())
    .toBe('Innovation, technology diffusion and adoption, artificial intelligence');
  expect(titles(d, 'research-list')).toEqual([
    'When Better AI Reveals Less',
    'Radical Innovation and Incumbent Survival: Evidence from the Hard Disk Drive Industry']);
  expect(section(d, 'research-list').querySelector('a[href="/research/"]')?.text.trim()).toBe('All papers and abstracts');
  expect(d.querySelectorAll('.paper--compact .paper-actions')).toHaveLength(0);
  const ld = JSON.parse(d.querySelector('script[type="application/ld+json"]')!.text);
  expect([ld['@type'], ld.name, ld.sameAs]).toEqual(['Person', 'Yetong Liu',
    ['https://scholar.google.com/citations?user=2wplHcMAAAAJ', 'https://www.linkedin.com/in/yetongliu/']]);
  expect(d.querySelector('meta[property="og:image"]')?.getAttribute('content')).toMatch(/^https:\/\/yetongliu\.com\/_astro\/.+\.jpg$/);
  expect(d.querySelector('header [lang="zh"]')).toBeNull();
});

test('the portrait loads first and the email is never auto-translated', () => {
  const d = html('default', 'index.html');
  const img = d.querySelector('picture img')!;
  expect([img.getAttribute('loading'), img.getAttribute('fetchpriority')]).toEqual(['eager', 'high']);
  expect(d.querySelector('.profile-links a[href^="mailto:"]')?.getAttribute('translate')).toBe('no');
});

test('market home page', () => {
  const d = html('market', 'index.html');
  expect(d.querySelector('.market-line')?.text.trim()).toBe('On the 2029–2030 academic job market');
  expect(labels(d)).toEqual(['Job market paper', 'Research interests', 'Other research', 'References']);
  const jmp = section(d, 'job-market-paper');
  expect(jmp.querySelector('.paper-summary')?.text.trim()).toBe('Fixture summary sentence.');
  expect(jmp.querySelectorAll('.paper-links a').map((a) => [linkText(a), a.getAttribute('href')]))
    .toEqual([['Paper (PDF)', '/papers/fixture-jmp.pdf'], ['Slides', '/papers/fixture-jmp-slides.pdf']]);
  expect(titles(d, 'research-list')).not.toContain('Fixture JMP: Evidence from "Quoted" Markets');
  expect(section(d, 'references').querySelectorAll('li').map((li) =>
    [li.querySelector('.reference-name')!.text.trim(), li.querySelector('.reference-role')!.text.trim()]))
    .toEqual([['Ada Reference', 'Professor, Example University'], ['Ben Reference', 'Associate Professor, Sample University']]);
  expect(d.querySelector('picture')).toBeNull();
  expect(d.querySelector('.intro--full')).toBeTruthy();
  expect(d.querySelectorAll('.profile-links a').map(linkText))
    .toEqual(['a.very.long.fixture.address.for.overflow.testing@example-university.edu', 'CV', 'Google Scholar']);
  expect(d.querySelector('header [lang="zh"]')?.text.trim()).toBe('测试');
});

test('every internal link resolves to a built file', () => {
  for (const s of ['default', 'market'] as const) {
    for (const { path, root } of allHtml(s)) {
      for (const a of root.querySelectorAll('a[href^="/"]')) {
        const href = a.getAttribute('href')!.split('#')[0];
        expect(exists(s, href.endsWith('/') ? `${href}index.html` : href), `${s}/${path} → ${href}`).toBe(true);
      }
    }
  }
});
