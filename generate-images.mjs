/**
 * Image Generation Script using Replicate API
 * Generates all missing media assets for Mr. DJ website
 */

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPLICATE_API_KEY = 'r8_F37uDRCZQ92lMBuJKJ5b5EM0xHH9vnZ2EDXMN';
const REPLICATE_API_URL = 'https://api.replicate.com/v1';
const OUTPUT_DIR = path.join(__dirname, 'mr-dj-eds-components/public/images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Create subdirectories
['events', 'venues', 'dj-setups', 'portfolio'].forEach(dir => {
  const dirPath = path.join(OUTPUT_DIR, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

/**
 * Make Replicate API request
 */
async function replicateRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${REPLICATE_API_URL}${endpoint}`;
    const url = new URL(fullUrl);

    const body = options.body || '';

    const requestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        ...options.headers,
      },
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (!data || data.trim() === '') {
            reject(new Error('Empty response from API'));
            return;
          }
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(jsonData.detail || jsonData.error || `API Error: ${res.statusCode}`));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}\nStatus: ${res.statusCode}\nData: ${data.substring(0, 500)}`));
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

/**
 * Wait for prediction to complete
 */
async function waitForPrediction(predictionId, maxAttempts = 60) {
  for (let i = 0; i < maxAttempts; i++) {
    const prediction = await replicateRequest(`/predictions/${predictionId}`);

    console.log(`  Status: ${prediction.status}...`);

    if (prediction.status === 'succeeded') {
      return prediction.output;
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(`Prediction failed: ${prediction.error}`);
    }

    // Wait 2 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  throw new Error('Prediction timed out');
}

/**
 * Download image from URL
 */
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`  ✓ Saved to ${path.basename(filepath)}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file if download failed
      reject(err);
    });
  });
}

/**
 * Generate image using Replicate
 */
async function generateImage(prompt, filename, aspectRatio = '16:9') {
  console.log(`\nGenerating: ${filename}`);
  console.log(`Prompt: ${prompt.substring(0, 80)}...`);

  try {
    const input = {
      prompt: prompt,
      aspect_ratio: aspectRatio,
      output_format: 'webp',
      output_quality: 90,
      safety_tolerance: 2,
    };

    const prediction = await replicateRequest('/predictions', {
      method: 'POST',
      body: JSON.stringify({
        version: 'black-forest-labs/flux-1.1-pro',
        input: input,
      }),
    });

    const output = await waitForPrediction(prediction.id);

    // Output can be array or single URL
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      throw new Error('No image URL in output');
    }

    await downloadImage(imageUrl, filename);

    return filename;
  } catch (error) {
    console.error(`  ✗ Failed: ${error.message}`);
    return null;
  }
}

/**
 * Main generation function
 */
async function generateAllImages() {
  console.log('='.repeat(60));
  console.log('Mr. DJ - Image Generation Script');
  console.log('='.repeat(60));

  const images = [];

  // 1. Hero Images for Service Pages
  console.log('\n--- HERO IMAGES FOR SERVICE PAGES ---');

  images.push(await generateImage(
    'Professional elegant wedding DJ setup at a beautiful Dutch venue, romantic purple and gold lighting, turntables and mixing equipment, saxophonist silhouette in background, flower decorations, crystal chandelier, cinematic photography, 8k, ultra detailed, wedding celebration atmosphere',
    path.join(OUTPUT_DIR, 'events', 'hero-bruiloft-dj.webp')
  ));

  images.push(await generateImage(
    'Modern corporate event DJ booth at a professional business venue, sleek blue and white lighting, high-end Pioneer DJ equipment, branded backdrop with company logos, well-dressed professionals dancing, luxury conference hall, professional photography, 8k resolution',
    path.join(OUTPUT_DIR, 'events', 'hero-bedrijfsfeest-dj.webp')
  ));

  images.push(await generateImage(
    'Energetic party DJ performing at an upscale event venue in Netherlands, dynamic multicolor lighting effects, laser beams, modern DJ equipment, enthusiastic crowd dancing, confetti in air, celebration atmosphere, cinematic shot, 8k resolution, vibrant energy',
    path.join(OUTPUT_DIR, 'events', 'hero-feest-dj.webp')
  ));

  // 2. Before/After Venue Transformation Images
  console.log('\n--- BEFORE/AFTER VENUE IMAGES ---');

  images.push(await generateImage(
    'Empty elegant event venue during daytime, plain white walls, wooden floor, natural window lighting, no decorations, Netherlands interior, professional photography, clean and minimal, before event setup',
    path.join(OUTPUT_DIR, 'venues', 'venue-before.webp')
  ));

  images.push(await generateImage(
    'Same elegant event venue transformed for party, professional DJ booth with LED screens, spectacular purple and blue lighting effects, dance floor with uplighting, decorated with flowers and elegant draping, nighttime atmosphere, full transformation, professional event photography',
    path.join(OUTPUT_DIR, 'venues', 'venue-after.webp')
  ));

  // 3. DJ Setup and Equipment Photos
  console.log('\n--- DJ SETUP PHOTOS ---');

  images.push(await generateImage(
    'Professional DJ equipment setup close-up, Pioneer CDJ-3000 decks, DJM-900NXS2 mixer, laptop with DJ software, professional monitor speakers, LED uplighting, backstage view, high-end equipment, product photography style, 8k detail',
    path.join(OUTPUT_DIR, 'dj-setups', 'equipment-closeup.webp'),
    '4:3'
  ));

  images.push(await generateImage(
    'Full DJ booth setup at wedding reception, elegant white DJ facade with uplighting, turntables and equipment on top, saxophonist standing next to DJ booth with golden saxophone, romantic venue background, professional event photography',
    path.join(OUTPUT_DIR, 'dj-setups', 'dj-sax-combo.webp'),
    '16:9'
  ));

  images.push(await generateImage(
    'DJ performing live at event, view from behind the decks looking out at dancing crowd, hands on mixer controls, LED screens showing visualizations, colorful stage lighting, energetic atmosphere, concert photography style',
    path.join(OUTPUT_DIR, 'dj-setups', 'dj-performing.webp'),
    '16:9'
  ));

  // 4. Event Portfolio Images
  console.log('\n--- EVENT PORTFOLIO IMAGES ---');

  images.push(await generateImage(
    'Wedding reception dance floor from above, bride and groom dancing in center with DJ visible in background, romantic lighting, guests in circle around couple, Dutch wedding celebration, aerial view, professional wedding photography',
    path.join(OUTPUT_DIR, 'portfolio', 'wedding-dance-floor.webp'),
    '4:3'
  ));

  images.push(await generateImage(
    'Corporate event networking session, business professionals mingling with drinks, DJ booth in background with blue corporate lighting, modern conference venue, professional atmosphere, event photography',
    path.join(OUTPUT_DIR, 'portfolio', 'corporate-networking.webp'),
    '4:3'
  ));

  images.push(await generateImage(
    'Birthday party celebration with colorful confetti falling, diverse group of people dancing and celebrating, DJ visible with multicolor lighting, balloons and decorations, energetic party atmosphere, celebration photography',
    path.join(OUTPUT_DIR, 'portfolio', 'birthday-celebration.webp'),
    '4:3'
  ));

  images.push(await generateImage(
    'Live saxophonist performing on stage with DJ, golden saxophone gleaming under spotlight, crowd dancing in background, smoke effects, concert lighting, energetic performance, professional music photography',
    path.join(OUTPUT_DIR, 'portfolio', 'saxophone-performance.webp'),
    '4:3'
  ));

  images.push(await generateImage(
    'Outdoor summer evening party, DJ setup under tent with string lights, people dancing on grass, sunset colors in sky, garden party atmosphere, Netherlands outdoor venue, lifestyle photography',
    path.join(OUTPUT_DIR, 'portfolio', 'outdoor-summer-party.webp'),
    '16:9'
  ));

  images.push(await generateImage(
    'Elegant gala dinner with DJ booth, round tables with white tablecloths and centerpieces, uplighting on walls, guests in formal attire, upscale event venue, professional event photography',
    path.join(OUTPUT_DIR, 'portfolio', 'gala-dinner-event.webp'),
    '16:9'
  ));

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('GENERATION COMPLETE');
  console.log('='.repeat(60));

  const successful = images.filter(img => img !== null).length;
  const failed = images.filter(img => img === null).length;

  console.log(`✓ Successfully generated: ${successful} images`);
  if (failed > 0) {
    console.log(`✗ Failed: ${failed} images`);
  }
  console.log(`\nImages saved to: ${OUTPUT_DIR}`);

  // Create manifest
  const manifest = {
    generated: new Date().toISOString(),
    images: images.filter(img => img !== null).map(img => path.relative(OUTPUT_DIR, img)),
    total: successful,
  };

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\nManifest created: manifest.json');
}

// Run the script
generateAllImages().catch(error => {
  console.error('\nFATAL ERROR:', error.message);
  process.exit(1);
});
