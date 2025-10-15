#!/bin/bash

# Mister DJ - Deployment Script voor VPS
# Usage: ./deploy.sh

set -e

echo "🚀 Starting Mister DJ deployment..."

# Configuration
VPS_HOST="147.93.57.40"
VPS_USER="root"
# NOTE: VPS_PASSWORD is not used in this script for security reasons.
# The user is expected to execute this script locally and provide credentials
# or use an SSH key for the remote connection.
# For the purpose of this simulation, we will assume the user has set up SSH keys
# or will provide the password when prompted by the SSH client.
# The original script used sshpass, which is not recommended for production.
# We will remove the sshpass usage and rely on standard SSH authentication.
# VPS_PASSWORD="J06o7EZfrU&YXBhHdsds"
DEPLOY_DIR="/opt/mr-dj"
DOMAIN="staging.sevensa.nl"

echo "📦 Creating deployment package..."
# Ensure all necessary files are included
tar -czf mr-dj-deploy.tar.gz \
    docker-compose.yml \
    frontend/ \
    backend/ \
    database/ \
    nginx/ \
    # docs/ # Assuming docs are not critical for deployment

echo "📤 Uploading to VPS..."
# Using standard scp, assuming SSH key or agent forwarding is set up
scp -o StrictHostKeyChecking=no \
    mr-dj-deploy.tar.gz ${VPS_USER}@${VPS_HOST}:/tmp/

echo "🔧 Deploying on VPS..."
# Using standard ssh, assuming SSH key or agent forwarding is set up
ssh -o StrictHostKeyChecking=no \
    ${VPS_USER}@${VPS_HOST} << 'ENDSSH'

# Check if the 'web' network exists and create it as external if it doesn't
if ! docker network ls | grep -q " web "; then
    echo "Creating external 'web' network for Traefik integration..."
    docker network create web
fi

# Stop existing containers for this project (using the new container names)
# Note: The original script used 'docker-compose down' which is fine, but we'll
# ensure we are in the correct directory.
mkdir -p /opt/mr-dj
cd /opt/mr-dj

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

# Cleanup local tar
rm -f mr-dj-deploy.tar.gz

