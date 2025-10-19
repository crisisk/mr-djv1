// src/utils/imageOptimizer.ts
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

interface OptimizationOptions {
  quality?: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill';
  format?: 'webp' | 'jpeg' | 'png';
}

interface OptimizedImage {
  buffer: Buffer;
  info: sharp.OutputInfo;
  format: string;
}

export class ImageOptimizer {
  /**
   * Optimizes a single image with the given options
   * @param input - Buffer or file path of the input image
   * @param options - Optimization options
   */
  static async optimize(
    input: Buffer | string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImage> {
    try {
      const {
        quality = 80,
        width,
        height,
        fit = 'cover',
        format = 'webp'
      } = options;

      let imageBuffer: Buffer;
      
      // Handle input as path or buffer
      if (typeof input === 'string') {
        imageBuffer = await fs.readFile(input);
      } else {
        imageBuffer = input;
      }

      // Process image with Sharp
      let sharpInstance = sharp(imageBuffer);

      // Resize if dimensions provided
      if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, { fit });
      }

      // Convert to desired format
      switch (format) {
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality });
          break;
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality });
          break;
        case 'png':
          sharpInstance = sharpInstance.png({ quality });
          break;
      }

      const [buffer, info] = await Promise.all([
        sharpInstance.toBuffer(),
        sharpInstance.toBuffer({ resolveWithObject: true })
      ]);

      return {
        buffer,
        info: info.info,
        format
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error.message}`);
    }
  }

  /**
   * Generates multiple sizes of an image for responsive design
   * @param input - Buffer or file path of the input image
   * @param sizes - Array of widths to generate
   */
  static async generateResponsiveSizes(
    input: Buffer | string,
    sizes: number[] = [320, 640, 1024, 1920]
  ): Promise<Map<number, OptimizedImage>> {
    try {
      const results = new Map<number, OptimizedImage>();

      await Promise.all(
        sizes.map(async (width) => {
          const optimized = await this.optimize(input, { width });
          results.set(width, optimized);
        })
      );

      return results;
    } catch (error) {
      throw new Error(`Responsive image generation failed: ${error.message}`);
    }
  }
}
