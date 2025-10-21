-- Refresh job for mv_hs_taric_today; schedule daily in cron/CI.
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hs_taric_today;
