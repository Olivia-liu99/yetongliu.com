import { expect, test } from 'vitest';
import { checkLocalLinks, checkSettings, SITE_PATH_OR_HTTPS } from '../../src/lib/checks';

test('accepts a consistent setup', () =>
  expect(checkSettings({ jobMarket: { onMarket: true, years: '2029–2030', paper: 'jmp' } }, ['jmp'])).toEqual([]));

test('names a missing job market paper', () =>
  expect(checkSettings({ jobMarket: { onMarket: false, paper: 'jpm' } }, ['jmp']))
    .toEqual(['jobMarket.paper is "jpm", but there is no file src/content/papers/jpm.md']));

test('requires years when on the market', () =>
  expect(checkSettings({ jobMarket: { onMarket: true } }, []))
    .toEqual(['jobMarket.onMarket is true, so jobMarket.years is required (for example "2029–2030")']));

test('names every link to a file the site does not have', () => {
  const papers = [{
    id: 'jmp',
    data: {
      links: {
        pdf: '/papers/jmp.pdf',
        slides: '/papers/slides.pdf',
        ssrn: 'https://ssrn.com/abstract=1',
        other: [{ label: 'Data', url: '/papers/data.zip' }, { label: 'NBER', url: 'https://nber.org/x' }],
      },
    },
  }];
  expect(checkLocalLinks(papers, (path) => path === '/papers/slides.pdf')).toEqual([
    'papers/jmp.md: links.pdf is "/papers/jmp.pdf", but there is no file public/papers/jmp.pdf',
    'papers/jmp.md: links.other is "/papers/data.zip", but there is no file public/papers/data.zip',
  ]);
});

test('site links must start with one slash or https://', () => {
  expect(['/papers/a.pdf', 'https://example.org', '//example.org/a.pdf', 'http://example.org'].map((s) => SITE_PATH_OR_HTTPS.test(s)))
    .toEqual([true, true, false, false]);
});
