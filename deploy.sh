#!/bin/bash

# Mister DJ - Deployment Script voor VPS
# Usage: ./deploy.sh
# Redeploy instructions:
#   1. Make your code changes locally and commit them if desired.
#   2. From the project root, run ./deploy.sh to build, package, and upload the latest version.
#   3. The script recreates containers on the VPS using docker-compose up -d, so the new build
#      is live once the health checks pass. For a quick remote redeploy, SSH into the VPS and run
#      "docker-compose pull && docker-compose up -d" inside /opt/mr-dj.

set -euo pipefail
IFS=$'\n\t'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting Mister DJ deployment..."

# Configuration
VPS_HOST="147.93.57.40"
VPS_USER="root"
DEPLOY_DIR="/opt/mr-dj"
DOMAIN="staging.sevensa.nl"
PACKAGE_NAME="mr-dj-deploy.tar.gz"

command -v ssh >/dev/null 2>&1 || { echo "❌ ssh command not found"; exit 1; }
command -v scp >/dev/null 2>&1 || { echo "❌ scp command not found"; exit 1; }

echo "🧪 Running local verification steps..."
pushd "$ROOT_DIR/backend" >/dev/null
echo "📦 Installing backend dependencies (if needed)..."
npm install --no-audit --progress=false
echo "🧪 Executing backend test suite..."
npm test -- --runInBand
popd >/dev/null

echo "🧹 Preparing clean deployment artifact..."
rm -f "$ROOT_DIR/$PACKAGE_NAME"

tar -czf "$ROOT_DIR/$PACKAGE_NAME" \
    --exclude='backend/node_modules' \
    --exclude='backend/.env' \
    --exclude='backend/.env.*' \
    -C "$ROOT_DIR" \
    docker-compose.yml \
    frontend \
    backend \
    database

echo "📤 Uploading to VPS..."
scp -o StrictHostKeyChecking=no \
    "$ROOT_DIR/$PACKAGE_NAME" ${VPS_USER}@${VPS_HOST}:/tmp/

echo "🔧 Deploying on VPS..."
ssh -o StrictHostKeyChecking=no \
    ${VPS_USER}@${VPS_HOST} << 'ENDSSH'

# Check if the 'web' network exists and create it as external if it doesn't
if ! docker network inspect web >/dev/null 2>&1; then
    echo "Creating external 'web' network for Traefik integration..."
    # Use an attachable bridge so Traefik and compose-managed services can share the network.
    if ! docker network create --driver bridge --attachable web; then
        echo "❌ Failed to create 'web' network. Aborting deployment." >&2
        exit 1
    fi
fi

# Stop existing containers for this project (using the new container names)
DEPLOY_DIR="/opt/mr-dj"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Stop and remove old containers if they exist, to prevent conflicts
# The original script's 'docker-compose down' is sufficient if the project name is unique.
# Since we are using unique container names, a simple down/up is fine.
docker-compose down || true

# Extract new version
tar -xzf /tmp/mr-dj-deploy.tar.gz
rm /tmp/mr-dj-deploy.tar.gz

# Create letsencrypt directory (if Traefik is managed by this compose file, which it is not anymore)
# This step is likely vestigial since the main Traefik instance manages this.
# However, it doesn't hurt to keep the directory creation for local volumes.
mkdir -p letsencrypt
chmod 600 letsencrypt

# Build and start containers
echo "Building Docker images..."
# Skipping cache for a fresh build, as is common in deployment scripts
docker-compose build --no-cache

echo "Starting containers..."
# Use -d for detached mode
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Ensure database migrations are up to date
echo "Running database migrations..."
docker-compose exec -T mr-dj-backend npm run migrate

# Check container status
echo "Container Status:"
docker-compose ps

# Show logs for the frontend service (eds-frontend)
echo "Recent logs for eds-frontend:"
docker-compose logs eds-frontend --tail=50

echo "✅ Deployment complete!"
echo "🌐 Website should be available at: https://staging.sevensa.nl/eds"
echo ""
echo "Useful commands (inside /opt/mr-dj on VPS):"
echo "  docker-compose logs -f eds-frontend # View frontend logs"
echo "  docker-compose ps                   # Check status"
echo "  docker-compose restart eds-frontend # Restart frontend"
echo "  docker-compose down                 # Stop all services"

ENDSSH

echo "✅ Deployment script completed!"
echo "🌐 Check your website at: https://staging.sevensa.nl/eds"
echo "📊 Post-deploy: Import docs/observability/grafana.json into Grafana via Dashboards → New → Import."

# Cleanup local tar
rm -f "$ROOT_DIR/$PACKAGE_NAME"

