import { expect, test } from 'vitest';
import {
  homePapers,
  inlineEmphasis,
  interestsLine,
  jsonLdString,
  listSeparator,
  monthYear,
  organizePapers,
  paperLinks,
  type PaperGroup,
} from '../../src/lib/format';

const p = (id: string, group: PaperGroup, order = 100, home?: boolean) => ({ id, data: { title: id, group, order, home } });

test('listSeparator', () => {
  expect([listSeparator(0, 1)]).toEqual(['']);
  expect([0, 1].map((i) => listSeparator(i, 2))).toEqual([' and ', '']);
  expect([0, 1, 2].map((i) => listSeparator(i, 3))).toEqual([', ', ', and ', '']);
});

test('inlineEmphasis', () => {
  expect(inlineEmphasis('Submitted to *Economics Letters*')).toBe('Submitted to <em>Economics Letters</em>');
  expect(inlineEmphasis('A <b> & "c"')).toBe('A &lt;b&gt; &amp; &quot;c&quot;');
  expect(inlineEmphasis('5 * 3')).toBe('5 * 3');
});

test('interestsLine', () => {
  expect(interestsLine(['Innovation', 'Technology diffusion and adoption', 'Organizational design']))
    .toBe('Innovation, technology diffusion and adoption, organizational design');
  expect(interestsLine(['Innovation', 'AI adoption'])).toBe('Innovation, AI adoption');
});

test('monthYear uses Toronto time', () => {
  expect(monthYear(new Date('2026-10-18T12:00:00Z'))).toBe('October 2026');
  expect(monthYear(new Date('2026-11-01T02:00:00Z'))).toBe('October 2026');
});

test('paperLinks', () => {
  expect(paperLinks({ ssrn: 'https://ssrn.com/abstract=1', pdf: '/papers/a.pdf', other: [{ label: 'NBER', url: 'https://nber.org/x' }] }))
    .toEqual([{ label: 'PDF', href: '/papers/a.pdf' }, { label: 'SSRN', href: 'https://ssrn.com/abstract=1' }, { label: 'NBER', href: 'https://nber.org/x' }]);
  expect(paperLinks({ pdf: '/p.pdf' }, { pdfLabel: 'Paper (PDF)' })[0].label).toBe('Paper (PDF)');
  expect(paperLinks(undefined)).toEqual([]);
});

test('organizePapers groups, sorts, and removes the JMP', () => {
  const r = organizePapers([p('b', 'working', 2), p('a', 'working', 2), p('c', 'working', 1), p('j', 'in-progress', 1), p('x', 'published')], 'j');
  expect(r.jmp?.id).toBe('j');
  expect(r.working.map((x) => x.id)).toEqual(['c', 'a', 'b']);
  expect(r.inProgress).toEqual([]);
  expect(r.published.map((x) => x.id)).toEqual(['x']);
});

test('homePapers', () => {
  expect(homePapers([p('i', 'in-progress'), p('w', 'working'), p('pub', 'published'), p('j', 'working', 1)], 'j').map((x) => x.id)).toEqual(['w', 'i']);
  expect(homePapers([p('pub', 'published', 100, true), p('w', 'working', 100, false)]).map((x) => x.id)).toEqual(['pub']);
});

test('jsonLdString escapes <', () => {
  expect(jsonLdString({ a: '</script>' })).toBe('{"a":"\\u003c/script>"}');
});
