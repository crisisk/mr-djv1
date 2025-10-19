// src/services/albumArtService.ts
import { ImageOptimizer } from '../utils/imageOptimizer';
import path from 'path';
import fs from 'fs/promises';

interface AlbumArtwork {
  original: string;
  webp: string;
  thumbnail: string;
  sizes: {
    width: number;
    url: string;
  }[];
}

export class AlbumArtService {
  private uploadDir: string;
  private outputDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.outputDir = path.join(process.cwd(), 'public', 'images', 'albums');
  }

  /**
   * Process album artwork and generate optimized versions
   * @param filename - Original uploaded file name
   */
  async processAlbumArt(filename: string): Promise<AlbumArtwork> {
    try {
      // Ensure directories exist
      await fs.mkdir(this.outputDir, { recursive: true });

      const inputPath = path.join(this.uploadDir, filename);
      const fileBase = path.parse(filename).name;

      // Generate WebP version
      const webpVersion = await ImageOptimizer.optimize(inputPath, {
        format: 'webp',
        quality: 90
      });

      // Generate thumbnail
      const thumbnail = await ImageOptimizer.optimize(inputPath, {
        width: 200,
        height: 200,
        format: 'webp',
        quality: 80
      });

      // Generate responsive sizes
      const responsiveSizes = await ImageOptimizer.generateResponsiveSizes(inputPath);

      // Save all versions
      const webpPath = path.join(this.outputDir, `${fileBase}.webp`);
      const thumbnailPath = path.join(this.outputDir, `${fileBase}-thumb.webp`);

      await Promise.all([
        fs.writeFile(webpPath, webpVersion.buffer),
        fs.writeFile(thumbnailPath, thumbnail.buffer),
        ...Array.from(responsiveSizes.entries()).map(([width, image]) => {
          const sizePath = path.join(this.outputDir, `${fileBase}-${width}.webp`);
          return fs.writeFile(sizePath, image.buffer);
        })
      ]);

      // Create response object
      return {
        original: `/images/albums/${filename}`,
        webp: `/images/albums/${fileBase}.webp`,
        thumbnail: `/images/albums/${fileBase}-thumb.webp`,
        sizes: Array.from(responsiveSizes.keys()).map(width => ({
          width,
          url: `/images/albums/${fileBase}-${width}.webp`
        }))
      };
    } catch (error) {
      throw new Error(`Album art processing failed: ${error.message}`);
    }
  }
}
