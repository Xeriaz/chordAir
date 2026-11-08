import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import sharp from 'sharp';

const SOURCE_DIR = path.resolve('extracted_pages');
const TARGET_DIR = path.resolve('public/book_pages');
const QUALITY = 82;
const MAX_DIMENSION = 1400;

if (!fs.existsSync(SOURCE_DIR)) {
  console.error(`Source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const files = fs.readdirSync(SOURCE_DIR)
  .filter((f) => /^page_\d{3}\.png$/i.test(f))
  .sort();

console.log(`Found ${files.length} pages to optimize from ${SOURCE_DIR}`);
console.log(`Target directory: ${TARGET_DIR}`);
console.log(`Max dimension: ${MAX_DIMENSION}px, Quality: ${QUALITY}`);

const startTime = Date.now();
const concurrency = Math.min(files.length, Math.max(2, os.cpus().length || 4));
let totalOriginalBytes = 0;
let totalOptimizedBytes = 0;
let completed = 0;

async function processFile(filename) {
  const inputPath = path.join(SOURCE_DIR, filename);
  const outFilename = filename.replace(/\.png$/i, '.webp');
  const outputPath = path.join(TARGET_DIR, outFilename);

  const stat = fs.statSync(inputPath);
  totalOriginalBytes += stat.size;

  const info = await sharp(inputPath)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality: QUALITY,
      effort: 5,
    })
    .toFile(outputPath);

  totalOptimizedBytes += info.size;
  completed++;
  
  if (completed % 25 === 0 || completed === files.length) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[${completed}/${files.length}] Processed ${outFilename} (${Math.round(info.size / 1024)} KB) - ${elapsed}s`);
  }
}

async function run() {
  const queue = [...files];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (!file) break;
      await processFile(file);
    }
  });

  await Promise.all(workers);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  const origMb = (totalOriginalBytes / (1024 * 1024)).toFixed(1);
  const optMb = (totalOptimizedBytes / (1024 * 1024)).toFixed(1);
  const ratio = ((1 - totalOptimizedBytes / totalOriginalBytes) * 100).toFixed(1);

  console.log('--- Optimization Summary ---');
  console.log(`Total Pages: ${completed}`);
  console.log(`Original Size: ${origMb} MB`);
  console.log(`Optimized Size: ${optMb} MB (${ratio}% reduction)`);
  console.log(`Average per page: ${Math.round(totalOptimizedBytes / completed / 1024)} KB`);
  console.log(`Completed in ${elapsed}s`);
}

run().catch((err) => {
  console.error('Error optimizing pages:', err);
  process.exit(1);
});
