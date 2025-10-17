# Interne city content automatisering (zonder n8n)

Deze notitie beschrijft hoe de maandelijkse city content workflow nu volledig binnen de Mister DJ stack draait, zonder afhankelijkheid van n8n.

## Architectuur

1. **Scheduler** – cronjob op de VPS (`0 3 1 * *`) die `node scripts/automation/run-city-content-workflow.js` uitvoert.
2. **Keyword ingest** – `cityContentAutomationService.fetchKeywordSet` haalt via `SEO_AUTOMATION_API_URL` het meest recente keyword-rapport op (Ahrefs/SEMrush compatible). Authenticatie via Bearer token (`SEO_AUTOMATION_API_KEY`).
3. **Data cleaning** – `filterKeywords` filtert op provincie (default Noord-Brabant) en entertainment zoektermen. Dubbels worden ontdubbeld op slug.
4. **Lookup** – `lookupExistingSlugs` controleert eerst de Postgres-tabel `local_seo_pages`; bij ontbreken fallback naar `content/local-seo/cities.json`.
5. **Content generatie** – `generateCityContent` gebruikt de LLM-config in het Config Dashboard. Wanneer geen sleutel aanwezig is, wordt de templatestrategie geactiveerd zodat de workflow blijft draaien.
6. **Quality gate** – `qualityCheck` valideert intro lengte, cases/FAQ-aanwezigheid en blokkeert verboden claims. Flagged items worden toegevoegd aan `docs/city-content-review.md`.
7. **Git en build** – Goedgekeurde entries worden in `content/local-seo/cities.json` geüpdatet en `scripts/generate-city-pages.mjs` wordt aangeroepen voor statische HTML. Resultaat & fouten loggen naar `docs/city-content-automation-report.md`.
8. **Notificatie** – Marketing ontvangt automatisch een e-mail (via bestaande mailprovider) wanneer het report is bijgewerkt; configureer `SEO_AUTOMATION_APPROVAL_EMAIL` in het dashboard.

## Configuratie via dashboard

Voeg de volgende variabelen toe in de tab **Content automatisering**:

- `SEO_AUTOMATION_API_URL`
- `SEO_AUTOMATION_API_KEY`
- `SEO_AUTOMATION_KEYWORDSET_ID`
- `SEO_AUTOMATION_REGION`
- `SEO_AUTOMATION_THEME_KEYWORDS`
- `SEO_AUTOMATION_APPROVAL_EMAIL`
- `CITY_AUTOMATION_LLM_PROVIDER`
- `CITY_AUTOMATION_LLM_MODEL`
- `CITY_AUTOMATION_LLM_API_KEY`
- `CITY_AUTOMATION_DRY_RUN`

## Monitoring

- Check het rapport (`docs/city-content-automation-report.md`) na elke run.
- Flagged content komt automatisch in [`docs/city-content-review.md`](./city-content-review.md).
- Voeg optioneel een health endpoint toe in de backend (`/automation/city-content/status`) voor CI monitoring.

## Volgende stappen

- Notificaties uitbreiden naar Slack via bestaande webhook service.
- Automatische merge-ready PR genereren via GitHub API (service hook). Dit vereist een PAT dat veilig in het dashboard opgeslagen wordt.
- City schema markup automatiseren (zie `docs/value-acceleration-plan.md`).
