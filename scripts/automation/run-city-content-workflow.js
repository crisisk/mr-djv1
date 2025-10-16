#!/usr/bin/env node
/* eslint-disable no-console */
const automation = require('../../backend/src/services/cityContentAutomationService');

async function main() {
  const args = process.argv.slice(2);
  const options = {};

  args.forEach((arg) => {
    const [key, value] = arg.split('=');
    if (key === '--limit') {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) {
        options.limit = parsed;
      }
    }
    if (key === '--dry-run') {
      options.dryRun = value !== 'false';
    }
  });

  try {
    const result = await automation.runWorkflow(options);
    console.log('\n✅ City content workflow voltooid');
    console.log(`- Keywords verwerkt: ${result.processed}`);
    console.log(`- Nieuwe steden: ${result.approved.length}`);
    console.log(`- Naar review: ${result.flagged.length}`);
    console.log(`- Overgeslagen (bestonden al): ${result.skipped}`);
    if (result.generator) {
      console.log(`- Static build: ${result.generator.success ? 'geslaagd' : 'mislukt'}`);
    }
  } catch (error) {
    console.error('❌ Workflow mislukt:', error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
