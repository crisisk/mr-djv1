#!/bin/bash
# Daily competitor tracking for MR-DJ

set -e

SERVICES_DIR="/srv/apps/mr-djv1/services"
DATA_DIR="/srv/apps/mr-djv1/data"
LOG_DIR="/var/log/mrdj-competitor"
DB_HOST="mr-dj-postgres"
DB_NAME="mrdj_db"
DB_USER="mrdj_user"
DB_PASS="mrdj_secure_password_2025"

# Ensure directories exist
mkdir -p "$LOG_DIR" "$DATA_DIR/snapshots" "$DATA_DIR/extracts"

echo "========================================" >> "$LOG_DIR/tracking.log"
echo "$(date '+%Y-%m-%d %H:%M:%S'): Starting competitor tracking" >> "$LOG_DIR/tracking.log"

# Step 1: Run snapshotper (Playwright competitor snapshots)
echo "$(date '+%Y-%m-%d %H:%M:%S'): Running competitor snapshots..." >> "$LOG_DIR/tracking.log"
cd "$SERVICES_DIR/snapshotper"

if [ ! -d "node_modules" ]; then
  npm install --silent >> "$LOG_DIR/snapshots.log" 2>&1
fi

node index.mjs >> "$LOG_DIR/snapshots.log" 2>&1
SNAPSHOT_EXIT=$?

if [ $SNAPSHOT_EXIT -eq 0 ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S'): ✓ Snapshots completed successfully" >> "$LOG_DIR/tracking.log"
else
  echo "$(date '+%Y-%m-%d %H:%M:%S'): ✗ Snapshots failed with exit code $SNAPSHOT_EXIT" >> "$LOG_DIR/tracking.log"
fi

# Step 2: Run extractor (HTML feature extraction)
echo "$(date '+%Y-%m-%d %H:%M:%S'): Extracting competitor features..." >> "$LOG_DIR/tracking.log"
cd "$SERVICES_DIR/extractor"

if [ ! -d "node_modules" ]; then
  npm install --silent >> "$LOG_DIR/extractor.log" 2>&1
fi

node index.mjs >> "$LOG_DIR/extractor.log" 2>&1
EXTRACT_EXIT=$?

if [ $EXTRACT_EXIT -eq 0 ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S'): ✓ Feature extraction completed successfully" >> "$LOG_DIR/tracking.log"
else
  echo "$(date '+%Y-%m-%d %H:%M:%S'): ✗ Feature extraction failed with exit code $EXTRACT_EXIT" >> "$LOG_DIR/tracking.log"
fi

# Step 3: Load extracted data into database (if JSON file exists)
EXTRACT_FILE="$DATA_DIR/extracts/competitor_features.json"
if [ -f "$EXTRACT_FILE" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S'): Loading data into database..." >> "$LOG_DIR/tracking.log"

  # Use docker exec to load into database
  docker exec -i "$DB_HOST" psql -U "$DB_USER" -d "$DB_NAME" <<EOF >> "$LOG_DIR/database.log" 2>&1
-- Insert competitor features from JSON
-- Note: This is a simplified version. In production, use a proper ETL process
INSERT INTO competitor_features (ts, domain, hero_h1, has_photobooth, mentions_100pct_dansgarantie, mentions_drive_in, mentions_all_in_prices, years_experience)
SELECT
  NOW(),
  (data->>'domain')::text,
  (data->>'hero_h1')::text,
  (data->>'has_photobooth')::boolean,
  (data->>'mentions_100pct_dansgarantie')::boolean,
  (data->>'mentions_drive_in')::boolean,
  (data->>'mentions_all_in_prices')::boolean,
  (data->>'years_experience')::int
FROM json_array_elements('$(cat "$EXTRACT_FILE")'::json) AS data;
EOF

  if [ $? -eq 0 ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S'): ✓ Data loaded into database" >> "$LOG_DIR/tracking.log"
  else
    echo "$(date '+%Y-%m-%d %H:%M:%S'): ✗ Database load failed" >> "$LOG_DIR/tracking.log"
  fi
fi

# Summary
echo "$(date '+%Y-%m-%d %H:%M:%S'): Competitor tracking completed" >> "$LOG_DIR/tracking.log"
echo "" >> "$LOG_DIR/tracking.log"

# Keep logs under 10MB
find "$LOG_DIR" -name "*.log" -size +10M -exec truncate -s 5M {} \;

exit 0
