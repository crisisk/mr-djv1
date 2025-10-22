# N8N Workflow Setup voor Mr. DJ

## Overzicht
RentGuy CRM beheert alle lead automation, maar N8N kan gebruikt worden voor extra workflows:
- Social media posts bij nieuwe bookings
- Team notificaties via Slack/Teams
- Calendar synchronisatie
- Custom reporting

## Webhook Configuration

**Webhook URL**: `https://your-n8n-instance.com/webhook/mr-dj-leads`

**Payload Format** (van RentGuy webhook):
```json
{
  "leadId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "eventType": "string",
  "eventDate": "ISO8601",
  "status": "new|contacted|converted",
  "source": "mister-dj-website"
}
```

## Lead Scoring Algoritme

```javascript
let score = 0;

// Event Type Scoring
switch (eventType.toLowerCase()) {
  case 'bruiloft': score += 100; break;
  case 'bedrijfsfeest': score += 80; break;
  case 'verjaardag': score += 60; break;
  case 'jubileum': score += 70; break;
  default: score += 40;
}

// Timing Scoring (event binnen 3 maanden)
const monthsUntilEvent = calculateMonths(eventDate);
if (monthsUntilEvent <= 3) score += 20;
if (monthsUntilEvent <= 1) score += 40;

// Message Length (indicates serious intent)
if (message.length > 100) score += 15;

// Priority Assignment
if (score >= 100) priority = 'HIGH';
else if (score >= 70) priority = 'MEDIUM';
else priority = 'LOW';
```

## Slack Notification Template

```
🎵 *Nieuwe Mr. DJ Lead!*

*Type:* {{eventType}}
*Datum:* {{eventDate}}
*Score:* {{leadScore}} ({{priority}})

*Contact:*
Naam: {{name}}
Email: {{email}}
Telefoon: {{phone}}

*Bericht:*
{{message}}

*Acties:*
<https://sevensa.rentguy.nl/leads/{{leadId}}|Open in RentGuy>
```

## Calendar Integration

Voor Google Calendar sync, gebruik RentGuy's built-in calendar export.

## Installatie

1. Import workflow JSON in N8N
2. Configure webhook credentials
3. Set environment variables
4. Test met dummy lead
5. Connect RentGuy webhook naar N8N

## Environment Variables

```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/YOUR/WEBHOOK
N8N_WEBHOOK_SECRET=your-secret-key
```
