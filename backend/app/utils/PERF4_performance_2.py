const cdnSetup = new CloudflareSetup(
    process.env.CLOUDFLARE_API_TOKEN,
    process.env.CLOUDFLARE_ZONE_ID
);
