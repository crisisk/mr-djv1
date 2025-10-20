# Database Backups

The `scripts/backup.sh` helper streams a `pg_dump` from the running `mr-dj-postgres` Docker service to the host machine. The script defaults to writing timestamped custom-format dumps to the top-level `backups/` directory and can be overridden with standard PostgreSQL environment variables (`PGUSER`, `PGDATABASE`, `PGPASSWORD`) if needed.

```bash
./scripts/backup.sh /var/backups/mrdj
```

## Cron example

The following cron entry runs the backup every night at 02:15 and keeps logs in `/var/log/mrdj-backup.log`:

```
15 2 * * * /path/to/repo/scripts/backup.sh /var/backups/mrdj >> /var/log/mrdj-backup.log 2>&1
```

Remember to ensure the destination directory exists and that the user running cron has permission to write to it.
