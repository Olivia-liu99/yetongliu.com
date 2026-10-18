import { expect, test } from 'vitest';
import { checkSettings } from '../../src/lib/checks';

test('accepts a consistent setup', () =>
  expect(checkSettings({ jobMarket: { onMarket: true, years: '2029–2030', paper: 'jmp' } }, ['jmp'])).toEqual([]));

test('names a missing job market paper', () =>
  expect(checkSettings({ jobMarket: { onMarket: false, paper: 'jpm' } }, ['jmp']))
    .toEqual(['jobMarket.paper is "jpm", but there is no file src/content/papers/jpm.md']));

test('requires years when on the market', () =>
  expect(checkSettings({ jobMarket: { onMarket: true } }, []))
    .toEqual(['jobMarket.onMarket is true, so jobMarket.years is required (for example "2029–2030")']));
