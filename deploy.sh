#!/bin/bash

# Mister DJ - Deployment Script voor VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Mister DJ deployment..."

# Configuration
VPS_HOST="147.93.57.40"
VPS_USER="root"
VPS_PASSWORD="J06o7EZfrU&YXBhHdsds"
DEPLOY_DIR="/opt/mr-dj"
DOMAIN="staging.sevensa.nl"

echo "📦 Creating deployment package..."
tar -czf mr-dj-deploy.tar.gz \
    docker-compose.yml \
    frontend/ \
    backend/ \
    database/ \
    nginx/ \
    docs/

echo "📤 Uploading to VPS..."
sshpass -p "$VPS_PASSWORD" scp -o StrictHostKeyChecking=no \
    mr-dj-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

echo "🔧 Deploying on VPS..."
sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no \
    ${VPS_USER}@${VPS_HOST} << 'ENDSSH'

# Stop existing containers
cd /opt/mr-dj 2>/dev/null && docker-compose down || true

# Create deployment directory
mkdir -p /opt/mr-dj
cd /opt/mr-dj

# Extract new version
tar -xzf /tmp/mr-dj-deploy.tar.gz
rm /tmp/mr-dj-deploy.tar.gz

# Create letsencrypt directory
mkdir -p letsencrypt
chmod 600 letsencrypt

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Build and start containers
echo "Building Docker images..."
docker-compose build --no-cache

echo "Starting containers..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check container status
docker-compose ps

# Show logs
echo "Recent logs:"
docker-compose logs --tail=50

echo "✅ Deployment complete!"
echo "🌐 Website should be available at: https://staging.sevensa.nl"
echo "📊 Traefik dashboard: http://traefik.staging.sevensa.nl:8080"
echo ""
echo "Useful commands:"
echo "  docker-compose logs -f          # View logs"
echo "  docker-compose ps               # Check status"
echo "  docker-compose restart          # Restart all"
echo "  docker-compose down             # Stop all"

ENDSSH

echo "✅ Deployment script completed!"
echo "🌐 Check your website at: https://staging.sevensa.nl"

# Cleanup local tar
rm -f mr-dj-deploy.tar.gz

