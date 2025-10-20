# Database Schema Management

The legacy `init.sql` bootstrap script has been replaced with versioned Knex migrations in `backend/src/lib/migrations/versions`.

Use the backend helper script to apply the latest schema changes:

```bash
cd backend
npm run migrate
```

The backend automatically runs migrations during service startup, and the deployment tooling (`deploy.sh`) invokes the same command to keep the schema up to date.
