# Network Routing Fix - October 16, 2025

## Problem
Website was returning 404/504 errors when accessing https://staging.sevensa.nl/

## Root Cause
Traefik and the frontend container were on **different Docker networks**, preventing communication:
- **mr-dj-traefik** was only on: `mr-dj_mr-dj-network` and `traefik-network`
- **mr-dj-eds-frontend** was only on: `web`

This caused Traefik to be unable to proxy requests to the frontend container.

## Solution Applied
Connected Traefik to the `web` network:
```bash
docker network connect web mr-dj-traefik
```

## Verification
All pages now return HTTP 200:
- https://staging.sevensa.nl/ ✅
- https://staging.sevensa.nl/dj-in-eindhoven ✅
- https://staging.sevensa.nl/bruiloft-dj-eindhoven ✅

## Current Network Configuration
```bash
# mr-dj-traefik is now on 3 networks:
- mr-dj_mr-dj-network
- traefik-network
- web (ADDED)

# mr-dj-eds-frontend is on:
- web
```

## Making This Fix Permanent
**IMPORTANT**: The manual `docker network connect` command is not persistent. If the mr-dj-traefik container is recreated, it will lose the `web` network connection.

### Option 1: Update Traefik Docker Compose
If mr-dj-traefik has its own docker compose file, add the `web` network to it:
```yaml
services:
  mr-dj-traefik:
    networks:
      - mr-dj_mr-dj-network
      - traefik-network
      - web  # ADD THIS

networks:
  mr-dj_mr-dj-network:
    external: true
  traefik-network:
    external: true
  web:  # ADD THIS
    external: true
```

### Option 2: Document Manual Connection
Add to deployment/restart procedures:
```bash
# After starting containers, ensure Traefik is on web network:
docker network connect web mr-dj-traefik 2>/dev/null || true
```

## Related Files
- `/opt/mr-dj/docker-compose.yml` - Frontend/backend service definitions
- Frontend uses `web` network (external: true)
- Backend uses `web` network (external: true)

## Date Fixed
October 16, 2025 05:19 UTC
