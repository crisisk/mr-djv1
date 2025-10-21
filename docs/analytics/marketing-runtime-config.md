# Marketing- en analytics-runtimeconfiguratie

Deze nota documenteert de omgevingsvariabelen, fallbackwaarden en regressiebewaking rond de recente marketingintegraties.

## Omgevingsvariabelen

| Variabele | Gebruik | Fallback |
| --- | --- | --- |
| `VITE_POSTHOG_API_KEY` | Activeert PostHog-gebeurtenistracking. | Geen initialisatie wanneer leeg of placeholder; component logt een waarschuwing. |
| `VITE_POSTHOG_API_HOST` | Overschrijft het PostHog-eindpunt. | `https://app.posthog.com` |
| `VITE_META_PIXEL_ID` | Meta-retargetingpixel. | `null` → retargeting-config laat pixel uit. |
| `VITE_GOOGLE_TAG_ID` | Google Tag (GTM/GA4) ID. | `null` → retargeting-config laat tag uit. |
| `VITE_LINKEDIN_PIXEL_ID` | LinkedIn Insight Tag. | `null` → retargeting-config laat pixel uit. |
| `VITE_GOOGLE_ADS_CONVERSION_ID` | Google Ads conversietag voor YouTube-retargeting. | Geen scriptinitialisatie en consolewaarschuwing. |

Alle waarden worden opgeschoond; placeholderstrings zoals `YOUR_*`, `undefined` of `null` worden genegeerd zodat er geen dubbele initialisaties ontstaan door foutieve defaultwaarden.

## Regressietests en monitoring

- **Browser smoke-test**: laad de site met `VITE_POSTHOG_API_KEY` gevuld en controleer via DevTools dat `posthog.init` slechts één keer wordt aangeroepen (er verschijnt slechts één netwerkrequest naar `/capture/`). De console meldt "PostHog initialized" één keer.
- **E2E-watch**: voeg in het bestaande monitoringsdashboard een logbewaker toe die het aantal `init`-logs van PostHog telt; meer dan één event binnen een pageload duidt op regressie.
- **Google Ads script healthcheck**: gebruik een synthetic monitor (bijv. Checkly) die valideert dat `window.dataLayer` één `config`-event voor het geconfigureerde `AW-*` ID ontvangt. Wanneer het script niet laadt, blijft het event uit en genereert de monitor een alert.

Deze stappen waarborgen dat een ontbrekende of foutieve sleutel leidt tot gecontroleerde degradatie en dat dubbele initialisaties snel worden gesignaleerd.
