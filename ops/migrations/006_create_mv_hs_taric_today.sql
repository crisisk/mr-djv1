-- Materialized view that keeps track of currently valid HS to TARIC mappings.
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hs_taric_today AS
SELECT t.hs_code8, t.taric_code, t.description
FROM v_taric_nomenclature t
WHERE is_valid_on(t.valid_from, t.valid_to, CURRENT_DATE);

CREATE INDEX IF NOT EXISTS idx_mv_hs_taric_today_hs
  ON mv_hs_taric_today(hs_code8);
