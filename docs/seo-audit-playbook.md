# SEO Audit Playbook – Google Search Console

Gebruik dit plan voor FINAL6.

## Setup stappen
1. Log in op Google Search Console met het Mister DJ account.
2. Voeg een nieuwe **Domain property** toe voor `mr-dj.nl` en `staging.sevensa.nl`.
3. Valideer via DNS TXT record op het hoofddomein.
4. Upload `frontend/public/sitemap.xml` in GSC → Sitemaps.
5. Activeer e-mail notificaties voor Coverage & Core Web Vitals.

## Monitoring dashboard
| Rapport | Frequentie | Actie |
| --- | --- | --- |
| Coverage | wekelijks | Los indexeringsproblemen op, her-validate |
| Core Web Vitals | wekelijks | Koppel met Lighthouse rapporten, open tickets voor LCP/CLS issues |
| Page Experience | maandelijks | Controleer HTTP/HTTPS, mobiel gebruik |
| Manual Actions | realtime | Escaleren naar SEO lead |

## Automatisering (n8n)
- Endpoint: `https://api.searchconsole.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`
- Schedule: dagelijks 07:00 CET
- Output: stuur naar Slack kanaal `#seo-reporting`, archiveer CSV in Google Drive
- Zie `docs/automation-n8n-research.md` §3 voor flowdiagram

## Rapportage
| Datum | Rapport | Insights | Actie | Eigenaar |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

Sla exports op in `docs/test-reports/seo/`.
