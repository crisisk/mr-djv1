import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '..', 'frontend', 'public', 'assets');

const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectFiles(fullPath);
      }
      return [fullPath];
    }),
  );
  return results.flat();
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.has(ext)) {
    return { status: 'skipped', reason: 'unsupported-format', filePath };
  }

  const tempPath = `${filePath}.tmp`;
  let pipeline = sharp(filePath);

  if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true });
  } else if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 80 });
  }

  try {
    await pipeline.toFile(tempPath);
  } catch (error) {
    await fs.rm(tempPath, { force: true });
    return { status: 'failed', reason: error.message, filePath };
  }

  const [originalStats, optimizedStats] = await Promise.all([
    fs.stat(filePath),
    fs.stat(tempPath),
  ]);

  if (optimizedStats.size < originalStats.size) {
    await fs.rename(tempPath, filePath);
    return {
      status: 'optimized',
      filePath,
      savedBytes: originalStats.size - optimizedStats.size,
    };
  }

  await fs.rm(tempPath, { force: true });
  return { status: 'skipped', reason: 'no-size-improvement', filePath };
}

(async () => {
  const files = await collectFiles(assetsDir);
  const imageFiles = files.filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log('No optimizable images found in', assetsDir);
    return;
  }

  let totalSaved = 0;
  for (const file of imageFiles) {
    const result = await optimizeImage(file);
    if (result.status === 'optimized') {
      totalSaved += result.savedBytes;
      console.log(`Optimized ${path.relative(assetsDir, file)} (-${result.savedBytes} bytes)`);
    } else if (result.status === 'failed') {
      console.warn(`Failed to optimize ${path.relative(assetsDir, file)}: ${result.reason}`);
    }
  }

  if (totalSaved > 0) {
    console.log(`Total bytes saved: ${totalSaved}`);
  } else {
    console.log('Optimization finished. No changes were made.');
  }
})();
