# RentGuy API Integratie voor Mr. DJ Website

**Status:** ✅ Production Ready
**Laatste Update:** 21 oktober 2025
**Deployment:** https://mr-dj.sevensa.nl/eds/

---

## Overzicht

De Mr. DJ marketing website integreert met het RentGuy CRM platform voor lead capture en booking management. RentGuy fungeert als **single source of truth** voor alle klantgegevens en communicatie.

### Architectuur

```
┌─────────────────────────────────────┐
│  mr-dj.sevensa.nl (Marketing Site)  │
│  ├─ React 19 + Vite 6 Components    │
│  ├─ Tailwind CSS v4                 │
│  └─ Radix UI Components             │
└──────────────┬──────────────────────┘
               │ HTTPS POST /api/v1/leads
               ▼
┌─────────────────────────────────────┐
│  mr-dj.rentguy.nl (CRM Platform)    │
│  ├─ FastAPI Backend (Python)        │
│  ├─ PostgreSQL Database             │
│  ├─ Redis Cache & Queues            │
│  └─ Email Templates (Jinja2)        │
└─────────────────────────────────────┘
```

---

## API Endpoint

### Lead Submission

**Endpoint:** `POST /api/v1/leads`
**URL:** `https://mr-dj.rentguy.nl/api/v1/leads`
**Authentication:** None (public endpoint)
**Rate Limiting:** Recommended in production
**Content-Type:** `application/json`

#### Headers

| Header | Required | Default | Beschrijving |
|--------|----------|---------|--------------|
| `Content-Type` | ✅ | - | Must be `application/json` |
| `X-RentGuy-Workspace` | ❌ | `mr-dj` | Multi-tenant workspace identifier |

#### Request Body

```json
{
  "leadId": "unique-external-id",
  "status": "new",
  "eventType": "bruiloft",
  "eventDate": "2025-08-15T14:00:00Z",
  "packageId": "premium-dj-package",
  "message": "Wij zoeken een DJ voor onze bruiloft...",
  "source": "mister-dj-website",
  "contact": {
    "name": "Jan en Marie Jansen",
    "email": "jan@example.nl",
    "phone": "+31612345678"
  },
  "persisted": false
}
```

#### Field Descriptions

| Field | Type | Required | Beschrijving |
|-------|------|----------|--------------|
| `leadId` | string | ✅ | Unique external ID for deduplication |
| `status` | string | ❌ | Lead status: `new`, `contacted`, `qualified` (default: `new`) |
| `eventType` | string | ❌ | Event type: `bruiloft`, `feest`, `bedrijfsevenement`, etc. |
| `eventDate` | string | ❌ | Event date in ISO 8601 format |
| `packageId` | string | ❌ | Requested package/service ID |
| `message` | string | ❌ | Lead message or notes |
| `source` | string | ✅ | Source identifier (e.g., `mister-dj-website-eds`) |
| `contact.name` | string | ✅ | Full name of contact person |
| `contact.email` | string | ✅ | Email address |
| `contact.phone` | string | ❌ | Phone number |
| `persisted` | boolean | ❌ | Whether lead was persisted in source system (default: `false`) |

#### Response

**Success (201 Created):**

```json
{
  "success": true,
  "leadId": 1,
  "externalId": "unique-external-id",
  "status": "new",
  "message": "Lead created successfully from mister-dj-website",
  "emailSent": false
}
```

**Duplicate (201 Created):**

```json
{
  "success": true,
  "leadId": 1,
  "externalId": "unique-external-id",
  "status": "new",
  "message": "Lead already exists - no duplicate created",
  "emailSent": false
}
```

**Error (400/500):**

```json
{
  "detail": "Error message here"
}
```

---

## Implementatie Voorbeelden

### JavaScript/TypeScript (React)

```typescript
interface LeadSubmission {
  leadId: string;
  eventType?: string;
  eventDate?: string;
  source: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  message?: string;
}

async function submitLead(data: LeadSubmission): Promise<void> {
  const response = await fetch('https://mr-dj.rentguy.nl/api/v1/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RentGuy-Workspace': 'mr-dj',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API error: ${error.detail || 'Unknown error'}`);
  }

  const result = await response.json();
  console.log('Lead created:', result.leadId);
  return result;
}

// Usage in React component
const handleSubmit = async (formData) => {
  try {
    await submitLead({
      leadId: `web-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: 'mister-dj-website-eds',
      eventType: formData.eventType,
      eventDate: formData.eventDate?.toISOString(),
      contact: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      message: formData.message,
    });

    // Show success message
    toast.success('Aanvraag verstuurd! We nemen binnen 24 uur contact op.');
  } catch (error) {
    toast.error('Er ging iets mis. Probeer het opnieuw.');
  }
};
```

### cURL (Testing)

```bash
curl -X POST https://mr-dj.rentguy.nl/api/v1/leads \
  -H "Content-Type: application/json" \
  -H "X-RentGuy-Workspace: mr-dj" \
  -d '{
    "leadId": "test-'$(date +%s)'",
    "eventType": "bruiloft",
    "eventDate": "2025-08-15T14:00:00Z",
    "source": "manual-test",
    "contact": {
      "name": "Test Gebruiker",
      "email": "test@example.nl",
      "phone": "+31612345678"
    },
    "message": "Dit is een test lead"
  }'
```

---

## Features

### ✅ Deduplication

Leads worden gededupliceerd op basis van `leadId`. Als een lead met hetzelfde `leadId` al bestaat, wordt geen duplicate aangemaakt en wordt de bestaande lead geretourneerd.

### ✅ Email Notifications

Wanneer een nieuwe lead wordt aangemaakt, wordt automatisch een email notificatie verstuurd naar:
- **Recipient:** `info@rentguy.nl`
- **Template:** Jinja2 template uit RentGuy CRM
- **Bevat:** Alle lead details + directe link naar CRM

**Let op:** `emailSent: false` betekent dat email nog niet is verstuurd (in development mode of SMTP niet geconfigureerd).

### ✅ Auto-Responder (Optioneel)

Als automation module is ingeschakeld, ontvangt de klant automatisch een bevestigingsmail.

### ✅ Lead Assignment (Optioneel)

Leads kunnen automatisch worden toegewezen aan sales reps op basis van:
- Event type
- Locatie
- Beschikbaarheid
- Workload balancing

---

## Deployment Status

### Frontend: https://mr-dj.sevensa.nl/eds/

- ✅ React 19 components gebuild (612 KB)
- ✅ Deployed in Docker container
- ✅ HTTPS via Traefik + Let's Encrypt
- ✅ Security headers configured
- ✅ Gzip compression enabled

### Backend: https://mr-dj.rentguy.nl/api/

- ✅ FastAPI backend running (port 8000)
- ✅ PostgreSQL database (production)
- ✅ Redis cache & queues
- ✅ External leads endpoint active
- ✅ Multi-tenant support (mr-dj tenant)
- ⏳ Email SMTP configuration pending

---

## Volgende Stappen

1. **Email Automation Activeren**
   - Postmark API key configureren
   - Test email templates
   - Activeer auto-responder

2. **City Landing Pages Genereren**
   - 12 lokale landingspagina's (Eindhoven, Tilburg, Breda, etc.)
   - SEO optimalisatie
   - Lokale keywords

3. **CRO Personalization**
   - Keyword intent detection
   - Dynamic content rendering
   - A/B testing setup

4. **Monitoring & Analytics**
   - n8n webhook for lead tracking
   - Grafana dashboard
   - Slack notifications

---

## Troubleshooting

### Error: 405 Not Allowed

**Oorzaak:** Incorrect endpoint gebruikt
**Oplossing:** Gebruik `/api/v1/leads` in plaats van `/v1/leads`

### Error: 404 Not Found

**Oorzaak:** Verkeerde domein of path
**Oplossing:** Gebruik altijd `https://mr-dj.rentguy.nl/api/v1/leads`

### Error: CORS blocked

**Oorzaak:** Frontend draait op verkeerd domein
**Oplossing:** Voeg domein toe aan `ALLOWED_ORIGINS` in backend `.env`

### emailSent: false

**Oorzaak:** SMTP niet geconfigureerd
**Oplossing:** Configureer Postmark API key in platform secrets

---

## Referenties

- **Backend Code:** `/srv/apps/RentGuy-v1/backend/app/modules/external_leads.py`
- **API Routes:** `/srv/apps/RentGuy-v1/backend/app/main.py` (regel 139)
- **Frontend Components:** `/srv/apps/mr-djv1/mr-dj-eds-components/`
- **Docker Compose:** `/srv/apps/RentGuy-v1/docker-compose.production.yml`
- **Integration Guide:** `/srv/apps/RentGuy-v1/docs/MR_DJ_INTEGRATION.md`

---

## Support

Voor vragen of problemen met de integratie:
- **Email:** info@rentguy.nl
- **CRM Dashboard:** https://mr-dj.rentguy.nl/
- **API Docs:** https://mr-dj.rentguy.nl/docs
