# City content automation

Deze handleiding beschrijft hoe de geautomatiseerde city-content workflow binnen Mister DJ functioneert en hoe je de resultaten valideert.

## Workflow overzicht

1. **Keyword ingest** – `cityContentAutomationService.fetchKeywordSet` haalt het meest recente keywordrapport op via `SEO_AUTOMATION_API_URL`. Authenticatie verloopt via het `SEO_AUTOMATION_API_KEY` bearer token.
2. **Filtering** – `filterKeywords` selecteert alleen entertainment-relevante zoektermen binnen de ingestelde regio en voorkomt dubbele slugs.
3. **Content generatie** – `generateCityContent` gebruikt de geconfigureerde LLM-provider. Wanneer geen sleutel aanwezig is, wordt de templatestrategie geactiveerd zodat de workflow blijft draaien.
4. **Quality gate** – `qualityCheck` valideert intro-lengte, cases/FAQ-aanwezigheid en blokkeert verboden claims. Flagged items gaan naar `docs/city-content-review.md`.
5. **Publicatie** – Goedgekeurde entries worden toegevoegd aan `content/local-seo/cities.json` en er wordt per stad een bestand weggeschreven naar `content/cities/<slug>.json`.
6. **Static build** – Na een succesvolle update wordt `scripts/generate-city-pages.mjs` uitgevoerd om de statische HTML opnieuw te genereren. De run samenvatting wordt in `docs/city-content-automation-report.md` opgeslagen.

## Concurrency bescherming

De volledige workflow wordt beschermd door een mutex (`async-mutex`). Hierdoor kan slechts één run tegelijk schrijven naar de contentbestanden en rapportages, wat race conditions voorkomt op `content/local-seo/cities.json`, `content/cities/`, `docs/city-content-review.md` en `docs/city-content-automation-report.md`.

Wanneer een tweede run wordt gestart terwijl de eerste nog bezig is, wacht de tweede run totdat de mutex vrijkomt.

## Slug conventies

Alle city-bestanden volgen het patroon `dj-<stad>.json`:

- Slugs worden opgebouwd via `buildSlugFromKeyword` / `slugifyCity` en altijd naar lowercase geconverteerd.
- De publicatie stap valideert het patroon `^dj-[a-z0-9-]+$`. Wanneer een slug hiervan afwijkt wordt automatisch een fallback slug uit de stadsnaam berekend.
- De JSON in `content/cities/<slug>.json` bevat dezelfde structuur als de verzamellijst (`slug`, `city`, `intro`, `cases`, `venues`, `faqs`).

## Omgevingsvariabelen

| Variabele | Beschrijving |
| --- | --- |
| `SEO_AUTOMATION_API_URL` | Endpoint voor het keywordrapport. |
| `SEO_AUTOMATION_API_KEY` | Bearer token voor authenticatie. |
| `SEO_AUTOMATION_KEYWORDSET_ID` | Optionele parameter om een specifiek keywordset te selecteren. |
| `SEO_AUTOMATION_REGION` | Provincie/gebied waarop gefilterd wordt (default: Noord-Brabant). |
| `SEO_AUTOMATION_THEME_KEYWORDS` | Komma-gescheiden lijst met themawoorden (fallback naar defaults). |
| `SEO_AUTOMATION_APPROVAL_EMAIL` | E-mail die een melding ontvangt na een run. |
| `CITY_AUTOMATION_LLM_PROVIDER` | `openai`, `anthropic` of `template`. |
| `CITY_AUTOMATION_LLM_MODEL` | Modelnaam voor de gekozen provider. |
| `CITY_AUTOMATION_LLM_API_KEY` | API sleutel voor de LLM. |
| `CITY_AUTOMATION_DRY_RUN` | `true` om alleen rapportages te genereren zonder bestanden te schrijven. |

## Testen

Voer de Jest tests in de backend uit om de automatisering te verifiëren:

```bash
cd backend
npm test -- cityContentAutomationService
```

De test controleert onder andere of de JSON lijst wordt bijgewerkt, de individuele stadsbestanden onder `content/cities/` worden aangemaakt en de rapportage wordt geschreven.
