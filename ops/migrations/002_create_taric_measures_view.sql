-- Canonical TARIC measures view for consistent downstream access.
CREATE OR REPLACE VIEW v_taric_measures AS
SELECT
  m.taric_code::varchar(10)    AS taric_code,
  m.measure_type               AS measure_type,
  m.country_code::varchar(2)   AS country_code,
  m.valid_from::date           AS valid_from,
  m.valid_to::date             AS valid_to,
  m.additional_code            AS additional_code,
  m.footnotes                  AS footnotes
FROM taric_measures m;
