# Mister DJ Backend API Documentation

## Overview

The Mister DJ backend API provides endpoints for managing contacts, bookings, and packages for the DJ services website. The API is built with Node.js/Express and uses PostgreSQL for data persistence.

**Base URL:** `https://mr-dj.sevensa.nl/api`
**Version:** 1.0.0
**Environment:** Production

## Architecture

### Components

- **Backend API:** Node.js/Express running in Docker container `mr-dj-backend` on port 3000
- **Database:** PostgreSQL 15 running in Docker container `mr-dj-postgres` on port 5432
- **Frontend:** React/Vite application served via nginx in container `mr-dj-eds-frontend`
- **Proxy:** nginx routes `/api/*` requests to backend container
- **Cache:** Redis running in container `mr-dj-redis` (for future use)

### Database Connection

```
Host: mr-dj-postgres
Port: 5432
Database: mrdj_db
User: mrdj_user
Connection Pool: Max 20 connections, 30s idle timeout
```

## Authentication

Currently, the API does not require authentication for public endpoints (contact form, packages). JWT authentication is configured but not yet implemented for protected routes.

**JWT Configuration:**
- Secret: Configured via `JWT_SECRET` environment variable
- Future use: Admin endpoints for managing contacts and bookings

## CORS Configuration

**Allowed Origin:** `https://mr-dj.sevensa.nl`
**Credentials:** Enabled
**Headers:** Standard headers allowed

## API Endpoints

---

### 1. Health Check

Check the health status of the API and database connection.

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-19T11:33:11.073Z",
  "service": "mr-dj-backend",
  "version": "1.0.0",
  "database": "connected"
}
```

**Status Codes:**
- `200 OK` - Service and database are healthy
- `503 Service Unavailable` - Database connection failed

**Example:**
```bash
curl https://mr-dj.sevensa.nl/api/health
```

---

### 2. Submit Contact Form

Submit a contact inquiry from the website contact form.

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+31 6 12345678",
  "message": "Ik ben geïnteresseerd in het boeken van een DJ voor mijn bruiloft.",
  "eventType": "bruiloft",
  "eventDate": "2025-12-25"
}
```

**Field Validation:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | string | Yes | Min 2 characters |
| `email` | string | Yes | Valid email format |
| `phone` | string | No | Min 10 digits (optional) |
| `message` | string | Yes | Min 10 characters |
| `eventType` | string | Yes | One of: `bruiloft`, `bedrijfsfeest`, `verjaardag`, `jubileum`, `feest`, `anders` |
| `eventDate` | string | No | ISO 8601 date format (YYYY-MM-DD) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Bedankt voor je bericht! We nemen zo snel mogelijk contact met je op.",
  "contactId": 2
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validatie fouten",
  "errors": [
    {
      "field": "name",
      "message": "Naam moet minimaal 2 tekens bevatten"
    },
    {
      "field": "email",
      "message": "Ongeldig emailadres"
    },
    {
      "field": "eventType",
      "message": "Ongeldig type evenement"
    }
  ]
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "Er is een fout opgetreden bij het verzenden. Probeer het later opnieuw.",
  "error": "Database connection error" // Only in development mode
}
```

**Database Storage:**

Contacts are stored in the `contacts` table with the following schema:

```sql
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    message TEXT,
    event_type VARCHAR(100),
    event_date DATE,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example:**
```bash
curl -X POST https://mr-dj.sevensa.nl/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+31 6 12345678",
    "message": "Ik wil graag meer informatie over jullie DJ services.",
    "eventType": "bruiloft",
    "eventDate": "2025-12-25"
  }'
```

---

### 3. Get Packages

Retrieve all available DJ service packages.

**Endpoint:** `GET /api/packages`

**Response:**
```json
{
  "packages": [
    {
      "id": "bronze",
      "name": "Brons Pakket",
      "price": 795,
      "duration": "4 uur",
      "features": [
        "Professionele DJ",
        "Geluidssysteem",
        "Basisverlichting",
        "Muziekvoorkeuren formulier",
        "100% Dansgarantie"
      ]
    },
    {
      "id": "silver",
      "name": "Zilver Pakket",
      "price": 995,
      "duration": "5 uur",
      "features": [
        "Professionele DJ",
        "Premium geluidssysteem",
        "LED verlichting",
        "Rookmachine",
        "Muziekvoorkeuren formulier",
        "Persoonlijk intakegesprek",
        "100% Dansgarantie"
      ],
      "popular": true
    },
    {
      "id": "gold",
      "name": "Goud Pakket",
      "price": 1295,
      "duration": "6 uur",
      "features": [
        "Professionele DJ",
        "Premium geluidssysteem",
        "Moving head verlichting",
        "Rookmachine",
        "DJ booth met logo",
        "Muziekvoorkeuren formulier",
        "Persoonlijk intakegesprek",
        "Saxofonist (optioneel)",
        "100% Dansgarantie"
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Packages retrieved successfully

**Example:**
```bash
curl https://mr-dj.sevensa.nl/api/packages
```

---

### 4. Get Bookings

Retrieve bookings information (placeholder endpoint).

**Endpoint:** `GET /api/bookings`

**Response:**
```json
{
  "message": "Bookings endpoint",
  "data": []
}
```

**Status:** Not yet implemented with database integration

---

### 5. Root Endpoint

API information and available endpoints.

**Endpoint:** `GET /api/`

**Response:**
```json
{
  "message": "Mister DJ API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "bookings": "/bookings",
    "contact": "/contact",
    "packages": "/packages"
  }
}
```

---

## Frontend Integration

### API Client Service

The frontend uses a centralized API client service located at:
`/opt/mr-dj/mr-dj-eds-components/src/services/api.js`

**Configuration:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

**Usage Example:**
```javascript
import { submitContactForm } from '../../services/api';

// Submit contact form
const response = await submitContactForm({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+31 6 12345678',
  message: 'Test message',
  eventType: 'bruiloft',
  eventDate: '2025-12-25'
});
```

### Contact Form Component

Location: `/opt/mr-dj/mr-dj-eds-components/src/components/Organisms/ContactForm.jsx`

Features:
- Client-side validation before submission
- Server-side validation error handling
- Loading states during submission
- Success/error message display
- Google Analytics tracking via GTM
- Auto-hide success message after 5 seconds

---

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 400 | Bad Request | Validation errors |
| 404 | Not Found | Endpoint not found |
| 500 | Internal Server Error | Server or database error |
| 503 | Service Unavailable | Database connection failed |

---

## Database Schema

### Contacts Table

```sql
Table "public.contacts"
   Column   |            Type             | Nullable |               Default
------------+-----------------------------+----------+--------------------------------------
 id         | integer                     | not null | nextval('contacts_id_seq'::regclass)
 name       | character varying(255)      | not null |
 email      | character varying(255)      | not null |
 phone      | character varying(50)       |          |
 message    | text                        |          |
 status     | character varying(50)       |          | 'new'::character varying
 created_at | timestamp without time zone |          | CURRENT_TIMESTAMP
 event_type | character varying(100)      |          |
 event_date | date                        |          |

Indexes:
    "contacts_pkey" PRIMARY KEY, btree (id)
    "idx_contacts_status" btree (status)
```

### Other Tables

- `bookings` - For managing DJ booking requests
- `packages` - For storing package information
- `reviews` - For customer reviews and testimonials

---

## Environment Variables

### Backend Configuration

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://mrdj_user:mrdj_secure_password_2025@mr-dj-postgres:5432/mrdj_db

# Security
JWT_SECRET=mrdj_jwt_secret_key_2025_very_secure
CORS_ORIGIN_LIST=https://mr-dj.sevensa.nl
CORS_PUBLIC_ORIGINS=https://*.netlify.app,https://app.netlify.com
CSP_DIRECTIVES="connect-src 'self' https://mr-dj.sevensa.nl"
REFERRER_POLICY=strict-origin-when-cross-origin
HSTS_MAX_AGE=15552000
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=false
```

### Frontend Configuration

```bash
# API Configuration
VITE_API_URL=/api  # Uses nginx proxy
```

---

## Testing

### Health Check Test

```bash
curl -s https://mr-dj.sevensa.nl/api/health | python3 -m json.tool
```

### Contact Form Test (Success)

```bash
curl -X POST https://mr-dj.sevensa.nl/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+31 6 12345678",
    "message": "Dit is een test bericht voor het contactformulier.",
    "eventType": "bruiloft",
    "eventDate": "2025-12-25"
  }' | python3 -m json.tool
```

### Contact Form Test (Validation Errors)

```bash
curl -X POST https://mr-dj.sevensa.nl/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "X",
    "email": "invalid-email",
    "eventType": "invalid"
  }' | python3 -m json.tool
```

### Verify Data in Database

```bash
docker exec mr-dj-postgres psql -U mrdj_user -d mrdj_db \
  -c "SELECT id, name, email, event_type, event_date, status FROM contacts ORDER BY id DESC LIMIT 5;"
```

---

## Performance & Security

### Security Features

1. **Helmet.js** - Security headers (XSS, MIME sniffing, etc.)
2. **CORS** - Restricted to production domain
3. **Input Validation** - express-validator for all inputs
4. **SQL Injection Protection** - Parameterized queries with pg
5. **Rate Limiting** - To be implemented
6. **HTTPS** - Enforced in production

### Performance Features

1. **Compression** - gzip compression for responses
2. **Connection Pooling** - PostgreSQL connection pool (max 20)
3. **nginx Caching** - Static assets cached (1 year)
4. **gzip Compression** - Enabled for text assets
5. **CDN Ready** - Static assets can be served via CDN

---

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend container is running: `docker ps | grep mr-dj-backend`
   - Check backend logs: `docker logs mr-dj-backend`

2. **Database Connection Errors**
   - Check if PostgreSQL is running: `docker ps | grep mr-dj-postgres`
   - Test connection: `docker exec mr-dj-backend node -e "const pg = require('pg'); const client = new pg.Client({connectionString: process.env.DATABASE_URL}); client.connect().then(() => console.log('Connected')).catch(err => console.error(err));"`

3. **CORS Errors**
   - Verify `CORS_ORIGIN_LIST` includes every credentialed frontend domain and that `CORS_PUBLIC_ORIGINS` is set for read-only endpoints
   - Check browser console for CORS-specific error messages

4. **Validation Errors Not Showing**
   - Check network tab for actual API response
   - Verify frontend is handling error responses correctly

### Logs

```bash
# Backend logs
docker logs -f mr-dj-backend

# Frontend/nginx logs
docker logs -f mr-dj-eds-frontend

# Database logs
docker logs -f mr-dj-postgres
```

---

## Future Enhancements

1. **Email Notifications**
   - Send confirmation emails to customers
   - Send notification emails to admin

2. **Admin Dashboard**
   - JWT-protected endpoints for managing contacts
   - View, update, delete contacts
   - Booking management

3. **Rate Limiting**
   - Prevent abuse of contact form
   - Redis-based rate limiting

4. **Analytics**
   - Track form submission rates
   - Monitor API performance

5. **Booking System**
   - Complete booking flow with calendar
   - Payment integration
   - Availability checking

---

## Change Log

### Version 1.0.0 (2025-10-19)

**Added:**
- Complete contact form endpoint with validation
- Database integration with PostgreSQL
- Health check endpoint with database status
- nginx API proxy configuration
- Comprehensive error handling and validation
- CORS configuration for production
- Connection pooling for database

**Updated:**
- Database schema to include `event_type` and `event_date` columns
- Frontend API client to use proxy path `/api`
- nginx configuration to proxy API requests to backend

**Fixed:**
- Contact form now successfully saves to database
- Validation errors properly returned to frontend
- Database connection properly tested on startup

---

## Support

For issues or questions, contact the development team or check the logs for debugging information.

**Key Files:**
- Backend: `/opt/mr-dj/backend/src/server.js`
- Frontend API Client: `/opt/mr-dj/mr-dj-eds-components/src/services/api.js`
- Contact Form: `/opt/mr-dj/mr-dj-eds-components/src/components/Organisms/ContactForm.jsx`
- nginx Config: `/etc/nginx/nginx.conf` (in mr-dj-eds-frontend container)

**Docker Containers:**
- `mr-dj-backend` - Backend API (port 3000)
- `mr-dj-eds-frontend` - Frontend + nginx (port 80)
- `mr-dj-postgres` - PostgreSQL database (port 5432)
- `mr-dj-redis` - Redis cache (port 6379)
