# Mailintegratie Onderzoek voor Mister DJ Platform

## 1. Doel en scope

Het doel van dit onderzoek is het bepalen van een betrouwbare, schaalbare en beheersbare mailintegratie voor de Express API en React frontend van Mister DJ. De oplossing moet voldoen aan enterprise eisen (security, auditability, monitoring) en eenvoudig te deployen zijn in de bestaande Docker/VPS omgeving.

## 2. Functionele en niet-functionele eisen

| Categorie | Eisen |
| --- | --- |
| Functioneel | \- Verzenden van contact- en boekingsbevestigingen vanuit de backend.<br>\- Ondersteunen van transacties (offerte, bevestiging, interne notificaties).<br>\- Contentbeheer via bestaande CMS/Netlify workflow (templates in Git). |
| Security & Compliance | \- TLS versleuteling voor alle uitgaande mail.<br>\- Secretbeheer via configuratie-dashboard (`managed.env`).<br>\- SPF/DKIM/DMARC ondersteuning voor deliverability en anti-spoofing.<br>\- Logging zonder gevoelige data te lekken, maar met trace-ID koppeling. |
| Operationeel | \- Integratie met huidige monitoring (health endpoint, structured logging).<br>\- Sandbox/staging accounts met beperkte quota.<br>\- Rate limiting / retry strategie om API niet te blokkeren. |
| Future-proof | \- API-first provider met Node SDK.<br>\- Template versiebeheer.<br>\- Mogelijkheid tot bounce/complaint webhooks. |

## 3. Integratie-opties

### 3.1 SMTP via Postfix of externe provider
- **Voordelen**: eenvoudig met Nodemailer, volledige controle over headers, geen vendor lock-in.
- **Nadelen**: onderhoud van Postfix/relay vereist, gevoelig voor deliverability issues zonder uitgebreide configuratie, moeilijker voor analytics en templates.
- **Aanpak**: gebruiken van `nodemailer` + SMTP-credentials in `managed.env`. Vereist openstaande poorten (587/465) en certificaatbeheer.

### 3.2 API-based e-maildiensten (aanbevolen)
| Provider | Voordelen | Aandachtspunten |
| --- | --- | --- |
| **Postmark** | Transactionele focus, hoge deliverability, EU datacenters, krachtige templates en webhook support. | Tarieven per e-mail, templates beheer via UI + API. |
| **SendGrid** | Breed ecosysteem, dynamische templates, granular permissions. | Complexe UI, free tier beperkt, moet goed geconfigureerd worden voor deliverability. |
| **Mailgun** | Flexibel, krachtige analytics, goede Node SDK. | EU regio betaalde tiers, SPF/DKIM setup vereist. |

**Conclusie**: Postmark of Mailgun sluiten het beste aan bij enterprise eisen (transacties, audit logs, EU hosting). API-based integraties bieden betere monitoring, webhooks en template management dan pure SMTP.

## 4. Backend architectuur (Express)

1. **Service laag**: creëer `mailService.js` in `backend/src/services` met een provider-agnostische interface (`sendContactConfirmation`, `sendBookingNotification`). Gebruik dependency injection om de provider (Postmark, Mailgun) te selecteren.
2. **Provider adapters**: implementeer afzonderlijke modules (`providers/postmark.js`, `providers/mailgun.js`) die een uniforme `send({ to, templateId, data })` methode bieden.
3. **Configuratie**: voeg volgende variabelen toe aan `managed.env` en `.env.example`:
   - `MAIL_PROVIDER` (`postmark` of `mailgun`)
   - `MAIL_API_KEY`
   - `MAIL_FROM_ADDRESS`
   - `MAIL_REPLY_TO`
   - `MAIL_TEMPLATES_CONTACT`, `MAIL_TEMPLATES_BOOKING`
4. **Error handling**: wrap provider-fouten in een custom error (`MailSendError`) en log `errorId`, `provider`, `templateId` + HTTP status.
5. **Retries & Queue**: gebruik een eenvoudige retry (`p-retry` of eigen implementatie) met exponential backoff. Voor hogere volumes kan later een job queue (BullMQ + Redis) gekoppeld worden.
6. **Testing**: mock provider SDK in unit tests; voeg contract-tests toe die fake API responses simuleren.
7. **Health monitoring**: breid `GET /api/health` uit met een `mail` status (laatste succesvolle ping op provider API).

## 5. Frontend (React) implicaties

- **Form validation**: zorg dat de contact- en boekingsformulieren alle verplichte velden aanleveren. Backend retourneert `messageId` zodat de UI een bevestiging kan tonen.
- **Feedback aan gebruiker**: toon loading states + foutmeldingen (`try again later`) bij mailfouten.
- **CMS templates**: houd tekst voor bevestigingsmails in content repository zodat marketing wijzigingen via Git/Netlify CMS verlopen.
- **Dashboard**: breid configuratie-dashboard uit met mailsectie (velden voor provider, API key, from address). Valideer input op backend (mask API key in UI).

## 6. Secretbeheer & beveiliging

- Sla API keys encrypted op in `managed.env` (rechten beperken tot backend container).
- Gebruik Basic Auth + HTTPS voor het configuratiedashboard, rate limit per IP (reeds aanwezig).
- Logging: gebruik structured logging (JSON) met `event: "mail.send"` en zonder PII in de payload.
- Update `deploy.sh` om `managed.env` te synchroniseren naar de server vóór container restart.
- Voeg audit trail toe (tijdstip + gebruiker) wanneer dashboard secrets worden aangepast.

## 7. DNS & deliverability

1. Registreer dedicated mail subdomein (`mail.mr-dj.nl`).
2. Configureer SPF record (`v=spf1 include:spf.mtasv.net -all` voor Postmark, `include:mailgun.org` voor Mailgun).
3. Genereer DKIM keys via provider en publiceer als TXT-record.
4. Stel DMARC in (`v=DMARC1; p=quarantine; rua=mailto:dmarc@mr-dj.nl`).
5. Optioneel: configureer CNAME records voor link tracking (Postmark: `pm-bounces`).

## 8. Webhooks & monitoring

- **Webhook endpoint**: implementeer `POST /api/mail/webhook` met signature-validatie voor bounce/complaint events. Log naar database (`mail_events` tabel) voor audit.
- **Alerts**: configureer provider notificaties (Slack/email) bij hoge bounce rates.
- **Metrics**: uitbreiding van health endpoint met laatste bounce count en provider latency.
- **Dashboards**: integreer met bestaande monitoring (bijv. Grafana/Prometheus) via custom exporter of provider API.

## 9. Roadmap & vervolgstappen

1. Kies provider (advies: Postmark) en bestel productietier.
2. Voeg configuratievelden toe aan dashboard + `managed.env` en update `.env.example`.
3. Implementeer mailservice + unit tests; voeg integratietest met mocked provider toe.
4. Roll out DNS records in staging, verifieer deliverability en DMARC rapportages.
5. Activeer webhooks en koppel deze aan logging/audit pipeline.
6. Documenteer templating workflow (bv. `docs/mail-templates.md`) en train operations team.

Met deze stappen kan Mister DJ transactiemails betrouwbaar versturen, voldoen aan security eisen en de configuratie centraal beheren zonder manuele server ingrepen.
