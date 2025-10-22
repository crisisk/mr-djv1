#!/usr/bin/env node

/**
 * A/B Testing Setup Script
 *
 * This script sets up the A/B testing framework:
 * 1. Runs database migrations
 * 2. Creates sample test from configuration
 * 3. Verifies API endpoints
 * 4. Tests basic functionality
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  console.log('\n📦 Running database migrations...');

  const migrationPath = path.join(__dirname, '../migrations/create_ab_testing_tables.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('✅ Database migrations completed successfully');
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying database tables...');

  const tables = [
    'ab_tests',
    'ab_variants',
    'ab_impressions',
    'ab_conversions',
    'ab_results',
    'ab_user_assignments',
    'ab_events'
  ];

  try {
    for (const table of tables) {
      const result = await pool.query(
        `SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1
        )`,
        [table]
      );

      if (result.rows[0].exists) {
        console.log(`  ✅ ${table}`);
      } else {
        console.log(`  ❌ ${table} - NOT FOUND`);
        return false;
      }
    }

    console.log('✅ All tables verified');
    return true;
  } catch (error) {
    console.error('❌ Table verification failed:', error.message);
    return false;
  }
}

async function createSampleTest() {
  console.log('\n🧪 Creating sample test...');

  try {
    // Load example configuration
    const examplePath = path.join(__dirname, '../../../content/ab-tests/example-hero-test.json');

    if (!fs.existsSync(examplePath)) {
      console.log('⚠️  Example configuration not found, skipping sample test creation');
      return true;
    }

    const config = JSON.parse(fs.readFileSync(examplePath, 'utf8'));

    // Check if test already exists
    const existing = await pool.query(
      'SELECT test_id FROM ab_tests WHERE test_id = $1',
      [config.testId]
    );

    if (existing.rows.length > 0) {
      console.log(`⚠️  Test ${config.testId} already exists, skipping`);
      return true;
    }

    // Create test
    await pool.query(
      `INSERT INTO ab_tests (
        test_id, name, description, type, status, goal,
        min_sample_size, confidence_level, traffic_allocation,
        created_by, metadata
      ) VALUES ($1, $2, $3, $4, 'draft', $5, $6, $7, $8, $9, $10)`,
      [
        config.testId,
        config.name,
        config.description,
        config.type,
        config.goal,
        config.minSampleSize,
        config.confidenceLevel,
        config.trafficAllocation,
        config.metadata.created_by,
        JSON.stringify(config.metadata)
      ]
    );

    console.log(`  ✅ Created test: ${config.testId}`);

    // Create variants
    for (const variant of config.variants) {
      await pool.query(
        `INSERT INTO ab_variants (
          test_id, variant_id, name, description,
          asset_url, asset_type, config, weight, is_control
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          config.testId,
          variant.variantId,
          variant.name,
          variant.description,
          variant.assetUrl,
          variant.assetType,
          JSON.stringify(variant.config),
          variant.weight,
          variant.isControl
        ]
      );

      // Initialize results entry
      await pool.query(
        'INSERT INTO ab_results (test_id, variant_id) VALUES ($1, $2)',
        [config.testId, variant.variantId]
      );

      console.log(`  ✅ Created variant: ${variant.variantId} - ${variant.name}`);
    }

    // Log event
    await pool.query(
      `INSERT INTO ab_events (test_id, event_type, event_data, triggered_by)
       VALUES ($1, 'test_created', $2, 'setup_script')`,
      [config.testId, JSON.stringify({ automated: true })]
    );

    console.log('✅ Sample test created successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to create sample test:', error.message);
    return false;
  }
}

async function testBasicFunctionality() {
  console.log('\n🧪 Testing basic functionality...');

  try {
    const ABTestingService = require('../services/abTestingService');
    const service = new ABTestingService(pool);

    // Test: Get active tests
    const activeTests = await service.getActiveTests();
    console.log(`  ✅ Found ${activeTests.length} active test(s)`);

    // Test: Assign user to variant
    if (activeTests.length > 0) {
      const testId = activeTests[0].test_id;
      const variantId = await service.assignUserToVariant(
        testId,
        'test_user_123',
        'test_session_456'
      );
      console.log(`  ✅ User assignment works (assigned to variant: ${variantId})`);

      // Test: Track impression
      await service.trackImpression({
        testId,
        variantId,
        userId: 'test_user_123',
        sessionId: 'test_session_456',
        userAgent: 'Test Script',
        ipAddress: '127.0.0.1',
        pageUrl: 'http://localhost:3000/',
        deviceType: 'desktop',
        browser: 'Node.js'
      });
      console.log('  ✅ Impression tracking works');

      // Test: Track conversion
      await service.trackConversion({
        testId,
        variantId,
        userId: 'test_user_123',
        sessionId: 'test_session_456',
        conversionType: 'test_conversion',
        userAgent: 'Test Script',
        ipAddress: '127.0.0.1',
        pageUrl: 'http://localhost:3000/'
      });
      console.log('  ✅ Conversion tracking works');

      // Test: Get results
      await service.updateResults(testId, variantId);
      const results = await service.getTestResults(testId);
      console.log('  ✅ Results calculation works');
    }

    console.log('✅ All functionality tests passed');
    return true;
  } catch (error) {
    console.error('❌ Functionality test failed:', error.message);
    console.error(error.stack);
    return false;
  }
}

async function displaySummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 A/B TESTING FRAMEWORK SETUP SUMMARY');
  console.log('='.repeat(60));

  try {
    const testsResult = await pool.query('SELECT COUNT(*) FROM ab_tests');
    const variantsResult = await pool.query('SELECT COUNT(*) FROM ab_variants');
    const impressionsResult = await pool.query('SELECT COUNT(*) FROM ab_impressions');
    const conversionsResult = await pool.query('SELECT COUNT(*) FROM ab_conversions');

    console.log(`\nDatabase Status:`);
    console.log(`  Tests: ${testsResult.rows[0].count}`);
    console.log(`  Variants: ${variantsResult.rows[0].count}`);
    console.log(`  Impressions: ${impressionsResult.rows[0].count}`);
    console.log(`  Conversions: ${conversionsResult.rows[0].count}`);

    console.log(`\nAPI Endpoints:`);
    console.log(`  GET  /api/ab-tests/active           - Get active tests`);
    console.log(`  GET  /api/ab-tests/:id              - Get test details`);
    console.log(`  GET  /api/ab-tests/:id/assign       - Assign variant`);
    console.log(`  POST /api/ab-tests/impression       - Track impression`);
    console.log(`  POST /api/ab-tests/conversion       - Track conversion`);
    console.log(`  GET  /api/ab-tests/:id/results      - Get results`);

    console.log(`\nFrontend Usage:`);
    console.log(`  import { useABTest } from '../hooks/useABTest';`);
    console.log(`  const { variant, trackConversion } = useABTest('test-id');`);

    console.log(`\nDocumentation:`);
    console.log(`  📖 /docs/AB-TESTING-CONFIGURATION.md`);

    console.log(`\nNext Steps:`);
    console.log(`  1. Configure environment variables (GA4_MEASUREMENT_ID, GA4_API_SECRET)`);
    console.log(`  2. Register API routes in /backend/src/routes/index.js`);
    console.log(`  3. Create your first test or activate the sample test`);
    console.log(`  4. Integrate useABTest hook in your React components`);
    console.log(`  5. Monitor results via API or build a dashboard`);

    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('Error displaying summary:', error.message);
  }
}

async function main() {
  console.log('\n🚀 A/B Testing Framework Setup');
  console.log('=' .repeat(60));

  let success = true;

  // Step 1: Run migration
  if (!await runMigration()) {
    success = false;
  }

  // Step 2: Verify tables
  if (success && !await verifyTables()) {
    success = false;
  }

  // Step 3: Create sample test
  if (success) {
    await createSampleTest();
  }

  // Step 4: Test functionality
  if (success) {
    await testBasicFunctionality();
  }

  // Step 5: Display summary
  if (success) {
    await displaySummary();
  }

  await pool.end();

  if (success) {
    console.log('\n✅ Setup completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Setup completed with errors');
    process.exit(1);
  }
}

// Run setup
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { runMigration, verifyTables, createSampleTest };
