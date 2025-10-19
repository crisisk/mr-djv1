// test/cloudflare-setup.test.js
const { CloudflareSetup, validateConfig } = require('../cloudflare-setup');
const assert = require('assert');

describe('CloudflareSetup', () => {
    let cdnSetup;

    before(() => {
        cdnSetup = new CloudflareSetup('test-token', 'test-zone');
    });

    it('should initialize with valid credentials', () => {
        assert(cdnSetup instanceof CloudflareSetup);
    });

    it('should throw error with invalid credentials', () => {
        assert.throws(() => {
            new CloudflareSetup();
        }, Error);
    });

    it('should validate configuration correctly', () => {
        const validConfig = {
            apiToken: 'token',
            zoneId: 'zone',
            domain: 'example.com'
        };

        assert.doesNotThrow(() => {
            validateConfig(validConfig);
        });
    });

    // Add more tests as needed
});
