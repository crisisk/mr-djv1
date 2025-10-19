// compression-middleware.js
const compression = require('compression');
const shrinkRay = require('shrink-ray-current'); // For Brotli support
const zlib = require('zlib');

/**
 * Configuration for compression thresholds and options
 */
const COMPRESSION_CONFIG = {
    // Only compress responses larger than 1KB
    threshold: 1024,
    // Compression level (1-9, where 9 is maximum compression)
    level: 6,
    // Cache compression results
    cache: true,
    // Don't compress these MIME types
    excludedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'audio/mpeg',
        'video/mp4'
    ]
};

/**
 * Custom compression middleware that chooses the best compression method
 * based on client support and response content
 */
function setupCompressionMiddleware(app) {
    // Setup Brotli and Gzip compression
    app.use(shrinkRay({
        ...COMPRESSION_CONFIG,
        filter: shouldCompress
    }));

    // Fallback to gzip for clients that don't support Brotli
    app.use(compression({
        ...COMPRESSION_CONFIG,
        filter: shouldCompress
    }));
}

/**
 * Determines whether a response should be compressed
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Boolean} - Whether the response should be compressed
 */
function shouldCompress(req, res) {
    // Don't compress if client sent 'x-no-compression' header
    if (req.headers['x-no-compression']) {
        return false;
    }

    // Don't compress if response is already compressed
    if (res.getHeader('Content-Encoding')) {
        return false;
    }

    // Check content type against excluded types
    const contentType = res.getHeader('Content-Type');
    if (contentType && COMPRESSION_CONFIG.excludedMimeTypes.some(type => 
        contentType.includes(type))) {
        return false;
    }

    return true;
}

/**
 * Utility function to compress data manually
 * @param {Buffer|String} data - Data to compress
 * @param {String} method - Compression method ('gzip' or 'br')
 * @returns {Promise<Buffer>} - Compressed data
 */
async function compressData(data, method = 'br') {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        
        if (method === 'br') {
            zlib.brotliCompress(buffer, {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: COMPRESSION_CONFIG.level
                }
            }, (err, compressed) => {
                if (err) reject(err);
                else resolve(compressed);
            });
        } else if (method === 'gzip') {
            zlib.gzip(buffer, { level: COMPRESSION_CONFIG.level }, (err, compressed) => {
                if (err) reject(err);
                else resolve(compressed);
            });
        } else {
            reject(new Error('Unsupported compression method'));
        }
    });
}

// Usage example and benchmarking
async function benchmark() {
    const testData = Buffer.alloc(1000000).fill('A'); // 1MB of data
    console.log('Original size:', testData.length);

    console.time('Brotli Compression');
    const brotliCompressed = await compressData(testData, 'br');
    console.timeEnd('Brotli Compression');
    console.log('Brotli compressed size:', brotliCompressed.length);

    console.time('Gzip Compression');
    const gzipCompressed = await compressData(testData, 'gzip');
    console.timeEnd('Gzip Compression');
    console.log('Gzip compressed size:', gzipCompressed.length);
}

// Example Express application usage
const express = require('express');
const app = express();

// Apply compression middleware
setupCompressionMiddleware(app);

// Example route
app.get('/api/data', (req, res) => {
    const largeData = {
        items: Array(10000).fill({ id: 1, name: 'Test' })
    };
    res.json(largeData);
});

module.exports = {
    setupCompressionMiddleware,
    compressData,
    benchmark
};

// Run benchmark if called directly
if (require.main === module) {
    benchmark().catch(console.error);
}
