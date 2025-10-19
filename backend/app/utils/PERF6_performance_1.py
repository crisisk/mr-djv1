// compression.test.js
const request = require('supertest');
const express = require('express');
const { setupCompressionMiddleware, compressData } = require('./compression-middleware');

describe('Compression Middleware', () => {
    let app;

    beforeEach(() => {
        app = express();
        setupCompressionMiddleware(app);
    });

    test('should compress responses with Brotli when supported', async () => {
        app.get('/test', (req, res) => {
            res.send('A'.repeat(10000));
        });

        const response = await request(app)
            .get('/test')
            .set('Accept-Encoding', 'br')
            .expect(200);

        expect(response.headers['content-encoding']).toBe('br');
        expect(response.body.length).toBeLessThan(10000);
    });

    test('should fall back to gzip when Brotli is not supported', async () => {
        app.get('/test', (req, res) => {
            res.send('A'.repeat(10000));
        });

        const response = await request(app)
            .get('/test')
            .set('Accept-Encoding', 'gzip')
            .expect(200);

        expect(response.headers['content-encoding']).toBe('gzip');
        expect(response.body.length).toBeLessThan(10000);
    });

    test('should not compress small responses', async () => {
        app.get('/test', (req, res) => {
            res.send('Small response');
        });

        const response = await request(app)
            .get('/test')
            .set('Accept-Encoding', 'br,gzip')
            .expect(200);

        expect(response.headers['content-encoding']).toBeUndefined();
    });

    test('should not compress excluded MIME types', async () => {
        app.get('/test', (req, res) => {
            res.set('Content-Type', 'image/jpeg');
            res.send(Buffer.alloc(10000));
        });

        const response = await request(app)
            .get('/test')
            .set('Accept-Encoding', 'br,gzip')
            .expect(200);

        expect(response.headers['content-encoding']).toBeUndefined();
    });
});

describe('compressData utility', () => {
    test('should compress data with Brotli', async () => {
        const original = 'A'.repeat(10000);
        const compressed = await compressData(original, 'br');
        expect(compressed.length).toBeLessThan(original.length);
    });

    test('should compress data with gzip', async () => {
        const original = 'A'.repeat(10000);
        const compressed = await compressData(original, 'gzip');
        expect(compressed.length).toBeLessThan(original.length);
    });

    test('should reject invalid compression method', async () => {
        await expect(compressData('test', 'invalid'))
            .rejects.toThrow('Unsupported compression method');
    });
});
