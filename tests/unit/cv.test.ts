import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'vitest';
import { copyCv } from '../../scripts/cv.mjs';

test('copyCv copies a PDF and rejects anything else', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'cv-'));
  const good = join(dir, 'good.pdf');
  writeFileSync(good, '%PDF-1.7\n%%EOF\n');
  const bad = join(dir, 'bad.pdf');
  writeFileSync(bad, 'hello');
  const dest = join(dir, 'out', 'cv.pdf');
  await copyCv(good, dest);
  expect(readFileSync(dest, 'utf8')).toBe('%PDF-1.7\n%%EOF\n');
  await expect(copyCv(bad, dest)).rejects.toThrow('is not a PDF');
  await expect(copyCv(join(dir, 'missing.pdf'), dest)).rejects.toThrow('No file at');
});
