// Builds the site several ways before the build tests run:
//   default — Yetong's real content and public/ folder
//   market  — fixture content with every optional feature switched on, and a
//             temporary public/ copy holding placeholder PDFs (never in the repo)
//   nocv    — real content without a CV, to check that CV links disappear
//   badlink — a paper linking to a missing file; this build must fail
// Each build's output is kept in dist-test/<name>.log.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PLACEHOLDER_PDF = '%PDF-1.4\n%%EOF\n';

function build(name: string, env: Record<string, string> = {}, expectFailure = false): void {
  const result = spawnSync('npx', ['astro', 'build'], {
    encoding: 'utf8',
    env: { ...process.env, SITE_OUT_DIR: `./dist-test/${name}`, SITE_CACHE_DIR: `./node_modules/.astro-test-${name}`, ...env },
  });
  const output = `${result.stdout}\n${result.stderr}`;
  mkdirSync('dist-test', { recursive: true });
  writeFileSync(join('dist-test', `${name}.log`), output);
  const failed = result.status !== 0;
  if (failed !== expectFailure) {
    throw new Error(`The ${name} build ${failed ? 'failed' : 'should have failed but succeeded'}:\n${output}`);
  }
}

function publicCopy(): string {
  const dir = mkdtempSync(join(tmpdir(), 'site-public-'));
  if (existsSync('public')) cpSync('public', dir, { recursive: true });
  return dir;
}

export default function setup(): void {
  build('default');

  const market = publicCopy();
  mkdirSync(join(market, 'papers'), { recursive: true });
  for (const file of ['cv.pdf', 'papers/fixture-jmp.pdf', 'papers/fixture-jmp-slides.pdf']) {
    writeFileSync(join(market, file), PLACEHOLDER_PDF);
  }
  build('market', { SITE_CONTENT_DIR: './tests/fixtures/market', SITE_PUBLIC_DIR: market });

  const nocv = publicCopy();
  rmSync(join(nocv, 'cv.pdf'), { force: true });
  build('nocv', { SITE_PUBLIC_DIR: nocv });

  build('badlink', { SITE_CONTENT_DIR: './tests/fixtures/badlink', SITE_PUBLIC_DIR: publicCopy() }, true);
}
