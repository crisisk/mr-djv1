# 🎵 MR. DJ + RENTGUY INTEGRATION PLAN
## RentGuy Vervangt Invoice Ninja voor Facturatie & Business Management

**Aangemaakt:** 2025-10-21
**Status:** Planning Phase
**Prioriteit:** HIGH - Vervangt Invoice Ninja

---

## 📋 EXECUTIVE SUMMARY

**Beslissing:** RentGuy Enterprise Platform vervangt Invoice Ninja als volledige business management en facturatiesysteem voor Mr. DJ.

**Waarom RentGuy?**
- ✅ **Ingebouwde billing/invoicing** - Geen externe Invoice Ninja nodig
- ✅ **Inventory management** - Beheer DJ apparatuur, verlichting, speakers
- ✅ **Project management** - Event planning en uitvoering
- ✅ **Crew scheduling** - Planning voor DJ's, saxofonist, crew
- ✅ **Transport planning** - Logistiek voor apparatuur naar events
- ✅ **Client portal** - Klanten kunnen offertes bekijken, boeken, betalen
- ✅ **Reporting & analytics** - Business insights en KPI tracking
- ✅ **Mollie payment integration** - Nederlandse betalingsverwerking
- ✅ **Multi-tenant white-label** - Custom branding voor Mr. DJ
- ✅ **Al ontwikkeld en actief** - Bestaande codebase in /root/rentguy-new

---

## 🎯 BUSINESS USE CASE: MR. DJ

### **Huidige Workflow (met Invoice Ninja)**
```
1. Klant contacteert Mr. DJ via website/WhatsApp
2. Handmatige offerte in Invoice Ninja
3. Handmatige email naar klant
4. Klant accepteert (via email)
5. Handmatige factuur aanmaken
6. Handmatige betalingsverwerking
7. Event wordt geleverd
8. Handmatige follow-up en review verzoek
```

**Problemen:**
- ❌ Te veel handmatig werk
- ❌ Geen geïntegreerd systeem
- ❌ Geen inventory tracking
- ❌ Geen crew planning
- ❌ Geen client self-service
- ❌ Geen business insights

### **Nieuwe Workflow (met RentGuy)**
```
1. Klant contacteert via website → Auto-create lead in RentGuy
2. Offerte maken in RentGuy:
   - Selecteer event type (bruiloft/bedrijfsfeest/privé)
   - Selecteer apparatuur uit inventory
   - Selecteer crew (DJ + optioneel saxofonist)
   - Auto-calculate prijs incl. transport
   - Direct versturen naar klant via client portal

3. Klant bekijkt offerte in client portal:
   - Review details
   - Accepteer online
   - Betaal aanbetaling via Mollie

4. Auto-convert offerte → Project:
   - Equipment gereserveerd in inventory
   - Crew scheduled in calendar
   - Transport gepland
   - Automatische reminder emails

5. Event execution:
   - Warehouse scan: Apparatuur uitgecheckt
   - Event geleverd
   - Warehouse scan: Apparatuur teruggecheckt
   - Automatische schade assessment

6. Post-event:
   - Auto-generate factuur (restbetaling)
   - Automatische review verzoek email
   - Analytics: Event winstgevendheid tracking
```

**Voordelen:**
- ✅ 80% minder handmatig werk
- ✅ Real-time inventory tracking
- ✅ Professional client experience
- ✅ Automated workflows
- ✅ Data-driven business decisions
- ✅ Schaalbaar (meer events, meer DJ's)

---

## 🏗️ TECHNICAL ARCHITECTURE

### **RentGuy Enterprise Platform**

**Backend:**
```
/root/rentguy-new/backend/
├── FastAPI service (Python 3.11+)
├── PostgreSQL database
├── Alembic migrations
├── Modular domain design:
│   ├── auth/          - Authentication & user management
│   ├── inventory/     - Equipment tracking (DJ gear)
│   ├── projects/      - Event project management
│   ├── crew/          - DJ & crew scheduling
│   ├── transport/     - Logistiek planning
│   ├── billing/       - Facturatie (vervangt Invoice Ninja!)
│   ├── warehouse/     - Barcode scanning workflow
│   ├── reporting/     - Business analytics
│   └── observability/ - Metrics & logging
```

**Frontend:**
```
/root/rentguy-new/
├── React SPA (Vite)
├── Two modes:
│   ├── Planner UI    - Operations dashboard (office use)
│   └── Scanner UI    - Warehouse app (mobile/tablet)
```

**Billing Module:** `/root/rentguy-new/backend/app/modules/billing/`
```
billing/
├── models.py      - Invoice, Quote, Payment models
├── schemas.py     - Pydantic validation
├── routes.py      - API endpoints
├── usecases.py    - Business logic
├── repo.py        - Database access
├── adapters/
│   └── invoice_ninja.py  - Legacy adapter (we vervangen dit!)
```

---

## 📦 MR. DJ ENTITY MAPPING

### **1. Inventory → DJ Equipment**

**Equipment Categories:**
```python
EQUIPMENT_CATEGORIES = {
    "audio": {
        "name": "Geluidssysteem",
        "items": [
            "Pioneer DJ Controller",
            "Speakers L/R (2x)",
            "Subwoofer",
            "Microfoon draadloos",
            "DJ Booth / Tafel",
            "Backup controller"
        ]
    },
    "lighting": {
        "name": "Verlichting",
        "items": [
            "LED Par lights (4x)",
            "Moving heads (2x)",
            "Fog machine",
            "DMX Controller",
            "Lighting truss",
            "Disco ball"
        ]
    },
    "special": {
        "name": "Speciale effecten",
        "items": [
            "Saxofoon (voor DJ+Sax)",
            "Draadloze sax microfoon",
            "LED Dance Floor",
            "Photo Booth setup",
            "Giant LOVE letters"
        ]
    },
    "transport": {
        "name": "Transport & Setup",
        "items": [
            "DJ Bus + branding",
            "Flightcases",
            "Cable management",
            "Power distribution",
            "Setup checklist"
        ]
    }
}
```

**Equipment Properties:**
```python
class DJEquipment:
    id: UUID
    name: str
    category: str
    brand: str  # Pioneer, JBL, Chauvet, etc.
    model: str
    serial_number: str
    purchase_date: date
    purchase_price: Decimal
    rental_price_per_event: Decimal
    condition: str  # excellent, good, fair, needs_repair
    maintenance_log: List[MaintenanceRecord]
    availability_status: str  # available, rented, maintenance
    location: str  # warehouse, in_transit, at_event
    barcode: str  # For warehouse scanning
```

### **2. Projects → Events**

**Event Types (Projects):**
```python
EVENT_TYPES = {
    "wedding": {
        "name": "Bruiloft DJ",
        "default_duration": 8,  # hours
        "base_price": 795,
        "includes": [
            "Complete DJ service",
            "Ceremony music",
            "Dinner background music",
            "First dance coordination",
            "Full party evening",
            "Unlimited pre-consultation"
        ]
    },
    "corporate": {
        "name": "Bedrijfsfeest DJ",
        "default_duration": 6,
        "base_price": 595,
        "includes": [
            "Professional DJ service",
            "Corporate appropriate music",
            "Optional branding integration",
            "Networking background music",
            "Party segment"
        ]
    },
    "private": {
        "name": "Privé Feest",
        "default_duration": 5,
        "base_price": 495,
        "includes": [
            "DJ service",
            "Custom playlist",
            "Flexible music style"
        ]
    },
    "dj_sax": {
        "name": "DJ + Live Saxofonist",
        "default_duration": 8,
        "base_price": 1195,
        "includes": [
            "DJ service",
            "Live saxophonist",
            "Duo performance",
            "Unique entertainment experience"
        ]
    }
}
```

**Event Workflow:**
```
Event States:
1. Lead → Offerte aangevraagd
2. Quote Sent → Offerte verzonden
3. Quote Accepted → Geboekt (aanbetaling ontvangen)
4. Scheduled → Crew & equipment toegewezen
5. In Preparation → 1 week voor event
6. Equipment Out → Apparatuur uitgecheckt
7. Live Event → Event loopt
8. Equipment In → Apparatuur teruggecheckt
9. Invoice Sent → Restbetaling factuur verzonden
10. Paid → Volledig betaald
11. Completed → Afgerond + review verzameld
```

### **3. Crew → DJ & Team**

**Crew Roles:**
```python
CREW_ROLES = {
    "lead_dj": {
        "name": "Lead DJ",
        "rate_per_event": 300,
        "required_skills": ["DJ", "MC", "Event Coordination"]
    },
    "saxophonist": {
        "name": "Saxofonist",
        "rate_per_event": 400,
        "required_skills": ["Saxophone", "Live Performance"]
    },
    "technical_crew": {
        "name": "Technisch Crew",
        "rate_per_hour": 35,
        "required_skills": ["Setup", "Sound Engineering"]
    },
    "backup_dj": {
        "name": "Backup DJ",
        "rate_per_event": 250,
        "required_skills": ["DJ"]
    }
}
```

### **4. Billing → Invoices**

**Invoice Structure:**
```python
class MrDJInvoice:
    # Event details
    event_type: str  # wedding, corporate, private, dj_sax
    event_date: date
    event_location: str
    client_name: str

    # Line items
    line_items: List[InvoiceLineItem] = [
        {
            "description": "DJ Service - Bruiloft Complete",
            "quantity": 1,
            "unit_price": 795.00,
            "subtotal": 795.00,
            "tax_rate": 0.21,  # 21% BTW
            "tax_amount": 166.95,
            "total": 961.95
        },
        {
            "description": "Extra verlichting - Moving Heads",
            "quantity": 2,
            "unit_price": 75.00,
            "subtotal": 150.00,
            "tax_rate": 0.21,
            "tax_amount": 31.50,
            "total": 181.50
        },
        {
            "description": "Transport - Veldhoven naar Amsterdam",
            "quantity": 1,
            "unit_price": 100.00,
            "subtotal": 100.00,
            "tax_rate": 0.21,
            "tax_amount": 21.00,
            "total": 121.00
        }
    ]

    # Totals
    subtotal: Decimal = 1045.00
    tax_total: Decimal = 219.45
    total: Decimal = 1264.45

    # Payments
    deposit_amount: Decimal = 300.00  # 30% aanbetaling
    deposit_paid: bool = True
    deposit_date: date

    remaining_amount: Decimal = 964.45
    final_payment_due_date: date  # 14 dagen na event

    # Payment method
    payment_provider: str = "mollie"
    payment_methods_accepted: List[str] = ["ideal", "creditcard", "bancontact"]
```

### **5. Client Portal**

**Client Features:**
```
Client Dashboard:
├── Mijn Events
│   ├── Aankomende events
│   ├── Event details & tijdlijn
│   └── Setup instructies
├── Offertes
│   ├── Openstaande offertes
│   ├── Offerte accepteren
│   └── Aanbetaling betalen
├── Facturen
│   ├── Openstaande betalingen
│   ├── Betaalgeschiedenis
│   └── Facturen downloaden (PDF)
├── Muziek Planning
│   ├── Spotify playlist delen
│   ├── Must-play songs
│   ├── No-go songs
│   └── Speciale verzoeken
├── Documenten
│   ├── Contract downloaden
│   ├── Pakbon
│   └── Verzekeringsinformatie
└── Support
    ├── Contact DJ
    ├── WhatsApp link
    └── FAQ
```

---

## 🔄 MIGRATION PLAN

### **FASE 1: RentGuy Setup voor Mr. DJ (Week 1-2)**

#### 1.1 Database Setup
```bash
cd /root/rentguy-new/backend

# Create Mr. DJ tenant database
createdb rentguy_mrdj

# Run migrations
alembic upgrade head

# Seed Mr. DJ specific data
python scripts/seed_mrdj_data.py
```

#### 1.2 Configuration
```bash
# Create Mr. DJ environment file
cp .env.example .env.mrdj

# Configure:
TENANT_ID=mrdj
TENANT_NAME="Mister DJ"
TENANT_DOMAIN=app.mr-dj.nl
BRANDING_PRIMARY_COLOR=#667eea
BRANDING_LOGO_URL=https://www.mr-dj.nl/assets/images/logo.png

# Billing
BILLING_ENABLED=true
INVOICE_PREFIX=MR-DJ
INVOICE_NUMBER_FORMAT="{year}-{number:04d}"
DEFAULT_TAX_RATE=0.21
CURRENCY=EUR

# Payments
MOLLIE_API_KEY=[API key from Mollie]
PAYMENT_METHODS=ideal,creditcard,bancontact
DEPOSIT_PERCENTAGE=30

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=info@mr-dj.nl
SMTP_PASSWORD=[from vault]
EMAIL_FROM=info@mr-dj.nl
EMAIL_FROM_NAME="Mister DJ"

# Business info
BUSINESS_NAME="Mister DJ"
BUSINESS_ADDRESS="Kapteijnlaan 17, 5505 AV Veldhoven"
BUSINESS_PHONE="+31408422594"
BUSINESS_EMAIL=info@mr-dj.nl
BUSINESS_KVK=68906277
BUSINESS_BTW=[BTW nummer]
```

#### 1.3 Equipment Inventory Import
```python
# scripts/seed_mrdj_data.py

from app.modules.inventory import crud_inventory
from app.core.database import SessionLocal

db = SessionLocal()

# Audio equipment
audio_items = [
    {
        "name": "Pioneer DDJ-1000 Controller",
        "category": "audio",
        "brand": "Pioneer",
        "model": "DDJ-1000",
        "serial_number": "PIO-DDJ1000-001",
        "condition": "excellent",
        "rental_price_per_event": 0,  # Included in service
        "barcode": "MRDJ-AUDIO-001"
    },
    {
        "name": "JBL EON615 Speaker (L)",
        "category": "audio",
        "brand": "JBL",
        "model": "EON615",
        "serial_number": "JBL-EON615-L",
        "condition": "excellent",
        "rental_price_per_event": 0,
        "barcode": "MRDJ-AUDIO-002"
    },
    # ... meer items
]

for item in audio_items:
    crud_inventory.create(db, item)
```

#### 1.4 Service Packages Setup
```python
# Define Mr. DJ service packages

packages = [
    {
        "id": "wedding-complete",
        "name": "Bruiloft DJ - Complete Dag",
        "description": "Volledige muzikale begeleiding...",
        "base_price": 795.00,
        "duration_hours": 8,
        "included_equipment": [
            "MRDJ-AUDIO-001",  # DJ Controller
            "MRDJ-AUDIO-002",  # Speaker L
            "MRDJ-AUDIO-003",  # Speaker R
            "MRDJ-AUDIO-004",  # Subwoofer
            "MRDJ-AUDIO-005",  # Wireless mic
            "MRDJ-LIGHT-001",  # LED Par lights
            "MRDJ-LIGHT-002",  # Moving heads
        ],
        "included_crew": ["lead_dj"],
        "options": [
            {
                "name": "Extra verlichting",
                "price": 150.00
            },
            {
                "name": "Fog machine",
                "price": 50.00
            }
        ]
    },
    {
        "id": "dj-sax-combo",
        "name": "DJ + Live Saxofonist",
        "description": "Unieke combinatie...",
        "base_price": 1195.00,
        "duration_hours": 8,
        "included_crew": ["lead_dj", "saxophonist"],
        # ... etc
    }
]
```

---

### **FASE 2: Invoice Ninja Data Migration (Week 2-3)**

#### 2.1 Export Existing Data
```bash
# Export Invoice Ninja data (if any exists)
# Clients, Invoices, Products

# Create migration scripts
python scripts/migrate_invoice_ninja_to_rentguy.py
```

#### 2.2 Data Mapping
```python
# Invoice Ninja → RentGuy mapping

invoice_ninja_to_rentguy = {
    "clients": "clients",              # 1:1 mapping
    "invoices": "invoices",            # 1:1 mapping
    "products": "packages/equipment",   # Map to RentGuy packages
    "quotes": "quotes",                # 1:1 mapping
    "payments": "payments",            # 1:1 mapping
}
```

---

### **FASE 3: Website Integration (Week 3-4)**

#### 3.1 API Integration

**Mr. DJ Website → RentGuy API:**
```javascript
// /srv/apps/mr-djv1/frontend/public/assets/js/rentguy-integration.js

const RENTGUY_API = 'https://app.mr-dj.nl/api/v1';

// Contact form submission → Create lead in RentGuy
async function submitContactForm(formData) {
  const response = await fetch(`${RENTGUY_API}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': RENTGUY_API_KEY
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      event_type: formData.eventType,
      event_date: formData.eventDate,
      event_location: formData.location,
      message: formData.message,
      source: 'website_contact_form'
    })
  });

  if (response.ok) {
    const lead = await response.json();

    // Show success message with tracking number
    showSuccessMessage(`
      Bedankt! Uw aanvraag is ontvangen.
      Referentienummer: ${lead.reference_number}
      We nemen binnen 24 uur contact met u op.
    `);

    // Optional: Redirect to client portal
    // window.location.href = `https://app.mr-dj.nl/client/leads/${lead.id}`;
  }
}

// Check availability
async function checkAvailability(date) {
  const response = await fetch(
    `${RENTGUY_API}/availability?date=${date}`,
    {
      headers: { 'X-API-Key': RENTGUY_API_KEY }
    }
  );

  const data = await response.json();
  return data.available;
}

// Get quote status (for clients who clicked email link)
async function getQuoteStatus(quoteId, clientToken) {
  const response = await fetch(
    `${RENTGUY_API}/quotes/${quoteId}`,
    {
      headers: { 'Authorization': `Bearer ${clientToken}` }
    }
  );

  return await response.json();
}
```

#### 3.2 Client Portal Embedding

**Option A: Subdomain (Aanbevolen)**
```
app.mr-dj.nl → RentGuy Client Portal
www.mr-dj.nl → Marketing website
```

**Option B: iFrame Integration**
```html
<!-- /srv/apps/mr-djv1/frontend/public/mijn-account.html -->

<div id="rentguy-portal">
  <iframe
    src="https://app.mr-dj.nl/client/portal"
    width="100%"
    height="800px"
    frameborder="0"
    sandbox="allow-same-origin allow-scripts allow-forms"
  ></iframe>
</div>
```

**Option C: Full Redirect**
```javascript
// Redirect to RentGuy for quotes/booking
window.location.href = 'https://app.mr-dj.nl/client/login';
```

#### 3.3 Webhook Integration

**RentGuy → Mr. DJ Website webhooks:**
```python
# backend/app/webhooks/mrdj_website.py

@router.post("/webhooks/mrdj/quote-accepted")
async def quote_accepted_webhook(quote_id: UUID):
    """
    Triggered when client accepts quote
    - Send to Google Analytics
    - Trigger email sequence
    - Update CRM
    """
    # Send conversion event to GA4
    await send_ga4_event({
        "event_name": "quote_accepted",
        "event_params": {
            "quote_id": str(quote_id),
            "value": quote.total_amount,
            "currency": "EUR"
        }
    })

    # Trigger email automation
    await send_email_sequence(
        quote.client.email,
        sequence="quote_accepted_followup"
    )

@router.post("/webhooks/mrdj/event-completed")
async def event_completed_webhook(event_id: UUID):
    """
    Triggered after event completion
    - Send review request
    - Update GBP
    """
    # Send review request email
    await send_review_request_email(event.client)

    # Post to Google Business Profile (if API available)
    await post_to_gbp(event)
```

---

### **FASE 4: Mollie Payment Integration (Week 4)**

#### 4.1 Mollie Setup
```bash
# Get Mollie API keys from dashboard.mollie.com
# Add to .env.mrdj

MOLLIE_API_KEY=live_...
MOLLIE_WEBHOOK_URL=https://app.mr-dj.nl/api/webhooks/mollie
```

#### 4.2 Payment Flow
```python
# backend/app/modules/billing/payment_providers/mollie.py

from mollie.api.client import Client

class MolliePaymentProvider:
    def __init__(self, api_key: str):
        self.client = Client()
        self.client.set_api_key(api_key)

    async def create_payment_link(
        self,
        invoice: Invoice,
        amount: Decimal,
        description: str
    ) -> str:
        """
        Create Mollie payment link for invoice
        """
        payment = self.client.payments.create({
            'amount': {
                'currency': 'EUR',
                'value': f'{amount:.2f}'
            },
            'description': description,
            'redirectUrl': f'https://app.mr-dj.nl/client/invoices/{invoice.id}/payment-success',
            'webhookUrl': f'https://app.mr-dj.nl/api/webhooks/mollie',
            'metadata': {
                'invoice_id': str(invoice.id),
                'client_id': str(invoice.client_id),
                'event_id': str(invoice.event_id)
            }
        })

        return payment.checkout_url

    async def handle_webhook(self, payment_id: str):
        """
        Handle Mollie webhook for payment status updates
        """
        payment = self.client.payments.get(payment_id)

        if payment.is_paid():
            invoice_id = payment.metadata['invoice_id']

            # Mark invoice as paid
            await mark_invoice_paid(
                invoice_id=invoice_id,
                payment_provider='mollie',
                payment_id=payment_id,
                amount=Decimal(payment.amount['value'])
            )

            # Send confirmation email
            await send_payment_confirmation_email(invoice_id)
```

---

### **FASE 5: Mobile Warehouse App (Week 5-6)**

#### 5.1 Scanner Mode Setup
```bash
# Scanner mode for warehouse operations
VITE_APP_MODE=scanner npm run build

# Deploy scanner app to mobile device or tablet
# Used for:
# - Equipment checkout before event
# - Equipment checkin after event
# - Condition assessment
# - Damage reporting
```

#### 5.2 Barcode Labels
```python
# Generate barcode labels for all equipment
from barcode import EAN13
from barcode.writer import ImageWriter

def generate_equipment_labels():
    for equipment in all_equipment:
        # Generate EAN13 barcode
        barcode = EAN13(
            equipment.barcode,
            writer=ImageWriter()
        )

        # Save label with equipment info
        barcode.save(
            f'/tmp/labels/{equipment.barcode}',
            options={
                'module_width': 0.4,
                'module_height': 15.0,
                'font_size': 12,
                'text_distance': 5.0,
                'quiet_zone': 6.5
            }
        )
```

---

### **FASE 6: Automation & Workflows (Week 7-8)**

#### 6.1 Email Automation
```python
# Email sequences

EMAIL_SEQUENCES = {
    "quote_sent": [
        {
            "delay_hours": 0,
            "subject": "Uw offerte van Mister DJ",
            "template": "quote_initial.html"
        },
        {
            "delay_hours": 48,
            "subject": "Heeft u nog vragen over uw offerte?",
            "template": "quote_followup_1.html",
            "condition": "quote_not_opened"
        },
        {
            "delay_hours": 120,  # 5 days
            "subject": "Laatste herinnering: Uw offerte",
            "template": "quote_followup_2.html",
            "condition": "quote_not_accepted"
        }
    ],

    "event_upcoming": [
        {
            "delay_days": -14,  # 2 weeks before
            "subject": "Uw event komt eraan - Laatste details",
            "template": "event_upcoming_2weeks.html"
        },
        {
            "delay_days": -3,
            "subject": "Nog 3 dagen! Finale check voor uw event",
            "template": "event_upcoming_3days.html"
        },
        {
            "delay_days": -1,
            "subject": "Morgen is het feest! 🎉",
            "template": "event_tomorrow.html"
        }
    ],

    "event_completed": [
        {
            "delay_days": 2,
            "subject": "Hoe was uw feest? Laat een review achter! ⭐",
            "template": "review_request.html"
        },
        {
            "delay_days": 7,
            "subject": "Herinnering: Deel uw ervaring met Mister DJ",
            "template": "review_reminder.html",
            "condition": "no_review_left"
        }
    ]
}
```

#### 6.2 WhatsApp Integration
```python
# Optional: WhatsApp Business API integration

from twilio.rest import Client

async def send_whatsapp_reminder(client_phone: str, event: Event):
    """
    Send WhatsApp reminder 1 day before event
    """
    message = f"""
    Hoi {event.client.first_name}! 🎵

    Morgen is het feest! We zijn er helemaal klaar voor.

    📅 Event: {event.event_type}
    🕐 Tijd: {event.start_time}
    📍 Locatie: {event.location}

    Tot morgen!
    - Mister DJ Team
    """

    twilio_client = Client(TWILIO_SID, TWILIO_TOKEN)

    message = twilio_client.messages.create(
        from_=f'whatsapp:{TWILIO_WHATSAPP_NUMBER}',
        body=message,
        to=f'whatsapp:{client_phone}'
    )
```

---

## 📊 EXPECTED BUSINESS IMPACT

### **Time Savings**
```
Handmatig proces (Invoice Ninja):
- Offerte maken: 30 min
- Email versturen: 5 min
- Follow-up: 15 min
- Factuur maken: 20 min
- Betalingsverwerking: 10 min
- Event planning: 45 min
Total per event: ~2 uur

Geautomatiseerd proces (RentGuy):
- Offerte maken: 10 min (templated)
- Email versturen: Automatisch
- Follow-up: Automatisch
- Factuur maken: Automatisch
- Betalingsverwerking: Automatisch
- Event planning: 15 min (visueel calendar)
Total per event: ~25 min

Time saving per event: 1.5 uur (75% reductie!)

Bij 50 events/jaar: 75 uur bespaard
Bij 100 events/jaar: 150 uur bespaard
```

### **Revenue Impact**
```
Betere conversie door:
- Professional client portal: +15% conversie
- Snellere offerte response: +10% conversie
- Online betaling: +5% snellere betaling

Huidige conversie: 30%
Nieuwe conversie: ~40%

Bij 100 leads/jaar:
- Huidig: 30 events
- Nieuw: 40 events
- Extra revenue: 10 events x €800 = €8.000

ROI eerste jaar: €8.000 - kosten
```

### **Customer Experience**
```
Client satisfaction improvements:
- Professional portal: ⭐⭐⭐⭐⭐
- Real-time updates: ⭐⭐⭐⭐⭐
- Easy payment: ⭐⭐⭐⭐⭐
- Transparancy: ⭐⭐⭐⭐⭐

Expected review increase:
- Huidig: 9.5 rating (50 reviews)
- Target: 9.7 rating (150+ reviews in 1 jaar)
```

---

## 🚀 DEPLOYMENT PLAN

### **Week 1-2: Setup & Configuration**
- [ ] RentGuy database setup
- [ ] Mr. DJ tenant configuration
- [ ] Equipment inventory import
- [ ] Service packages setup
- [ ] Mollie payment integration

### **Week 3-4: Website Integration**
- [ ] API integration on mr-dj.nl
- [ ] Client portal setup (app.mr-dj.nl)
- [ ] Webhook configuration
- [ ] Testing contact form → lead creation

### **Week 5-6: Mobile & Automation**
- [ ] Warehouse scanner app deployment
- [ ] Barcode labels printed
- [ ] Email automation setup
- [ ] WhatsApp integration (optional)

### **Week 7-8: Testing & Migration**
- [ ] Invoice Ninja data migration
- [ ] Parallel run (both systems)
- [ ] Staff training
- [ ] Client communication

### **Week 9: Go Live**
- [ ] Switch to RentGuy as primary system
- [ ] Invoice Ninja sunset
- [ ] Monitor and adjust

---

## 📁 FILE LOCATIONS

### **RentGuy Installation**
```
/root/rentguy-new/                    - Main RentGuy installation
/root/rentguy-new/backend/            - FastAPI backend
/root/rentguy-new/backend/app/modules/billing/  - Billing module
```

### **Mr. DJ Integration Files**
```
/srv/apps/mr-djv1/docs/RENTGUY_INTEGRATION_PLAN.md  - This file
/srv/apps/mr-djv1/docs/rentguy/                      - Integration docs
/srv/apps/mr-djv1/scripts/rentguy/                   - Integration scripts
```

### **Configuration**
```
/root/rentguy-new/.env.mrdj           - Mr. DJ specific config
/srv/apps/mr-djv1/vault/.env          - Update with RentGuy credentials
```

---

## 🔐 SECURITY & ACCESS

### **RentGuy Admin Access**
```
Email: info@mr-dj.nl
Password: [Generate secure password, store in vault]
Role: Admin/Owner
2FA: Required
```

### **API Keys**
```
RentGuy API Key: [Generate, store in vault]
Mollie API Key: [From dashboard.mollie.com]
```

### **Database Backup**
```
# Automated daily backups
0 3 * * * pg_dump rentguy_mrdj > /backups/rentguy_mrdj_$(date +\%Y\%m\%d).sql
```

---

## ✅ SUCCESS CRITERIA

**Technical:**
- [ ] RentGuy deployed and accessible at app.mr-dj.nl
- [ ] All equipment imported and barcoded
- [ ] Mollie payments working
- [ ] Email automation active
- [ ] Client portal functional
- [ ] API integration with mr-dj.nl complete

**Business:**
- [ ] First quote sent via RentGuy
- [ ] First payment received via Mollie
- [ ] First event executed with RentGuy workflow
- [ ] Staff trained and comfortable with system
- [ ] Invoice Ninja fully replaced

**Timeline:**
- Setup complete: Week 9
- Full adoption: Week 12
- Invoice Ninja sunset: Week 12

---

**Created:** 2025-10-21
**Owner:** Sevensa Solutions
**Status:** 🚀 Ready to Execute
**Priority:** HIGH - Replaces Invoice Ninja
