// Builds the site twice before the build tests run:
//   default — Yetong's real content and public/ folder
//   market  — fixture content with every optional feature switched on, and a
//             temporary public/ copy holding placeholder PDFs (never in the repo)
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PLACEHOLDER_PDF = '%PDF-1.4\n%%EOF\n';

function build(name: string, env: Record<string, string> = {}): void {
  try {
    execFileSync('npx', ['astro', 'build'], {
      stdio: 'pipe',
      env: { ...process.env, SITE_OUT_DIR: `./dist-test/${name}`, SITE_CACHE_DIR: `./node_modules/.astro-test-${name}`, ...env },
    });
  } catch (error) {
    const { stdout = '', stderr = '' } = error as { stdout?: Buffer; stderr?: Buffer };
    throw new Error(`The ${name} build failed:\n${stdout}\n${stderr}`);
  }
}

export default function setup(): void {
  build('default');

  const publicDir = mkdtempSync(join(tmpdir(), 'site-public-'));
  if (existsSync('public')) cpSync('public', publicDir, { recursive: true });
  mkdirSync(join(publicDir, 'papers'), { recursive: true });
  for (const file of ['cv.pdf', 'papers/fixture-jmp.pdf', 'papers/fixture-jmp-slides.pdf']) {
    writeFileSync(join(publicDir, file), PLACEHOLDER_PDF);
  }
  build('market', { SITE_CONTENT_DIR: './tests/fixtures/market', SITE_PUBLIC_DIR: publicDir });
}
