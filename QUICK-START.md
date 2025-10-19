# Mr. DJ API - Quick Start Guide

## Test the API Immediately

### 1. Health Check
```bash
curl https://mr-dj.sevensa.nl/api/health
```

Expected response:
```json
{"status":"ok","database":"connected"}
```

### 2. Submit a Test Contact Form
```bash
curl -X POST https://mr-dj.sevensa.nl/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+31 6 12345678",
    "message": "Test message - minimum 10 characters",
    "eventType": "bruiloft",
    "eventDate": "2025-12-25"
  }'
```

Expected response:
```json
{"success":true,"message":"Bedankt voor je bericht!","contactId":3}
```

### 3. View Submitted Contacts
```bash
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT id, name, email, event_type, event_date, created_at FROM contacts ORDER BY id DESC LIMIT 5;"
```

### 4. Get Packages
```bash
curl https://mr-dj.sevensa.nl/api/packages
```

## Container Management

### Check Status
```bash
docker ps --filter "name=mr-dj"
```

### View Logs
```bash
# Backend logs
docker logs -f mr-dj-backend

# Frontend/nginx logs
docker logs -f mr-dj-eds-frontend

# Database logs
docker logs -f mr-dj-postgres
```

### Restart Services
```bash
# Restart backend
docker restart mr-dj-backend

# Restart frontend
docker restart mr-dj-eds-frontend
```

## Common Commands

### Database Queries
```bash
# View all contacts
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT * FROM contacts ORDER BY created_at DESC;"

# Count contacts by event type
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT event_type, COUNT(*) FROM contacts GROUP BY event_type;"

# View contacts by status
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT * FROM contacts WHERE status = 'new' ORDER BY created_at DESC;"
```

### Test API from Inside Container
```bash
# Test health endpoint
docker exec mr-dj-backend curl -s http://localhost:3000/health

# Test via nginx proxy
docker exec mr-dj-eds-frontend curl -s http://localhost/api/health
```

## File Locations

| Component | Path |
|-----------|------|
| Backend server | `/opt/mr-dj/backend/src/server.js` |
| API client | `/opt/mr-dj/mr-dj-eds-components/src/services/api.js` |
| Contact form | `/opt/mr-dj/mr-dj-eds-components/src/components/Organisms/ContactForm.jsx` |
| nginx config | `/etc/nginx/nginx.conf` (in mr-dj-eds-frontend container) |
| API docs | `/opt/mr-dj/API-DOCUMENTATION.md` |
| Test results | `/opt/mr-dj/INTEGRATION-TEST-RESULTS.md` |

## Valid Event Types

- `bruiloft` - Wedding
- `bedrijfsfeest` - Corporate event
- `verjaardag` - Birthday
- `jubileum` - Anniversary
- `feest` - General party
- `anders` - Other

## Environment Variables

### Backend
- `PORT=3000`
- `DATABASE_URL=postgresql://mrdj_user:password@mr-dj-postgres:5432/mrdj_db`
- `JWT_SECRET=...`
- `CORS_ORIGIN=https://mr-dj.sevensa.nl`

### Frontend
- `VITE_API_URL=/api` (uses nginx proxy)

## Troubleshooting

### API returns 502 Bad Gateway
```bash
# Check if backend is running
docker ps | grep mr-dj-backend

# Restart backend
docker restart mr-dj-backend
```

### Database connection error
```bash
# Check if PostgreSQL is running
docker ps | grep mr-dj-postgres

# Test connection
docker exec mr-dj-backend node -e "const pg=require('pg'); const c=new pg.Client({connectionString:process.env.DATABASE_URL}); c.connect().then(()=>console.log('OK')).catch(e=>console.error(e.message));"
```

### CORS error in browser
- Verify request is coming from `https://mr-dj.sevensa.nl`
- Check CORS_ORIGIN environment variable in backend

## Quick Reference

| What | Where | How |
|------|-------|-----|
| View API docs | `/opt/mr-dj/API-DOCUMENTATION.md` | `cat /opt/mr-dj/API-DOCUMENTATION.md` |
| Test health | API endpoint | `curl https://mr-dj.sevensa.nl/api/health` |
| Submit form | API endpoint | See example above |
| View contacts | Database | See database queries above |
| Check logs | Docker | `docker logs mr-dj-backend` |

## Support

For detailed documentation, see:
- **API Reference:** `/opt/mr-dj/API-DOCUMENTATION.md`
- **Test Results:** `/opt/mr-dj/INTEGRATION-TEST-RESULTS.md`

Last updated: 2025-10-19
