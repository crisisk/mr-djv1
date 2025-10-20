#!/usr/bin/env node
/* eslint-disable no-console */
const surveyService = require('../../backend/src/services/surveyService');
const reviewService = require('../../backend/src/services/reviewService');

function parseArguments(argv) {
  const tokens = [];
  const ids = [];
  let dryRun = false;

  argv.forEach((arg) => {
    if (arg === '--dry-run') {
      dryRun = true;
      return;
    }

    if (arg.startsWith('--token=')) {
      const value = arg.slice('--token='.length).trim();
      if (value) {
        tokens.push(value);
      }
      return;
    }

    if (arg.startsWith('--id=')) {
      const value = arg.slice('--id='.length).trim();
      if (value) {
        ids.push(value);
      }
    }
  });

  return { tokens, ids, dryRun };
}

function printUsage() {
  console.log('\nGebruik: node scripts/automation/moderate-survey-feedback.js --token=TOKEN [--id=ID] [--dry-run]');
  console.log('Voorbeelden:');
  console.log('  --token=abc123 --token=def456');
  console.log('  --id=survey-uuid-1 --id=survey-uuid-2');
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));

    if (!options.tokens.length && !options.ids.length) {
      printUsage();
      return;
    }

    if (options.dryRun) {
      console.log('\n🔎 Dry-run: volgende tokens/IDs zouden worden goedgekeurd:');
      options.tokens.forEach((token) => console.log(` - token: ${token}`));
      options.ids.forEach((id) => console.log(` - id: ${id}`));
      return;
    }

    const result = await surveyService.approveSurveyResponses({
      tokens: options.tokens,
      ids: options.ids
    });

    if (result.updated > 0) {
      await reviewService.resetCache();
    }

    console.log('\n✅ Moderatie afgerond');
    console.log(`- Records bijgewerkt: ${result.updated}`);
    if (result.approvedTokens?.length) {
      console.log(`- Tokens: ${result.approvedTokens.join(', ')}`);
    }
    if (result.updated > 0) {
      console.log('- Reviews cache vernieuwd.');
    }
  } catch (error) {
    console.error('\n❌ Moderatie mislukt:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}
