// Prepares the portrait used on the home page.
//
//   npm run photo -- "path/to/photo.jpg"
//
// Crops to a 4:5 portrait around the center, resizes to 1200×1500, and saves it
// as src/content/profile/photo.jpg. Camera and location details are removed.
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const DEFAULT_OUTPUT = 'src/content/profile/photo.jpg';

export async function preparePhoto(input, output) {
  const info = await sharp(input)
    .rotate()
    .resize(1200, 1500, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(output);
  return { width: info.width, height: info.height };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output = DEFAULT_OUTPUT] = process.argv.slice(2);
  if (!input) {
    console.error('Usage: npm run photo -- "path/to/photo.jpg"');
    process.exit(1);
  }
  const { width, height } = await preparePhoto(input, output);
  console.log(`Saved ${output} (${width}×${height}). Check it, then commit and push to publish it.`);
}
