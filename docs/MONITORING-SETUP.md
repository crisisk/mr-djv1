# Mr. DJ - Automated Monitoring System

## Overview

AI-powered monitoring system using OpenRouter (Claude 3.5 Sonnet) for automated health checks, performance analysis, and SEO reporting.

## Architecture

```
┌─────────────────────────────────────────┐
│     Mr. DJ Website & Infrastructure     │
│  (Docker, PostgreSQL, Redis, RentGuy)   │
└───────────────┬─────────────────────────┘
                │
                │ Collect Metrics
                ▼
┌─────────────────────────────────────────┐
│      Monitoring Scripts (Bash)          │
│  • daily-health-check.sh                │
│  • weekly-performance-check.sh          │
│  • monthly-seo-report.sh                │
└───────────────┬─────────────────────────┘
                │
                │ AI Analysis
                ▼
┌─────────────────────────────────────────┐
│    OpenRouter API (Claude 3.5)          │
│  • Health status analysis               │
│  • Performance grading                  │
│  • SEO recommendations                  │
└───────────────┬─────────────────────────┘
                │
                │ Reports & Alerts
                ▼
┌─────────────────────────────────────────┐
│         Reports & Logs                  │
│  /srv/apps/mr-djv1/reports/             │
│  /var/log/mrdj-monitoring.log           │
└─────────────────────────────────────────┘
```

## Components

### 1. Daily Health Check
**Script**: `/scripts/monitoring/daily-health-check.sh`
**Schedule**: Every day at 8:00 AM
**Duration**: ~30 seconds

**Monitors**:
- Docker container status (all 4 services)
- Backend health endpoint response
- RentGuy sync queue status
- Database connectivity & connection pool
- Recent error logs (last 100 lines)
- Disk usage
- Lead submissions (last 24 hours)

**AI Analysis**:
- Overall health status: GREEN/YELLOW/RED
- Critical issues requiring immediate action
- Non-critical warnings
- RentGuy queue health & delivery rate
- Actionable recommendations

**Exit Codes**:
- `0`: All systems operational (GREEN/YELLOW)
- `1`: Critical issues detected (RED)

### 2. Weekly Performance Check
**Script**: `/scripts/monitoring/weekly-performance-check.sh`
**Schedule**: Every Monday at 9:00 AM
**Duration**: ~45 seconds

**Monitors**:
- Lead conversions (last 7 days)
- Event type popularity breakdown
- Backend API response times
- Error rate percentage
- Redis cache statistics
- Database connection pool usage

**AI Analysis**:
- Performance grade: A-F
- Conversion trends & insights
- Popular event types
- Response time assessment
- Error rate evaluation
- Prioritized action items

### 3. Monthly SEO Report
**Script**: `/scripts/monitoring/monthly-seo-report.sh`
**Schedule**: 1st of each month at 10:00 AM
**Duration**: ~60 seconds

**Monitors**:
- Lead sources by city/campaign
- Event type distribution (30 days)
- Sitemap URL count (should be 111)
- Robots.txt accessibility
- Key page response times
- Broken links check
- Month-over-month growth rate

**AI Analysis**:
- SEO health score: 0-100
- Content strategy recommendations
- Priority cities & event types
- Technical SEO issues
- Growth trend analysis
- Quick wins & long-term strategy

## Installation

### 1. Install Monitoring System

```bash
cd /srv/apps/mr-djv1
bash scripts/monitoring/setup-cron.sh
```

This will:
- Make scripts executable
- Install cron jobs
- Create log file
- Set up report directories

### 2. Verify Installation

```bash
# Check cron jobs
crontab -l | grep mrdj

# Test scripts manually
bash scripts/monitoring/daily-health-check.sh
```

### 3. Manual Test Run

```bash
# Daily health check
cd /srv/apps/mr-djv1
bash scripts/monitoring/daily-health-check.sh

# Weekly performance
bash scripts/monitoring/weekly-performance-check.sh

# Monthly SEO
bash scripts/monitoring/monthly-seo-report.sh
```

## Schedule

| Task | Frequency | Time | Day |
|------|-----------|------|-----|
| Health Check | Daily | 8:00 AM | Every day |
| Performance | Weekly | 9:00 AM | Monday |
| SEO Report | Monthly | 10:00 AM | 1st of month |
| Cleanup | Weekly | 3:00 AM | Sunday |

## Reports

### Directory Structure

```
/srv/apps/mr-djv1/reports/
├── daily/
│   ├── health-check-YYYY-MM-DD_HH-MM-SS.json
│   └── analysis-YYYY-MM-DD_HH-MM-SS.json
├── weekly/
│   ├── performance-check-YYYY-MM-DD_HH-MM-SS.json
│   └── analysis-YYYY-MM-DD_HH-MM-SS.json
└── monthly/
    ├── seo-report-YYYY-MM-DD_HH-MM-SS.json
    └── analysis-YYYY-MM-DD_HH-MM-SS.json
```

### Report Format

Each check generates 2 files:

1. **Raw Data** (`*-check-*.json` / `*-report-*.json`)
   - System metrics
   - Database queries
   - Performance measurements
   - Structured JSON format

2. **AI Analysis** (`analysis-*.json`)
   - Claude's assessment
   - Status/grade
   - Issues & recommendations
   - Actionable insights

## Logs

### Main Log File
**Location**: `/var/log/mrdj-monitoring.log`

**View recent logs**:
```bash
tail -f /var/log/mrdj-monitoring.log
```

**View today's checks**:
```bash
grep "$(date +%Y-%m-%d)" /var/log/mrdj-monitoring.log
```

### Docker Logs
```bash
# Backend errors
docker-compose logs --tail=100 mr-dj-backend | grep -i error

# All services
docker-compose logs --tail=50 --follow
```

## Configuration

### OpenRouter API Key

Set in scripts or environment:
```bash
export OPENROUTER_API_KEY="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"
```

### Database Connection

Uses existing PostgreSQL credentials:
```bash
PGPASSWORD='ilszsWugvCcC8mOuPJ/6g3+f5p8vyhkqBReHJfkPPWw='
Database: rentguy-db-prod
User: rentguy
Database: rentguy_production
```

### Report Retention

Reports older than 90 days are automatically deleted every Sunday.

**Change retention**:
Edit `setup-cron.sh` line with `find ... -mtime +90`

## Alerting

### Critical Alerts (RED Status)

Daily health check exits with code `1` when critical issues detected.

**Setup email alerts**:
```bash
# Edit crontab
crontab -e

# Modify daily check line:
0 8 * * * cd /srv/apps/mr-djv1 && /srv/apps/mr-djv1/scripts/monitoring/daily-health-check.sh || echo "CRITICAL: Mr DJ health check failed" | mail -s "Mr DJ Alert" admin@sevensa.nl
```

### Slack/Discord Webhooks

Add to end of each script:

```bash
# Send to Slack
if [ "$STATUS" = "RED" ]; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 Mr DJ Alert: $AI_ANALYSIS\"}" \
    https://hooks.slack.com/services/YOUR/WEBHOOK/URL
fi
```

## Maintenance

### Update Scripts

```bash
cd /srv/apps/mr-djv1
# Edit scripts
vim scripts/monitoring/daily-health-check.sh

# No need to reinstall cron - changes take effect immediately
```

### Disable Monitoring

```bash
# Remove cron jobs
crontab -l | grep -v "mrdj-monitoring" | crontab -

# Verify
crontab -l
```

### Re-enable Monitoring

```bash
cd /srv/apps/mr-djv1
bash scripts/monitoring/setup-cron.sh
```

## Troubleshooting

### Script Fails

**Check permissions**:
```bash
ls -la /srv/apps/mr-djv1/scripts/monitoring/
# Should be executable (-rwxr-xr-x)
```

**Check logs**:
```bash
tail -50 /var/log/mrdj-monitoring.log
```

**Run manually with debug**:
```bash
bash -x scripts/monitoring/daily-health-check.sh
```

### OpenRouter API Errors

**Test API key**:
```bash
curl -s https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer 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"
```

**Check usage**:
https://openrouter.ai/activity

### Database Connection Issues

**Test connection**:
```bash
PGPASSWORD='ilszsWugvCcC8mOuPJ/6g3+f5p8vyhkqBReHJfkPPWw=' \
  docker exec rentguy-db-prod psql -U rentguy -d rentguy_production -c "SELECT 1;"
```

### Report Directory Issues

**Create directories**:
```bash
mkdir -p /srv/apps/mr-djv1/reports/{daily,weekly,monthly}
chmod 755 /srv/apps/mr-djv1/reports
```

## Costs

### OpenRouter API Usage

**Model**: `anthropic/claude-3.5-sonnet`

**Estimated costs per month**:
- Daily checks: 30 × $0.01 = $0.30
- Weekly checks: 4 × $0.02 = $0.08
- Monthly checks: 1 × $0.03 = $0.03

**Total**: ~$0.41/month

**Monitor usage**: https://openrouter.ai/activity

## Integration with RentGuy

All lead data is pulled from RentGuy CRM database:
- Workspace: `mr-dj`
- Database: `rentguy_production`
- Table: `crm_leads`

**Test query**:
```bash
PGPASSWORD='ilszsWugvCcC8mOuPJ/6g3+f5p8vyhkqBReHJfkPPWw=' \
  docker exec rentguy-db-prod psql -U rentguy -d rentguy_production -c \
  "SELECT COUNT(*) FROM crm_leads WHERE created_at > NOW() - INTERVAL '7 days';"
```

## Advanced Usage

### Custom Monitoring Scripts

Create new script in `/scripts/monitoring/`:

```bash
#!/bin/bash
# custom-check.sh

# Your monitoring logic here
# ...

# Send to OpenRouter for AI analysis
AI_RESPONSE=$(curl -s https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -d "{\"model\": \"anthropic/claude-3.5-sonnet\", \"messages\": [...]}")
```

Add to cron:
```bash
crontab -e
# Add line:
0 12 * * * /srv/apps/mr-djv1/scripts/monitoring/custom-check.sh
```

### Export Reports to External Systems

Add to end of monitoring scripts:

```bash
# Send to external API
curl -X POST https://your-analytics-platform.com/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @"$REPORT_FILE"
```

## Support

### Documentation
- Main docs: `/srv/apps/mr-djv1/docs/`
- Monitoring scripts: `/srv/apps/mr-djv1/scripts/monitoring/`
- Reports: `/srv/apps/mr-djv1/reports/`

### Contacts
- Technical: backend@sevensa.nl
- DevOps: devops@sevensa.nl
- Monitoring issues: Check `/var/log/mrdj-monitoring.log`

### Quick Commands

```bash
# View monitoring status
crontab -l | grep mrdj

# Check recent reports
ls -lt /srv/apps/mr-djv1/reports/daily/ | head -5

# Manual health check
bash /srv/apps/mr-djv1/scripts/monitoring/daily-health-check.sh

# View logs
tail -f /var/log/mrdj-monitoring.log
```

---

**Last Updated**: 2025-10-18
**Version**: 1.0.0
**System**: Mr. DJ Production Monitoring
