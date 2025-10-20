# Waardevermeerderingsplan naar €25.000 – €30.000

_Laatst bijgewerkt: 2025-10-18_

Dit plan bundelt alle resterende werkzaamheden om de Mister DJ website van de huidige €23k–€28k waardering naar een stabiele bandbreedte van €25k–€30k te tillen. Elke taak bevat verwachte uren, benodigde rollen en KPI-impact zodat voortgang meetbaar blijft.

## 1. CRO & Conversie-optimalisatie

| Taak | Beschrijving | Uren | Rollen | KPI-impact |
| --- | --- | --- | --- | --- |
| Hero & pricing multivariate test | 3 varianten (wedding/corporate/private) opzetten met KPI-logging via personalization hook. | 18 | Frontend, CRO specialist | +8% lead → boeking |
| Availability Checker analytics | Eventtracking voor elke stap (focus/validatie/success) toevoegen aan CRO datalayer + dashboards. | 10 | Frontend, Data engineer | +5% formulier afronding |
| Lead nurture email journeys | Implementatie van 3-sequente e-mails vanuit bestaande mailprovider met dynamic content per persona. | 16 | Marketing automation | +12% MQL → SQL |

**Totaal uren**: 44 → **Kostenrange**: €3.300 – €4.200 (bij €75–€95/uur)

## 2. SEO & Content automatisering

| Taak | Beschrijving | Uren | Rollen | KPI-impact |
| --- | --- | --- | --- | --- |
| Maandelijkse keyword ingest | Plan en monitor de nieuwe workflow (`scripts/automation/run-city-content-workflow.js`) en koppel aan cron. | 8 | Tech lead | +12% organisch verkeer |
| Content QA & redactie | Review queue (`docs/city-content-review.md`) wekelijks nalopen, tone-of-voice bijschaven. | 12 | Copywriter | +6% dwell time |
| Schema markup uitbreiding | Automatische JSON-LD generator uitbreiden voor city pages (events + FAQ schema). | 14 | Backend | +5% SERP CTR |

**Totaal uren**: 34 → **Kostenrange**: €2.550 – €3.230

## 3. Integratie & Operations

| Taak | Beschrijving | Uren | Rollen | KPI-impact |
| --- | --- | --- | --- | --- |
| RentGuy SLA dashboard | Dashboard-tab toevoegen met queue metrics, SLA alerts en retry controls. | 18 | Backend, Ops | -20% mislukte syncs |
| Disaster recovery drill | Scripts draaien (`scripts/backup/postgres-dump.sh`, `docs/disaster-recovery-plan.md`) + runbook bijwerken. | 12 | Ops, QA | RTO < 4 uur |
| Compliance & consent audit | Jaarlijkse check op GDPR/AVG incl. logrotatie, retention policies en DPIA update volgens het [Consent Compliance Audit Runbook](operations/consent-audit.md). | 14 | Legal, Data privacy | Audit-proof |

**Totaal uren**: 44 → **Kostenrange**: €3.300 – €4.200

## 4. KPI & Reporting automatisering

| Taak | Beschrijving | Uren | Rollen | KPI-impact |
| --- | --- | --- | --- | --- |
| KPI datalake dashboard | Combineer GA4, RentGuy en personalization events in 1 Metabase/Looker Studio dashboard. | 16 | Data engineer | + volledige funnel inzicht |
| Executive scorecard | Maandelijkse PDF (auto-generatie) met KPI’s, CRO-resultaten en forecast. | 12 | Product owner | Snellere besluitvorming |
| Revenue attribution | Koppeling van booking-ID’s aan pakketten en marketingbron in database. | 10 | Backend | + nauwkeurige ROI |

**Totaal uren**: 38 → **Kostenrange**: €2.850 – €3.610

## 5. Samenvatting & fasering

| Fase | Uren | Kostenrange | Verwachte waardevermeerdering |
| --- | --- | --- | --- |
| Fase 1 – CRO + SEO (1 maand) | 78 | €5.850 – €7.430 | +€4k waarde dankzij hogere conversie en content schaalbaarheid |
| Fase 2 – Integratie + Operations (1 maand) | 44 | €3.300 – €4.200 | +€2.5k waarde via betrouwbaarheid en SLA’s |
| Fase 3 – KPI automatisering (3 weken) | 38 | €2.850 – €3.610 | +€2k waarde door inzicht & rapportage |

**Totaal**: 160 uur → Investering €12.000 – €15.200 → Verwachte waardevermeerdering: **€7.5k – €9k**, waardoor de totale waarde van de website structureel binnen **€25k – €30k** valt.

## 6. KPI’s & checkpoints

- **Conversie KPI’s**: lead-to-booking ≥ 32%, Availability Checker completion ≥ 68%.
- **SEO KPI’s**: 18 city pages live, organisch verkeer ≥ 6.500 sessies/maand, CTR op city pages ≥ 4%.
- **Operations KPI’s**: RentGuy queue < 3 items, DR drill ≤ 4 uur, consent logs ≤ 24 uur oud.
- **Reporting KPI’s**: maandelijkse scorecard verzonden op dag 2, forecast nauwkeurigheid ±8%.

## 7. Afhankelijkheden & risico’s

- **LLM API**: indien extern (OpenAI/Anthropic) vereist, sleutel beheren via Config Dashboard → sectie “Content automatisering”.
- **Cron scheduling**: VPS cronjob (`0 3 1 * * node scripts/automation/run-city-content-workflow.js`) + notificatie naar marketing.
- **Data privacy**: QA check voor elke nieuw gegenereerde city page (flagged content staat in `docs/city-content-review.md`).
- **Resourcing**: minimaal 1 vaste developer + marketing copywriter beschikbaar per fase om doorlooptijd te borgen.

Met deze roadmap zijn de stappen richting een €25k–€30k waardering concreet, meetbaar en geïntegreerd met bestaande infrastructuur zonder externe n8n-dependenties.
