import type { HTMLElement } from 'node-html-parser';
import { expect, test } from 'vitest';
import { exists, html, labels, read, titles } from './helpers';

const entry = (d: HTMLElement, title: string) => d.querySelectorAll('article').find((a) => a.querySelector('h3')!.text.trim() === title)!;

test("Yetong's research page", () => {
  const d = html('default', 'research/index.html');
  expect(d.querySelectorAll('h1').map((h) => h.text.trim())).toEqual(['Research']);
  expect(d.querySelector('nav a[aria-current="page"]')?.text.trim()).toBe('Research');
  expect(labels(d)).toEqual(['Working papers', 'Work in progress']);
  expect(titles(d, 'working-papers')).toEqual(['When Better AI Reveals Less']);
  expect(titles(d, 'work-in-progress')).toEqual([
    'Radical Innovation and Incumbent Survival: Evidence from the Hard Disk Drive Industry',
    'Does Delivery Format Close the Gender Gap in AI Adoption? Evidence from a Field Experiment']);
  const p1 = entry(d, 'When Better AI Reveals Less');
  expect(p1.querySelector('.paper-status')?.innerHTML).toBe('Submitted to <em>Economics Letters</em>');
  expect(p1.querySelector('summary')?.text).toContain('Abstract');
  expect(p1.querySelectorAll('.paper-links a').map((a) => a.getAttribute('href'))).toEqual(['https://ssrn.com/abstract=7592711']);
  const p2 = entry(d, titles(d, 'work-in-progress')[0]);
  expect(p2.querySelector('.paper-meta')?.text.trim()).toBe('with Joshua Gans');
  expect(p2.querySelector('.paper-meta a.coauthor')?.getAttribute('href')).toMatch(/^https:\/\//);
  expect(p2.querySelector('.paper-note')?.text.trim()).toBe('Supported by a Management Data and Analytics Lab research grant');
  expect(entry(d, titles(d, 'work-in-progress')[1]).querySelector('.paper-meta')?.text.trim()).toBe('with Hong Luo and Solène Delecourt');
  expect(read('default', 'sitemap-0.xml')).toContain('https://yetongliu.com/research/');
  expect(read('default', 'sitemap-0.xml')).not.toContain('404');
});

test('market research page: JMP first, publications, verbatim titles, partial actions', () => {
  const d = html('market', 'research/index.html');
  expect(labels(d)).toEqual(['Job market paper', 'Publications', 'Work in progress']);
  expect(titles(d, 'job-market-paper')).toEqual(['Fixture JMP: Evidence from "Quoted" Markets']);
  expect(d.querySelector('.research-intro')?.text.trim()).toBe('Fixture research intro.');
  const pub = entry(d, 'Fixture Published Paper');
  expect(pub.querySelector('.paper-status')?.innerHTML).toBe('<em>Journal of Tests</em>, 2028');
  expect([pub.querySelector('summary'), pub.querySelector('.paper-actions--abstract')]).toEqual([null, null]);
  const wip = entry(d, titles(d, 'work-in-progress')[0]);
  expect(wip.querySelector('.paper-meta')?.text.trim()).toBe('with Solène Coauthor, Second Coauthor, and Third Coauthor');
  expect([!!wip.querySelector('summary'), wip.querySelector('.paper-links')]).toEqual([true, null]);
});

test('Teaching page exists only when switched on', () => {
  expect(exists('default', 'teaching/index.html')).toBe(false);
  const t = html('market', 'teaching/index.html');
  expect(t.querySelectorAll('h1').map((h) => h.text.trim())).toEqual(['Teaching']);
  expect(t.querySelector('main')?.text).toContain('Fixture teaching: Strategy 101 (TA), Fall 2028.');
});
