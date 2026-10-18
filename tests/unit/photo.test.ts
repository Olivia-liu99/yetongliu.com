import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { expect, test } from 'vitest';
import { preparePhoto } from '../../scripts/photo.mjs';

test('crops to 4:5 at 1200×1500 and strips metadata', async () => {
  const input = await sharp({ create: { width: 3801, height: 3254, channels: 3, background: '#888' } })
    .withExif({ IFD0: { Copyright: 'test' } }).jpeg().toBuffer();
  const out = join(tmpdir(), `photo-${Date.now()}.jpg`);
  expect(await preparePhoto(input, out)).toEqual({ width: 1200, height: 1500 });
  const meta = await sharp(out).metadata();
  expect([meta.width, meta.height, meta.exif]).toEqual([1200, 1500, undefined]);
});
