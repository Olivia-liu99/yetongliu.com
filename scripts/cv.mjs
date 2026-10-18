// Copies your CV into the site.
//
//   npm run cv -- "/path/to/your CV.pdf"
//
// Then commit and push to publish it. The CV links on the site appear
// automatically once public/cv.pdf exists.
import { copyFile, mkdir, open } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

// The PDF of your master CV. Plain `npm run cv` copies this file; change the
// path if your CV moves.
const DEFAULT_SOURCE = '~/Library/CloudStorage/Dropbox/CV/Yetong_Liu_CV.pdf';
const DEST = 'public/cv.pdf';

export async function copyCv(source, dest = DEST) {
  let handle;
  try {
    handle = await open(source, 'r');
  } catch {
    throw new Error(`No file at ${source}`);
  }
  const start = Buffer.alloc(5);
  try {
    await handle.read(start, 0, 5, 0);
  } finally {
    await handle.close();
  }
  if (start.toString('latin1') !== '%PDF-') {
    throw new Error(`${source} is not a PDF (it doesn't start with %PDF-)`);
  }
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(source, dest);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const source = process.argv[2] ?? DEFAULT_SOURCE;
  if (!source) {
    console.error('Usage: npm run cv -- "/path/to/your CV.pdf"');
    process.exit(1);
  }
  try {
    await copyCv(source);
    console.log(`Copied ${source} → ${DEST}. Commit and push to publish it.`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
