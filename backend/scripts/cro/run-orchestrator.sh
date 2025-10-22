#!/bin/bash
#
# Mr. DJ - CRO Orchestrator Cron Job
# Runs hourly to manage A/B tests and optimize conversions
#

set -e

# Configuration
BACKEND_CONTAINER="mr-dj-backend"
LOG_DIR="/srv/apps/mr-djv1/logs/cro"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="$LOG_DIR/orchestrator-$TIMESTAMP.log"

# Create log directory
mkdir -p "$LOG_DIR"

echo "=== CRO Orchestrator Run: $(date) ===" | tee -a "$LOG_FILE"

# Run orchestrator inside backend container
docker exec "$BACKEND_CONTAINER" node -e "
const CROOrchestrator = require('./src/services/croOrchestrator');
const orchestrator = new CROOrchestrator();

async function run() {
  try {
    console.log('Starting CRO orchestration cycle...');

    // Evaluate active tests and declare winners
    await orchestrator.evaluateAndDeclareWinners();

    // Generate new test hypotheses
    await orchestrator.generateNewTests();

    // Update traffic allocation
    await orchestrator.optimizeTrafficAllocation();

    // Retrain ML model if needed
    await orchestrator.retrainMLModel();

    console.log('CRO orchestration cycle completed successfully');
  } catch (error) {
    console.error('CRO orchestration failed:', error.message);
    process.exit(1);
  }
}

run();
" 2>&1 | tee -a "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ Orchestrator completed successfully" | tee -a "$LOG_FILE"
else
  echo "⚠️ Orchestrator failed with exit code $EXIT_CODE" | tee -a "$LOG_FILE"
fi

# Clean up old logs (keep last 30 days)
find "$LOG_DIR" -name "orchestrator-*.log" -mtime +30 -delete

echo "=== End: $(date) ===" | tee -a "$LOG_FILE"

exit $EXIT_CODE
