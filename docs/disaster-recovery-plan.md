# Disaster Recovery Plan – Mister DJ Platform

_Laatst bijgewerkt: 2025-10-16_

## 1. Doelstellingen
- **RPO (Recovery Point Objective)**: ≤ 1 uur – database snapshots en event queue exports per uur.
- **RTO (Recovery Time Objective)**: ≤ 4 uur – volledige stack opnieuw uitrollen via `deploy.sh` en infrastructuur scripts.
- **Scope**: Docker/VPS infrastructuur (Traefik, backend, frontend, Postgres, Redis), RentGuy integratie en n8n automation flows.

## 2. Back-up strategie
| Component | Frequentie | Tooling | Opslag | Validatie |
| --- | --- | --- | --- | --- |
| Postgres database | 60 min | `pg_dump` via cron (`scripts/backup/postgres-dump.sh`) | VPS + off-site S3 bucket | Maandelijkse restore test | 
| Redis (queue/cache) | 60 min | `redis-cli --rdb` | VPS persistent volume | Kwartaal – cold restore in staging |
| Managed env (`backend/managed.env`) | Bij wijziging | `rsync` naar secure storage | Versleutelde vault (Bitwarden/1Password) | Checksum-vergelijking |
| Netlify content | Bij deploy | Netlify build archive | Netlify build history | Test fallback build |
| n8n workflows | Dagelijks | `n8n export --all --output backups/n8n.json` | Git repository + cloud drive | Import in staging |

> Maak gebruik van `docs/go-live-checklist.md` §8 voor periodieke monitoring.

## 3. Incident response stappen
1. **Incident triage** – bepaal type (infra down, data corruptie, integratie failure).
2. **Communicatie** – informeer Mister DJ stakeholders + RentGuy support via slack/mail.
3. **Stabiliseer** – zet maintenance page aan (Netlify), pauzeer n8n triggers.
4. **Restore** – voer relevante herstelstappen uit (zie §4).
5. **Validatie** – draai `npm test -- --coverage --runInBand`, controleer `/api/health`, voer UAT smoke test uit.
6. **Post-mortem** – documenteer oorzaak, tijdslijn, toegepaste fixes (confluence/notion).

## 4. Herstelprocedures
### 4.1 Backend/API
```bash
ssh root@147.93.57.40
cd /srv/mr-dj
./deploy.sh --mode restore
```
- Controleer `docker compose ps` → alle services `Up`.
- Valideer `.env` via dashboard en flush de RentGuy queue wanneer nodig.

### 4.2 Database herstel
```bash
# restore laatste snapshot
pg_restore -h localhost -U mrdj_user -d mrdj_db backups/mrdj-$(date +%Y%m%d%H).dump
```
- Run migraties / schema check.
- Draai smoke test: `curl -s localhost:3000/api/health | jq`.

### 4.3 RentGuy & n8n
1. Controleer `/integrations/rentguy/status` en dashboard-statuskaart.
2. Draai `POST /dashboard/api/integrations/rentguy/flush` indien queue > 0.
3. Activeer n8n workflows opnieuw na verificatie.

## 5. Testplan
- **Kwartaal**: Dry-run restore op staging, inclusief database import en RentGuy synchronisatietest.
- **Halfjaarlijks**: Full failover test (VPS clone), monitor RTO/RPO metrics.
- **Na grote release**: Update dit document, bevestig dat nieuwe services opgenomen zijn.

## 6. Rollen & contact
| Rol | Verantwoordelijk | Contact |
| --- | --- | --- |
| Tech lead | DR-coördinatie, post-mortem | techlead@mr-dj.nl |
| DevOps engineer | Backups, infra scripts | ops@mr-dj.nl |
| QA lead | Validatie & rapportage | qa@mr-dj.nl |
| RentGuy support | Integratie escalatie | support@rentguy.app |

Bewaar dit plan in de gedeelde drive en koppel aan de release-documentatie.
