-- Canonical HS (CN) codes view for 8-digit HS references.
CREATE OR REPLACE VIEW v_hs_codes AS
SELECT
  h.hs_code8::varchar(8) AS hs_code8,
  h.chapter              AS chapter,
  h.heading              AS heading,
  h.subheading           AS subheading,
  h.description          AS description,
  h.valid_from::date     AS valid_from,
  h.valid_to::date       AS valid_to
FROM hs_codes h;
